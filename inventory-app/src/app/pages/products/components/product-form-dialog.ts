import { Component, output, input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { ProductRequest } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [DialogModule, InputTextModule, InputNumberModule, ButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form-dialog.html',
  styleUrls: ['./product-form-dialog.scss'],
})
export class ProductFormDialog {
  readonly visible = input(false);
  readonly saving = input(false);
  readonly visibleChange = output<boolean>();
  readonly save = output<ProductRequest>();

  private readonly fb = inject(FormBuilder);

  protected form = this.fb.nonNullable.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    category: ['', Validators.required],
    currentStock: [0, [Validators.required, Validators.min(0)]],
    minStock: [0, [Validators.required, Validators.min(0)]],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
  });

  onHide(): void {
    this.visibleChange.emit(false);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.save.emit(this.form.value as unknown as ProductRequest);
    this.form.reset({ sku: '', name: '', category: '', currentStock: 0, minStock: 0, unitPrice: 0 });
  }
}
