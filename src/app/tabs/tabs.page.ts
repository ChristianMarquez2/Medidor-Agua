import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { RegistrosService } from '../services/registros.service';

// Importa los íconos que usaremos
import { addIcons } from 'ionicons';
import {
  list,
  add,
  person,
  shield,
  logOut,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
  ],
})
export class TabsPage implements OnInit {
  isAdmin = false;
  isMedidor = false;

  constructor(private registrosService: RegistrosService) {
    // Carga los íconos
    addIcons({ list, add, person, shield, logOut });
  }

  async ngOnInit() {
    // Al cargar la página, determina el rol
    const rol = await this.registrosService.getUserRole();
    if (rol === 'admin') {
      this.isAdmin = true;
    } else if (rol === 'medidor') {
      this.isMedidor = true;
    }
  }
}