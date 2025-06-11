import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocBlankComponent } from './doc-blank.component';

describe('DocBlankComponent', () => {
  let component: DocBlankComponent;
  let fixture: ComponentFixture<DocBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocBlankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
