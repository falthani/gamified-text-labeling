import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliDialogComponent } from './doc-nli-dialog.component';

describe('DocNliDialogComponent', () => {
  let component: DocNliDialogComponent;
  let fixture: ComponentFixture<DocNliDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
