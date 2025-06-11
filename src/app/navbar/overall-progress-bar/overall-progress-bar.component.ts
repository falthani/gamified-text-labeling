import { Component, OnInit } from '@angular/core';
import { ScoreSystemService } from '../../score-system.service';


@Component({
  selector: 'app-overall-progress-bar',
  templateUrl: './overall-progress-bar.component.html',
  styleUrls: ['./overall-progress-bar.component.scss']
})
export class OverallProgressBarComponent implements OnInit {
  overallScore: number = 0;

  constructor(private ScoreSystemService: ScoreSystemService) {}

  ngOnInit(): void {
    this.getOverallScore();
  }

  getOverallScore() {
    this.ScoreSystemService.getSmileyScore().subscribe((x) => {
      this.overallScore += x;
      console.log(this.overallScore);
    });
    this.ScoreSystemService.getStarScore().subscribe((x) => {
      this.overallScore += x;
      console.log(this.overallScore);
    });
    return this.overallScore;
  }

}
