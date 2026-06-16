import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PanelMenuModule],
  template: `
    <div class="sidebar">
      <div class="logo">
        <i class="pi pi-box" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
        <span class="logo-text">StockFlow</span>
      </div>
      <p-panelMenu [model]="items" />
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100dvh;
      background: var(--surface-card);
      border-right: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
    }
    .logo {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--primary-color);
    }
    a.active-link {
      background: var(--primary-color);
      color: var(--primary-color-text);
    }
  `]
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
