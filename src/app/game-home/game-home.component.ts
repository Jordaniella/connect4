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
  endGame: boolean = false;
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
  setGameScore = (index: number) => {
    this.gameScore[index].score++;
  };
  gameOver = (value: string) => {
    if (this.round < 3) {
      if (
        this.round == 2 &&
        (this.gameScore[1].score == 2 || this.gameScore[0].score == 2)
      ) {
        this.winner = this.gameScore[0].score == 2 ? 'The BOT' : 'YOU';
        this.endGame = true
        setTimeout(() => this.endTheGame, 3000);
      } 
      else {
        setTimeout(() => {
          this.round++;
          this.reInitBoard();
        }, 5000);}
        
      if (value != 'draw') {
        this.winnerColor[this.round - 1] = value;
        this.winner = value == this.gameScore[0].color ? 'YOU' : 'The BOT';
      } else {
        this.winner = value;
      }
    } else {
      if (value != 'draw') this.winnerColor[this.round - 1] = value;
      this.winner =
        this.gameScore[0].score < this.gameScore[1].score ? 'The BOT' : 'YOU';
        this.endGame = true
      setTimeout(() => this.endTheGame, 3000);
    }
    if (this.round > 3) this.restartGame()
  };
restartGame = () => {
  this.start = false
  this.endGame = false
  this.round = 1;
  this.endTheGame()
}
  endTheGame = () => {
    this.winner = null;
    this.isBotBegin = false;
    this.gameScore.forEach((element) => {
      element.score = 0;
    });
    this.endGame = false
    this.winnerColor = ['white', 'white', 'white'];
  }
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
