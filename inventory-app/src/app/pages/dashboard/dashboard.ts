import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InventoryStore } from '../../store/inventory.store';
import { MovementService } from '../../core/services/movement.service';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { MovementRequest } from '../../shared/models/movement.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule, TableModule, ButtonModule, DialogModule, SelectModule,
    InputNumberModule, TextareaModule, TagModule, PanelModule,
    PaginatorModule, SkeletonModule, InputTextModule, SelectButtonModule,
    ToastModule, FormsModule, ReactiveFormsModule,
    DecimalPipe, KpiCard,
  ],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <div class="kpi-grid">
        @if (store.loading()) {
          @for (_ of [1,2,3,4]; track _) {
            <p-skeleton height="100px" />
          }
        } @else {
          <app-kpi-card icon="pi-box" [value]="store.totalProducts()" label="Total Productos" color="var(--blue-500)" />
          <app-kpi-card icon="pi-exclamation-triangle" [value]="store.totalAlerts()" label="Alertas Activas" color="var(--orange-500)" />
          <app-kpi-card icon="pi-times-circle" [value]="store.criticalAlerts()" label="Alertas Críticas" color="var(--red-500)" />
          <app-kpi-card icon="pi-dollar" [value]="'$' + (store.totalInventoryValue() | number:'1.2-2')" label="Valor Inventario" color="var(--green-500)" />
        }
      </div>

      <div class="dashboard-grid">
        <div class="left-col">
          <p-panel header="Alertas de Stock" [toggleable]="true">
            @if (store.alerts().length === 0) {
              <p>No hay alertas activas.</p>
            }
            @for (alert of store.alerts(); track alert.productId) {
              <div class="alert-item" [class.critical]="alert.severity === 'CRITICAL'">
                <i [class]="'pi ' + (alert.severity === 'CRITICAL' ? 'pi-times-circle' : 'pi-exclamation-triangle')"
                   [style.color]="alert.severity === 'CRITICAL' ? 'var(--red-500)' : 'var(--orange-500)'"></i>
                <span class="alert-name">{{ alert.productName }}</span>
                <span class="alert-stock">{{ alert.currentStock }} / {{ alert.minStock }}</span>
                <p-tag [severity]="alert.severity === 'CRITICAL' ? 'danger' : 'warn'"
                       [value]="alert.severity" />
              </div>
            }
          </p-panel>

          @defer (on viewport) {
            <p-panel header="Estadísticas Avanzadas" class="stats-panel">
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Stock promedio</span>
                  <span class="stat-value">{{ avgStock() | number:'1.0-0' }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Productos con stock crítico</span>
                  <span class="stat-value">{{ store.criticalAlerts() }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">% Stock crítico</span>
                  <span class="stat-value">{{ criticalPercent() }}%</span>
                </div>
              </div>
            </p-panel>
          } @placeholder {
            <p-skeleton height="200px" />
          } @loading {
            <div class="spinner-container"><i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i></div>
          } @error {
            <p-panel header="Estadísticas"><p>Error al cargar estadísticas.</p></p-panel>
          }
        </div>

        <div class="right-col">
          <p-panel header="Registrar Movimiento">
            <form [formGroup]="movementForm" (ngSubmit)="registerMovement()">
              <div class="field">
                <label>Producto</label>
                <p-select [options]="store.products()" formControlName="productId"
                          optionLabel="name" optionValue="productId" placeholder="Seleccionar producto"
                          styleClass="w-full" [showClear]="true"></p-select>
              </div>
              <div class="field">
                <label>Tipo</label>
                <p-selectButton [options]="movementTypes" formControlName="type"
                                optionLabel="label" optionValue="value" />
              </div>
              <div class="field">
                <label>Cantidad</label>
                <p-inputNumber formControlName="quantity" [min]="1" styleClass="w-full" />
              </div>
              <div class="field">
                <label>Razón</label>
                <textarea pTextarea formControlName="reason" rows="3" class="w-full"></textarea>
              </div>
              <p-button type="submit" label="Guardar Movimiento" icon="pi pi-save"
                        [disabled]="movementForm.invalid || movementLoading" [loading]="movementLoading" />
            </form>
          </p-panel>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 1.5rem; }
    h1 { margin: 0 0 1.5rem; font-size: 1.75rem; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 400px; gap: 1.5rem; }
    @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }
    .alert-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--surface-border); }
    .alert-item.critical { background: var(--red-50); margin: 0 -1rem; padding: 0.5rem 1rem; }
    .alert-name { flex: 1; font-weight: 500; }
    .alert-stock { color: var(--text-color-secondary); }
    .field { margin-bottom: 1rem; }
    .field label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    .stats-grid { display: flex; flex-direction: column; gap: 1rem; }
    .stat-item { display: flex; justify-content: space-between; }
    .stat-label { color: var(--text-color-secondary); }
    .stat-value { font-weight: 600; }
    .spinner-container { display: flex; justify-content: center; padding: 2rem; }
  `]
})
export class Dashboard implements OnInit {
  protected readonly store = inject(InventoryStore);
  private readonly movementService = inject(MovementService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  protected movementLoading = false;

  protected readonly movementTypes = [
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' },
  ];

  protected movementForm = this.fb.nonNullable.group({
    productId: [0, Validators.required],
    type: ['IN', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
  });

  ngOnInit(): void {
    this.store.loadProducts();
    this.store.loadAlerts();
  }

  protected avgStock(): number {
    const products = this.store.products();
    if (products.length === 0) return 0;
    return products.reduce((s, p) => s + p.currentStock, 0) / products.length;
  }

  protected criticalPercent(): number {
    const products = this.store.products();
    if (products.length === 0) return 0;
    const critical = products.filter(p => p.currentStock < p.minStock).length;
    return Math.round((critical / products.length) * 100);
  }

  protected registerMovement(): void {
    if (this.movementForm.invalid) return;
    this.movementLoading = true;
    this.movementService.save(this.movementForm.value as unknown as MovementRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Movimiento registrado', detail: 'Stock actualizado correctamente', life: 3000 });
        this.movementForm.reset({ productId: 0, type: 'IN', quantity: 1, reason: '' });
        this.store.loadProducts();
        this.store.loadAlerts();
        this.movementLoading = false;
      },
      error: () => this.movementLoading = false,
    });
  }
}
