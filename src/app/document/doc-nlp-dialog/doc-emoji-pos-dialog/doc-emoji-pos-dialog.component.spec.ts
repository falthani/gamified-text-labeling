import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocEmojiPosDialogComponent } from './doc-emoji-pos-dialog.component';

describe('DocEmojiPosDialogComponent', () => {
  let component: DocEmojiPosDialogComponent;
  let fixture: ComponentFixture<DocEmojiPosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocEmojiPosDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocEmojiPosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
