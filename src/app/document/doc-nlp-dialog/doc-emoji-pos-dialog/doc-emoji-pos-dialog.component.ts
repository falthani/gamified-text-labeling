import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PosTagService } from '../../../pos-tag.service';
import { ScoreSystemService } from '../../../score-system.service';
import { Observable, Subscription } from 'rxjs';
import { last } from 'lodash';
import Keyboard from 'simple-keyboard';


// Define interfaces for type safety
interface PosTagItem {
  id: number;
  word: string;
  pos: string;
  conc: number | undefined;
  noun: boolean;
  pronoun: boolean;
  verb: boolean;
  adjective: boolean;
  propernoun: boolean;
  isDisabled: boolean;
  isExperimentItem?: boolean;
  color: string;
  img?: string;
}

interface experimentItem {
  id: number;
  img?: string;
}

interface UserPosTagItem {
  id: number;
  word: string;
  pos: string;
  conc: number | undefined;
  userInput: string;
}

@Component({
  selector: 'app-doc-emoji-pos-dialog',
  templateUrl: './doc-emoji-pos-dialog.component.html',
  styleUrls: ['./doc-emoji-pos-dialog.component.scss'],
})
export class DocEmojiPosDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('keyboard') keyboardComponent!: ElementRef;
  keyboard!: Keyboard;
  sharedPosTagItem: PosTagItem[] = [];
  posTagItems: PosTagItem[] = [];
  blanks: string[] = [];
  blank = '';
  lastIndex = 0;
  currentUserPosTagItem: UserPosTagItem[] = [];
  hangmanState = {
    word: '',           // Word to guess
    display: '',        // Displayed underscores or letters
    guesses: new Set(), // Store guessed letters
    attemptsLeft: 6,    // Number of attempts
  };


  experimentItems: experimentItem[] = [];
  sharedPosTagItems: PosTagItem[] = [];
  sharedPosTagItems$!: Observable<any[]>;

  pageSize = 100; // Ensure this matches the pageSize in DocNlpPosExp1Component

  gameOver: boolean = false; 



  constructor(
    public posTagService: PosTagService,
    private snackBar: MatSnackBar,
    private scoreSystemService: ScoreSystemService,
    private bottomSheet: MatBottomSheet,
    private sanitizer: DomSanitizer
  ) {
    this.sharedPosTagItems$ = this.posTagService.sharedPosTagItem$;
  }

  ngOnInit(): void {
    this.sharedPosTagItem = this.getData();
    this.experimentItems = this.getExperimentData();
    this.pushExpPosWords();
    this.pushPosWords();
    this.pushBlanks();
    this.pickNewBlank();
    this.initializeHangman(this.sharedPosTagItems[this.lastIndex].word);  // Correct call

  }

  ngAfterViewInit(): void {
    this.keyboard = new Keyboard({
      // onChange: input => this.onInputChanged(input),
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
      physicalKeyboardHighlightPress: true
    });

  }


  initializeHangman(word: string): void {
    this.hangmanState.word = word.toUpperCase();
    this.hangmanState.display = '_ '.repeat(word.length).trim();
    this.hangmanState.guesses.clear();
    this.hangmanState.attemptsLeft = 6;
  }

  onKeyPressed(button: string) {
    if (button === "{bksp}") {
      // this.handleBackspace();
    } else if (button === "{enter}") {
      // Possibly handle enter
    } else {
      this.guessLetter(button);
    }
  }

  // handleBackspace() {
  //   // Handle backspace logic if needed
  // }

  guessLetter(letter: string) {
    const upperLetter = letter.toUpperCase();
    if (!this.hangmanState.guesses.has(upperLetter) && this.hangmanState.attemptsLeft > 0) {
      this.hangmanState.guesses.add(upperLetter);

      if (this.hangmanState.word.includes(upperLetter)) {
        this.updateDisplay();
        if (!this.hangmanState.display.includes('_')) {
          this.revealPosTaggingOptions();
        }
      } else {
        this.hangmanState.attemptsLeft--;
        if (this.hangmanState.attemptsLeft === 0) {
          this.revealPosTaggingOptions();
        }
      }
    }}
  

  updateDisplay() {
    let display = this.hangmanState.word.split('').map(char => 
      this.hangmanState.guesses.has(char) ? char : '_'
    ).join(' ');
    this.hangmanState.display = display;
  }
  

  setupHangmanGame(): void {
    if (this.sharedPosTagItems.length > 0) {
      this.pickNewBlank();  // Update lastIndex based on logic to select the correct word
      if (this.sharedPosTagItems[this.lastIndex]) {
        this.initializeHangman(this.sharedPosTagItems[this.lastIndex].word);
      }
    }}
  
  revealPosTaggingOptions(): void {
    if (!this.hangmanState.display.includes('_') || this.hangmanState.attemptsLeft === 0) {
      this.gameOver = true; // Set game over true when the word is guessed or attempts are out
      // this.snackBar.open('Transitioning to labeling task', 'Close', { duration: 3000 });
    }
  }



  getData(): PosTagItem[] {
    return this.posTagService.sharedPosTagItem;
  }

  getExperimentData(): experimentItem[] {
    return this.posTagService.experimentItem;
  }

  pushExpPosWords(): void {
    for (const item of this.posTagService.posTagItems) {
      if (item.isExperimentItem) {
        this.posTagItems.push({ ...item });
      }
    }
  }

  pushPosWords(): void {
    for (const item of this.sharedPosTagItem) {
      if (['NOUN', 'PROPN', 'PRON'].includes(item.pos)) {
        this.sharedPosTagItems.push({ ...item });
      }
    }
  }

  pushBlanks(): void {
    this.blanks = this.sharedPosTagItems.map((item) => item.word);
  }

  pickNewBlank(): void {
    this.lastIndex = this.blanks.length - 1;
    this.blank = this.blanks[this.lastIndex];
  }

  handleButtonClick(tagType: string, isCorrect: boolean, color: string): void {
    // console.log('handleButtonClick triggered');
    let id = this.sharedPosTagItems[this.lastIndex]?.id;
    // console.log('index:',this.lastIndex);
    // console.log('id', id);

    let serviceItem = this.posTagService.posTagItems.find(
      (item) => item.id === id
    );

    if (serviceItem) {
      serviceItem.color = isCorrect ? color : 'grey';
      serviceItem.isDisabled = true;
      serviceItem.img = '';
      serviceItem.userInput = tagType;

      let newUserPosTagItem: UserPosTagItem = {
        id: serviceItem.id,
        word: serviceItem.word,
        pos: serviceItem.pos,
        conc: serviceItem.conc,
        userInput: serviceItem.userInput,
      };
      this.posTagService.userPosTagItem.push(newUserPosTagItem);
      this.posTagService.updateUserPosTagItem(
        this.posTagService.userPosTagItem
      );
    }
    this.bottomSheet.dismiss();
    this.onNextClick();
  }

  onBackClick(): void {
    // Check if sharedPosTagItems is empty
    if (this.sharedPosTagItems.length === 0) {
      // Log error or handle the case where sharedPosTagItems is empty
      console.error('sharedPosTagItems is empty');
      return;
    }

    // Get the ID of the last item in sharedPosTagItems
    const currentPosTagItemId = this.sharedPosTagItems[this.sharedPosTagItems.length - 1].id;

    // Find the index of the previous enabled item
    const previousPosTagItemIndex = this.posTagItems.slice().reverse().findIndex(item => item.id < currentPosTagItemId && !item.isDisabled);

    // Check if a valid previous item was found
    if (previousPosTagItemIndex !== -1) {
      // Calculate the actual index in the original array (since we used reverse)
      const actualIndex = this.posTagItems.length - 1 - previousPosTagItemIndex;
      const previousPosTagItem = this.posTagItems[actualIndex];

      // Ensure the nounPronPropnCount is less than 30
      if (this.posTagService.nounPronPropnCount.value < 30) {
        // Calculate and update the current page index
        const pageIndex = Math.floor(previousPosTagItem.id / this.pageSize);
        this.posTagService.setCurrentPageIndex(pageIndex);

        // Close the current bottom sheet
        this.bottomSheet.dismiss();

        // Defer the simulation of the click action
        setTimeout(() => {
          // Simulate click on the previousPosTagItem
          this.posTagService.simulatePosTagItemClick(previousPosTagItem.id);

          // Optionally, reopen the bottom sheet or perform other actions here
          setTimeout(() => {
            this.openBottomSheet(previousPosTagItem.id);
          }, 300);
        }, 500); // Adjust this delay as needed
      }
    } else {
      // Log error or handle the case where no suitable previous item is found
      console.error('No suitable previous posTagItem found');
    }
}


  // Using the handleButtonClick method for different buttons
  pronounBtn(): void {
    this.handleButtonClick(
      'PRON',
      !!this.sharedPosTagItems[this.lastIndex].pronoun,
      'blue'
    );
    if (this.sharedPosTagItems[this.lastIndex].pronoun) {
      this.scoreSystemService.setStarScore(1);
    }
  }

  nounBtn(): void {
    this.handleButtonClick(
      'NOUN',
      !!this.sharedPosTagItems[this.lastIndex].noun,
      'green'
    );
    if (this.sharedPosTagItems[this.lastIndex].noun) {
      this.scoreSystemService.setStarScore(1);
    }
  }

  properNounBtn(): void {
    this.handleButtonClick(
      'PROPN',
      !!this.sharedPosTagItems[this.lastIndex].propernoun,
      'purple'
    );
    if (this.sharedPosTagItems[this.lastIndex].propernoun) {
      this.scoreSystemService.setStarScore(1);
    }
  }

  sanitizeImageUrl(imageUrl: string | undefined): SafeUrl {
    if (imageUrl === undefined) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  openBottomSheet(value: any): void {
    // Find the PosTagItem by the passed ID
    const posTagItem = this.posTagItems.find((item) => item.id === value);
    if (posTagItem) {
      // this.sharedPosTagItems = this.findSentenceItems(value);

      // Add the found posTagItem to currentPosTagItems
      this.sharedPosTagItems.push(posTagItem);

      // Update the sharedPosTagItem in the service
      this.posTagService.sharedPosTagItem = this.sharedPosTagItems;

      // Open the bottom sheet with the updated data
      const bottomSheetRef = this.bottomSheet.open(DocEmojiPosDialogComponent);

      // Optional: Add logic for after the bottom sheet is dismissed
      bottomSheetRef.afterDismissed().subscribe(() => {
        // Add any additional logic if needed
      });
    } else {
      console.error('No posTagItem found for ID:', value);
    }
  }

onNextClick(): void {
  // console.log('onNextClick triggered');
  if (this.sharedPosTagItems.length === 0) {
    // console.error('sharedPosTagItems is empty');
    return;
  }

  const lastSharedPosTagItemId = this.sharedPosTagItems[this.sharedPosTagItems.length - 1].id;
  const nextPosTagItem = this.posTagItems.find(item => item.id > lastSharedPosTagItemId);
  const arrayId = this.posTagItems.findIndex(item => item.id > lastSharedPosTagItemId);

  if (nextPosTagItem && nextPosTagItem.id !== undefined && !this.posTagItems[arrayId]?.isDisabled && this.posTagService.nounPronPropnCount.value < 30) {
    const pageIndex = Math.floor(nextPosTagItem.id / this.pageSize);
    this.posTagService.setCurrentPageIndex(pageIndex);

    // Update the image URL if the nextPosTagItem has an image
    if (nextPosTagItem.img) {
      this.posTagService.updateImageUrl(nextPosTagItem.img);
    }

    this.bottomSheet.dismiss();
    setTimeout(() => {
      this.posTagService.simulatePosTagItemClick(nextPosTagItem.id);
      setTimeout(() => {
        this.openBottomSheet(nextPosTagItem.id);
      }, 300);
    }, 500);
  } else {
    // console.error('No next posTagItem found or next posTagItem id is undefined');
  }
}

  
  
}
