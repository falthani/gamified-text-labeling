import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCatalogListComponent } from './doc-catalog-list.component';

describe('DocCatalogListComponent', () => {
  let component: DocCatalogListComponent;
  let fixture: ComponentFixture<DocCatalogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocCatalogListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocCatalogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
