import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNlpCorefDialogComponent } from './doc-nlp-coref-dialog.component';

describe('DocNlpCorefDialogComponent', () => {
  let component: DocNlpCorefDialogComponent;
  let fixture: ComponentFixture<DocNlpCorefDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNlpCorefDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNlpCorefDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
