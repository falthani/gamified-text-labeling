import { Component, OnInit } from '@angular/core';
import Model from 'wink-eng-lite-web-model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DocumentsService } from '../../../documents.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';
import { PosTagService } from 'src/app/pos-tag.service';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { url } from 'inspector';
import { map } from 'rxjs/operators';

register();

@Component({
  selector: 'app-doc-text-img-gen',
  templateUrl: './doc-text-img-gen.component.html',
  styleUrls: ['./doc-text-img-gen.component.scss'],
})
export class DocTextImgGenComponent implements OnInit {
  firestore: Firestore;
  winkNlp = require('wink-nlp');
  model = require('wink-eng-lite-web-model');
  nlp = this.winkNlp(Model);
  its = this.nlp.its;
  as = this.nlp.as;
  id: any = this.route.snapshot.paramMap.get('id');
  documents$: Observable<any[]>;
  text$: Observable<string | undefined>;
  text: string | undefined;
  title$: Observable<string | undefined>;
  annotations$: Observable<any[]>;
  patterns = [
    {
      name: 'nounPhrase',
      patterns: ['[PROPN]'],
    },
    {
      name: 'noun',
      patterns: ['[NOUN]'],
    }
  ];

  patternCount = this.nlp.learnCustomEntities(this.patterns, {
    matchValue: false,
    useEntity: true,
    usePOS: true,
  });



  // doc = this.nlp.readDoc(this.text);

  customEntities: string[] = [];
  selectedEntities: string[] = [];
  valueFromServer: any = null;
  // imageUrl: string[] = [];
  apiUrl =
    // 'https://api-inference.huggingface.co/models/prompthero/openjourney';
    // 'https://api-inference.huggingface.co/models/SG161222/Realistic_Vision_V1.4';
    'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
  // 'https://api-inference.huggingface.co/models/dreamlike-art/dreamlike-photoreal-2.0'

  genImg: {
    caption: string;
    url: string;
  }[] = [];

  posTagItem: {
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

  posTagItems: any[] = [];
  private subscription!: Subscription;

  constructor(
    private readonly http: HttpClient,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private documentsService: DocumentsService,
    private PosTagService: PosTagService,
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
    this.PosTagService.posTagItems$.subscribe((data) => {
      this.posTagItems = data;
    });
    this.annotations$.forEach((doc) => console.log(doc));
    console.log(this.posTagItems);
    console.log(this.PosTagService.sharedPosTagItem);
    this.learnCustomEntities();
    await this.readDoc(); // Wait for readDoc to complete
    console.log('custom entities:' + this.customEntities);
    this.selectRandomEntities();
    await this.addPic();
    this.assignUrlsToPosTagItems();
    console.log(this.genImg[0].caption + ' ' + this.genImg[0].url);
    console.log(this.PosTagService.posTagItems);
  }

  learnCustomEntities() {
    this.nlp.learnCustomEntities(this.patterns, {
      matchValue: true,
      useEntity: true,
      usePOS: true,
    });
  }
  async readDoc() {
    const text = await firstValueFrom(this.text$);
    this.text = text;
    const doc = this.nlp.readDoc(this.text);
    console.log("text:", text);
    let customEntities = doc.customEntities().out();
    console.log("Extracted custom entities:", customEntities); // Log it here for debugging
    this.customEntities.push(...customEntities);
  }

  displayEntities() {
    let text = this.text;
    let doc = this.nlp.readDoc(text);
    let pos = doc.tokens().out(this.its.pos);
  }

  pushEntities() {
    let customEntities = this.nlp.readDoc(this.text).customEntities().out();
    this.customEntities.push(...customEntities);
  }

  selectRandomEntities() {
    let uniqueCustomEntities = [...new Set(this.customEntities)];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(
        Math.random() * uniqueCustomEntities.length
      );
      const selectedEntity = uniqueCustomEntities[randomIndex];
      this.selectedEntities.push(selectedEntity);
    }
  }
  
  async addPic(): Promise<void> {
    const requests = [];
    for (let i = 0; i < 8; i++) {
      let input = this.customEntities[i] + ' ' + 'in the realism style';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer REDACTED_API_KEY', // Replace with your actual API key
      };
  
      const requestBody = {
        inputs: input,
      };
  
      this.genImg.push({
        caption: this.customEntities[i],
        url: '', // Initialize with an empty string
      });
  
      const request = this.http
        .post(this.apiUrl, requestBody, { headers, responseType: 'blob' })
        .pipe(
          tap((blob: Blob) => {
            const url = URL.createObjectURL(blob);
            this.genImg[i].url = url; // Assign the URL after it's created
          })
        );
      requests.push(lastValueFrom(request)); // Convert the observable to a promise
    }
    await Promise.all(requests); // Wait for all requests to complete
  }
  
  

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  assignUrlsToPosTagItems() {
    for (let i = 0; i < this.PosTagService.posTagItems.length; i++) {
      const posTagItem = this.PosTagService.posTagItems[i];
      const matchingImg = this.genImg.find(
        (img) => img.caption === posTagItem.word
      );
      if (matchingImg) {
        posTagItem.img = matchingImg.url;
      }
      this.PosTagService.updatePosTagItem(this.PosTagService.posTagItems);
    }
  }
}
