// Group related imports together
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PosTagService } from '../../../pos-tag.service';
import { ScoreSystemService } from '../../../score-system.service';
import { Subscription } from 'rxjs';

// Define interfaces for type safety
interface PosTagItem {
  id: number;
  word: string;
  pos: string;
  conc: number | undefined;
  noun?: boolean;
  pronoun?: boolean;
  verb?: boolean;
  adjective?: boolean;
  propernoun?: boolean;
  isDisabled?: boolean;
  color?: string;
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
  selector: 'app-doc-nlp-pos-dialog',
  templateUrl: './doc-nlp-pos-dialog.component.html',
  styleUrls: ['./doc-nlp-pos-dialog.component.scss'],
})
export class DocNlpPosDialogComponent implements OnInit {
  sharedPosTagItem: PosTagItem[] = [];
  posTagItems: PosTagItem[] = [];
  blanks: string[] = [];
  blank = '';
  lastIndex = 0;
  currentUserPosTagItem: UserPosTagItem[] = [];

  constructor(
    public posTagService: PosTagService,
    private snackBar: MatSnackBar,
    private scoreSystemService: ScoreSystemService,
    private bottomSheet: MatBottomSheet,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.sharedPosTagItem = this.getData();
    this.pushPosWords();
    this.pushBlanks();
    this.pickNewBlank();
  }

  getData(): PosTagItem[] {
    return this.posTagService.sharedPosTagItem;
  }

  pushPosWords(): void {
    for (const item of this.sharedPosTagItem) {
      if (['NOUN', 'PROPN', 'VERB', 'ADJ', 'PRON'].includes(item.pos)) {
        this.posTagItems.push({ ...item });
      }
    }
  }

  pushBlanks(): void {
    this.blanks = this.posTagItems.map((item) => item.word);
  }

  pickNewBlank(): void {
    this.lastIndex = this.blanks.length - 1;
    this.blank = this.blanks[this.lastIndex];
  }

  handleButtonClick(tagType: string, isCorrect: boolean, color: string): void {
    let id = this.posTagItems[this.lastIndex]?.id;
    let serviceItem = this.posTagService.posTagItems.find(item => item.id === id);
  
    if (serviceItem) {
      serviceItem.color = isCorrect ? color : 'grey';
      serviceItem.isDisabled = true;
      serviceItem.img =  '';
      serviceItem.userInput = tagType;
  
      let newUserPosTagItem: UserPosTagItem = {
        id: serviceItem.id,
        word: serviceItem.word,
        pos: serviceItem.pos,
        conc: serviceItem.conc,
        userInput: serviceItem.userInput,
      };
  
      // Instead of pushing to currentUserPosTagItem,
      // push newUserPosTagItem to your service's userPosTagItems and then update the BehaviorSubject
      this.posTagService.userPosTagItem.push(newUserPosTagItem);
      this.posTagService.updateUserPosTagItem(this.posTagService.userPosTagItem);
      
      // console.log('New user pos tag item added:', newUserPosTagItem);
      // console.log('Current user pos tag item array:', this.posTagService.userPosTagItem);
    }
  
    this.bottomSheet.dismiss();
    // ...
  }
  

  // Using the handleButtonClick method for different buttons
  pronounBtn(): void {
    this.handleButtonClick('PRON', !!this.posTagItems[this.lastIndex].pronoun, 'blue');
    if (this.posTagItems[this.lastIndex].pronoun) {
      this.scoreSystemService.setStarScore(1);
    }
  }
  
  nounBtn(): void {
    this.handleButtonClick('NOUN', !!this.posTagItems[this.lastIndex].noun, 'green');
    if (this.posTagItems[this.lastIndex].noun) {
      this.scoreSystemService.setStarScore(1);
    }
  }
  
  // verbBtn(): void {
  //   this.handleButtonClick('VERB', !!this.posTagItems[this.lastIndex].verb, 'red');
  //   if (this.posTagItems[this.lastIndex].verb) {
  //     this.scoreSystemService.setStarScore(1);
  //   }
  // }
  
  // adjectiveBtn(): void {
  //   this.handleButtonClick('ADJ', !!this.posTagItems[this.lastIndex].adjective, 'orange');
  //   if (this.posTagItems[this.lastIndex].adjective) {
  //     this.scoreSystemService.setStarScore(1);
  //   }
  // }
  
  properNounBtn(): void {
    this.handleButtonClick('PROPN', !!this.posTagItems[this.lastIndex].propernoun, 'purple');
    if (this.posTagItems[this.lastIndex].propernoun) {
      this.scoreSystemService.setStarScore(1);
    }
  }
  
  sanitizeImageUrl(imageUrl: string | undefined): SafeUrl {
    if (imageUrl === undefined) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

}
