import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { Product, PageResponse } from '../../shared/models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findAll', () => {
    it('should call GET /api/v1/products with default params', () => {
      const mock: PageResponse<Product> = {
        content: [], totalElements: 0, totalPages: 0, number: 0, size: 10, first: true, last: true, empty: true,
      };

      service.findAll().subscribe(res => expect(res).toEqual(mock));

      const req = httpMock.expectOne(r => r.url.includes('/products'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      req.flush(mock);
    });

    it('should include category and sort when provided', () => {
      service.findAll('Electronics', 1, 5, 'name,asc').subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/products'));
      expect(req.request.params.get('category')).toBe('Electronics');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('size')).toBe('5');
      expect(req.request.params.get('sort')).toBe('name,asc');
      req.flush({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 5, first: false, last: true, empty: true });
    });
  });

  describe('findById', () => {
    it('should call GET /api/v1/products/:id', () => {
      const product: Product = { productId: 1, sku: 'SKU001', name: 'Test', category: 'Cat', currentStock: 10, minStock: 5, unitPrice: 100 };

      service.findById(1).subscribe(res => expect(res).toEqual(product));

      const req = httpMock.expectOne(r => r.url.includes('/products/1'));
      expect(req.request.method).toBe('GET');
      req.flush(product);
    });
  });

  describe('save', () => {
    it('should POST to /api/v1/products', () => {
      const request = { sku: 'SKU002', name: 'New', category: 'Cat', currentStock: 5, minStock: 2, unitPrice: 50 };
      const product: Product = { productId: 2, ...request };

      service.save(request).subscribe(res => expect(res).toEqual(product));

      const req = httpMock.expectOne(r => r.url.includes('/products'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(product);
    });
  });
});
