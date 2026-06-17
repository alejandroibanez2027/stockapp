import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { InventoryStore } from '../../store/inventory.store';
import { MovementService } from '../../core/services/movement.service';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { MovementRequest } from '../../shared/models/movement.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule, TableModule, ButtonModule, DialogModule, SelectModule,
    InputNumberModule, TextareaModule, TagModule, PanelModule,
    PaginatorModule, SkeletonModule, InputTextModule, SelectButtonModule,
    ToastModule, FormsModule, ReactiveFormsModule,
    DecimalPipe, KpiCard,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  protected readonly store = inject(InventoryStore);
  private readonly movementService = inject(MovementService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  protected movementLoading = false;

  protected readonly movementTypes = [
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' },
  ];

  protected movementForm = this.fb.nonNullable.group({
    productId: [0, Validators.required],
    type: ['IN', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
  });

  ngOnInit(): void {
    this.store.loadProducts();
    this.store.loadAlerts();
  }

  protected avgStock(): number {
    const products = this.store.products();
    if (products.length === 0) return 0;
    return products.reduce((s, p) => s + p.currentStock, 0) / products.length;
  }

  protected criticalPercent(): number {
    const products = this.store.products();
    if (products.length === 0) return 0;
    const critical = products.filter(p => p.currentStock < p.minStock).length;
    return Math.round((critical / products.length) * 100);
  }

  protected registerMovement(): void {
    if (this.movementForm.invalid) return;
    this.movementLoading = true;
    this.movementService.save(this.movementForm.value as unknown as MovementRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Movimiento registrado', detail: 'Stock actualizado correctamente', life: 3000 });
        this.movementForm.reset({ productId: 0, type: 'IN', quantity: 1, reason: '' });
        this.store.loadProducts();
        this.store.loadAlerts();
        this.movementLoading = false;
      },
      error: () => this.movementLoading = false,
    });
  }
}
