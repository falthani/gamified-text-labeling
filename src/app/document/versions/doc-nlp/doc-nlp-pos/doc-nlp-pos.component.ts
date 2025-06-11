import { Component, OnInit } from '@angular/core';
import Model from 'wink-eng-lite-web-model';
import { Document } from '../../../../documents.model';
import { DocumentsService } from '../../../../documents.service';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DocNlpPosDialogComponent } from '../../../doc-nlp-dialog/doc-nlp-pos-dialog/doc-nlp-pos-dialog.component';
import { PosTagService } from '../../../../pos-tag.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-doc-nlp-pos',
  templateUrl: './doc-nlp-pos.component.html',
  styleUrls: ['./doc-nlp-pos.component.scss'],
})
export class DocNlpPosComponent implements OnInit {
  firestore: Firestore;
  winkNlp = require('wink-nlp');
  model = require('wink-eng-lite-web-model');
  nlp = this.winkNlp(Model);
  its = this.nlp.its;
  as = this.nlp.as;
  nlpText = document.getElementById('nlp-text');
  id: any = this.route.snapshot.paramMap.get('id');
  documents$: Observable<any[]>;
  text = 'this is a test';
  title$: Observable<string | undefined>;
  annotations$: Observable<any[]>;

  doc = this.nlp.readDoc(this.text);
  // textArray: string[] = [];
  posArray: string[] = [];
  nounArray: string[] = [];
  verbArray: string[] = [];
  pronounArray: string[] = [];
  adjectiveArray: string[] = [];
  pnounArray: string[] = [];

  pagedPosTagItems: {
    id: number;
    word: string;
    pos: string;
    noun: boolean;
    pronoun: boolean;
    verb: boolean;
    adjective: boolean;
    propernoun: boolean;
    isDisabled: boolean;
    nounPronPropnId?: number | undefined;
    color: string;
    conc: number | undefined;
    img?: string | undefined;
  }[] = [];

  posTagItems: {
    id: number;
    word: string;
    pos: string;
    noun: boolean;
    pronoun: boolean;
    verb: boolean;
    adjective: boolean;
    propernoun: boolean;
    isDisabled: boolean;
    nounPronPropnId?: number | undefined;
    color: string;
    conc: number | undefined;
    img?: string | undefined;
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
    nounPronPropnId?: number | undefined;
    conc: number | undefined;
    img?: string | undefined;
  }[] = [];

  goldPosTagItems: {
    id: number;
    word: string;
    pos: string;
    conc: number | undefined;
  }[] = [];

  pageSize = 150;
  pageSizeOptions = [5, 10, 25, 100];
  currentPage = 0;

  nounPronPropnCount: number = 0;
  doneButtonVisible: boolean = true;

  constructor(
    private PosTagService: PosTagService,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private readonly http: HttpClient,
    private documentsService: DocumentsService,
    private db: Firestore
  ) {
    this.firestore = db;
    const docCollection = collection(this.db, 'documents');
    const subcollectionPath = collection(
      this.db,
      'documents/' + this.id + '/annotations'
    );

    this.documents$ = collectionData(docCollection, {
      idField: 'customIdName',
    });
    this.annotations$ = collectionData(subcollectionPath);
    const documentRef = doc(this.db, 'documents', this.id);

    this.title$ = docData(documentRef, { idField: 'customIdName' }).pipe(
      map((doc) => doc['title'])
    );
  }

  async ngOnInit(): Promise<void> {
    this.annotations$.forEach((doc) => console.log(doc));
    this.testPos();
    this.subscribeToCount();
    // console.log(this.id);
  }

  subscribeToCount() {
    console.log('subscribeToCount', this.nounPronPropnCount);
    const totalTags = this.goldPosTagItems.length;
    console.log('totalTags', totalTags);
    const percentageTotalTags = (30/100) * totalTags;
    console.log('percentageTotalTags', percentageTotalTags);
    this.PosTagService.nounPronPropnCount.subscribe(count => {
      this.nounPronPropnCount = count;
      this.doneButtonVisible = this.nounPronPropnCount >= 3; // Change the number as per your requirement
      // this.doneButtonVisible = this.nounPronPropnCount >= percentageTotalTags; // Change the number as per your requirement

    });
  }

