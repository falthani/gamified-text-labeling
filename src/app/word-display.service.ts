import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordDisplayService {
  private wordSubject = new BehaviorSubject<string | null>(null);
  word$ = this.wordSubject.asObservable();

  // New properties for score tracking
  private correctGuessesPoints = 0;
  private correctLabelsPoints = 0;


  setWord(word: string): void {
    this.wordSubject.next(word);
  }

  clearWord(): void {
    this.wordSubject.next(null);
  }

  // New methods for updating points
  addPointsForGuesses(points: number) {
    this.correctGuessesPoints += points;
    console.log(`Points for guesses: ${this.correctGuessesPoints}`);
  }

  addPointsForLabels(points: number) {
    this.correctLabelsPoints += points;
    console.log(`Points for labels: ${this.correctLabelsPoints}`);
  }

  getTotalPoints() {
    return this.correctGuessesPoints + this.correctLabelsPoints;
  }
}
