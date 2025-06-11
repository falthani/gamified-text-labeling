import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDocumentsComponent } from './new-documents.component';

describe('NewDocumentsComponent', () => {
  let component: NewDocumentsComponent;
  let fixture: ComponentFixture<NewDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
