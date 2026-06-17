import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryDialog } from './history-dialog';
import { MovementService } from '../../../../core/services/movement.service';
import { Product } from '../../../../shared/models/product.model';
import { of } from 'rxjs';

describe('HistoryDialog', () => {
  let component: HistoryDialog;
  let fixture: ComponentFixture<HistoryDialog>;
  let movementServiceMock: { findByProductId: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn> };

  const mockProduct: Product = {
    productId: 1, sku: 'SKU001', name: 'Test Product', category: 'Electronics',
    currentStock: 10, minStock: 5, unitPrice: 99.99,
  };

  const mockHistory = [
    { movementId: 1, productId: 1, type: 'IN' as const, quantity: 10, reason: 'Initial stock', createdAt: '2025-01-01T10:00:00' },
    { movementId: 2, productId: 1, type: 'OUT' as const, quantity: 3, reason: 'Sale', createdAt: '2025-01-02T10:00:00' },
  ];

  beforeEach(async () => {
    movementServiceMock = {
      findByProductId: vi.fn().mockReturnValue(of(mockHistory)),
      save: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HistoryDialog],
      providers: [
        { provide: MovementService, useValue: movementServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load history on init', () => {
    expect(movementServiceMock.findByProductId).toHaveBeenCalledWith(1);
    const comp = component as unknown as { history: typeof mockHistory; loading: boolean };
    expect(comp.history.length).toBe(2);
    expect(comp.loading).toBe(false);
  });

  it('should display history entries', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('IN');
    expect(el.textContent).toContain('Initial stock');
    expect(el.textContent).toContain('Sale');
  });

  it('should emit close on hide', () => {
    let closed = false;
    component.close.subscribe(() => closed = true);
    component.onHide();
    expect(closed).toBe(true);
  });
});
