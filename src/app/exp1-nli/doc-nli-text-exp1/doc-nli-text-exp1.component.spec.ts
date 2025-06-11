import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliTextExp1Component } from './doc-nli-text-exp1.component';

describe('DocNliTextExp1Component', () => {
  let component: DocNliTextExp1Component;
  let fixture: ComponentFixture<DocNliTextExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliTextExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliTextExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
