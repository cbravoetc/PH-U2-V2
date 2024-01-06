import { Component, OnInit } from '@angular/core';
import { FormularioCitasComponent } from '../formulario-citas/formulario-citas.component';
import { ListaDeCitasComponent } from '../lista-de-citas/lista-de-citas.component';
import { Cita } from '../modelo/cita';
import { CitaService } from '../servicios/cita.service';
import { ConfiguracionService } from '../servicios/configuracion.service';

@Component({
  selector: 'app-gestion-de-citas',
  templateUrl: './gestion-de-citas.component.html',
  styleUrls: ['./gestion-de-citas.component.scss'],
  standalone: true,
  imports: [FormularioCitasComponent, ListaDeCitasComponent]
})


export class GestionDeCitasComponent  implements OnInit {

  citas:Cita[] = [];
  eliminarCitasCelebres:boolean = false

  constructor(
    private citaService:CitaService,
    private configuracionService:ConfiguracionService
  ) { }

  async ngOnInit() {
    console.log("GestionDeCitasComponent::ngOnInit")
    await this.citaService.iniciarPlugin() 
    await this.actualizar() 
  }

  /*ngAfterViewInit(): void {
    console.log("GestionDeCitasComponent::ngAfterViewInit");
    if (this.listaDeCitasComponent) {
      this.listaDeCitasComponent.ionViewWillEnter();
    }
  }*/

  async ionViewWillEnter() {
    console.log("GestionDeCitasComponent::ionViewWillEnter");
    await this.actualizar();
  }

  async actualizar() {
    console.log("actualizando...");
    this.eliminarCitasCelebres = await this.configuracionService.eliminarRegistros();
    this.citas = await this.citaService.getCitas(); 
  }

  async agregarCita(cita: { texto: string; autor: string }) {
    await this.citaService.agregarCita(cita); 
    await this.actualizar();
  }

  async onCitaChange(c: Cita) {
    await this.citaService.editar(c); 
    await this.actualizar();
  }
}
