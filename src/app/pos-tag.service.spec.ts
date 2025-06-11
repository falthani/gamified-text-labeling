import { TestBed } from '@angular/core/testing';

import { PosTagService } from './pos-tag.service';

describe('PosTagService', () => {
  let service: PosTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
