import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPuzzleComponent } from './doc-puzzle.component';

describe('DocPuzzleComponent', () => {
  let component: DocPuzzleComponent;
  let fixture: ComponentFixture<DocPuzzleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocPuzzleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocPuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
