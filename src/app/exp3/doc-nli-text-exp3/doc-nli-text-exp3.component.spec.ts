import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliTextExp3Component } from './doc-nli-text-exp3.component';

describe('DocNliTextExp3Component', () => {
  let component: DocNliTextExp3Component;
  let fixture: ComponentFixture<DocNliTextExp3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliTextExp3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliTextExp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
