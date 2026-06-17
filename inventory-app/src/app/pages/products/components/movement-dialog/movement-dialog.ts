import { Component, output, input, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
  readonly saving = input(false);
  readonly visibleChange = output<boolean>();
  readonly save = output<MovementRequest>();

  private readonly fb = inject(FormBuilder);

  protected readonly movementTypes = [
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' },
  ];

  protected form = this.fb.nonNullable.group({
    type: ['IN', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
  });

  onHide(): void {
    this.visibleChange.emit(false);
  }

  submit(): void {
    if (this.form.invalid) return;
    const p = this.product();
    if (!p) return;
    const request: MovementRequest = {
      productId: p.productId,
      type: this.form.value.type as 'IN' | 'OUT',
      quantity: this.form.value.quantity!,
      reason: this.form.value.reason!,
    };
    this.save.emit(request);
    this.form.reset({ type: 'IN', quantity: 1, reason: '' });
  }
}
