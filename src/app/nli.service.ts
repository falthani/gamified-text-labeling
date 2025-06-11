import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataObject } from './data-object.interface';

@Injectable({
  providedIn: 'root'
})
export class NliService {
  private dataObjectsSubject = new BehaviorSubject<DataObject[]>([]);
  public dataObjects$: Observable<DataObject[]> = this.dataObjectsSubject.asObservable();

  private currentIndexSubject = new BehaviorSubject<number>(0);
  public currentIndex$: Observable<number> = this.currentIndexSubject.asObservable();

  constructor() { }

  // Method to update the entire dataset
  updateDataObjects(newDataObjects: DataObject[]): void {
    this.dataObjectsSubject.next(newDataObjects);
  }

  // Method to update the current index
  updateCurrentIndex(newIndex: number): void {
    this.currentIndexSubject.next(newIndex);
  }

  // Get the current data object based on the index
  getCurrentDataObject(): DataObject | undefined {
    const currentIndex = this.currentIndexSubject.value;
    const dataObjects = this.dataObjectsSubject.value;
    return dataObjects.length > currentIndex ? dataObjects[currentIndex] : undefined;
  }

  // Randomize the current index
  randomizeIndex(): void {
    const dataLength = this.dataObjectsSubject.value.length;
    const randomIndex = Math.floor(Math.random() * dataLength);
    this.updateCurrentIndex(randomIndex);
  }

  // Navigate to next data object
  nextDataObject(): void {
    const currentIndex = this.currentIndexSubject.value;
    const dataLength = this.dataObjectsSubject.value.length;
    const nextIndex = currentIndex + 1 === dataLength ? 0 : currentIndex + 1;
    this.updateCurrentIndex(nextIndex);
  }
}
