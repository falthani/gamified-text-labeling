import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarScoreComponent } from './star-score.component';

describe('StarScoreComponent', () => {
  let component: StarScoreComponent;
  let fixture: ComponentFixture<StarScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
