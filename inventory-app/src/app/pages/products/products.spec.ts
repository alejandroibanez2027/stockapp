import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Products } from './products';
import { InventoryStore } from '../../store/inventory.store';
import { ProductService } from '../../core/services/product.service';
import { AlertService } from '../../core/services/alert.service';
import { MovementService } from '../../core/services/movement.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { PageResponse, Product } from '../../shared/models/product.model';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;
  let store: InventoryStore;

  const mockPage: PageResponse<Product> = {
    content: [
      { productId: 1, sku: 'SKU001', name: 'Product A', category: 'Electronics', currentStock: 10, minStock: 5, unitPrice: 100 },
      { productId: 2, sku: 'SKU002', name: 'Product B', category: 'Office', currentStock: 3, minStock: 5, unitPrice: 50 },
    ],
    totalElements: 2, totalPages: 1, number: 0, size: 10, first: true, last: true, empty: false,
  };

  beforeEach(async () => {
    const productServiceMock = { findAll: vi.fn().mockReturnValue(of(mockPage)), findById: vi.fn(), save: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        InventoryStore,
        { provide: ProductService, useValue: productServiceMock },
        { provide: AlertService, useValue: { getAlerts: vi.fn() } },
        { provide: MovementService, useValue: { save: vi.fn(), findByProductId: vi.fn() } },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    }).compileComponents();

    store = TestBed.inject(InventoryStore);
    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with categories', () => {
    const comp = component as unknown as { categories: string[] };
    expect(comp.categories).toContain('Electronics');
    expect(comp.categories).toContain('Gaming');
  });

  it('should load products on init', () => {
    expect(store.products().length).toBe(2);
  });

  it('should filter by category', () => {
    const comp = component as unknown as { selectedCategory: string; filterByCategory: () => void };
    comp.selectedCategory = 'Office';
    comp.filterByCategory();
    expect(store.filters().category).toBe('Office');
    expect(store.filters().page).toBe(0);
  });

  it('should handle lazy load event with sort', () => {
    const comp = component as unknown as { loadLazy: (e: any) => void };
    comp.loadLazy({ first: 10, rows: 10, sortField: 'name', sortOrder: 1 });
    expect(store.filters().page).toBe(1);
    expect(store.filters().sort).toBe('name,asc');
  });

  it('should handle lazy load event with desc sort', () => {
    const comp = component as unknown as { loadLazy: (e: any) => void };
    comp.loadLazy({ first: 0, rows: 10, sortField: 'currentStock', sortOrder: -1 });
    expect(store.filters().sort).toBe('currentStock,desc');
  });

  it('should handle lazy load event without sort', () => {
    const comp = component as unknown as { loadLazy: (e: any) => void };
    comp.loadLazy({ first: 0, rows: 10 });
    expect(store.filters().sort).toBe('productId,asc');
  });

  it('should open detail dialog with product', () => {
    const comp = component as unknown as { showDetail: (p: Product) => void; detailProduct: Product | null; detailDialog: boolean };
    const product = store.products()[0];
    comp.showDetail(product);
    expect(comp.detailProduct).toBe(product);
    expect(comp.detailDialog).toBe(true);
  });

  it('should open movement dialog with product', () => {
    const comp = component as unknown as { openMovementDialog: (p: Product) => void; movementProduct: Product | null; movementDialog: boolean };
    const product = store.products()[0];
    comp.openMovementDialog(product);
    expect(comp.movementProduct).toBe(product);
    expect(comp.movementDialog).toBe(true);
  });

  it('should open history dialog with product', () => {
    const comp = component as unknown as { showHistory: (p: Product) => void; selectedForHistory: Product | null; historyDialog: boolean };
    const product = store.products()[0];
    comp.showHistory(product);
    expect(comp.selectedForHistory).toBe(product);
    expect(comp.historyDialog).toBe(true);
  });
});
