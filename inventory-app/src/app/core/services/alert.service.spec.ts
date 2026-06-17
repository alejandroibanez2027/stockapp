import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AlertService } from './alert.service';
import { StockAlert } from '../../shared/models/alert.model';

describe('AlertService', () => {
  let service: AlertService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AlertService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAlerts', () => {
    it('should GET /api/v1/alerts', () => {
      const alerts: StockAlert[] = [
        { productId: 1, sku: 'SKU001', productName: 'Test', currentStock: 2, minStock: 5, severity: 'CRITICAL' },
      ];

      service.getAlerts().subscribe(res => expect(res).toEqual(alerts));

      const req = httpMock.expectOne(r => r.url.includes('/alerts'));
      expect(req.request.method).toBe('GET');
      req.flush(alerts);
    });
  });
});
