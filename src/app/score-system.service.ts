import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ScoreSystemService {

  public smileyScore = new BehaviorSubject(0);
  public starScore = new BehaviorSubject(0);

  constructor(private http: HttpClient) { }

  setSmileyScore(smileyScore: number) {
    this.smileyScore.next(smileyScore);
   }
   getSmileyScore() {
     return this.smileyScore;
   }

   setStarScore(starScore: number) {
    // this.starScore.next(1);
    // this.starScore.subscribe(x => console.log(x));
    this.starScore.next(starScore);
   }

   getStarScore() {
     return this.starScore;
   }
}
