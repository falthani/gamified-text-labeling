import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FillInBlanksService } from '../../fill-in-blanks.service';
import { ScoreSystemService } from '../../score-system.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-doc-mistake-count',
  templateUrl: './doc-mistake-count.component.html',
  styleUrls: ['./doc-mistake-count.component.scss'],
})
export class DocMistakeCountComponent implements OnInit, OnChanges {
  @Input() guesses: string[] = [];
  @Input() blank: string = '';
  @Input() blanks: string[] = [];
  lastIndex: number = 0;
  MAX_MISTAKES = 7;
  mistakesRemaining;
  success: boolean = false;

  constructor(
    private FillInBlanksService: FillInBlanksService,
    private ScoreSystemService: ScoreSystemService,
    private _bottomSheet: MatBottomSheet,
    private changeDetector: ChangeDetectorRef
  ) {
    this.mistakesRemaining = this.MAX_MISTAKES;
  }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  getData() {
    return this.FillInBlanksService.finalText;
  }

  closeBottomSheet() {
    this._bottomSheet.dismiss();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.['blank']?.currentValue &&
      changes?.['blank'].currentValue !== changes?.['blank'].previousValue
    ) {
      this.mistakesRemaining = this.MAX_MISTAKES;
      this.success = false;
    }
    const guessesCurrentValue = changes?.['guesses']?.currentValue;
    if (
      guessesCurrentValue &&
      guessesCurrentValue.length &&
      guessesCurrentValue != changes['guesses'].previousValue
    ) {
      const char = [...guessesCurrentValue].pop();
      this.checkGuess(char);
    }
  }

  checkGuess(letter: string) {
    let i = this.lastIndex;
    let lastIndexText = this.FillInBlanksService.currentFinalText.length - 1;
    this.lastIndex = lastIndexText;
    let currentFinalText = this.FillInBlanksService.currentFinalText;
    let id = currentFinalText[i].id;
    let didWin = true;
    this.mistakesRemaining -= this.wasGuessAMistake(letter);
    for (let i = 0; i < this.blank.length; i++) {
      if (
        !this.guesses.find(
          (guess) => guess.toLowerCase() === this.blank[i].toLowerCase()
        )
      ) {
        didWin = false;
        break;
      }
    }
    this.success = didWin;

    if (this.success) {
      console.log('game ended');
      console.log(currentFinalText[i]);
      this.ScoreSystemService.setSmileyScore(1);
      this.closeBottomSheet();
      console.log(this.FillInBlanksService.finalText[id]);
      this.FillInBlanksService.finalText[id].translated =
        this.FillInBlanksService.finalText[id].word;
      this.FillInBlanksService.finalText[id].isDisabled = true;
      this.FillInBlanksService.finalText[id].button = 'correct-button';
    } else if (this.mistakesRemaining === 0) {
      this.closeBottomSheet();
    }
  }

  wasGuessAMistake(letter: string) {
    const match = this.blank.match(new RegExp(letter, 'gi'));
    return match ? 0 : 1;
  }

  pickNewBlank() {
    console.log(this.blanks);
  }

}