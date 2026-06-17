import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PanelMenuModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  readonly items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: '/dashboard',
    },
    {
      label: 'Productos',
      icon: 'pi pi-box',
      routerLink: '/products',
    },
  ];
}
