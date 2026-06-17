import { Component, output, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../../core/services/product.service';
import { InventoryStore } from '../../../../store/inventory.store';
import { ProductRequest } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [DialogModule, InputTextModule, InputNumberModule, ButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form-dialog.html',
  styleUrls: ['./product-form-dialog.scss'],
})
export class ProductFormDialog {
  readonly close = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly messageService = inject(MessageService);
  private readonly store = inject(InventoryStore);

  protected saving = signal(false);

  protected form = this.fb.nonNullable.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    category: ['', Validators.required],
    currentStock: [0, [Validators.required, Validators.min(0)]],
    minStock: [0, [Validators.required, Validators.min(0)]],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
  });

  onHide(): void {
    this.close.emit();
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.productService.save(this.form.value as unknown as ProductRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Producto creado', detail: 'Producto registrado correctamente', life: 3000 });
        this.store.loadProducts();
        this.close.emit();
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
