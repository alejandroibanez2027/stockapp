import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { InventoryStore } from '../../store/inventory.store';
import { StockBadge } from '../../shared/components/stock-badge/stock-badge';
import { Product } from '../../shared/models/product.model';
import { ProductFormDialog } from './components/product-form-dialog/product-form-dialog';
import { ProductDetailDialog } from './components/product-detail-dialog/product-detail-dialog';
import { MovementDialog } from './components/movement-dialog/movement-dialog';
import { HistoryDialog } from './components/history-dialog/history-dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableModule, ButtonModule, SelectModule,
    SkeletonModule, ToastModule, TooltipModule, FormsModule,
    CurrencyPipe, StockBadge,
    ProductFormDialog, ProductDetailDialog, MovementDialog, HistoryDialog,
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class Products implements OnInit {
  protected readonly store = inject(InventoryStore);

  private loadingLazy = false;

  protected categories = ['Electronics', 'Office', 'Home', 'Networking', 'Gaming', 'Accessories'];
  protected selectedCategory: string | undefined;

  protected newProductDialog = false;
  protected detailDialog = false;
  protected movementDialog = false;
  protected historyDialog = false;
  protected detailProduct: Product | null = null;
  protected movementProduct: Product | null = null;
  protected selectedForHistory: Product | null = null;

  ngOnInit(): void {
    this.store.loadProducts();
    this.selectedCategory = this.store.filters().category || undefined;
  }

  protected filterByCategory(): void {
    this.store.setFilters({ category: this.selectedCategory || '', page: 0 });
    this.store.loadProducts();
  }

  protected loadLazy(event: any): void {
    if (this.loadingLazy) return;
    this.loadingLazy = true;
    const rows = event.rows ?? 10;
    const page = (event.first ?? 0) / rows;
    const sort = event.sortField
      ? `${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}`
      : 'productId,asc';
    this.store.setFilters({ page, size: rows, sort });
    this.store.loadProducts();
    this.loadingLazy = false;
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
}
