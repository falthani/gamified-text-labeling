import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliGrExp1Component } from './doc-nli-gr-exp1.component';

describe('DocNliGrExp1Component', () => {
  let component: DocNliGrExp1Component;
  let fixture: ComponentFixture<DocNliGrExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliGrExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliGrExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
