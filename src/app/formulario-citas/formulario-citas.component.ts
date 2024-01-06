/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../servicios/cita.service';


@Component({
  selector: 'app-formulario-citas',
  templateUrl: './formulario-citas.component.html',
  styleUrls: ['./formulario-citas.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})


export class FormularioCitasComponent {
  textoCita: string = ""; 
  autorCita: string = ""; 

  @Output() onCitaAgregada = new EventEmitter<{ texto: string, autor: string }>();

  constructor(private citaService: CitaService) {} 

  emitirCita() {
    if (this.textoCita && this.autorCita) {
      this.onCitaAgregada.emit({
        texto: this.textoCita,
        autor: this.autorCita
      });
      this.textoCita = "";
      this.autorCita = "";
    }
  }
  
}