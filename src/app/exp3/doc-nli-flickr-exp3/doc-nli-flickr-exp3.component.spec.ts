import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliFlickrExp3Component } from './doc-nli-flickr-exp3.component';

describe('DocNliFlickrExp3Component', () => {
  let component: DocNliFlickrExp3Component;
  let fixture: ComponentFixture<DocNliFlickrExp3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliFlickrExp3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliFlickrExp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
