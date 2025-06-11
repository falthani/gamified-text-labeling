import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliAiImgComponent } from './doc-nli-ai-img.component';

describe('DocNliAiImgComponent', () => {
  let component: DocNliAiImgComponent;
  let fixture: ComponentFixture<DocNliAiImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliAiImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliAiImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
