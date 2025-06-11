import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Player 1', weight: 200 },
  { position: 2, name: 'Player 2', weight: 150 },
  { position: 3, name: 'Player 3', weight: 100 },
  { position: 4, name: 'Player 4', weight: 50 },
  { position: 5, name: 'Player 5', weight: 25 },
];

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
