import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { GameBoardComponent } from '../game-board/game-board.component';
import { GameSettingComponent } from '../game-setting/game-setting.component';
import { NgClass } from '@angular/common';
import { GameScoreComponent } from '../game-score/game-score.component';

@Component({
  selector: 'app-game-home',
  standalone: true,
  imports: [
    HeaderComponent,
    GameBoardComponent,
    GameSettingComponent,
    NgClass,
    GameScoreComponent,
  ],
  templateUrl: './game-home.component.html',
  styleUrl: './game-home.component.scss',
})
export class GameHomeComponent {
  gameScore: Score[] = [
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
  start: boolean = false;
  isBotBegin: boolean = false;
  round: number = 1;
  winner: string | null = null;
  initRound: boolean = false;
  winnerColor: string[] = ['white', 'white', 'white'];
  getIfBotBeginSetting = (choice: boolean) => (this.isBotBegin = choice);
  getUserTileColor = (choice: Tile) => {
    this.gameScore[0].color = choice;
    if (choice == 'red') {
      this.gameScore[1].color = 'yellow';
    }
  };
  startTheGame = (start: boolean) => {
    this.start = start;
    this.initRound = true;
    setTimeout(() => {
      this.initRound = false;
    }, 3000);
  };
  setBotScore = (gain: boolean) => {
    this.gameScore[1].score++;
  };
  setUserScore = (gain: boolean) => {
    this.gameScore[0].score++;
  };
  gameOver = (value: string) => {
    if (this.round < 3) {
      if (value != 'draw') {
        this.winnerColor[this.round - 1] = value;
        this.winner = value == this.gameScore[0].color ? 'YOU' : 'The BOT';
      } else {
        this.winner = value;
      }
      setTimeout(() => {
        this.round++;
        this.reInitBoard();
      }, 6000);
    } else if (
      this.round == 2 &&
      (this.gameScore[1].score == 2 || this.gameScore[0].score == 2)
    ) {
      this.winner = this.gameScore[0].score == 2 ? 'The BOT' : 'YOU';
      setTimeout(() => {
        this.start = false;
        this.reInitBoard();
        this.round = 1;
        this.gameScore.forEach((element) => {
          element.score = 0;
        });
        this.winnerColor = ['white', 'white', 'white'];
      }, 3000);
    } else {
      if (value != 'draw') this.winnerColor[this.round - 1] = value;
      this.winner =
        this.gameScore[0].score < this.gameScore[1].score ? 'The BOT' : 'YOU';
      setTimeout(() => {
        this.start = false;
        this.reInitBoard();
        this.round = 1;
        this.gameScore.forEach((element) => {
          element.score = 0;
        });
        this.winnerColor = ['white', 'white', 'white'];
      }, 3000);
    }
  };
  reInitBoard = () => {
    this.winner = null;
    this.isBotBegin = !this.isBotBegin;
    this.initRound = true;
    setTimeout(() => {
      this.initRound = false;
    }, 2000);
  };
}
type Tile = 'red' | 'yellow' | 'green' | 'white' | 'blue';

type Score = {
  name: string;
  score: number;
  color: Tile;
};
