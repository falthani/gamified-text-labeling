import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocNliImgComponent } from './doc-nli-img.component';

describe('DocNliImgComponent', () => {
  let component: DocNliImgComponent;
  let fixture: ComponentFixture<DocNliImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocNliImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocNliImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
