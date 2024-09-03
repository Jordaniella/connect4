import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-score',
  standalone: true,
  imports: [],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss',
})
export class GameScoreComponent {
  @Input() round: number = 1;
  @Input() gameScore: Score[] = [
    {
      name: 'YOU',
      score: 0,
      color: 'yellow',
    },
    {
      name: 'BOT',
      score: 0,
      color: 'red',
    },
  ];
  @Input() winnerColor: string[] = ['white', 'white', 'white'];
}
type Score = {
  name: string;
  score: number;
  color: string;
};
