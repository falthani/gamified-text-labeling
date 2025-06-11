import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScoreSystemService } from '../../../score-system.service';

@Component({
  selector: 'app-star-score',
  templateUrl: './star-score.component.html',
  styleUrls: ['./star-score.component.scss']
})
export class StarScoreComponent implements OnInit, OnDestroy {

  public starPointsCount = -1;
  public starPointsSubscription: Subscription = new Subscription;

  constructor(private ScoreSystemService: ScoreSystemService) { }

  ngOnInit(): void {
    this.starPointsSubscription = this.ScoreSystemService.getStarScore()
    .subscribe(response => {
      this.starPointsCount++;
    })
  }

  ngOnDestroy() {
    this.starPointsSubscription.unsubscribe();
  }

  // getData(){
  //   return this.ScoreSystemService.starScore;
  // }
}
