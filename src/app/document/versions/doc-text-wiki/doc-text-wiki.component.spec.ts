import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocTextWikiComponent } from './doc-text-wiki.component';

describe('DocTextWikiComponent', () => {
  let component: DocTextWikiComponent;
  let fixture: ComponentFixture<DocTextWikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocTextWikiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocTextWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
