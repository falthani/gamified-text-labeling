import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocKeyboardComponent } from './doc-keyboard.component';

describe('DocKeyboardComponent', () => {
  let component: DocKeyboardComponent;
  let fixture: ComponentFixture<DocKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocKeyboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
