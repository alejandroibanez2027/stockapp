import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InventoryStore } from '../../store/inventory.store';
import { ProductService } from '../../core/services/product.service';
import { MovementService } from '../../core/services/movement.service';
import { StockBadge } from '../../shared/components/stock-badge/stock-badge';
import { Product, ProductRequest } from '../../shared/models/product.model';
import { Movement, MovementRequest } from '../../shared/models/movement.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableModule, ButtonModule, DialogModule, SelectModule,
    InputNumberModule, TextareaModule, InputTextModule, TagModule,
    PanelModule, PaginatorModule, SkeletonModule, SelectButtonModule,
    ToastModule, TooltipModule, FormsModule, ReactiveFormsModule,
    CurrencyPipe, DatePipe, StockBadge,
  ],
  template: `
    <div class="products-page">
      <div class="header">
        <h1>Productos</h1>
        <p-button label="Nuevo Producto" icon="pi pi-plus" (click)="newProductDialog = true" />
      </div>

      <div class="filters">
        <p-select [options]="categories" [(ngModel)]="selectedCategory" placeholder="Todas las categorías"
                  styleClass="w-full" (onChange)="filterByCategory()" [showClear]="true"></p-select>
      </div>

      @if (store.loading()) {
        @for (_ of [1,2,3,4,5]; track _) {
          <p-skeleton height="50px" style="margin-bottom: 0.5rem;" />
        }
      } @else {
        <p-table [value]="store.products()" dataKey="productId" [paginator]="false" [rows]="10">
          <ng-template #header>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </ng-template>
          <ng-template #body let-product>
            <tr>
              <td>{{ product.sku }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.currentStock }} / {{ product.minStock }}</td>
              <td><app-stock-badge [currentStock]="product.currentStock" [minStock]="product.minStock" /></td>
              <td>{{ product.unitPrice | currency }}</td>
              <td>
                <div class="actions">
                  <p-button icon="pi pi-eye" severity="info" pTooltip="Ver detalle" (click)="showDetail(product)" />
                  <p-button icon="pi pi-bolt" severity="warn" pTooltip="Registrar movimiento" (click)="openMovementDialog(product)" />
                  <p-button icon="pi pi-list" severity="secondary" pTooltip="Ver historial"
                            (click)="showHistory(product)" [badge]="' '"/>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>

        <p-paginator [totalRecords]="store.totalElements()" [rows]="store.filters().size"
                     [first]="store.currentPage() * store.filters().size" (onPageChange)="onPageChange($event)" />
      }

      @defer (on interaction) {
        @if (selectedForHistory) {
          <p-panel header="Historial de movimientos - {{ selectedForHistory.name }}" class="history-panel" [toggleable]="true" collapsed="true">
            @if (historyLoading) {
              <p-skeleton height="100px" />
            } @else {
              <p-table [value]="history" dataKey="movementId">
                <ng-template #header>
                  <tr><th>Tipo</th><th>Cantidad</th><th>Razón</th><th>Fecha</th></tr>
                </ng-template>
                <ng-template #body let-m>
                  <tr>
                    <td><p-tag [severity]="m.type === 'IN' ? 'success' : 'danger'" [value]="m.type" /></td>
                    <td>{{ m.quantity }}</td>
                    <td>{{ m.reason }}</td>
                    <td>{{ m.createdAt | date:'short' }}</td>
                  </tr>
                </ng-template>
              </p-table>
            }
          </p-panel>
        }
      } @placeholder {
        <p-skeleton height="50px" />
      } @loading {
        <div class="spinner"><i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i></div>
      } @error {
        <p-panel header="Historial"><p>Error al cargar historial.</p></p-panel>
      }
    </div>

    <p-dialog header="Nuevo Producto" [(visible)]="newProductDialog" [modal]="true" styleClass="w-30rem">
      <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
        <div class="field"><label>SKU</label><input pInputText formControlName="sku" class="w-full" /></div>
        <div class="field"><label>Nombre</label><input pInputText formControlName="name" class="w-full" /></div>
        <div class="field"><label>Categoría</label><input pInputText formControlName="category" class="w-full" /></div>
        <div class="field"><label>Stock actual</label><p-inputNumber formControlName="currentStock" [min]="0" styleClass="w-full" /></div>
        <div class="field"><label>Stock mínimo</label><p-inputNumber formControlName="minStock" [min]="0" styleClass="w-full" /></div>
        <div class="field"><label>Precio unitario</label><p-inputNumber formControlName="unitPrice" [min]="0" [minFractionDigits]="2" styleClass="w-full" /></div>
        <div class="dialog-footer">
          <p-button label="Cancelar" severity="secondary" (click)="newProductDialog = false" />
          <p-button type="submit" label="Guardar" [disabled]="productForm.invalid || savingProduct" [loading]="savingProduct" />
        </div>
      </form>
    </p-dialog>

    <p-dialog header="Detalle del Producto" [(visible)]="detailDialog" [modal]="true" styleClass="w-30rem">
      @if (detailProduct) {
        <div class="detail-grid">
          <div class="detail-row"><span class="detail-label">SKU</span><span>{{ detailProduct.sku }}</span></div>
          <div class="detail-row"><span class="detail-label">Nombre</span><span>{{ detailProduct.name }}</span></div>
          <div class="detail-row"><span class="detail-label">Categoría</span><span>{{ detailProduct.category }}</span></div>
          <div class="detail-row"><span class="detail-label">Stock actual</span><span>{{ detailProduct.currentStock }}</span></div>
          <div class="detail-row"><span class="detail-label">Stock mínimo</span><span>{{ detailProduct.minStock }}</span></div>
          <div class="detail-row"><span class="detail-label">Precio</span><span>{{ detailProduct.unitPrice | currency }}</span></div>
          <div class="detail-row"><span class="detail-label">Estado</span><span><app-stock-badge [currentStock]="detailProduct.currentStock" [minStock]="detailProduct.minStock" /></span></div>
        </div>
        <div class="dialog-footer" style="margin-top: 1rem;">
          <p-button label="Cerrar" severity="secondary" (click)="detailDialog = false" />
          <p-button label="Registrar Movimiento" icon="pi pi-bolt" severity="warn" (click)="detailDialog = false; openMovementDialog(detailProduct)" />
        </div>
      }
    </p-dialog>

    <p-dialog [header]="'Movimiento - ' + movementProduct?.name" [(visible)]="movementDialog" [modal]="true" styleClass="w-25rem">
      <form [formGroup]="movementForm" (ngSubmit)="saveMovement()">
        <div class="field"><label>Tipo</label>
          <p-selectButton [options]="movementTypes" formControlName="type" optionLabel="label" optionValue="value" />
        </div>
        <div class="field"><label>Cantidad</label><p-inputNumber formControlName="quantity" [min]="1" styleClass="w-full" /></div>
        <div class="field"><label>Razón</label><textarea pTextarea formControlName="reason" rows="3" class="w-full"></textarea></div>
        <div class="dialog-footer">
          <p-button label="Cancelar" severity="secondary" (click)="movementDialog = false" />
          <p-button type="submit" label="Guardar" [disabled]="movementForm.invalid || movementSaving" [loading]="movementSaving" />
        </div>
      </form>
    </p-dialog>
  `,
  styles: [`
    .products-page { padding: 1.5rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .header h1 { margin: 0; font-size: 1.75rem; }
    .filters { margin-bottom: 1rem; max-width: 300px; }
    .actions { display: flex; gap: 0.25rem; }
    .field { margin-bottom: 1rem; }
    .field label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 0.5rem; }
    .history-panel { margin-top: 1rem; }
    .spinner { display: flex; justify-content: center; padding: 2rem; }
    .detail-grid { display: flex; flex-direction: column; gap: 0.75rem; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; }
    .detail-label { font-weight: 500; color: var(--text-color-secondary); }
  `]
})
export class Products implements OnInit {
  protected readonly store = inject(InventoryStore);
  private readonly productService = inject(ProductService);
  private readonly movementService = inject(MovementService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  protected categories = ['Electronics', 'Office', 'Home', 'Networking', 'Gaming', 'Accessories'];
  protected selectedCategory: string | undefined;

  protected newProductDialog = false;
  protected detailDialog = false;
  protected movementDialog = false;
  protected detailProduct: Product | null = null;
  protected movementProduct: Product | null = null;
  protected selectedForHistory: Product | null = null;
  protected history: Movement[] = [];
  protected historyLoading = false;
  protected savingProduct = false;
  protected movementSaving = false;

  protected readonly movementTypes = [
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' },
  ];

  protected productForm = this.fb.nonNullable.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    category: ['', Validators.required],
    currentStock: [0, [Validators.required, Validators.min(0)]],
    minStock: [0, [Validators.required, Validators.min(0)]],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
  });

  protected movementForm = this.fb.nonNullable.group({
    type: ['IN', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
  });

  ngOnInit(): void {
    this.store.loadProducts();
    this.selectedCategory = this.store.filters().category || undefined;
  }

  protected filterByCategory(): void {
    this.store.setFilters({ category: this.selectedCategory || '', page: 0 });
  }

  protected onPageChange(event: { page?: number; first?: number; rows?: number }): void {
    this.store.setFilters({ page: event.page ?? 0, size: event.rows ?? 10 });
  }

  protected showDetail(product: Product): void {
    this.detailProduct = product;
    this.detailDialog = true;
  }

  protected openMovementDialog(product: Product): void {
    this.movementProduct = product;
    this.movementForm.reset({ type: 'IN', quantity: 1, reason: '' });
    this.movementDialog = true;
  }

  protected showHistory(product: Product): void {
    this.selectedForHistory = product;
    this.historyLoading = true;
    this.movementService.findByProductId(product.productId).subscribe({
      next: (data) => { this.history = data; this.historyLoading = false; },
      error: () => this.historyLoading = false,
    });
  }

  protected saveProduct(): void {
    if (this.productForm.invalid) return;
    this.savingProduct = true;
    this.productService.save(this.productForm.value as unknown as ProductRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Producto creado', detail: 'Producto registrado correctamente', life: 3000 });
        this.newProductDialog = false;
        this.productForm.reset({ sku: '', name: '', category: '', currentStock: 0, minStock: 0, unitPrice: 0 });
        this.store.loadProducts();
        this.savingProduct = false;
      },
      error: () => this.savingProduct = false,
    });
  }

  protected saveMovement(): void {
    if (this.movementForm.invalid || !this.movementProduct) return;
    this.movementSaving = true;
    const request: MovementRequest = {
      productId: this.movementProduct.productId,
      type: this.movementForm.value.type as 'IN' | 'OUT',
      quantity: this.movementForm.value.quantity!,
      reason: this.movementForm.value.reason!,
    };
    this.movementService.save(request).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Movimiento registrado', detail: 'Stock actualizado', life: 3000 });
        this.movementDialog = false;
        this.store.loadProducts();
        this.store.loadAlerts();
        this.movementSaving = false;
      },
      error: () => this.movementSaving = false,
    });
  }
}
