import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocEmoWdsDialogComponent } from './doc-emo-wds-dialog.component';

describe('DocEmoWdsDialogComponent', () => {
  let component: DocEmoWdsDialogComponent;
  let fixture: ComponentFixture<DocEmoWdsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocEmoWdsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocEmoWdsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
