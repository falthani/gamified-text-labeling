import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNlpCorefComponent } from './doc-nlp-coref.component';

describe('DocNlpCorefComponent', () => {
  let component: DocNlpCorefComponent;
  let fixture: ComponentFixture<DocNlpCorefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNlpCorefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNlpCorefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
