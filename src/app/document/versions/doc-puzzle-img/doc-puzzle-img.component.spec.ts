import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPuzzleImgComponent } from './doc-puzzle-img.component';

describe('DocPuzzleImgComponent', () => {
  let component: DocPuzzleImgComponent;
  let fixture: ComponentFixture<DocPuzzleImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocPuzzleImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocPuzzleImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