  testPos() {
    this.annotations$.subscribe((annotations) => {
      let tokens = annotations[0].tokens;
      let pos = annotations[0].pos;
      let conc = annotations[0].conc;

      if (tokens && pos && tokens.length === pos.length) {
        for (let i = 0; i < tokens.length; i++) {
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
            nounPronPropnId: undefined,
            color: 'white',
            conc: conc ? conc[i] : undefined,
          });
        }
      }
      // this.PosTagService.posTagItems = this.currentPosTagItems;

      this.PosTagService.updatePosTagItem(this.posTagItems);
      this.textCheck();
      this.updatePagedItems();
      this.checkGoldPosTagItems();
    });
  }

  getGoldPosTagItems() {
    for (let i = 0; i < this.posTagItems.length; i++) {
      this.goldPosTagItems.push({
        id: i,
        word: this.posTagItems[i].word,
        pos: this.posTagItems[i].pos,
        conc: this.posTagItems[i].conc,
      });
    }
  }

  checkGoldPosTagItems() {
    this.getGoldPosTagItems();
    // console.log(this.goldPosTagItems);
    this.goldPosTagItems.forEach((element) => {
      if (
        element.pos !== 'NOUN' &&
        element.pos !== 'PRON' &&
        element.pos !== 'VERB' &&
        element.pos !== 'ADJ' &&
        element.pos !== 'PROPN'
      ) {
        element.pos = 'NULL';
      }
    });
    // console.log(this.goldPosTagItems);
  }

  textCheck() {
    this.posTagItems.forEach((element) => {
      if (element.pos === 'NOUN') {
        element.isDisabled = false;
        element.color = 'white';
      } else if (element.pos === 'PRON') {
        this.pronounArray.push(element.word);
        element.isDisabled = false;
        element.color = 'white';
        // } else if (element.pos === 'VERB') {
        //   this.verbArray.push(element.word);
        //   element.isDisabled = false;
        //   element.color = 'white';
        // } else if (element.pos === 'ADJ') {
        //   this.adjectiveArray.push(element.word);
        //   element.isDisabled = false;
        //   element.color = 'white';
      } else if (element.pos === 'PROPN') {
        this.pnounArray.push(element.word);
        element.isDisabled = false;
        element.color = 'white';
      } else {
        element.isDisabled = true;
        element.color = 'none';
      }
    });
    this.PosTagService.updatePosTagItem(this.posTagItems);
  }

  openBottomSheet(value: any): void {
    // console.log('id:', value);
    // console.log('word:', this.posTagItems[value].word);
    this.currentPosTagItems.push({
      id: this.posTagItems[value].id,
      word: this.posTagItems[value].word,
      pos: this.posTagItems[value].pos,
      noun: this.posTagItems[value].noun,
      pronoun: this.posTagItems[value].pronoun,
      verb: this.posTagItems[value].verb,
      adjective: this.posTagItems[value].adjective,
      propernoun: this.posTagItems[value].propernoun,
      isDisabled: this.posTagItems[value].isDisabled,
      color: this.posTagItems[value].color,
      img: this.posTagItems[value].img,
      conc: this.posTagItems[value].conc,
    });
    this.PosTagService.sharedPosTagItem = this.currentPosTagItems;
    console.log('subscribeToCount', this.nounPronPropnCount);
    this._bottomSheet.open(DocNlpPosDialogComponent);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedItems();
  }

  updatePagedItems() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPosTagItems = this.posTagItems.slice(startIndex, endIndex);
  }

  // updatePagedItems() {
  //   const startIndex = this.currentPage * this.pageSize;
  //   let endIndex = startIndex + this.pageSize;

  //   // Ensure endIndex does not exceed the length of the posTagItems array.
  //   endIndex = endIndex > this.posTagItems.length ? this.posTagItems.length : endIndex;

  //   // Check if the end index is in the middle of a sentence
  //   while (endIndex < this.posTagItems.length && !['.', '?', '!'].includes(this.posTagItems[endIndex].word)) {
  //     endIndex++;
  //   }

  //   // Check if the next item is a sentence start (not punctuation)
  //   while (endIndex < this.posTagItems.length - 1 && ['.', '?', '!'].includes(this.posTagItems[endIndex + 1].word)) {
  //     endIndex++;
  //   }

  //   // Slice the posTagItems array based on the adjusted end index
  //   this.pagedPosTagItems = this.posTagItems.slice(startIndex, endIndex);

  //   // Adjust the pageSize to match the actual size of sliced items.
  //   this.pageSize = this.pagedPosTagItems.length;
  // }

  onDone() {
    // console.log('Current user pos tag item array:', this.PosTagService.userPosTagItem);
    this.PosTagService.userPosTagItem.sort((a, b) => a.id - b.id);
    // console.log('Array sorted by id:', this.PosTagService.userPosTagItem);
    // console.log(
    //   'userInput Array sorted by id:',
    //   this.PosTagService.userPosTagItem.map((item) => item.userInput)
    // );
    // The new logic to find missing IDs and push corresponding items to userPosTagItem
    const userPosTagItemIds = this.PosTagService.userPosTagItem.map(
      (item) => item.id
    );
    const missingPosTagItems = this.posTagItems.filter(
      (item) => !userPosTagItemIds.includes(item.id)
    );

    for (let missingItem of missingPosTagItems) {
      this.PosTagService.userPosTagItem.push({
        id: missingItem.id,
        word: missingItem.word,
        pos: missingItem.pos,
        conc: missingItem.conc,
        userInput: "null",
      });
    }

    // If you want to keep userPosTagItem sorted by ID, you can sort it again after pushing new items.
    this.PosTagService.userPosTagItem.sort((a, b) => a.id - b.id);

    // Log the result
    // console.log('Updated userPosTagItem:', this.PosTagService.userPosTagItem);
    console.log(
      'userInput Array sorted by id:',
      this.PosTagService.userPosTagItem.map((item) => item.userInput)
    );
    console.log(
      'gold pos Array:',
      this.goldPosTagItems.map((item) => item.pos)
    );
    console.log(
      'conc Array:',
      this.goldPosTagItems.map((item) => item.conc)
    );
    let userInput = this.PosTagService.userPosTagItem.map(
      (item) => item.userInput
    );
    let img = this.PosTagService.posTagItems.map((item) => item.img);
    let gold = this.goldPosTagItems.map((item) => item.pos);
    let conc = this.goldPosTagItems.map((item) => item.conc);
    window.top?.postMessage(
      { action: 'metric', payload: { userInput: userInput } },
      '*'
    );
    window.top?.postMessage({ action: 'metric', payload: { gold: gold } }, '*');
    window.top?.postMessage({ action: 'metric', payload: { img: img } }, '*');
    window.top?.postMessage({ action: 'metric', payload: { conc: conc } }, '*');
    window.top?.postMessage({ action: 'finished' }, '*');
  }
}
