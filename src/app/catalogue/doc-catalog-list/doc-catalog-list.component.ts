import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Document } from '../../documents.model';
import { DocumentsService } from '../../documents.service';

@Component({
  selector: 'app-doc-catalog-list',
  templateUrl: './doc-catalog-list.component.html',
  styleUrls: ['./doc-catalog-list.component.scss'],
})
export class DocCatalogListComponent implements OnInit {
  panelOpenState = false;

  documents$!: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService
  ) {}

  ngOnInit(): void {
    this.documents$ = this.documentsService.getAvailableDocuments();
  }
}
