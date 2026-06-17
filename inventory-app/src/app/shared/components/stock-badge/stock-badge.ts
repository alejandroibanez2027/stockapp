import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  imports: [TagModule],
  templateUrl: './stock-badge.html',
})
export class StockBadge {
  readonly currentStock = input.required<number>();
  readonly minStock = input.required<number>();

  protected readonly severity = computed(() => {
    const current = this.currentStock();
    const min = this.minStock();
    if (current < min) return 'danger';
    if (current === min) return 'warn';
    return 'success';
  });

  protected readonly label = computed(() => {
    const current = this.currentStock();
    const min = this.minStock();
    if (current < min) return 'CRITICO';
    if (current === min) return 'BAJO';
    return 'OK';
  });
}
