import { Component, output, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { StockBadge } from '../../../../shared/components/stock-badge/stock-badge';
import { Product } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-detail-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, CurrencyPipe, StockBadge],
  templateUrl: './product-detail-dialog.html',
  styleUrls: ['./product-detail-dialog.scss'],
})
export class ProductDetailDialog {
  readonly product = input.required<Product>();
  readonly close = output<void>();
  readonly registerMovement = output<Product>();

  onHide(): void {
    this.close.emit();
  }

  onRegisterMovement(): void {
    this.close.emit();
    this.registerMovement.emit(this.product());
  }
}
