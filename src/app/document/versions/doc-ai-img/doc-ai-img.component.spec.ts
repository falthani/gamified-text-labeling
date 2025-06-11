import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocAiImgComponent } from './doc-ai-img.component';

describe('DocAiImgComponent', () => {
  let component: DocAiImgComponent;
  let fixture: ComponentFixture<DocAiImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocAiImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocAiImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
