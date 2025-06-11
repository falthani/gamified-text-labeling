import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocEmoPosExp2Component } from './doc-emo-pos-exp2.component';

describe('DocEmoPosExp2Component', () => {
  let component: DocEmoPosExp2Component;
  let fixture: ComponentFixture<DocEmoPosExp2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocEmoPosExp2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocEmoPosExp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
