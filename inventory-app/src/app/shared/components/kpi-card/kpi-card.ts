import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CardModule],
  template: `
    <p-card>
      <div class="kpi-content">
        <i [class]="'kpi-icon pi ' + icon()" [style.color]="color()"></i>
        <div class="kpi-info">
          <span class="kpi-value">{{ value() }}</span>
          <span class="kpi-label">{{ label() }}</span>
        </div>
      </div>
    </p-card>
  `,
  styles: [`
    .kpi-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .kpi-icon {
      font-size: 2rem;
    }
    .kpi-info {
      display: flex;
      flex-direction: column;
    }
    .kpi-value {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .kpi-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }
  `]
})
export class KpiCard {
  readonly icon = input.required<string>();
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
  readonly color = input('var(--primary-color)');
}
