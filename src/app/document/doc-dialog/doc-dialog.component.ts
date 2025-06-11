import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FillInBlanksService } from '../../fill-in-blanks.service';
import Keyboard from 'simple-keyboard';
import test from 'node:test';
import { concat } from 'rxjs';

@Component({
  selector: 'app-doc-dialog',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './doc-dialog.component.html',
  styleUrls: ['./doc-dialog.component.scss'],
})
export class DocDialogComponent implements OnInit, AfterViewInit {
  finalText: {
    id: number;
    word: string;
    translated: string;
    emoji: string;
    isDisabled: boolean;
    button: string;
  }[] = this.getData();
  test: {
    id: number;
    word: string;
    translated: string;
    emoji: string;
    isDisabled: boolean;
    button: string;
  }[] = [];
  currentFinalText: {
    id: number;
    word: string;
    translated: string;
    emoji: string;
    isDisabled: boolean;
    button: string;
  }[] = this.test;

  blank: string = '';
  blanks: string[] = [];
  guesses: string[] = [];
  value = '';
  keyboard!: Keyboard;
  lastIndex: number = 0;
  constructor(private FillInBlanksService: FillInBlanksService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.pushEmojiWords();
    this.pushBlanks();
    this.pickNewBlank();
  }



  getData() {
    return this.FillInBlanksService.currentFinalText;
  }

  pushEmojiWords() {
    for (let i = 0; i < this.finalText.length; i++) {
      if (this.finalText[i].emoji === 'true') {
        let emojiWords = this.finalText[i];
        emojiWords.word = emojiWords.word.replace(/[,."!]/g, '');
        emojiWords.translated = emojiWords.translated.replace(/[,."!]/g, '');
        this.test.push({
          id: emojiWords.id,
          word: emojiWords.word,
          translated: emojiWords.translated,
          emoji: emojiWords.emoji,
          isDisabled: emojiWords.isDisabled,
          button: emojiWords.button,
        });
      }
    }
  }

  pushBlanks() {
    this.test
      .map((item) => item.word)
      .forEach((item) => {
        this.blanks.push(item);
      });
  }

  guess(letter: string) {
    if (!letter || this.guesses.includes(letter)) {
      return;
    }
    this.guesses = [...this.guesses, letter];
  }

  reset() {
    this.guesses = [];
    this.pickNewBlank();
  }

  pickNewBlank() {
    let lastIndexBlank = this.blanks.length - 1;
    this.blank = this.blanks[lastIndexBlank];
    this.lastIndex = lastIndexBlank;
    this.sendData();
  }

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onKeyPress: (button: string) => this.onKeyPress(button),
      theme: 'hg-theme-default hg-layout-default myTheme',
      layout: {
        default: ['q w e r t y u i o p', 'a s d f g h j k l', 'z x c v b n m'],
      },
      buttonTheme: [
        {
          class: 'hg-grey',
          buttons: ' ',
        },
      ],
    });
    this.cd.detectChanges();
  }

  sendData() {
    this.FillInBlanksService.currentFinalText[this.lastIndex] =
      this.test[this.lastIndex];
  }

  onKeyPress = (button: string) => {
    const key = button;
    console.log(key);
    this.guess(key);
    this.keyboard.addButtonTheme(key, 'hg-grey');
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  };
}
