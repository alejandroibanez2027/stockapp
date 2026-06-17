import { Component, output, input, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePipe } from '@angular/common';
import { MovementService } from '../../../core/services/movement.service';
import { Product } from '../../../shared/models/product.model';
import { Movement } from '../../../shared/models/movement.model';

@Component({
  selector: 'app-history-dialog',
  standalone: true,
  imports: [DialogModule, TableModule, TagModule, ButtonModule, SkeletonModule, DatePipe],
  templateUrl: './history-dialog.html',
  styleUrls: ['./history-dialog.scss'],
})
export class HistoryDialog {
  readonly visible = input(false);
  readonly product = input<Product | null>(null);
  readonly visibleChange = output<boolean>();

  private readonly movementService = inject(MovementService);

  protected history: Movement[] = [];
  protected loading = false;

  onShow(): void {
    const p = this.product();
    if (!p) return;
    this.loading = true;
    this.movementService.findByProductId(p.productId).subscribe({
      next: (data) => { this.history = data; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  onHide(): void {
    this.visibleChange.emit(false);
  }
}
