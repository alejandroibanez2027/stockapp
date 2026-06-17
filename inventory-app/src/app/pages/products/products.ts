import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { InventoryStore } from '../../store/inventory.store';
import { ProductService } from '../../core/services/product.service';
import { MovementService } from '../../core/services/movement.service';
import { StockBadge } from '../../shared/components/stock-badge/stock-badge';
import { Product, ProductRequest } from '../../shared/models/product.model';
import { MovementRequest } from '../../shared/models/movement.model';
import { ProductFormDialog } from './components/product-form-dialog';
import { ProductDetailDialog } from './components/product-detail-dialog';
import { MovementDialog } from './components/movement-dialog';
import { HistoryDialog } from './components/history-dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableModule, ButtonModule, SelectModule,
    PaginatorModule, SkeletonModule,
    ToastModule, TooltipModule, FormsModule,
    CurrencyPipe, StockBadge,
    ProductFormDialog, ProductDetailDialog, MovementDialog, HistoryDialog,
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class Products implements OnInit {
  protected readonly store = inject(InventoryStore);
  private readonly productService = inject(ProductService);
  private readonly movementService = inject(MovementService);
  private readonly messageService = inject(MessageService);

  protected categories = ['Electronics', 'Office', 'Home', 'Networking', 'Gaming', 'Accessories'];
  protected selectedCategory: string | undefined;

  protected newProductDialog = false;
  protected detailDialog = false;
  protected movementDialog = false;
  protected historyDialog = false;
  protected detailProduct: Product | null = null;
  protected movementProduct: Product | null = null;
  protected selectedForHistory: Product | null = null;
  protected savingProduct = false;
  protected movementSaving = false;

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
    this.movementDialog = true;
  }

  protected showHistory(product: Product): void {
    this.selectedForHistory = product;
    this.historyDialog = true;
  }

  protected saveProduct(request: ProductRequest): void {
    this.savingProduct = true;
    this.productService.save(request).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Producto creado', detail: 'Producto registrado correctamente', life: 3000 });
        this.newProductDialog = false;
        this.store.loadProducts();
        this.savingProduct = false;
      },
      error: () => this.savingProduct = false,
    });
  }

  protected saveMovement(request: MovementRequest): void {
    this.movementSaving = true;
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
