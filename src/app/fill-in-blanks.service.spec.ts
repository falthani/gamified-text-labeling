import { TestBed } from '@angular/core/testing';

import { FillInBlanksService } from './fill-in-blanks.service';

describe('FillInBlanksService', () => {
  let service: FillInBlanksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FillInBlanksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
