import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocEmoWdsExp2Component } from './doc-emo-wds-exp2.component';

describe('DocEmoWdsExp2Component', () => {
  let component: DocEmoWdsExp2Component;
  let fixture: ComponentFixture<DocEmoWdsExp2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocEmoWdsExp2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocEmoWdsExp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
