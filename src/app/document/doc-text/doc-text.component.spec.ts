import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocTextComponent } from './doc-text.component';

describe('DocTextComponent', () => {
  let component: DocTextComponent;
  let fixture: ComponentFixture<DocTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
