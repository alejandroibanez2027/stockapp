import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement, MovementRequest } from '../../shared/models/movement.model';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/movements';

  save(request: MovementRequest): Observable<Movement> {
    return this.http.post<Movement>(this.apiUrl, request);
  }

  findByProductId(productId: number): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.apiUrl}/${productId}/history`);
  }
}
