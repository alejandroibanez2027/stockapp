import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRequest, PageResponse } from '../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/products';

  findAll(category?: string, page = 0, size = 10, sort?: string): Observable<PageResponse<Product>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (category) params = params.set('category', category);
    if (sort) params = params.set('sort', sort);
    return this.http.get<PageResponse<Product>>(this.apiUrl, { params });
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  save(request: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, request);
  }
}
