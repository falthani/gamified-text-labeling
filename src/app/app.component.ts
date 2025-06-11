import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  firestore: Firestore = inject(Firestore)
  documents$: Observable<any[]>;

  constructor() {
    const aCollection = collection(this.firestore, 'documents')
    this.documents$ = collectionData(aCollection);
  }
}