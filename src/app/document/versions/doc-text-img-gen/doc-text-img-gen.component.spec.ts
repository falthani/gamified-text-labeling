import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocTextImgGenComponent } from './doc-text-img-gen.component';

describe('DocTextImgGenComponent', () => {
  let component: DocTextImgGenComponent;
  let fixture: ComponentFixture<DocTextImgGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocTextImgGenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocTextImgGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
