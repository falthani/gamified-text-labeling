import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from '../../documents.service';
import { HttpClient } from '@angular/common/http';
import { random } from 'lodash';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss'],
})
export class GridListComponent implements OnInit {
  // documents = this.documentsService.getAvailableDocuments();
  // id: any = this.route.snapshot.paramMap.get('id');

  routes = [
    'doc-img/',
    'doc-nlp-pos/',
    'doc-puzzle-img/',
    'doc-puzzle/',
    'doc-text-img-gen/',
    'img-gen/',
  ];

  purchasedDocuments = this.documentsService.getPurchasedDocuments();

  // randomIndex = Math.floor(Math.random() * this.purchasedDocuments.length);



  // combinedRoute = this.routes.map(item => item + this.purchasedDocuments[this.randomIndex].id);


  constructor(
    private route: ActivatedRoute,
    private readonly http: HttpClient,
    private documentsService: DocumentsService
  ) {}

  ngOnInit(): void {
    // console.log(this.purchasedDocuments[this.randomIndex].id);
  }
}
