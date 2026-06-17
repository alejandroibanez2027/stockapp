import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { InventoryStore } from '../../store/inventory.store';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SkeletonModule, TagModule, PanelModule, DecimalPipe, KpiCard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  protected readonly store = inject(InventoryStore);

  ngOnInit(): void {
    this.store.loadProducts();
    this.store.loadAlerts();
  }
}
