import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliDalle3Exp3Component } from './doc-nli-dalle3-exp3.component';

describe('DocNliDalle3Exp3Component', () => {
  let component: DocNliDalle3Exp3Component;
  let fixture: ComponentFixture<DocNliDalle3Exp3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliDalle3Exp3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliDalle3Exp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
