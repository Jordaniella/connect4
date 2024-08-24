import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHomeComponent } from './game-home.component';

describe('GameHomeComponent', () => {
  let component: GameHomeComponent;
  let fixture: ComponentFixture<GameHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
