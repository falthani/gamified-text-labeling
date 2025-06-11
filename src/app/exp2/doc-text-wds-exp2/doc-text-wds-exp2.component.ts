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
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DocWdsDialogComponent } from '../doc-wds-dialog/doc-wds-dialog.component';
import { WordDisplayService } from '../../word-display.service';


interface GoldMap {
  definition: string;
  examples: string[];
}

interface FirestoreDoc {
  id: number;
  word: string;
  sentence: string;
  gold: GoldMap;  // Reflecting the nested structure
  definitions: { definition: string; examples: string[] }[];  // Assuming definitions are an array of objects
  emoji: string;
}

interface DataObject {
  id: number;
  word: string;
  sentence: string;
  gold: GoldMap;
  definitions: { definition: string; examples: string[] }[];
  emoji: string;
  userInput: string;
}

@Component({
  selector: 'app-doc-text-wds-exp2',
  templateUrl: './doc-text-wds-exp2.component.html',
  styleUrls: ['./doc-text-wds-exp2.component.scss']
})
export class DocTextWdsExp2Component {


  currentDataIndex = 0; // Default initialization, will be randomized later
  private subscriptions: Subscription = new Subscription();
  private storage: Storage = inject(Storage);

  data: DataObject[] = []; // Use the interface to type your array
  sentence: string = '';
  emoji: string = '';
  label: number = 0;
  // genImg: SafeUrl | null = null;
  isLoading: boolean = true;
  firestore: Firestore;
  id: any = this.route.snapshot.paramMap.get('id');
  totalEntries: number = 0; // Total number of entries to be labeled
  labeledEntries: number = 0; // Number of entries labeled by the user
  // Component class properties
  labelCorrect: boolean = false; // To store if the last label was correct
  lastLabel: string = ''; // To store the last label type selected
  labelAttempted: boolean = false; // New variable to track if a label has been attempted
  allLabeled: boolean = false; // New property to track if all data has been labeled
  lastColor!: string;

  constructor(
    private readonly http: HttpClient,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar, // Inject MatSnackBar
    private route: ActivatedRoute,
    private db: Firestore,
    private bottomSheet: MatBottomSheet,
    public wordDisplayService: WordDisplayService
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
      'wds-dataset-1'
    ).withConverter<FirestoreDoc>({
      fromFirestore: (snapshot, options): FirestoreDoc => {
        const data = snapshot.data(options);
        const example = data['example'] || {}; // Safeguard against missing 'example' key
        return {
          id: data['id'], // Assumes id is directly accessible and correctly typed
          word: data['word'],
          sentence: data['sentence'],
          gold: data['gold'],
          definitions: data['definitions'],
          emoji: data['emoji']
        };
      },
      toFirestore(model: FirestoreDoc): DocumentData {
        return model; // Or however you need to map back if writing to Firestore
      },
    });

