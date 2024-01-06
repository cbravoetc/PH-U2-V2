/* eslint-disable @angular-eslint/no-output-on-prefix */
import { ConfiguracionService } from '../servicios/configuracion.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Cita } from '../modelo/cita';
import { CitaService } from '../servicios/cita.service';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';


@Component({
  selector: 'app-lista-de-citas',
  templateUrl: './lista-de-citas.component.html',
  styleUrls: ['./lista-de-citas.component.scss'],
  standalone: true,
  imports: [IonItem,IonLabel, IonList, IonIcon,CommonModule]
})
export class ListaDeCitasComponent  implements OnInit, OnDestroy{

  @Input() citas:Cita[] = []
  @Output() citaChanged = new EventEmitter<Cita>()


  constructor(private configuracionService: ConfiguracionService,
    private citaService: CitaService) { 
      addIcons({
        trash
      })
    }

  async ngOnInit() {
    console.log("ListaDeCitasComponent::ngOnInit() - CitaService::iniciarPlugin()")
    await this.citaService.iniciarPlugin() 
  }
  
  async ngOnDestroy() {
    console.log("ListaDeCitasComponent::ngOnDestroy")    
    await this.citaService.cerrarConexion() 
  }

  async ionViewWillEnter() {
    console.log("ListaDeCitasComponent::ionViewWillEnter()");
    this.citas = await this.citaService.getCitas();
  }

  async eliminarCita(cita: Cita) {
    const puedeEliminar = await this.configuracionService.eliminarRegistros();
    if (puedeEliminar && cita.id !== undefined) {
      await this.citaService.deleteCita(cita.id);
      this.citas = await this.citaService.getCitas();
    } else {
      console.error('ID de cita no definido o eliminación de citas no permitida');
    }
  }
  
}
