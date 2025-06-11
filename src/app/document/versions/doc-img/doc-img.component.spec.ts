import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocImgComponent } from './doc-img.component';

describe('DocImgComponent', () => {
  let component: DocImgComponent;
  let fixture: ComponentFixture<DocImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
