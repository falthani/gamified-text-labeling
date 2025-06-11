import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class FillInBlanksService {
  finalText: { id: number; word: string; translated: string; emoji: string; isDisabled: boolean; button: string }[] = [];
  currentFinalText: { id: number; word: string; translated: string; emoji: string; isDisabled: boolean; button: string } [] = [];

  constructor(private http: HttpClient) { }

  getFinalText() {
    return this.finalText;
  }
}
