import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { lastValueFrom, tap } from 'rxjs';
// import jsonData from '/Users/fatimaalthani/dev/my-app/dist/my-app/assets/nli-data.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  DocumentData,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Storage } from '@angular/fire/storage';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


interface DataObject {
  id: number;
  premise: string;
  hypothesis: string;
  label: string;
  imgPath: string; // New property for image path
  userInput: string; // New property for user input
}

interface FirestoreDoc {
  id: number;
  sentence1: string;
  sentence2: string;
  gold_label: string;
}

@Component({
  selector: 'app-doc-nli-text',
  templateUrl: './doc-nli-text.component.html',
  styleUrls: ['./doc-nli-text.component.scss'],
})
export class DocNliTextComponent implements OnInit {


  currentDataIndex = 0;  // Default initialization, will be randomized later
  private subscriptions: Subscription = new Subscription();
  private storage: Storage = inject(Storage);


  data: DataObject[] = []; // Use the interface to type your array
  premise: string = '';
  hypothesis: string = '';
  img: string = '';
  label: number = 0;
  genImg: SafeUrl | null = null;
  isLoading: boolean = true;
  firestore: Firestore;
  id: any = this.route.snapshot.paramMap.get('id');

  constructor(
    private readonly http: HttpClient,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar, // Inject MatSnackBar
    private route: ActivatedRoute,
    private db: Firestore
  ) {
    this.firestore = db;
    this.setupCollections();
  }

  ngOnInit(): void {
    // this.loadData();
    // this.updateView(this.currentDataIndex);
  }

  private setupCollections(): void {
    const docCollection = collection(
      this.db,
      'snli-high-dataset'
    ).withConverter<FirestoreDoc>({
      fromFirestore: (snapshot, options): FirestoreDoc => {
        const data = snapshot.data(options);
        const example = data['example'] || {}; // Safeguard against missing 'example' key
        return {
          id: data['id'], // Assumes id is directly accessible and correctly typed
          sentence1: example['premise'],
          sentence2: example['hypothesis'],
          gold_label: data['majority_label'],
        };
      },
      toFirestore(model: FirestoreDoc): DocumentData {
        return model; // Or however you need to map back if writing to Firestore
      },
    });

    const sub = collectionData<FirestoreDoc>(docCollection, {
      idField: 'customIdName'
    }).subscribe(docs => {
      this.data = docs.map(doc => ({
        id: doc.id,
        premise: doc.sentence1,
        hypothesis: doc.sentence2,
        label: doc.gold_label,
        imgPath: '', // Initial imgPath setup
        userInput: ''
      }));
      this.isLoading = false;
      console.log(this.data);
      if (this.data.length > 0) {
        this.randomizeIndex();
        this.addPic(); // Fetch images after data is loaded
        this.updateView(this.currentDataIndex);
      }
    });
  }


  updateView(index: number): void {
    if (index < this.data.length && index >= 0) {
      const dataObject = this.data[index];
      this.premise = dataObject.premise;
      this.hypothesis = dataObject.hypothesis;
      // other properties can also be set here if needed
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async addPic() {
    try {
      const imagePromises = this.data.map(async item => {
        const filePath = 'nli-snli-high-imgs/' + item.id + '.webp'; // Assuming the image file path is derived from the id
        const imageRef = ref(this.storage, filePath);
        item.imgPath = await getDownloadURL(imageRef);
        return item; // Return updated item with imgPath
      });
  
      this.data = await Promise.all(imagePromises); // Update the whole data array with new imgPaths
      this.updateView(this.currentDataIndex); // Update the view to reflect new image paths
    } catch (error) {
      console.error('Error fetching image URLs:', error);
    }
  }


  randomizeIndex(): void {
    this.currentDataIndex = Math.floor(Math.random() * this.data.length);
  }



  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  checkLabelAndNext(selectedLabel: string): void {
    let snackbarMessage = 'Incorrect';
    if (this.data[this.currentDataIndex].label === selectedLabel) {
      snackbarMessage = 'Correct';
      console.log('Correct');
      console.log(this.data[this.currentDataIndex].label);
      this.data[this.currentDataIndex].userInput = selectedLabel;
      console.log(this.data[this.currentDataIndex].userInput);
    }else{
      console.log('Incorrect');
      console.log(this.data[this.currentDataIndex].label);
      this.data[this.currentDataIndex].userInput = selectedLabel;
      console.log(this.data[this.currentDataIndex].userInput);
    }

    // Show the snackbar with the message
    this.snackBar.open(snackbarMessage, 'Close', {
      duration: 2000, // Adjust the duration as needed
    });

    this.nextData(); // Move to the next data object
  }

  nextData(): void {
    if (this.currentDataIndex < this.data.length - 1) {
      this.currentDataIndex++;
    } else {
      this.currentDataIndex = 0; // Optionally loop back to the first object
    }
    this.updateView(this.currentDataIndex);
  }

}
