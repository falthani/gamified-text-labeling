import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocTextExp1Component } from './doc-text-exp1.component';

describe('DocTextExp1Component', () => {
  let component: DocTextExp1Component;
  let fixture: ComponentFixture<DocTextExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocTextExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocTextExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
