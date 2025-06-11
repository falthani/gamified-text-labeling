import { TestBed } from '@angular/core/testing';

import { WordDisplayService } from './word-display.service';

describe('WordDisplayService', () => {
  let service: WordDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
