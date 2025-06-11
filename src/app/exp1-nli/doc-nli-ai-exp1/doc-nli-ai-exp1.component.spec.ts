import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliAiExp1Component } from './doc-nli-ai-exp1.component';

describe('DocNliAiExp1Component', () => {
  let component: DocNliAiExp1Component;
  let fixture: ComponentFixture<DocNliAiExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliAiExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliAiExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
