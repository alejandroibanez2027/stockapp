import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { ProductService } from '../core/services/product.service';
import { AlertService } from '../core/services/alert.service';
import { Product } from '../shared/models/product.model';
import { StockAlert } from '../shared/models/alert.model';
import { MessageService } from 'primeng/api';

export interface Filters {
  category: string;
  page: number;
  size: number;
  sort: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryStore {
  private readonly productService = inject(ProductService);
  private readonly alertService = inject(AlertService);
  private readonly messageService = inject(MessageService);

  readonly products = signal<Product[]>([]);
  readonly alerts = signal<StockAlert[]>([]);
  readonly selectedProduct = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);

  readonly filters = signal<Filters>({ category: '', page: 0, size: 10, sort: 'productId,asc' });

  readonly totalProducts = computed(() => this.totalElements());
  readonly criticalAlerts = computed(() => this.alerts().filter(a => a.severity === 'CRITICAL').length);
  readonly totalAlerts = computed(() => this.alerts().length);
  readonly totalInventoryValue = computed(() =>
    this.products().reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0)
  );
  readonly lowStockProducts = computed(() =>
    this.products()
      .filter(p => p.currentStock >= p.minStock)
      .sort((a, b) => a.currentStock - b.currentStock)
      .slice(0, 10)
  );

  constructor() {
    const saved = localStorage.getItem('stockflow-filters');
    if (saved) {
      try {
        this.filters.set(JSON.parse(saved));
      } catch { }
    }

    effect(() => {
      localStorage.setItem('stockflow-filters', JSON.stringify(this.filters()));
    });

    effect(() => {
      const alerts = this.alerts();
      if (alerts.length > 0) {
        const critical = alerts.filter(a => a.severity === 'CRITICAL').length;
        this.messageService.add({
          severity: critical > 0 ? 'warn' : 'info',
          summary: 'Alertas de inventario',
          detail: `${alerts.length} alerta(s) activa(s), ${critical} crítica(s)`,
          life: critical > 0 ? 15000 : 5000,
        });
      }
    });
  }

  loadProducts(): void {
    const f = this.filters();
    this.loading.set(true);
    this.error.set(null);
    this.productService.findAll(f.category, f.page, f.size, f.sort).pipe(
      finalize(() => this.loading.set(false)),
      catchError((err) => {
        this.error.set(err.error?.message || 'Error al cargar productos');
        throw err;
      })
    ).subscribe({
      next: (res) => {
        this.products.set(res.content);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages);
        this.currentPage.set(res.number);
      },
    });
  }

  loadAlerts(): void {
    this.alertService.getAlerts().subscribe({
      next: (data) => this.alerts.set(data),
    });
  }

  setFilters(partial: Partial<Filters>): void {
    this.filters.update(f => ({ ...f, ...partial }));
  }
}
