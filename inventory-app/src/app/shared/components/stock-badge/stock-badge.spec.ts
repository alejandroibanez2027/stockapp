import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockBadge } from './stock-badge';
import { TagModule } from 'primeng/tag';

describe('StockBadge', () => {
  let component: StockBadge;
  let fixture: ComponentFixture<StockBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockBadge, TagModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StockBadge);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when currentStock < minStock', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentStock', 3);
      fixture.componentRef.setInput('minStock', 5);
      fixture.detectChanges();
    });

    it('severity should be danger', () => {
      expect(getSeverity(component)).toBe('danger');
    });

    it('label should be CRITICO', () => {
      expect(getLabel(component)).toBe('CRITICO');
    });
  });

  describe('when currentStock === minStock', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentStock', 5);
      fixture.componentRef.setInput('minStock', 5);
      fixture.detectChanges();
    });

    it('severity should be warn', () => {
      expect(getSeverity(component)).toBe('warn');
    });

    it('label should be BAJO', () => {
      expect(getLabel(component)).toBe('BAJO');
    });
  });

  describe('when currentStock > minStock', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('currentStock', 10);
      fixture.componentRef.setInput('minStock', 5);
      fixture.detectChanges();
    });

    it('severity should be success', () => {
      expect(getSeverity(component)).toBe('success');
    });

    it('label should be OK', () => {
      expect(getLabel(component)).toBe('OK');
    });
  });

  function getSeverity(c: StockBadge): string {
    return (c as unknown as { severity: () => string }).severity();
  }

  function getLabel(c: StockBadge): string {
    return (c as unknown as { label: () => string }).label();
  }
});
