import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  AfterViewInit,
} from '@angular/core';
import * as translate from 'moji-translate';
import documents from 'src/assets/documents.json';
import { FillInBlanksService } from '../../../fill-in-blanks.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DocDialogComponent } from '../../doc-dialog/doc-dialog.component';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {PageEvent} from '@angular/material/paginator';
import { DocumentsService } from '../../../documents.service';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { firstValueFrom, map, Observable } from 'rxjs';



@Component({
  selector: 'app-doc-puzzle',
  templateUrl: './doc-puzzle.component.html',
  styleUrls: ['./doc-puzzle.component.scss']
})
export class DocPuzzleComponent
  implements OnInit, AfterViewInit {
  firestore: Firestore;
  id: any = this.route.snapshot.paramMap.get('id');
  documents = this.documentsService.getAvailableDocuments();
  // text = this.documents[this.id].text;
  // title = this.documents[this.id].title;
  documents$: Observable<any[]>;
  text$: Observable<string>;
  text!: string ;
  title$: Observable<string | undefined>;
  annotations$: Observable<any[]>;
  // text = "this is a test";
  // title = "test";


  translatedText!: string ;
  textArray: string[] = [];
  translatedTextArray: string[] = [];
  guessEmoji: string[] = [];
  finalText: {
    id: number;
    word: string;
    translated: string;
    emoji: string;
    isDisabled: boolean;
    button: string;
  }[] = [];
  currentText: {
    id: number;
    word: string;
    translated: string;
    emoji: string;
    isDisabled: boolean;
    button: string;
  }[] = [];

  pageSize = 250;
  pageSizeOptions = [5, 10, 25, 100];
  currentPage = 0;
  



  constructor(
    private FillInBlanksService: FillInBlanksService,
    private _bottomSheet: MatBottomSheet,
    private changeDetector: ChangeDetectorRef,
    private readonly http: HttpClient,
    private route:ActivatedRoute,
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

    this.text$ = docData(documentRef, { idField: 'customIdName' }).pipe(
      map((doc) => {
        console.log('Raw doc data:', doc);
        return JSON.stringify(doc['text']);
      })
    );
  }

  async ngOnInit(): Promise<void> {
    await this.translateText();
    this.splitWords();
    this.splitTranslatedWords();
    this.checkEmoji();
    console.log(this.id);

  }

  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }

  async translateText() {
    const text = await firstValueFrom(this.text$);
    this.text = text;
    this.translatedText = translate.translate(text, false);
  }


  get pagedfinalTexts(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.finalText.slice(startIndex, startIndex + this.pageSize)
  }
  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
  }
  

  openBottomSheet(value: any): void {
    console.log('id:', value);
    console.log('word:', this.finalText[value].word);
    this.currentText.push({
      id: this.finalText[value].id,
      word: this.finalText[value].word,
      translated: this.finalText[value].translated,
      emoji: this.finalText[value].emoji,
      isDisabled: this.finalText[value].isDisabled,
      button: this.finalText[value].button,
    });
    this.FillInBlanksService.currentFinalText = this.currentText;
    this._bottomSheet.open(DocDialogComponent);
  }

  splitWords() {
    let originalWords = this.text;
    let originalWordsArray = originalWords.split(' ');
    this.textArray.push(...originalWordsArray);
  }

  checkEmoji() {
    for (let i = 0; i < this.translatedTextArray.length; i++) {
      if (translate.isMaybeAlreadyAnEmoji(this.translatedTextArray[i])) {
        this.guessEmoji.push(...this.translatedTextArray[i]);
        this.finalText.push({
          id: i,
          word: this.textArray[i],
          translated: '?',
          emoji: 'true',
          isDisabled: false,
          button: 'emoji-button',
        });
      } else {
        this.finalText.push({
          id: i,
          word: this.textArray[i],
          translated: this.translatedTextArray[i],
          emoji: 'false',
          isDisabled: true,
          button: 'text-button',
        });
      }
    }
    this.FillInBlanksService.finalText = this.finalText;
  }

  splitTranslatedWords() {
    let translatedWords = this.translatedText;
    let translatedWordsArray = translatedWords.split(' ');
    this.translatedTextArray.push(...translatedWordsArray);
  }

}
