import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Document } from '../documents.model';
import { DocumentsService } from '../documents.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  documents: Document[] = [];
  selected = '';
  ongoingDocument = false;
  documentSubscription!: Subscription;

  constructor(private documentsService: DocumentsService) {}

  ngOnInit(): void {
    this.documentSubscription = this.documentsService.documentChanged.subscribe(
      (document) => {
        if (document) {
          this.ongoingDocument = true;
        } else {
          this.ongoingDocument = false;
        }
      }
    );
  }
}
