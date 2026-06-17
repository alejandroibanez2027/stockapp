import { Component, output, input, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MovementService } from '../../../../core/services/movement.service';
import { InventoryStore } from '../../../../store/inventory.store';
import { Product } from '../../../../shared/models/product.model';
import { MovementRequest } from '../../../../shared/models/movement.model';

@Component({
  selector: 'app-movement-dialog',
  standalone: true,
  imports: [DialogModule, SelectButtonModule, InputNumberModule, TextareaModule, ButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './movement-dialog.html',
  styleUrls: ['./movement-dialog.scss'],
})
export class MovementDialog {
  readonly visible = input(false);
  readonly product = input<Product | null>(null);
  readonly visibleChange = output<boolean>();

  private readonly fb = inject(FormBuilder);
  private readonly movementService = inject(MovementService);
  private readonly messageService = inject(MessageService);
  private readonly store = inject(InventoryStore);

  protected saving = signal(false);

  protected readonly movementTypes = [
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' },
  ];

  protected form = this.fb.nonNullable.group({
    type: ['IN', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
  });

  onShow(): void {
    this.form.reset({ type: 'IN', quantity: 1, reason: '' });
  }

  onHide(): void {
    this.visibleChange.emit(false);
  }

  submit(): void {
    if (this.form.invalid) return;
    const p = this.product();
    if (!p) return;
    this.saving.set(true);
    const request: MovementRequest = {
      productId: p.productId,
      type: this.form.value.type as 'IN' | 'OUT',
      quantity: this.form.value.quantity!,
      reason: this.form.value.reason!,
    };
    this.movementService.save(request).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Movimiento registrado', detail: 'Stock actualizado', life: 3000 });
        this.visibleChange.emit(false);
        this.form.reset({ type: 'IN', quantity: 1, reason: '' });
        this.store.loadProducts();
        this.store.loadAlerts();
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
