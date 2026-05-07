import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { GameBoardComponent } from '../game-board/game-board.component';
import { GameSettingComponent } from '../game-setting/game-setting.component';
import { NgClass } from '@angular/common';
import { GameScoreComponent } from '../game-score/game-score.component';
import { AiDifficulty, Tile } from '../../utils/minimax';

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
  difficulty: AiDifficulty = 'hard';
  winnerColor: string[] = ['white', 'white', 'white'];

  getIfBotBeginSetting = (choice: boolean) => (this.isBotBegin = choice);
  setDifficulty = (difficulty: AiDifficulty) => (this.difficulty = difficulty);

  getUserTileColor = (choice: Tile) => {
    this.gameScore[0].color = choice;
    this.gameScore[1].color = choice == 'red' ? 'yellow' : 'red';
  };

  startTheGame = (start: boolean) => {
    this.start = start;
    this.showRoundIntro(3000);
  };

  setGameScore = (index: number) => {
    this.gameScore[index].score++;
  };

  getRoundWinner = (value: string): string => {
    if (value == 'draw') return 'draw';

    return value == this.gameScore[0].color ? 'YOU' : 'The BOT';
  };

  getMatchWinner = (): string => {
    if (this.gameScore[0].score === this.gameScore[1].score) return 'draw';

    return this.gameScore[0].score > this.gameScore[1].score
      ? 'YOU'
      : 'The BOT';
  };

  gameOver = (value: string) => {
    if (value != 'draw') {
      this.winnerColor[this.round - 1] = value;
    }

    this.winner = this.getRoundWinner(value);

    if (this.round >= 3 || this.gameScore.some((score) => score.score === 2)) {
      this.winner = this.getMatchWinner();
      this.endGame = true;
      return;
    }

    setTimeout(() => {
      this.round++;
      this.reInitBoard();
    }, 5000);
  };

  restartGame = () => {
    this.start = false;
    this.round = 1;
    this.endTheGame();
  };

  endTheGame = () => {
    this.winner = null;
    this.isBotBegin = false;
    this.gameScore.forEach((element) => {
      element.score = 0;
    });
    this.endGame = false;
    this.winnerColor = ['white', 'white', 'white'];
  };

  showRoundIntro = (duration: number) => {
    this.initRound = true;
    setTimeout(() => {
      this.initRound = false;
    }, duration);
  };

  reInitBoard = () => {
    this.winner = null;
    this.isBotBegin = !this.isBotBegin;
    this.showRoundIntro(2000);
  };
}

type Score = {
  name: string;
  score: number;
  color: Tile;
};
