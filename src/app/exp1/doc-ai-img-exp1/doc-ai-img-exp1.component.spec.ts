import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocAiImgExp1Component } from './doc-ai-img-exp1.component';

describe('DocAiImgExp1Component', () => {
  let component: DocAiImgExp1Component;
  let fixture: ComponentFixture<DocAiImgExp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocAiImgExp1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocAiImgExp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
