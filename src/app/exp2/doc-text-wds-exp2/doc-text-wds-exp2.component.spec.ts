import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocTextWdsExp2Component } from './doc-text-wds-exp2.component';

describe('DocTextWdsExp2Component', () => {
  let component: DocTextWdsExp2Component;
  let fixture: ComponentFixture<DocTextWdsExp2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocTextWdsExp2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocTextWdsExp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
