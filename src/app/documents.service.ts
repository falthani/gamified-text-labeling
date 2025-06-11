import { Document } from './documents.model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class DocumentsService {
  private selectedDocumentSubject = new BehaviorSubject<Document | null>(null);
  documentChanged = this.selectedDocumentSubject.asObservable();

  documents$: Observable<any[]>;
  annotations$: Observable<any[]>;

  private runningDocument!: Document;
  private currentDocumentSubject = new BehaviorSubject<Document | null>(null);
  currentDocument = this.selectedDocumentSubject.asObservable();


  constructor(private db: Firestore) {
    const subcollectionPath = collection(this.db, 'documents/25qc2iH3cBHoB02fc45C/annotations');
    const docCollection = collection(this.db, 'documents');

    this.documents$ = collectionData(docCollection, { idField: 'customIdName' });
    this.annotations$ = collectionData(subcollectionPath);
  }

  getAvailableDocuments() {
    return this.documents$;
  }

  startDocument(selectedId: number) {
    this.documents$.pipe(
      map(documents => documents.find(document => document.customIdName === selectedId))
    ).subscribe(selectedDocument => {
      if (!selectedDocument) {
        console.error(`Document with ID ${selectedId} not found`);
        return;
      }
      this.runningDocument = selectedDocument;
      this.selectedDocumentSubject.next({ ...this.runningDocument });
    });
  }

  getPurchasedDocuments(): Observable<Document[]> {
    return this.documents$.pipe(
      map(documents => documents.filter(document => document.purchased === true))
    );
  }


  getDocument(id: any) {
    this.documents$.pipe(
      map(documents => documents.find(document => document.customIdName === id))
    ).subscribe(selectedDocument => {
      if (!selectedDocument) {
        console.error(`Document with ID ${id} not found`);
        return;
      }
      this.currentDocument = selectedDocument;
    });

  }





}
