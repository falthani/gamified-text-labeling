import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliTextComponent } from './doc-nli-text.component';

describe('DocNliTextComponent', () => {
  let component: DocNliTextComponent;
  let fixture: ComponentFixture<DocNliTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
