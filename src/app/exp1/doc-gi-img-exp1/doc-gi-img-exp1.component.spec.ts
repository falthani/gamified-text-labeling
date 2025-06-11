import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocGiImgExp1Component } from './doc-gi-img-exp1.component';

describe('DocGiImgExp1Component', () => {
  let component: DocGiImgExp1Component;
  let fixture: ComponentFixture<DocGiImgExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocGiImgExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocGiImgExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
