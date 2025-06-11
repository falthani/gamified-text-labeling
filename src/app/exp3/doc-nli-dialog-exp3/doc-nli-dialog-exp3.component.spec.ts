import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliDialogExp3Component } from './doc-nli-dialog-exp3.component';

describe('DocNliDialogExp3Component', () => {
  let component: DocNliDialogExp3Component;
  let fixture: ComponentFixture<DocNliDialogExp3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliDialogExp3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliDialogExp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
