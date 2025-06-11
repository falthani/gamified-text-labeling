import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPuzWdsDialogComponent } from './doc-puz-wds-dialog.component';

describe('DocPuzWdsDialogComponent', () => {
  let component: DocPuzWdsDialogComponent;
  let fixture: ComponentFixture<DocPuzWdsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocPuzWdsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocPuzWdsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
