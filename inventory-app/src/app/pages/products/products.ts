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
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
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
