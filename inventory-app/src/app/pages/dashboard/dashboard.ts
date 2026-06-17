import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { InventoryStore } from '../../store/inventory.store';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { ProductService } from '../../core/services/product.service';
import { MovementService } from '../../core/services/movement.service';
import { Product } from '../../shared/models/product.model';
import { MovementRequest } from '../../shared/models/movement.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SkeletonModule, TagModule, PanelModule, DecimalPipe, KpiCard,
    FormsModule, ReactiveFormsModule, SelectModule, SelectButtonModule,
    InputNumberModule, TextareaModule, ButtonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly movementService = inject(MovementService);
  private readonly messageService = inject(MessageService);
  protected readonly store = inject(InventoryStore);

  protected allProducts = signal<Product[]>([]);
  protected saving = signal(false);

  protected readonly movementTypes = [
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' },
  ];

  protected form = this.fb.nonNullable.group({
    product: [null as Product | null, Validators.required],
    type: ['IN', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
  });

  ngOnInit(): void {
    this.store.loadDashboardProducts();
    this.store.loadAlerts();
    this.productService.findAll('', 0, 1000).subscribe({
      next: (res) => this.allProducts.set(res.content),
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const product = this.form.value.product!;
    const request: MovementRequest = {
      productId: product.productId,
      type: this.form.value.type as 'IN' | 'OUT',
      quantity: this.form.value.quantity!,
      reason: this.form.value.reason!,
    };

    this.movementService.save(request).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Movimiento registrado', detail: 'Stock actualizado', life: 3000 });
        this.store.loadDashboardProducts();
        this.store.loadAlerts();
        this.form.reset({ product: null, type: 'IN', quantity: 1, reason: '' });
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
