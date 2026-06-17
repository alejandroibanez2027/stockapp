import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovementDialog } from './movement-dialog';
import { MovementService } from '../../../../core/services/movement.service';
import { InventoryStore } from '../../../../store/inventory.store';
import { MessageService } from 'primeng/api';
import { AlertService } from '../../../../core/services/alert.service';
import { ProductService } from '../../../../core/services/product.service';
import { of } from 'rxjs';
import { Product } from '../../../../shared/models/product.model';

describe('MovementDialog', () => {
  let component: MovementDialog;
  let fixture: ComponentFixture<MovementDialog>;
  let movementServiceMock: { save: ReturnType<typeof vi.fn>; findByProductId: ReturnType<typeof vi.fn> };
  let messageServiceAdd: ReturnType<typeof vi.fn>;

  const mockProduct: Product = {
    productId: 1, sku: 'SKU001', name: 'Test Product', category: 'Electronics',
    currentStock: 10, minStock: 5, unitPrice: 99.99,
  };

  function form() {
    return (component as unknown as { form: any }).form;
  }

  function movementTypes() {
    return (component as unknown as { movementTypes: { label: string; value: string }[] }).movementTypes;
  }

  beforeEach(async () => {
    movementServiceMock = {
      save: vi.fn().mockReturnValue(of({ movementId: 1 })),
      findByProductId: vi.fn(),
    };
    messageServiceAdd = vi.fn();

    await TestBed.configureTestingModule({
      imports: [MovementDialog],
      providers: [
        InventoryStore,
        { provide: MovementService, useValue: movementServiceMock },
        { provide: AlertService, useValue: { getAlerts: vi.fn() } },
        { provide: ProductService, useValue: { findAll: vi.fn() } },
        { provide: MessageService, useValue: { add: messageServiceAdd } },
      ],
    }).compileComponents();

    const store = TestBed.inject(InventoryStore);
    vi.spyOn(store, 'loadProducts').mockImplementation(() => {});
    vi.spyOn(store, 'loadAlerts').mockImplementation(() => {});

    fixture = TestBed.createComponent(MovementDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(form().get('type')?.value).toBe('IN');
    expect(form().get('quantity')?.value).toBe(1);
    expect(form().get('reason')?.value).toBe('');
  });

  it('should have movement type options', () => {
    expect(movementTypes().length).toBe(2);
    expect(movementTypes()[0].value).toBe('IN');
    expect(movementTypes()[1].value).toBe('OUT');
  });

  it('should mark form invalid when reason is empty', () => {
    expect(form().valid).toBe(false);
  });

  it('should mark form valid when all fields filled', () => {
    form().patchValue({ type: 'OUT', quantity: 3, reason: 'Sale' });
    expect(form().valid).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(movementServiceMock.save).not.toHaveBeenCalled();
  });

  it('should save movement when form is valid', () => {
    form().patchValue({ type: 'OUT', quantity: 3, reason: 'Sale to customer' });

    let closed = false;
    component.close.subscribe(() => closed = true);

    component.submit();

    expect(movementServiceMock.save).toHaveBeenCalledWith({
      productId: 1, type: 'OUT', quantity: 3, reason: 'Sale to customer',
    });
    expect(messageServiceAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success', summary: 'Movimiento registrado' })
    );
    expect(closed).toBe(true);
  });

  it('should emit close on hide', () => {
    let closed = false;
    component.close.subscribe(() => closed = true);
    component.onHide();
    expect(closed).toBe(true);
  });
});
