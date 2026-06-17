import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  readonly items = [
    { label: 'Dashboard', icon: 'pi-chart-bar', route: '/dashboard' },
    { label: 'Productos', icon: 'pi-box', route: '/products' },
  ];
}
