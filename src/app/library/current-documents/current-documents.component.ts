import { Component, OnInit, Input } from '@angular/core';
import { Document } from '../../documents.model';
import { DocumentsService } from '../../documents.service';
import { Subscription } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-current-documents',
  templateUrl: './current-documents.component.html',
  styleUrls: ['./current-documents.component.scss'],
})
export class CurrentDocumentsComponent implements OnInit {
  documents: Document[] = [];
  selected: string | undefined;
  ongoingDocument = false;
  documentSubscription!: Subscription;
  firestore: Firestore;
  documents$: Observable<any[]>;

  constructor(private documentsService: DocumentsService, private db: Firestore) {
    this.firestore = db;
    const docCollection = collection(this.db, 'documents');
    this.documents$ = collectionData(docCollection, { idField: 'customIdName' });
  }

  ngOnInit(): void {
    this.documents$.pipe(
      map(docs => docs.map(doc => doc.customIdName))
    ).subscribe(customIdNames => {
      console.log(customIdNames);
    });
  }
}
