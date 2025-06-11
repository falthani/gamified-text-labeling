import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PageEvent } from '@angular/material/paginator';
import { PosTagService } from '../../pos-tag.service';
// import { DocNlpDialogExp1Component } from '../doc-nlp-dialog-exp1/doc-nlp-dialog-exp1.component';
import { DocEmojiPosDialogComponent } from '../../document/doc-nlp-dialog/doc-emoji-pos-dialog/doc-emoji-pos-dialog.component';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { last } from 'lodash';

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

@Component({
  selector: 'app-doc-emo-pos-exp2',
  templateUrl: './doc-emo-pos-exp2.component.html',
  styleUrls: ['./doc-emo-pos-exp2.component.scss'],
})
export class DocEmoPosExp2Component implements OnInit {
  firestore: Firestore;
  id: any = this.route.snapshot.paramMap.get('id');
  documents$!: Observable<any[]>;
  annotations$!: Observable<any[]>;
  experimentItems$!: Observable<any[]>;
  title$!: Observable<string | undefined>;
  sharedPosTagItem: PosTagItem[] = [];
  sharedPosTagItems: PosTagItem[] = [];
  sharedPosTagItems$!: Observable<any[]>;
  posTagItems: any[] = [];
  pagedPosTagItems: any[] = [];
  currentPage = 0;
  pageSize = 100;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];
  nounPronPropnCount = 0;
  progress = 0;
  blanks: string[] = [];
  blank = '';
  lastIndex = 0;
  imageUrl$!: Observable<string>;
  highlightedItemId: number | null = null;
  doneButtonVisible = true;
  experimentItems: {
    id: number;
    img?: string | undefined;
  }[] = [];

  goldPosTagItems: {
    id: number;
    word: string;
    pos: string;
    conc: number | undefined;
  }[] = [];

  currentPosTagItems: {
    id: number;
    word: string;
    pos: string;
    noun: boolean;
    pronoun: boolean;
    verb: boolean;
    adjective: boolean;
    propernoun: boolean;
    isDisabled: boolean;
    color: string;
    isExperimentItem?: boolean;
    nounPronPropnId?: number;
    conc: number | undefined;
    img?: string | undefined;
  }[] = [];

  imageValid: { [url: string]: boolean } = {};


  @ViewChild('cardContainer') cardContainer!: ElementRef;

  constructor(
    private PosTagService: PosTagService,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private db: Firestore,
    private sanitizer: DomSanitizer
  ) {
    this.firestore = db;
    this.setupCollections();
    this.sharedPosTagItems$ = this.PosTagService.sharedPosTagItem$;
  }

  ngOnInit(): void {
    // this.sharedPosTagItem = this.getData();
    // this.pushPosWords();
    this.testPos();
    this.subscribeToCount();
    // this.pushBlanks();
    // this.pickNewBlank();
    this.PosTagService.currentPageIndex$.subscribe((index) => {
      this.currentPage = index;
      this.pageIndex = index;
      this.updatePagedItems();
    });
    this.PosTagService.sentenceHighlightSource$.subscribe((indices) => {
      this.updateHighlighting();
    });

    this.PosTagService.posTagItemClicked$.subscribe((id) => {
      this.handlePosTagItemClick(id);
    });
    // console.log(this.posTagItems);
    // Subscribing to the image URL observable
    this.imageUrl$ = this.PosTagService.currentImageUrl$;
    this.imageUrl$.subscribe(url => {
      this.checkImageURL(url);
    });
  }

  private setupCollections(): void {
    const docCollection = collection(this.db, 'documents');
    const subcollectionPath = collection(
      this.db,
      `documents/${this.id}/annotations`
    );
    const experimentSubcollectionPath = collection(
      this.db,
      `documents/${this.id}/exp-1`
    );

    this.documents$ = collectionData(docCollection, {
      idField: 'customIdName',
    });
    this.annotations$ = collectionData(subcollectionPath);
    this.experimentItems$ = collectionData(experimentSubcollectionPath);
    this.title$ = docData(doc(this.db, 'documents', this.id), {
      idField: 'customIdName',
    }).pipe(map((doc) => doc['title']));
  }

  subscribeToCount() {
    const totalTags = this.goldPosTagItems.length;
    // const percentageTotalTags = (30 / 100) * totalTags;
    this.PosTagService.nounPronPropnCount.subscribe((count) => {
      this.nounPronPropnCount = count;
      this.doneButtonVisible = this.nounPronPropnCount >= 30;
      this.updateProgress();
    });
    // this.progress = percentageTotalTags;
  }

  testPos() {
    this.annotations$.subscribe((annotations) => {
      let tokens = annotations[0].tokens;
      let pos = annotations[0].pos;
      let conc = annotations[0].conc;
      let nounPronPropnCounter = -1; // Initialize counter for nouns, propernouns, and pronouns

      if (tokens && pos && tokens.length === pos.length) {
        for (let i = 0; i < tokens.length; i++) {
          // Increment counter if the pos is noun, propernoun, or pronoun
          if (pos[i] === 'NOUN' || pos[i] === 'PROPN' || pos[i] === 'PRON') {
            nounPronPropnCounter++;
          }

          this.posTagItems.push({
            id: i,
            word: tokens[i],
            pos: pos[i],
            noun: pos[i] === 'NOUN',
            pronoun: pos[i] === 'PRON',
            verb: pos[i] === 'VERB',
            adjective: pos[i] === 'ADJ',
            propernoun: pos[i] === 'PROPN',
            isDisabled: true,
            isExperimentItem: false,
            color: 'none',
            conc: conc[i],
            nounPronPropnId:
              pos[i] === 'NOUN' || pos[i] === 'PROPN' || pos[i] === 'PRON'
                ? nounPronPropnCounter
                : undefined,
            // Add new property nounPronPropnId to keep track of noun, propernoun, and pronoun items
          });
        }
      }
      this.pushExperimentItems();
      this.updatePagedItems();
    });
  }

  pushExperimentItems() {
    this.experimentItems$.subscribe((experimentItem) => {
      // Retrieve the annotations array from the annotationsObject
      let experimentArray = experimentItem[0].annotations;

      for (let i = 0; i < experimentArray.length; i++) {
        // Check if the word and pos properties exist in the current object
        if ('word' in experimentArray[i] && 'pos' in experimentArray[i]) {
          this.experimentItems.push(experimentArray[i].id);
        }
        this.PosTagService.experimentItem = this.experimentItems;
      }
      this.textCheck();
      // console.log(
      //   'experimentItems from service:',
      //   this.PosTagService.experimentItem
      // ); // Log experimentItems
    });
  }

  textCheck() {
    this.posTagItems.forEach((element, index) => {
      if (this.experimentItems.includes(element.nounPronPropnId)) {
        element.isDisabled = false;
        element.color = 'white';
        element.isExperimentItem = true;
      } else {
        element.isDisabled = true;
        element.color = 'none';
        element.isExperimentItem = false;
      }
    });

    this.PosTagService.updatePosTagItem(this.posTagItems); // Update the posTagItems
  }

  openBottomSheet(posTagItem: any): void {
    this.lastIndex = posTagItem;

    // console.log('lastIndex:', this.lastIndex);
    // console.log(posTagItem);

    // Check if posTagItem is a valid index in posTagItems array
    if (posTagItem >= 0 && posTagItem < this.posTagItems.length) {
      this.currentPosTagItems = this.PosTagService.findSentenceItems(
        posTagItem,
        this.posTagItems
      );
      if (
        posTagItem >= 0 &&
        posTagItem < this.posTagItems.length &&
        this.posTagItems[posTagItem].img
      ) {
        this.PosTagService.updateImageUrl(this.posTagItems[posTagItem].img);
      }
      // Add the item to currentPosTagItems if it exists
      if (this.posTagItems[posTagItem]) {
        this.currentPosTagItems.push({
          ...this.posTagItems[posTagItem],
        });
      }

      this.PosTagService.sharedPosTagItem = this.currentPosTagItems;
      const bottomSheetRef = this._bottomSheet.open(DocEmojiPosDialogComponent);
      const indicesToHighlight = this.currentPosTagItems.map((item) => item.id);
      this.PosTagService.highlightSentenceItems(
        indicesToHighlight,
        this.currentPage,
        this.pageSize
      );
      this.highlightedItemId = posTagItem;

      bottomSheetRef.afterDismissed().subscribe(() => {
        this.PosTagService.clearAllHighlights();
      });
    } else {
      // console.error('Invalid index:', posTagItem);
    }
  }

  private isOnCurrentPage(
    index: number,
    currentPage: number,
    pageSize: number
  ): boolean {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return index >= startIndex && index < endIndex;
  }

  updateHighlighting() {
    const currentIndices = this.PosTagService.getCurrentHighlightedIndices();
    const currentPageIndices = currentIndices.filter((index) =>
      this.isOnCurrentPage(index, this.currentPage, this.pageSize)
    );

    // Clear previous highlights and highlight only the current page's items
    this.PosTagService.clearAllHighlights();
    const indicesToHighlight =
      this.PosTagService.getCurrentHighlightedIndices();
    this.PosTagService.highlightSentenceItems(
      indicesToHighlight,
      this.currentPage,
      this.pageSize
    );
  }

  updatePagedItems() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPosTagItems = this.posTagItems.slice(startIndex, endIndex);
  }
  updateProgress() {
    this.PosTagService.nounPronPropnCount.subscribe((count) => {
    this.progress = count / 30 * 100;
    });    
  }

  

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedItems();

    // Assuming getCurrentHighlightedIndices() returns the indices to be highlighted
    const indicesToHighlight =
      this.PosTagService.getCurrentHighlightedIndices();
    this.PosTagService.highlightSentenceItems(
      indicesToHighlight,
      this.currentPage,
      this.pageSize
    );
  }

  performClickAction(posTagItem: any): void {
    // Find the sentence containing the clicked posTagItem
    const sentenceItems = this.PosTagService.findSentenceItems(
      posTagItem.id,
      this.posTagItems
    );
    const sentenceItemIds = sentenceItems.map((item) => item.id);
    this.highlightedItemId = posTagItem.id;

    // console.log('highlightedItemId:', this.highlightedItemId);

    // Highlight the sentence
    this.PosTagService.highlightSentenceItems(
      sentenceItemIds,
      this.currentPage,
      this.pageSize
    );
    // console.log(sentenceItemIds[0]);

    // Open a bottom sheet with more information or actions related to the posTagItem
    this.openBottomSheet(posTagItem);
  }

  handlePosTagItemClick(id: number): void {
    const posTagItem = this.posTagItems.find((item) => item.id === id);
    if (!posTagItem) {
      // console.error(`No posTagItem found for ID: ${id}`);
      return;
    }

    this.performClickAction(posTagItem);
  }
  onDone() {
    // Ensure userPosTagItem is sorted
    this.PosTagService.userPosTagItem.sort((a, b) => a.id - b.id);

    // Map user input from PosTagService
    let userInput = this.PosTagService.userPosTagItem.map(item => item.userInput);

    // Map goldPosTagItems to get only the pos property
    let gold =  this.posTagItems
      .filter(item => item.isExperimentItem === true) // Filter items where experimentItem is true
      .map(item => item.pos); 
    // Post the data to the parent window
    window.top?.postMessage({ action: 'metric', payload: { userInput: userInput } }, '*');
    window.top?.postMessage({ action: 'metric', payload: { gold: gold } }, '*');

    // Log the data for debugging
    // console.log(userInput);
    // console.log(gold);

    // Signal the completion of the operation
    window.top?.postMessage({ action: 'finished' }, '*');
}

  sanitizeImageUrl(imageUrl: string | undefined): SafeUrl {
    if (imageUrl === undefined) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  checkImageURL(url: string | null): void {
    if (!url) {
      return; // Exit if the URL is null or undefined
    }
  
    const img = new Image();
    img.onload = () => this.imageValid[url] = true;
    img.onerror = () => this.imageValid[url] = false;
    img.src = url;
  }
  isHighlightedItemWithImage(): boolean {
    const highlightedItem = this.posTagItems.find(
      (item) => item.id === this.highlightedItemId
    );
    return highlightedItem && highlightedItem.img !== undefined;
  }
}
