import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StockAlert } from '../../shared/models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/alerts`;

  getAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(this.apiUrl);
  }
}
