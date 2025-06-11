import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPuzWdsExp2Component } from './doc-puz-wds-exp2.component';

describe('DocPuzWdsExp2Component', () => {
  let component: DocPuzWdsExp2Component;
  let fixture: ComponentFixture<DocPuzWdsExp2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocPuzWdsExp2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocPuzWdsExp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
