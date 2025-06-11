import { Component, OnInit } from '@angular/core';
import Model from 'wink-eng-lite-web-model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { DocumentsService } from '../../../documents.service';
import { get } from 'lodash';
import { PosTagService } from 'src/app/pos-tag.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { register } from 'swiper/element/bundle';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

register();

@Component({
  selector: 'app-doc-text-wiki',
  templateUrl: './doc-text-wiki.component.html',
  styleUrls: ['./doc-text-wiki.component.scss'],
})
export class DocTextWikiComponent implements OnInit {
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


  customEntities: string[] = [];
  selectedEntities: string[] = [];
  wikiPic =
    'https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=pageimages&pithumbsize=200&titles=';

  valueFromServer: any = null;
  wikiImg: {
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
  }

  getData() {
    return this.PosTagService.sharedPosTagItem;
  }

  getPosData() {
    return this.PosTagService.posTagItems;
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

  selectRandomEntities() {
    let uniqueCustomEntities = [...new Set(this.customEntities)];
    for (let i = 0; i < uniqueCustomEntities.length; i++) {
    this.selectedEntities.push(uniqueCustomEntities[i]);
  }
}

  async addPic() {
    const uriEntities = this.selectedEntities.map(encodeURIComponent);
    for (let i = 0; i < uriEntities.length; i++) {
      const url = this.wikiPic;
      // console.log(uriEntities[i]);
      const finalUrl = url + uriEntities[i];
      const response = await firstValueFrom(this.http.get(finalUrl));
      const pages = get(response, 'query.pages', null);
      if (!!pages) {
        const page = Object.values(pages)[0];
        const thumbnail = get(page, 'thumbnail', null);
        if (!!thumbnail) {
          const source = get(thumbnail, 'source', null);
          if (!!source) {
            // console.log(source);
            this.wikiImg.push({
              caption: decodeURIComponent(uriEntities[i]),
              url: source,
            });
          } 
        } else {
          // console.log(uriEntities[i] + ' - no thumbnail');
        }
      } else {
        // console.log(uriEntities[i] + ' - no page');
      }
    }
  }

  assignUrlsToPosTagItems() {
    for (let i = 0; i < this.PosTagService.posTagItems.length; i++) {
      const posTagItem = this.PosTagService.posTagItems[i];
      const matchingImg = this.wikiImg.find((img) => img.caption === posTagItem.word);

      if (matchingImg) {
        posTagItem.img = matchingImg.url;
      }
      // else {
      //   posTagItem.img = undefined;
      // }
      this.PosTagService.updatePosTagItem(this.PosTagService.posTagItems);
    }
  }
}
