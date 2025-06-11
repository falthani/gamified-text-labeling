import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import Keyboard from "simple-keyboard";
@Component({
  selector: 'app-doc-keyboard',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './doc-keyboard.component.html',
  styleUrls: ['./doc-keyboard.component.scss']
})
export class DocKeyboardComponent implements OnInit {
  @Input() blank = '';
  @Input() guesses: string[] = [];
  @Input() blanks: string[] = [];
  value = "";
  keyboard!: Keyboard;
  

  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onKeyPress: (button: string) => this.onKeyPress(button)
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
    const randomIndex = Math.floor(Math.random() * this.blanks.length);
    this.blank = this.blanks[randomIndex];
    console.log(this.blank);
  }

  onKeyPress = (button: string) => {
    console.log(button);
    const key = prompt('Enter a key') || '';
    this.guess(key);

    // const key = button;
    // this.guess(key);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    // if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };


  ngOnInit(): void {
  }

}
