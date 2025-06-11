import { Component, OnInit } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { DocDialogComponent } from './doc-dialog/doc-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Document } from '../documents.model';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit {
  document: Document | undefined;
  documents: Document[] = [];

  constructor(
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private documentService: DocumentsService
  ) {}

  openBottomSheet(): void {
    this._bottomSheet.open(DocDialogComponent);
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const documentIdFromRoute = Number(routeParams.get('documentId'));
    this.document = this.documents.find(
      (document) => document.id === documentIdFromRoute
    );
  }
}