    const sub = collectionData<FirestoreDoc>(docCollection, {
      idField: 'customIdName',
    }).subscribe((docs) => {
      this.data = docs.map((doc) => ({
        id: doc.id,
        word: doc.word,
        sentence: doc.sentence,
        gold: {
          definition: doc.gold.definition,
          examples: doc.gold.examples || [],  // Handle the case where examples might be undefined or empty
        },
        definitions: doc.definitions,
        emoji: doc.emoji || '',  // Ensure emoji is mapped correctly
        userInput: '',
      }));

      // Sort the data by 'id' right after mapping
      this.data = this.data.sort((a, b) => a.id - b.id);

      // console.log('Loaded and sorted data:', this.data); // Logs all data to inspect IDs and order

      this.isLoading = false;
      this.totalEntries = this.data.length;
      this.labeledEntries = this.data.filter((d) => d.userInput).length;
      this.isLoading = false;
      if (this.data.length > 0) {
        this.randomizeIndex();
        // this.addPic(); // Fetch images after data is loaded
        this.updateView(this.currentDataIndex);
      }
    });
  }

  getSentenceParts(sentence: string, word: string) {
    const wordIndex = sentence.indexOf(word);
  
    if (wordIndex === -1) {
      return {
        beforeWord: sentence,
        word: '',
        afterWord: '',
      };
    }
  
    const beforeWord = sentence.substring(0, wordIndex);
    const afterWord = sentence.substring(wordIndex + word.length);
  
    return { beforeWord, word, afterWord };
  }
  

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // async addPic() {
  //   try {
  //     const imagePromises = this.data.map(async (item) => {
  //       const filePath =
  //         'mlni-imgs/mlni-imgs-no-style/' + 'g-' + item.id + '.webp'; // Assuming the image file path is derived from the id
  //       const imageRef = ref(this.storage, filePath);
  //       item.imgPath = await getDownloadURL(imageRef);
  //       return item; // Return updated item with imgPath
  //     });

  //     this.data = await Promise.all(imagePromises); // Update the whole data array with new imgPaths
  //     this.updateView(this.currentDataIndex); // Update the view to reflect new image paths
  //   } catch (error) {
  //     console.error('Error fetching image URLs:', error);
  //   }
  // }

  randomizeIndex(): void {
    this.currentDataIndex = Math.floor(Math.random() * this.data.length);
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  updateView(index: number): void {
    // console.log('Updating view for index:', index); // Log which index is being updated
    if (index < this.data.length && index >= 0) {
      const dataObject = this.data[index];
      this.sentence = dataObject.sentence;
      // console.log('Current data object:', dataObject); // Detailed log of the data object
      this.openBottomSheet();
    } else {
      console.error('Index out of range:', index); // Log error if index is out of valid range
    }
  }

  nextData(): void {
    const unlabeledData = this.data.filter((d) => !d.userInput);
    if (unlabeledData.length > 0) {
      const randomIndex = Math.floor(Math.random() * unlabeledData.length);
      this.currentDataIndex = this.data.findIndex(
        (d) => d.id === unlabeledData[randomIndex].id
      );
      this.updateView(this.currentDataIndex);
    } else {
      console.warn('All entries labeled. No more moves.');
      this.allLabeled = true; // Set this property to true when no more data is left to label
    }
  }

  // checkLabelAndNext(selectedLabel: string): void {
  //   this.labelAttempted = true;
  //   this.labelCorrect =
  //   this.labelCorrect = this.data[this.currentDataIndex].gold.definition === selectedLabel;
  //   if (this.labelCorrect) {
  //     this.lastLabel = selectedLabel;
  //   } else {
  //     this.lastLabel = '';
  //   }
  //   if (!this.data[this.currentDataIndex].userInput) {
  //     this.labeledEntries++;
  //   }
  //   this.data[this.currentDataIndex].userInput = selectedLabel;
  //   setTimeout(() => {
  //     this.nextData();
  //     this.labelAttempted = false;
  //   }, 500);
  // }

  splitSentenceIntoWords(sentence: string, targetWord: string): string[] {
    return sentence.split(' '); // Split the sentence into an array of words
  }

  openBottomSheet(): void {
    const bottomSheetRef = this.bottomSheet.open(DocWdsDialogComponent, {
      data: {
        definitions: this.data[this.currentDataIndex].definitions
      }
    });
  
    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result) {
        this.checkLabelAndNext(result.definition, result.color);
      }
    });
  }
  
  checkLabelAndNext(selectedLabel: string, selectedColor: string): void {
    this.labelAttempted = true;
  
    // Check if the selected label matches the correct definition
    this.labelCorrect =
      this.data[this.currentDataIndex].gold.definition === selectedLabel;
  
    if (this.labelCorrect) {
      this.lastLabel = selectedLabel;
      this.lastColor = selectedColor;
  
      // Add points for correct label
      this.wordDisplayService.addPointsForLabels(25); // Add 5 points for correctly labeling the word
    } else {
      this.lastLabel = ''; // Reset if incorrect
      this.lastColor = 'grey'; // Apply grey for incorrect answers
    }
  
    if (!this.data[this.currentDataIndex].userInput) {
      this.labeledEntries++;
    }
  
    // Store user input
    this.data[this.currentDataIndex].userInput = selectedLabel;
  
    setTimeout(() => {
      this.nextData();
      this.labelAttempted = false;
    }, 500);
  }
  
  
  onDone() {
    // Ensure userPosTagItem is sorted
    this.data.sort((a, b) => a.id - b.id);

    // Map user input from PosTagService
    let userInput = this.data.map((item) => item.userInput);

    // Map goldPosTagItems to get only the pos property
    let gold = this.data.map((item) => item.gold.definition);
    // Post the data to the parent window
    window.top?.postMessage(
      { action: 'metric', payload: { userInput: userInput } },
      '*'
    );
    window.top?.postMessage({ action: 'metric', payload: { gold: gold } }, '*');

    // Log the data for debugging
    // console.log(userInput);
    // console.log(gold);

    // Signal the completion of the operation
    window.top?.postMessage({ action: 'finished' }, '*');
  }
}
