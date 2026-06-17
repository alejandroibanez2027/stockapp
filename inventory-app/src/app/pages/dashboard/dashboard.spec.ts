import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { InventoryStore } from '../../store/inventory.store';
import { ProductService } from '../../core/services/product.service';
import { AlertService } from '../../core/services/alert.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { PageResponse, Product } from '../../shared/models/product.model';
import { StockAlert } from '../../shared/models/alert.model';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let store: InventoryStore;

  const mockPage: PageResponse<Product> = {
    content: [
      { productId: 1, sku: 'SKU001', name: 'A', category: 'Cat', currentStock: 10, minStock: 5, unitPrice: 100 },
      { productId: 2, sku: 'SKU002', name: 'B', category: 'Cat', currentStock: 3, minStock: 5, unitPrice: 50 },
    ],
    totalElements: 2, totalPages: 1, number: 0, size: 10, first: true, last: true, empty: false,
  };

  const mockAlerts: StockAlert[] = [
    { productId: 2, sku: 'SKU002', productName: 'B', currentStock: 3, minStock: 5, severity: 'CRITICAL' },
  ];

  beforeEach(async () => {
    const productServiceMock = { findAll: vi.fn().mockReturnValue(of(mockPage)) };
    const alertServiceMock = { getAlerts: vi.fn().mockReturnValue(of(mockAlerts)) };
    const messageServiceMock = { add: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        InventoryStore,
        { provide: ProductService, useValue: productServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(InventoryStore);
    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject store', () => {
    expect(component['store']).toBe(store);
  });

  it('should call loadDashboardProducts and loadAlerts on init', () => {
    expect(store.products().length).toBe(2);
    expect(store.alerts().length).toBe(1);
  });

  it('should render KPI cards with values', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Total Productos');
    expect(el.textContent).toContain('Alertas Activas');
    expect(el.textContent).toContain('Alertas Críticas');
    expect(el.textContent).toContain('Valor Inventario');
  });

  it('should render alerts panel with severity tags', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('SKU002');
    expect(el.textContent).toContain('CRITICAL');
  });
});
