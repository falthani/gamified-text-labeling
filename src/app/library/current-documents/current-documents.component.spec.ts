import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDocumentsComponent } from './current-documents.component';

describe('CurrentDocumentsComponent', () => {
  let component: CurrentDocumentsComponent;
  let fixture: ComponentFixture<CurrentDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
