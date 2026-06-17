import { Component, output, input, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePipe } from '@angular/common';
import { MovementService } from '../../../../core/services/movement.service';
import { Product } from '../../../../shared/models/product.model';
import { Movement } from '../../../../shared/models/movement.model';

@Component({
  selector: 'app-history-dialog',
  standalone: true,
  imports: [DialogModule, TableModule, TagModule, ButtonModule, SkeletonModule, DatePipe],
  templateUrl: './history-dialog.html',
  styleUrls: ['./history-dialog.scss'],
})
export class HistoryDialog implements OnInit {
  readonly product = input.required<Product>();
  readonly close = output<void>();

  private readonly movementService = inject(MovementService);

  protected history: Movement[] = [];
  protected loading = false;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.movementService.findByProductId(this.product().productId).subscribe({
      next: (data) => { this.history = data; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  onHide(): void {
    this.close.emit();
  }
}
