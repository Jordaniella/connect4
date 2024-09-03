import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameScoreComponent } from './game-score.component';

describe('GameScoreComponent', () => {
  let component: GameScoreComponent;
  let fixture: ComponentFixture<GameScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
