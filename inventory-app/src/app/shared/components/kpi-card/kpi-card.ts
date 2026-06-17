import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CardModule],
  templateUrl: './kpi-card.html',
  styleUrls: ['./kpi-card.scss'],
  host: {
    '[style.--card-color]': 'color()',
  },
})
export class KpiCard {
  readonly icon = input.required<string>();
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
  readonly color = input('#6366f1');
}
