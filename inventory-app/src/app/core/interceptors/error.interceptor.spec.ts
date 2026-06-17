import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let messageService: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    messageService = { add: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageService },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should call messageService.add with body message on HttpErrorResponse', () => {
    const http = TestBed.inject(HttpClient);

    http.get('/test').subscribe({
      error: () => {
        expect(messageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Error 404',
          detail: 'Not found',
          life: 5000,
        });
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Not found', status: 404 }, { status: 404, statusText: 'Not Found' });
  });

  it('should fallback to statusText when body has no message', () => {
    const http = TestBed.inject(HttpClient);

    http.get('/test').subscribe({
      error: () => {
        expect(messageService.add).toHaveBeenCalledWith(
          expect.objectContaining({ detail: 'Server Error' })
        );
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, { status: 500, statusText: 'Server Error' });
  });

  it('should fallback to statusText when no body', () => {
    const http = TestBed.inject(HttpClient);

    http.get('/test').subscribe({
      error: () => {
        expect(messageService.add).toHaveBeenCalledWith(
          expect.objectContaining({ detail: 'Unknown Error' })
        );
      },
    });

    const req = httpMock.expectOne('/test');
    req.error(new ProgressEvent('error'));
  });
});
