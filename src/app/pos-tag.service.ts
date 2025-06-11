import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PosTagService {
  private posTagItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  public posTagItems$: Observable<any[]> =
    this.posTagItemsSubject.asObservable();

  private userPosTagItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  public userPosTagItems$: Observable<any[]> =
    this.userPosTagItemsSubject.asObservable();

  private experimentItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  public experimentItems$: Observable<any[]> =
    this.experimentItemsSubject.asObservable();


  private posTagItemClickedSource = new Subject<number>();
    posTagItemClicked$ = this.posTagItemClickedSource.asObservable();

  private currentImageUrlSource = new BehaviorSubject<string>('');
    currentImageUrl$ = this.currentImageUrlSource.asObservable();
    
  


  private _sharedPosTagItemSource = new BehaviorSubject<any[]>([]);
  sharedPosTagItem$ = this._sharedPosTagItemSource.asObservable();
  private currentPageIndexSubject = new BehaviorSubject<number>(0);
  public currentPageIndex$ = this.currentPageIndexSubject.asObservable();
  private sentenceHighlightSource = new BehaviorSubject<number[]>([]);
  public sentenceHighlightSource$ = this.sentenceHighlightSource.asObservable();
  private currentHighlightedIndices: number[] = [];

  public sharedPosTagItem: {
    id: number;
    word: string;
    pos: string;
    conc: number | undefined;
    noun: boolean;
    pronoun: boolean;
    verb: boolean;
    adjective: boolean;
    propernoun: boolean;
    isDisabled: boolean;
    isExperimentItem?: boolean;
    nounPronPropnId?: number | undefined;
    color: string;
    img?: string;
  }[] = [];

  public sharedCurrentPosTagItem: {
    id: number;
    word: string;
    pos: string;
    conc: number | undefined;
    noun: boolean;
    pronoun: boolean;
    verb: boolean;
    adjective: boolean;
    propernoun: boolean;
    isDisabled: boolean;
    isExperimentItem?: boolean;
    nounPronPropnId?: number | undefined;
    color: string;
    img?: string;
  }[] = [];

  public userPosTagItem: {
    id: number;
    word: string;
    pos: string;
    conc: number | undefined;
    userInput: string;
  }[] = [];

  public experimentItem: {
    id: number;
    img?: string;
  }[] = [];

  currentPage: number = 0;
  pageSize: number = 100; // Default value or from component

  nounPronPropnCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  public get posTagItems(): any[] {
    return this.posTagItemsSubject.value;
  }


  public get experimentItems(): any[] {
    return this.experimentItemsSubject.value;
  }

  simulatePosTagItemClick(id: number) {
    // console.log('Simulating click for ID:', id); // Check the received id value
    this.posTagItemClickedSource.next(id);
  }

  public updatePosTagItem(data: any): void {
    // console.trace('updatePosTagItem called');
    this.posTagItemsSubject.next(data);
  }

  get sharedPosTagItems(): any[] {
    return this._sharedPosTagItemSource.getValue();
  }

  set sharedPosTagItems(value: any[]) {
    this._sharedPosTagItemSource.next(value);
  }

  // Method to update the current page index
  setCurrentPageIndex(index: number) {
    this.currentPageIndexSubject.next(index);
  }

  getCurrentHighlightedIndices(): number[] {
    return this.currentHighlightedIndices;
  }

  // Method to find sentence items based on index
  findSentenceItems(index: number, posTagItems: any[]): any[] {
    let startIndex = index;
    let endIndex = index;
  
    // Find the start of the sentence
    while (startIndex > 0) {
      if (posTagItems[startIndex - 1] && this.isSentenceEnd(posTagItems[startIndex - 1])) {
        break;
      }
      startIndex--;
    }
  
    // Find the end of the sentence
    while (endIndex < posTagItems.length) {
      if (posTagItems[endIndex] && this.isSentenceEnd(posTagItems[endIndex])) {
        // Stop at the sentence-ending punctuation without including the next item
        break;
      }
      endIndex++;
    }
  
    return posTagItems.slice(startIndex, endIndex);
  }

  // Method to check if an item is the end of a sentence
  private isSentenceEnd(item: any): boolean {
    return ['.', '!', '?'].includes(item.word);
  }

  // Update currentPage and pageSize methods
  setCurrentPage(page: number): void {
    this.currentPage = page;
    // console.log('this.currentPage', this.currentPage);
  }

  setPageSize(size: number): void {
    this.pageSize = size;
  }

  // Method to clear all highlights
  clearAllHighlights(): void {
    const highlightedElements = document.querySelectorAll('.is-highlighted');
    const highlightedBtns = document.querySelectorAll('.is-highlighted-btn');
    highlightedElements.forEach((element) => {
      element.classList.remove('is-highlighted');
    });
    highlightedBtns.forEach((element) => {
      element.classList.remove('is-highlighted-btn');
    });
  }

  isOnCurrentPage(
    index: number,
    currentPage: number,
    pageSize: number
  ): boolean {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    // console.log('currentPage', currentPage);
    return index >= startIndex && index < endIndex;
  }

  // Method to highlight sentence items
  highlightSentenceItems(
    items: number[],
    currentPage: number,
    pageSize: number
  ): void {
    this.clearAllHighlights();
    this.currentHighlightedIndices = items.filter((index) =>
      this.isOnCurrentPage(index, currentPage, pageSize)
    );
  
    this.currentHighlightedIndices.forEach((itemId) => {
      const element = document.getElementById(`pos-tag-item-${itemId}`);
      if (element && 
          !element.classList.contains('white') && 
          !element.classList.contains('green') && 
          !element.classList.contains('blue') && 
          !element.classList.contains('purple')) {
        element.classList.add('is-highlighted');
      } else if (element) {
        element.classList.add('is-highlighted-btn');
      }
    });
  }

  countNounPronPropn() {
    let count = 0;
    for (let item of this.userPosTagItem) {
      if (['NOUN', 'PRON', 'PROPN'].includes(item.userInput)) {
        count++;
      }
    }
    this.nounPronPropnCount.next(count);
  }

  updateImageUrl(newUrl: string) {
    this.currentImageUrlSource.next(newUrl);
}

  public updateUserPosTagItem(data: any): void {
    this.userPosTagItemsSubject.next(data);
    this.countNounPronPropn();
  }

  public get userPosTagItems(): any[] {
    return this.userPosTagItemsSubject.value;
  }
}
