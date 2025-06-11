import {
  Component,
  Inject,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import Keyboard from 'simple-keyboard';
import { WordDisplayService } from '../../word-display.service';

@Component({
  selector: 'app-doc-emo-wds-dialog',
  templateUrl: './doc-emo-wds-dialog.component.html',
  styleUrls: ['./doc-emo-wds-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None  // Disable encapsulation
})
export class DocEmoWdsDialogComponent {
  shuffledDefinitions: {
    definition: string;
    color: string;
    examples: string[];
  }[] = [];
  hangmanState = {
    word: '', // Word to guess in its original form
    display: [] as string[], // Displayed underscores or letters, now as an array
    guesses: new Set(), // Store guessed letters
    attemptsLeft: 6, // Number of attempts
  };
  
  gameOver: boolean = false;
  wordSenseTaskVisible: boolean = false; // This controls when the word sense task is shown
  wordRevealed: boolean = false; // Controls when the word is revealed after the hangman puzzle
  showKeyboard: boolean = true; // Controls the visibility of the keyboard

  keyboard!: Keyboard;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<DocEmoWdsDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private wordDisplayService: WordDisplayService // Inject the shared service here
  ) {}

  ngOnInit(): void {
    // Shuffle definitions but keep the colors in the fixed order
    const colorMap = ['blue', 'green', 'purple']; // Fixed color order
    const shuffledDefs = this.shuffleArray(this.data.definitions); // Shuffle the definitions
    this.shuffledDefinitions = shuffledDefs.map((def, index) => ({
      ...def,
      color: colorMap[index], // Assign fixed colors in order
    }));

    // Initialize hangman game
    this.initializeHangman(this.data.word); // Initialize hangman with the word passed from the main component
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.keyboard = new Keyboard({
      onKeyPress: (button: string) => this.onKeyPressed(button),
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
      mergeDisplay: true,
      physicalKeyboardHighlight: true,
      debug: true,
      physicalKeyboardHighlightPress: true,
    });

    // Force Angular to detect changes after the keyboard initialization
    this.cd.detectChanges();
  }

  // Shuffle the definitions array
  shuffleArray(array: any[]): any[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Initialize the hangman game
  initializeHangman(word: string): void {
    this.hangmanState.word = word; // Keep the original casing of the word
    this.hangmanState.display = Array(word.length).fill(''); // Create an array of underscores
    this.hangmanState.guesses.clear();
    this.hangmanState.attemptsLeft = 6;
  }

  // Handle keypress for the hangman game
  onKeyPressed(button: string) {
    console.log('Key Pressed:', button); // Ensure this logs the key pressed
    this.guessLetter(button);
    this.keyboard.addButtonTheme(button, 'hg-grey');
  }

  // Guess a letter in the hangman game
  guessLetter(letter: string) {
    const upperLetter = letter.toUpperCase();
  
    if (
      !this.hangmanState.guesses.has(upperLetter) &&
      this.hangmanState.attemptsLeft > 0
    ) {
      this.hangmanState.guesses.add(upperLetter);
  
      if (this.hangmanState.word.toUpperCase().includes(upperLetter)) {
        let pointsEarned = 0;
  
        // Count the occurrences of the guessed letter in the word
        for (let char of this.hangmanState.word.toUpperCase()) {
          if (char === upperLetter) {
            pointsEarned += 2; // Award 1 point for each correctly guessed letter
          }
        }
  
        // Update the display with the correct guesses
        this.updateDisplay();
  
        // Add points for correct guesses
        this.wordDisplayService.addPointsForGuesses(pointsEarned);
  
        // console.log(`Points Earned: ${pointsEarned}`);
  
        // Check if the word is completely guessed
        if (!this.hangmanState.display.includes('')) {
          this.revealWord(); // Reveal the word if all letters are guessed
        }
      } else {
        this.hangmanState.attemptsLeft--;
  
        // If no attempts are left, reveal the full word
        if (this.hangmanState.attemptsLeft === 0) {
          this.revealFullWord();
        }
      }
    }
  }
  

// Reveal the word when all letters are guessed correctly
revealWord(): void {
  this.wordRevealed = true; // Mark the word as revealed
  
  // Add points for correctly guessing the word
  this.wordDisplayService.addPointsForGuesses(10); // Add 10 points for correctly guessing

  // Set the revealed word in the shared service
  this.wordDisplayService.setWord(this.hangmanState.word);

  // Proceed to the word sense task
  setTimeout(() => {
    this.revealWordSenseOptions();
  }, 800); // Optional: small delay to enhance user experience
}

// Reveal the full word if the player runs out of attempts
revealFullWord(): void {
  this.hangmanState.display = this.hangmanState.word.split('');

  // Set the revealed word in the shared service
  this.wordDisplayService.setWord(this.hangmanState.word);
  this.wordRevealed = true;
  this.wordSenseTaskVisible = true;

  this.cd.detectChanges(); // Ensure Angular updates the view immediately
}

  updateDisplay() {
    // Update the display array while preserving the original casing
    this.hangmanState.display = this.hangmanState.word
      .split('')
      .map((char) => (this.hangmanState.guesses.has(char.toUpperCase()) ? char : ''));
  }

  // Proceed to the word sense task
  revealWordSenseOptions(): void {
    this.wordSenseTaskVisible = true; // Show the word sense labeling task
  }

  // Handle word sense selection
  selectLabel(definition: string, color: string): void {
    // After labeling is complete, dismiss the bottom sheet
    this._bottomSheetRef.dismiss({
      puzzleComplete: true,
      definition,
      color,
    });
  }
  
}
