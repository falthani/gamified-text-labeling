import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNlpPosComponent } from './doc-nlp-pos.component';

describe('DocNlpPosComponent', () => {
  let component: DocNlpPosComponent;
  let fixture: ComponentFixture<DocNlpPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNlpPosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNlpPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
