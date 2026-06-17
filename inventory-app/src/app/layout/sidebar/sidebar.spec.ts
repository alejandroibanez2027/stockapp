import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { provideRouter } from '@angular/router';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two navigation items', () => {
    expect(component.items.length).toBe(2);
  });

  it('should render navigation links', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Dashboard');
    expect(el.textContent).toContain('Productos');
  });

  it('should display StockFlow logo text', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('StockFlow');
  });
});
