import { Component, OnInit } from '@angular/core';
import { getEnvironmentData } from 'worker_threads';
import { Subscription } from 'rxjs';
import { ScoreSystemService } from '../../../score-system.service';

@Component({
  selector: 'app-smiley-score',
  templateUrl: './smiley-score.component.html',
  styleUrls: ['./smiley-score.component.scss']
})
export class SmileyScoreComponent implements OnInit { 
  // smileyScore: number = this.getData();
  public smileyPointsCount = -1;
  public smileyPointsSubscription: Subscription = new Subscription;

  constructor(private ScoreSystemService: ScoreSystemService) { }

  ngOnInit(): void {
    this.smileyPointsSubscription = this.ScoreSystemService.getSmileyScore()
    .subscribe(response => {
      this.smileyPointsCount++;
    })
  }


  ngOnDestroy() {
    this.smileyPointsSubscription.unsubscribe();
  }

  // getData(){
    
  //   return this.ScoreSystemService.smileyScore;
  // }

}
