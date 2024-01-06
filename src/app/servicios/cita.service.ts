import { Injectable } from '@angular/core';
import { Cita } from '../modelo/cita';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  plataforma:string = "";
  iniciado:boolean = false

  private readonly DB_NAME         = "lista_de_citas";
  private readonly DB_ENCRIPTADA   = false;
  private readonly DB_MODE         = "no-encryption";
  private readonly DB_VERSION     = 1;
  private readonly DB_READ_ONLY   = false;

  private readonly TABLE_NAME       = "lista_de_citas"
  private readonly COL_ID           = "id"
  private readonly COL_TEXTO        = "texto"
  private readonly COL_AUTOR        = "autor"

  private readonly DB_SQL_TABLAS   = `
    CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
      ${this.COL_ID} INTEGER PRIMARY KEY AUTOINCREMENT,
      ${this.COL_TEXTO} TEXT NOT NULL,
      ${this.COL_AUTOR} TEXT NOT NULL
    );
  `;

  constructor() {
   }

   async _iniciarPluginWeb(): Promise<void> {    
    await customElements.whenDefined('jeep-sqlite')
    const jeepSqliteEl = document.querySelector("jeep-sqlite")
    if( jeepSqliteEl != null ) {      
      await this.sqlite.initWebStore()            
    }
  }

  async iniciarPlugin() {    
    this.plataforma = Capacitor.getPlatform()
    if(this.plataforma == "web") {
      await this._iniciarPluginWeb()
    }
    await this.abrirConexion()
    await this.db.execute(this.DB_SQL_TABLAS)

    
  }

  async abrirConexion() {                    
    const ret = await this.sqlite.checkConnectionsConsistency() 
    const isConn = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result

    if(ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY)      
    } 
    else {
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        this.DB_ENCRIPTADA,
        this.DB_MODE,
        this.DB_VERSION,
        this.DB_READ_ONLY
      )
    }
  await this.db.open()

  const countResult = await this.db.query(`SELECT COUNT(*) AS count FROM ${this.TABLE_NAME}`);
    if (countResult.values && countResult.values[0].count === 0) {
        await this.agregarCita({id:1, texto:"“La vida es una obra teatral que no importa cuánto haya durado, sino lo bien que haya sido representada.”", autor:"Séneca"});
        await this.agregarCita({id:2, texto:"“La vida es la constante sorpresa de saber que existo.”", autor:"Rabindranath Tagore"});
        await this.agregarCita({id:3, texto:"“La vida es eso que pasa mientras estás ocupado haciendo otros planes”", autor:"John Lennon"});
    }
  }

  async agregarCita(cita: Cita) {
    if (!this.db) {
      console.error('La conexión a la base de datos no está establecida');
      return;
    }
  
    const sql = `INSERT INTO ${this.TABLE_NAME} (${this.COL_TEXTO}, ${this.COL_AUTOR}) VALUES (?, ?)`;
    try {
      await this.db.run(sql, [cita.texto, cita.autor]);
    } catch (error) {
      console.error('Error al agregar cita:', error);
    }
  }
  

  async getCitas(): Promise<Cita[]>  { 
    if (!this.db) {
      console.error('La conexión a la base de datos no está establecida');
      return [];
    }
    
    const sql = `SELECT * FROM ${this.TABLE_NAME}`;
    console.log(sql);
    console.dir(this.db);
    try {
      const resultado = await this.db.query(sql);
      return resultado.values ?? []; 
    } catch (error) {
      console.error('Error al obtener citas:', error);
      return [];
    }
  }
  

  async deleteCita(id:number) {
    const sql = `DELETE FROM ${this.TABLE_NAME} WHERE ${this.COL_ID} = ?`
    await this.db.run(sql, [id])  
  }
  
  async editar(cita:Cita) {
    await this.actualizar(cita)
  }

  async actualizar(cita:Cita) {
    const sql = `UPDATE ${this.TABLE_NAME} SET ${this.COL_TEXTO} = ?, ${this.COL_AUTOR} = ? WHERE ${this.COL_ID} = ?`
    await this.db.run(sql, [cita.texto, cita.autor, cita.id])
  }

  async getRandomCita(): Promise<Cita> {
    if (!this.db) {
      console.error('La conexión a la base de datos no está establecida');
      throw new Error('Conexión a la base de datos no está establecida');
    }
  
    const sql = `SELECT * FROM ${this.TABLE_NAME} ORDER BY RANDOM() LIMIT 1`;
    try {
      const resultado = await this.db.query(sql);
      if (resultado.values && resultado.values.length > 0) {
        return resultado.values[0] as Cita;
      } else {
        throw new Error('No se encontró ninguna cita');
      }
    } catch (error) {
      console.error('Error al obtener cita aleatoria:', error);
      throw error;
    }
  }
  
  
  async cerrarConexion() {
    await this.db.close() 
  }
  
}