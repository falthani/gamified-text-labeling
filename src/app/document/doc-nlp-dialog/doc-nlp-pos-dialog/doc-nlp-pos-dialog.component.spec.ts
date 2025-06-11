import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNlpPosDialogComponent } from './doc-nlp-pos-dialog.component';

describe('DocNlpPosDialogComponent', () => {
  let component: DocNlpPosDialogComponent;
  let fixture: ComponentFixture<DocNlpPosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNlpPosDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNlpPosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
