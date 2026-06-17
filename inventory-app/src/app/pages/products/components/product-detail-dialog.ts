import { Component, output, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { StockBadge } from '../../../shared/components/stock-badge/stock-badge';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-detail-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, CurrencyPipe, StockBadge],
  templateUrl: './product-detail-dialog.html',
  styleUrls: ['./product-detail-dialog.scss'],
})
export class ProductDetailDialog {
  readonly visible = input(false);
  readonly product = input<Product | null>(null);
  readonly visibleChange = output<boolean>();
  readonly registerMovement = output<Product>();

  onHide(): void {
    this.visibleChange.emit(false);
  }

  onRegisterMovement(): void {
    const p = this.product();
    if (p) {
      this.visibleChange.emit(false);
      this.registerMovement.emit(p);
    }
  }
}
