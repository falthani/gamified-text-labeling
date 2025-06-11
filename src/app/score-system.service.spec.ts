import { TestBed } from '@angular/core/testing';

import { ScoreSystemService } from './score-system.service';

describe('ScoreSystemService', () => {
  let service: ScoreSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
