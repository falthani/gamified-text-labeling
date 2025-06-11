import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocMistakeCountComponent } from './doc-mistake-count.component';

describe('DocMistakeCountComponent', () => {
  let component: DocMistakeCountComponent;
  let fixture: ComponentFixture<DocMistakeCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocMistakeCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocMistakeCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
