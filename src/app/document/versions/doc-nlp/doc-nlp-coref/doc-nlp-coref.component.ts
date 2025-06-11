import { Component, OnInit } from '@angular/core';
import Model from 'wink-eng-lite-web-model';
import { Document } from '../../../../documents.model';
import { DocumentsService } from '../../../../documents.service';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DocNlpCorefDialogComponent } from '../../../doc-nlp-dialog/doc-nlp-coref-dialog/doc-nlp-coref-dialog.component';
import { PosTagService } from '../../../../pos-tag.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-doc-nlp-coref',
  templateUrl: './doc-nlp-coref.component.html',
  styleUrls: ['./doc-nlp-coref.component.scss'],
})
export class DocNlpCorefComponent implements OnInit {
  firestore: Firestore;
  winkNlp = require('wink-nlp');
  model = require('wink-eng-lite-web-model');
  nlp = this.winkNlp(Model);
  its = this.nlp.its;
  as = this.nlp.as;
  nlpText = document.getElementById('nlp-text');
  id: any = this.route.snapshot.paramMap.get('id');
  documents$: Observable<any[]>;
  text$: Observable<string | undefined>;
  text: string | undefined;
  title$: Observable<string | undefined>;
  annotations$: Observable<any[]>;

  // doc = this.nlp.readDoc(this.text);
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
    color: string;
    img?: string | undefined;
  }[] = [];

  posTagItems: {
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
    color: string;
    img?: string | undefined;
  }[] = [];

  currentPosTagItems: {
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
    color: string;
    img?: string | undefined;
  }[] = [];

  corefItems: {
    id: number;
    // tokens: string[];
    coref: string;
    isDisabled: boolean;
    color: string;
  }[] = [];

  tokens: string[] = [];

  extractedCorefItems: {
    start: string;
    end: string;
  }[] = [];

  // extractedCorefItems: string[] = [];

  pageSize = 250;
  pageSizeOptions = [5, 10, 25, 100];
  currentPage = 0;

  constructor(
    private PosTagService: PosTagService,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private readonly http: HttpClient,
    private documentsService: DocumentsService,
    private db: Firestore,
    private cd: ChangeDetectorRef
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

    this.text$ = docData(documentRef, { idField: 'customIdName' }).pipe(
      map((doc) => {
        console.log('Raw doc data:', doc);
        return JSON.stringify(doc['text']);
      })
    );
  }

  async ngOnInit(): Promise<void> {
    console.log(this.id);
    this.findTokens().then(() => {
      this.findCoreferences().then(() => {
        this.extractCoreferences();
      });
    });
  }

  async findTokens(): Promise<void> {
    return new Promise((resolve) => {
        this.annotations$.subscribe((annotations) => {
            let tokens = annotations[0].tokens;
            for (let i = 0; i < tokens.length; i++) {
                // Check if the token contains any word character
                // if (/\w/.test(tokens[i])) {
                    this.tokens.push(tokens[i]);
                // }
            }
            resolve();
        });
    });
}

  async findCoreferences(): Promise<void> {
    return new Promise((resolve) => {
      this.annotations$.subscribe((annotations) => {
        let coref = annotations[0].coref;
        for (let i = 0; i < coref.length; i++) {
          this.corefItems.push({
            id: i,
            coref: coref[i],
            isDisabled: true,
            color: 'white',
          });
        }
        console.log('corefItems after findCoreferences:', this.corefItems); // Add this log
        resolve(); // Resolve the promise
      });
    });
  }




  async extractCoreferences(): Promise<void> {
    if (!this.tokens || this.tokens.length === 0) {
        console.error('Tokens array is empty or undefined');
        return;
    }

    // Clear the extractedCorefItems array
    this.extractedCorefItems = [];

    for (let i = 0; i < this.corefItems.length; i++) {
        let coref = this.corefItems[i].coref;
        console.log('coref before split:', coref); // Log the coref before splitting

        // Parse the start and end values
        const [start, end] = coref.split('-').map(Number);
        console.log('start:', start, 'end:', end); // Log the start and end values

        // Slice the tokens array to get the words between start and end indices inclusive
        // const extractedTokens = this.tokens.slice(start, end + 1);

        // Join the tokens to form the substring
        // const extractedSubstring = extractedTokens.join(' ');
        console.log(this.tokens[start], this.tokens[end]); // Log the extracted substring

        // Push the extracted substring to the extractedCorefItems array
        this.extractedCorefItems.push(
            {
                start: this.tokens[start],
                end: this.tokens[end]
            }
        );
    }
    this.cd.detectChanges();
    console.log('Final extractedCorefItems:', this.extractedCorefItems);
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
            conc: conc[i],
            noun: pos[i] === 'NOUN',
            pronoun: pos[i] === 'PRON',
            verb: pos[i] === 'VERB',
            adjective: pos[i] === 'ADJ',
            propernoun: pos[i] === 'PROPN',
            isDisabled: true,
            color: 'white',
          });
        }
      }
      // this.PosTagService.posTagItems = this.currentPosTagItems;

      this.PosTagService.updatePosTagItem(this.posTagItems);
      this.textCheck();
      this.updatePagedItems();
    });
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
    console.log('id:', value);
    console.log('word:', this.posTagItems[value].word);
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
      conc: this.posTagItems[value].conc,
      img: this.posTagItems[value].img,
    });
    this.PosTagService.sharedPosTagItem = this.currentPosTagItems;
    this._bottomSheet.open(DocNlpCorefDialogComponent);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.updatePagedItems();
  }

  updatePagedItems() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPosTagItems = this.posTagItems.slice(startIndex, endIndex);
  }
}
