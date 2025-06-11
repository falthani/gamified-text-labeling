import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-doc-blank',
  templateUrl: './doc-blank.component.html',
  styleUrls: ['./doc-blank.component.scss']
})
export class DocBlankComponent implements OnInit, OnChanges {
  @Input() blank: string = '';
  @Input() guesses: string[] = [];
  characters: { value: string; guessed: boolean }[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.['blank']?.currentValue &&
      changes?.['blank'].currentValue !== changes?.['blank'].previousValue
    ) {
      this.characters = this.blank
        .split('')
        .map((char) => ({ value: char, guessed: false}));
    }
    const guessesCurrentValue = changes?.['guesses']?.currentValue;
    if (
      guessesCurrentValue &&
      guessesCurrentValue.length &&
      guessesCurrentValue !== changes['guesses'].previousValue
    ) {
      const guessedChar = [...changes['guesses'].currentValue].pop();
      this.characters = this.characters.map((char) => {
        if (char.value.toLowerCase() === guessedChar.toLowerCase()) {
          return { ...char, guessed: true };
        }
        return char;
      });
    }
  }
}
