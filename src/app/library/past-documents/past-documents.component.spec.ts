import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastDocumentsComponent } from './past-documents.component';

describe('PastDocumentsComponent', () => {
  let component: PastDocumentsComponent;
  let fixture: ComponentFixture<PastDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
