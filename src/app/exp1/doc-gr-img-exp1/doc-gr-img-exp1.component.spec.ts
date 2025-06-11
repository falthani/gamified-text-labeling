import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocGrImgExp1Component } from './doc-gr-img-exp1.component';

describe('DocGrImgExp1Component', () => {
  let component: DocGrImgExp1Component;
  let fixture: ComponentFixture<DocGrImgExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocGrImgExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocGrImgExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
