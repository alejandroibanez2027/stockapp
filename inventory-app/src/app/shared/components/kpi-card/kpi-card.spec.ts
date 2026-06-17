import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiCard } from './kpi-card';

describe('KpiCard', () => {
  let component: KpiCard;
  let fixture: ComponentFixture<KpiCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCard],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', 'pi-box');
    fixture.componentRef.setInput('value', 42);
    fixture.componentRef.setInput('label', 'Total');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render value and label', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('42');
    expect(el.textContent).toContain('Total');
  });

  it('should use default color #6366f1', () => {
    expect(component.color()).toBe('#6366f1');
  });

  it('should allow custom color', () => {
    fixture.componentRef.setInput('color', '#ff0000');
    fixture.detectChanges();
    expect(component.color()).toBe('#ff0000');
  });
});
