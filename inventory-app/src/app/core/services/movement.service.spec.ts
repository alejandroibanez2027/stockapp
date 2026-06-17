import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MovementService } from './movement.service';
import { Movement, MovementRequest } from '../../shared/models/movement.model';

describe('MovementService', () => {
  let service: MovementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save', () => {
    it('should POST to /api/v1/movements', () => {
      const request: MovementRequest = { productId: 1, type: 'IN', quantity: 5, reason: 'Re-stock' };
      const movement: Movement = { movementId: 1, productId: 1, type: 'IN', quantity: 5, reason: 'Re-stock', createdAt: '2025-01-01T00:00:00' };

      service.save(request).subscribe(res => expect(res).toEqual(movement));

      const req = httpMock.expectOne(r => r.url.includes('/movements'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(movement);
    });
  });

  describe('findByProductId', () => {
    it('should GET /api/v1/movements/:productId/history', () => {
      const movements: Movement[] = [
        { movementId: 1, productId: 1, type: 'IN', quantity: 10, reason: 'Initial', createdAt: '2025-01-01T00:00:00' },
      ];

      service.findByProductId(1).subscribe(res => expect(res).toEqual(movements));

      const req = httpMock.expectOne(r => r.url.includes('/movements/1/history'));
      expect(req.request.method).toBe('GET');
      req.flush(movements);
    });
  });
});
