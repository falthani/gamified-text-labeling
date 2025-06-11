import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PosTagService } from '../../pos-tag.service';
import { ScoreSystemService } from '../../score-system.service';
import { Observable, Subscription } from 'rxjs';
import { last } from 'lodash';

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
  selector: 'app-doc-nlp-exp1-dialog',
  templateUrl: './doc-nlp-dialog-exp1.component.html',
  styleUrls: ['./doc-nlp-dialog-exp1.component.scss'],
})
export class DocNlpDialogExp1Component implements OnInit {
  sharedPosTagItem: PosTagItem[] = [];
  experimentItems: experimentItem[] = [];
  posTagItems: PosTagItem[] = [];
  sharedPosTagItems: PosTagItem[] = [];
  sharedPosTagItems$!: Observable<any[]>;
  blanks: string[] = [];
  blank = '';
  lastIndex = 0;
  pageSize = 100; // Ensure this matches the pageSize in DocNlpPosExp1Component

  currentUserPosTagItem: UserPosTagItem[] = [];

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

    // Check if posTagItems is populated
    // console.log('posTagItems on init:', this.posTagItems);
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
    // console.log('this.blank', this.blank, this.lastIndex);
    // console.log('this.sharedPosTagItems', this.sharedPosTagItems);
    // console.log('this.sharedPosTagItems[this.lastIndex]', this.sharedPosTagItems[this.lastIndex]);
    // console.log('blanks', this.blanks)
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
      const bottomSheetRef = this.bottomSheet.open(DocNlpDialogExp1Component);

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
