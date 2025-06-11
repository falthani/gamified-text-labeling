import { TestBed } from '@angular/core/testing';

import { NliService } from './nli.service';

describe('NliService', () => {
  let service: NliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
