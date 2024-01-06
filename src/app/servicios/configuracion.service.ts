import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})

export class ConfiguracionService {
  
  private readonly  KEY_ELIMINAR = "ELIMINAR"

  constructor() {}

  async eliminarRegistros():Promise<boolean> {
    const eliminarConfig =  await Preferences.get({key: this.KEY_ELIMINAR})
    return eliminarConfig?.value ==  "true" ?? false
  }
  
  async setEliminarRegistros(eliminarRegistros:boolean):Promise<void> {
    await Preferences.set ({
      key: this.KEY_ELIMINAR,
      value: eliminarRegistros ? "true": "false"
    })
  }
}
