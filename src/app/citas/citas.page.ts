import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GestionDeCitasComponent } from "../gestion-de-citas/gestion-de-citas.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-citas',
    templateUrl: './citas.page.html',
    styleUrls: ['./citas.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, GestionDeCitasComponent, RouterModule],
})


export class CitasPage implements OnInit {
  @ViewChild(GestionDeCitasComponent) gestionDeCitasComponent!:GestionDeCitasComponent

  constructor() { }

  ngOnInit(): void {
    console.log("CitasPage::ngOnInit")
  }
  ionViewWillEnter():void {
    console.log("CitasPage::ionViewWillEnter")
    this.gestionDeCitasComponent.ionViewWillEnter() 
  }
}