import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallProgressBarComponent } from './overall-progress-bar.component';

describe('OverallProgressBarComponent', () => {
  let component: OverallProgressBarComponent;
  let fixture: ComponentFixture<OverallProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallProgressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
