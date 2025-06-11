import { Component, OnInit, inject } from '@angular/core';
import Model from 'wink-eng-lite-web-model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DocumentsService } from '../../documents.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';
import { PosTagService } from 'src/app/pos-tag.service';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { lastValueFrom, tap } from 'rxjs';
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
import { Storage } from '@angular/fire/storage';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

register();

@Component({
  selector: 'app-doc-ai-img-exp1',
  templateUrl: './doc-ai-img-exp1.component.html',
  styleUrls: ['./doc-ai-img-exp1.component.scss'],
})
export class DocAiImgExp1Component implements OnInit {
  private storage: Storage = inject(Storage);
  firestore: Firestore;
  id: any = this.route.snapshot.paramMap.get('id');
  documents$: Observable<any[]>;
  text$: Observable<string | undefined>;
  text: string | undefined;
  title$: Observable<string | undefined>;
  imgPath$: Observable<string | undefined>;
  annotations$: Observable<any[]>;
  posTagItems$!: Observable<any[]>;
  imageUrl!: string;
  customEntities: string[] = [];
  selectedEntities: string[] = [];
  valueFromServer: any = null;
  filename: string = '';

  genImg: {
    id: number;
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
    isExperimentItem?: boolean;
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
    private db: Firestore,
    private store: Storage
  ) {
    this.firestore = db;
    const docCollection = collection(this.db, 'documents');
    const subcollectionPath = collection(
      this.db,
      'documents/' + this.id + '/exp-1'
    );

    this.documents$ = collectionData(docCollection, {
      idField: 'customIdName',
    });
    this.annotations$ = collectionData(subcollectionPath);
    const documentRef = doc(this.db, 'documents', this.id);

    this.title$ = docData(documentRef, { idField: 'customIdName' }).pipe(
      map((doc) => doc['title'])
    );
    this.imgPath$ = docData(documentRef, { idField: 'customIdName' }).pipe(
      map((doc) => doc['img-path'])
    );

    this.text$ = docData(documentRef, { idField: 'customIdName' }).pipe(
      map((doc) => {
        // console.log('Raw doc data:', doc);
        return JSON.stringify(doc['text']);
      })
    );
  }

  async ngOnInit(): Promise<void> {
    this.subscription = this.PosTagService.posTagItems$
      .pipe(distinctUntilChanged())
      .subscribe(async (data) => {
        this.posTagItems = data;
        await this.addPic();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  transformTitleToFilename(title: string): string {
    return title.trim().toLowerCase().replace(/\s+/g, '-');
  }

  getValidPosCount(): number {
    return this.posTagItems.filter(
      (item) =>
        item.pos === 'NOUN' || item.pos === 'PRON' || item.pos === 'PROPN'
    ).length;
  }

  async addPic() {
    this.imgPath$.subscribe((imgPath) => {
      if (imgPath) {
        this.filename = imgPath;
      }
    });
    await Promise.all(
      this.posTagItems.map(async (item) => {
        if (item.isExperimentItem === true) {
          // Check if isExperimentItem is true
          const imagePath = item.nounPronPropnId; // Use item.id for all true items
          const filePath =
            this.filename +
            '-imgs/' +
            this.filename +
            '-imgs-ai/' +
            this.filename +
            '-imgs-ai-no-style-exp1/' +
            this.filename +
            '-g-' +
            imagePath +
            '.webp';
          try {
            const url = await getDownloadURL(ref(this.storage, filePath));
            item.img = url; // Assign URL directly to posTagItem
          } catch (error) {
            // console.error('Error fetching image URL for filePath:', filePath);
          }
        }
      })
    );
    this.PosTagService.updatePosTagItem(this.PosTagService.posTagItems);
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
}
