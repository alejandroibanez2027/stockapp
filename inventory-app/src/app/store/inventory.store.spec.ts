import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { InventoryStore, Filters } from './inventory.store';
import { ProductService } from '../core/services/product.service';
import { AlertService } from '../core/services/alert.service';
import { MessageService } from 'primeng/api';
import { Product, PageResponse } from '../shared/models/product.model';
import { StockAlert } from '../shared/models/alert.model';

describe('InventoryStore', () => {
  let store: InventoryStore;

  const mockProduct: Product = { productId: 1, sku: 'SKU001', name: 'Product A', category: 'Electronics', currentStock: 10, minStock: 5, unitPrice: 100 };
  const mockProduct2: Product = { productId: 2, sku: 'SKU002', name: 'Product B', category: 'Office', currentStock: 3, minStock: 5, unitPrice: 50 };
  const mockProduct3: Product = { productId: 3, sku: 'SKU003', name: 'Product C', category: 'Home', currentStock: 5, minStock: 5, unitPrice: 200 };

  const mockPage: PageResponse<Product> = {
    content: [mockProduct, mockProduct2, mockProduct3],
    totalElements: 3, totalPages: 1, number: 0, size: 10, first: true, last: true, empty: false,
  };

  const mockAlerts: StockAlert[] = [
    { productId: 2, sku: 'SKU002', productName: 'Product B', currentStock: 3, minStock: 5, severity: 'CRITICAL' },
    { productId: 3, sku: 'SKU003', productName: 'Product C', currentStock: 5, minStock: 5, severity: 'LOW' },
  ];

  function configureStore() {
    const psMock = { findAll: vi.fn() };
    const asMock = { getAlerts: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        InventoryStore,
        { provide: ProductService, useValue: psMock },
        { provide: AlertService, useValue: asMock },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    });

    store = TestBed.inject(InventoryStore);
    return { psMock, asMock };
  }

  afterEach(() => {
    localStorage.removeItem('stockflow-filters');
  });

  describe('initialization', () => {
    it('should create with default filters', () => {
      configureStore();
      const f = store.filters();
      expect(f.category).toBe('');
      expect(f.page).toBe(0);
      expect(f.size).toBe(10);
      expect(f.sort).toBe('productId,asc');
    });

    it('should restore filters from localStorage', () => {
      const saved: Filters = { category: 'Office', page: 1, size: 20, sort: 'name,desc' };
      localStorage.setItem('stockflow-filters', JSON.stringify(saved));

      configureStore();

      expect(store.filters().category).toBe('Office');
      expect(store.filters().page).toBe(1);
      expect(store.filters().size).toBe(20);
      expect(store.filters().sort).toBe('name,desc');
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('stockflow-filters', 'not-json');
      configureStore();
      expect(store.filters().category).toBe('');
    });
  });

  describe('computed signals', () => {
    beforeEach(() => {
      const { psMock, asMock } = configureStore();
      psMock.findAll.mockReturnValue(of(mockPage));
      asMock.getAlerts.mockReturnValue(of(mockAlerts));
      store.loadDashboardProducts();
      store.loadAlerts();
    });

    it('totalProducts should return totalElements', () => {
      expect(store.totalProducts()).toBe(3);
    });

    it('totalAlerts should return alerts length', () => {
      expect(store.totalAlerts()).toBe(2);
    });

    it('criticalAlerts should count CRITICAL severity', () => {
      expect(store.criticalAlerts()).toBe(1);
    });

    it('totalInventoryValue should sum currentStock * unitPrice', () => {
      expect(store.totalInventoryValue()).toBe(10 * 100 + 3 * 50 + 5 * 200);
    });

    it('lowStockProducts should return products where currentStock >= minStock, sorted ascending, top 10', () => {
      const result = store.lowStockProducts();
      expect(result.length).toBe(2);
      expect(result[0].productId).toBe(3);
      expect(result[1].productId).toBe(1);
    });
  });

  describe('setFilters', () => {
    beforeEach(() => configureStore());

    it('should merge partial filters', () => {
      store.setFilters({ category: 'Gaming', page: 2 });
      const f = store.filters();
      expect(f.category).toBe('Gaming');
      expect(f.page).toBe(2);
      expect(f.size).toBe(10);
      expect(f.sort).toBe('productId,asc');
    });

    it('should persist filters to localStorage via effect', () => {
      store.setFilters({ category: 'Networking' });
      TestBed.flushEffects();
      const stored = localStorage.getItem('stockflow-filters');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!).category).toBe('Networking');
    });
  });

  describe('loadProducts', () => {
    it('should call productService.findAll with current filters', () => {
      const { psMock } = configureStore();
      psMock.findAll.mockReturnValue(of(mockPage));
      store.setFilters({ category: 'Office', page: 1, size: 5, sort: 'name,asc' });
      store.loadProducts();
      expect(psMock.findAll).toHaveBeenCalledWith('Office', 1, 5, 'name,asc');
    });

    it('should update signals on success', () => {
      const { psMock } = configureStore();
      psMock.findAll.mockReturnValue(of(mockPage));
      store.loadProducts();
      expect(store.products().length).toBe(3);
      expect(store.totalElements()).toBe(3);
      expect(store.totalPages()).toBe(1);
      expect(store.currentPage()).toBe(0);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should set error on failure', () => {
      const { psMock } = configureStore();
      psMock.findAll.mockReturnValue(throwError(() => ({ error: { message: 'API Error' } })));
      store.loadProducts();
      expect(store.error()).toBe('API Error');
      expect(store.loading()).toBe(false);
    });

    it('should set generic error when no message in error', () => {
      const { psMock } = configureStore();
      psMock.findAll.mockReturnValue(throwError(() => ({})));
      store.loadProducts();
      expect(store.error()).toBe('Error al cargar productos');
    });
  });

  describe('loadDashboardProducts', () => {
    it('should call productService.findAll with empty category and default pagination', () => {
      const { psMock } = configureStore();
      psMock.findAll.mockReturnValue(of(mockPage));
      store.loadDashboardProducts();
      expect(psMock.findAll).toHaveBeenCalledWith('', 0, 10, 'productId,asc');
    });

    it('should clear filters category when loading dashboard', () => {
      const { psMock } = configureStore();
      store.setFilters({ category: 'Office' });
      psMock.findAll.mockReturnValue(of(mockPage));
      store.loadDashboardProducts();
      expect(psMock.findAll).toHaveBeenCalledWith('', 0, 10, 'productId,asc');
    });
  });

  describe('loadAlerts', () => {
    it('should call alertService.getAlerts and update alerts signal', () => {
      const { asMock } = configureStore();
      asMock.getAlerts.mockReturnValue(of(mockAlerts));
      store.loadAlerts();
      expect(store.alerts().length).toBe(2);
    });

    it('should show toast notification when alerts are loaded', () => {
      const { asMock } = configureStore();
      asMock.getAlerts.mockReturnValue(of(mockAlerts));
      store.loadAlerts();
      TestBed.flushEffects();
      const ms = TestBed.inject(MessageService) as unknown as { add: ReturnType<typeof vi.fn> };
      expect(ms.add).toHaveBeenCalled();
    });
  });
});
