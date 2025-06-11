import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmileyScoreComponent } from './smiley-score.component';

describe('SmileyScoreComponent', () => {
  let component: SmileyScoreComponent;
  let fixture: ComponentFixture<SmileyScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmileyScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmileyScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
