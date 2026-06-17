import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailDialog } from './product-detail-dialog';
import { Product } from '../../../../shared/models/product.model';

describe('ProductDetailDialog', () => {
  let component: ProductDetailDialog;
  let fixture: ComponentFixture<ProductDetailDialog>;

  const mockProduct: Product = {
    productId: 1, sku: 'SKU001', name: 'Test Product', category: 'Electronics',
    currentStock: 10, minStock: 5, unitPrice: 99.99,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product details', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('SKU001');
    expect(el.textContent).toContain('Test Product');
    expect(el.textContent).toContain('Electronics');
    expect(el.textContent).toContain('10');
    expect(el.textContent).toContain('5');
  });

  it('should emit close on hide', () => {
    let closed = false;
    component.close.subscribe(() => closed = true);
    component.onHide();
    expect(closed).toBe(true);
  });

  it('should emit registerMovement with product and then close', () => {
    let emittedProduct: Product | undefined;
    component.registerMovement.subscribe(p => emittedProduct = p);

    let closed = false;
    component.close.subscribe(() => closed = true);

    component.onRegisterMovement();

    expect(emittedProduct).toBe(mockProduct);
    expect(closed).toBe(true);
  });
});
