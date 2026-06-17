import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormDialog } from './product-form-dialog';
import { ProductService } from '../../../../core/services/product.service';
import { InventoryStore } from '../../../../store/inventory.store';
import { MessageService } from 'primeng/api';
import { AlertService } from '../../../../core/services/alert.service';
import { MovementService } from '../../../../core/services/movement.service';
import { of } from 'rxjs';

describe('ProductFormDialog', () => {
  let component: ProductFormDialog;
  let fixture: ComponentFixture<ProductFormDialog>;
  let productServiceMock: { findAll: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn> };
  let messageServiceAdd: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    productServiceMock = {
      findAll: vi.fn(),
      save: vi.fn().mockReturnValue(of({ productId: 1 })),
    };
    messageServiceAdd = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProductFormDialog],
      providers: [
        InventoryStore,
        { provide: ProductService, useValue: productServiceMock },
        { provide: AlertService, useValue: { getAlerts: vi.fn() } },
        { provide: MovementService, useValue: { save: vi.fn(), findByProductId: vi.fn() } },
        { provide: MessageService, useValue: { add: messageServiceAdd } },
      ],
    }).compileComponents();

    const store = TestBed.inject(InventoryStore);
    vi.spyOn(store, 'loadProducts').mockImplementation(() => {});

    fixture = TestBed.createComponent(ProductFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function form() {
    return (component as unknown as { form: any }).form;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(form().get('sku')?.value).toBe('');
    expect(form().get('name')?.value).toBe('');
    expect(form().get('category')?.value).toBe('');
    expect(form().get('currentStock')?.value).toBe(0);
    expect(form().get('minStock')?.value).toBe(0);
    expect(form().get('unitPrice')?.value).toBe(0);
  });

  it('should mark form invalid when empty', () => {
    expect(form().valid).toBe(false);
  });

  it('should mark form valid when all fields are filled', () => {
    form().patchValue({
      sku: 'SKU123', name: 'Test Product', category: 'Electronics',
      currentStock: 10, minStock: 5, unitPrice: 99.99,
    });
    expect(form().valid).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(productServiceMock.save).not.toHaveBeenCalled();
  });

  it('should save product and emit close when form is valid', () => {
    form().patchValue({
      sku: 'SKU123', name: 'Test Product', category: 'Electronics',
      currentStock: 10, minStock: 5, unitPrice: 99.99,
    });

    let closed = false;
    component.close.subscribe(() => closed = true);

    component.submit();

    expect(productServiceMock.save).toHaveBeenCalled();
    expect(messageServiceAdd).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success', summary: 'Producto creado' })
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
