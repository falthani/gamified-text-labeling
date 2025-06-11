import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocWdsDialogComponent } from './doc-wds-dialog.component';

describe('DocWdsDialogComponent', () => {
  let component: DocWdsDialogComponent;
  let fixture: ComponentFixture<DocWdsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocWdsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocWdsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
