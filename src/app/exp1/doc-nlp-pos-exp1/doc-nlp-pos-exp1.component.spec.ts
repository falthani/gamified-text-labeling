import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNlpPosExp1Component } from './doc-nlp-pos-exp1.component';

describe('DocNlpPosExp1Component', () => {
  let component: DocNlpPosExp1Component;
  let fixture: ComponentFixture<DocNlpPosExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNlpPosExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNlpPosExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
