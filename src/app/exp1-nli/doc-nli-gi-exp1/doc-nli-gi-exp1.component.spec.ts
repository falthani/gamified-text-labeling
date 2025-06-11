import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliGiExp1Component } from './doc-nli-gi-exp1.component';

describe('DocNliGiExp1Component', () => {
  let component: DocNliGiExp1Component;
  let fixture: ComponentFixture<DocNliGiExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliGiExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliGiExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
