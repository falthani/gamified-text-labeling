import { Component, OnInit, inject, Query } from '@angular/core';
import { DocumentsService } from '../../documents.service';
import { Document } from '../../documents.model';
import { Firestore, collection, collectionData, collectionSnapshots, SnapshotMetadata } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Collection, result } from 'lodash';


@Component({
  selector: 'app-new-documents',
  templateUrl: './new-documents.component.html',
  styleUrls: ['./new-documents.component.scss'],
})
export class NewDocumentsComponent implements OnInit {
  documents$: Observable<any[]>;
  annotations$: Observable<any[]>;

  constructor(
    private documentsService: DocumentsService,
    private db: Firestore
  ) {

    const subcollectionPath = collection(this.db, 'documents/25qc2iH3cBHoB02fc45C/annotations');
    const docCollection = collection(this.db, 'documents');


    this.documents$ = collectionData(docCollection, { idField: 'customIdName' });
    this.annotations$ = collectionData(subcollectionPath);

  }

  ngOnInit() {
    this.documents$.subscribe(documents => {
      documents.forEach(document => {
        console.log('Document ID:', document.customIdName);
        console.log('Document data:', document);
      });
    });

    // this.annotations$.subscribe(annotations => {
    //   annotations.forEach(annotation => {
    //     console.log('Annotation ID:', annotation.customIdName);
    //     console.log('Annotation data:', annotation);
    //   });
    // });
    
    this.annotations$.forEach(doc => console.log(doc));
    this.documents$.forEach(doc => console.log(doc));
  }


  onAddDocument(document: Document) {
    this.documentsService.startDocument(document.id);
    document.purchased = true;
    console.log();
  }
}
