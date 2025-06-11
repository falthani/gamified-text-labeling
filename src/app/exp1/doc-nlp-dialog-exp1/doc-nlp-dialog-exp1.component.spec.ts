import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNlpDialogExp1Component } from './doc-nlp-dialog-exp1.component';

describe('DocNlpDialogExp1Component', () => {
  let component: DocNlpDialogExp1Component;
  let fixture: ComponentFixture<DocNlpDialogExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNlpDialogExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNlpDialogExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
