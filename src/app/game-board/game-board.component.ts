import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass } from '@angular/common';
import { AiDifficulty, Minimax, TerminalState, Tile } from '../../utils/minimax';
import { GameSettingComponent } from '../game-setting/game-setting.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [HeaderComponent, NgClass, GameSettingComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  @Output() gameScore: EventEmitter<number> = new EventEmitter<number>();
  @Output() round: EventEmitter<number> = new EventEmitter<number>();
  @Output() isGameOver: EventEmitter<string> = new EventEmitter<string>();

  @Input() userColor: Tile = 'red';
  @Input() botColor: Tile = 'yellow';
  @Input() difficulty: AiDifficulty = 'hard';

  grid: (Tile | null)[][] = [];
  // Determine le tour, quand turn = false, c'est l'user qui commence
  @Input() turn: boolean = false;
  totalTokens: number = 0;
  win: TerminalState = {
    gameOver: false,
    winner: null,
  };
  disabledBoard: boolean = false;

  createEmptyGrid = (lines: number, cols: number): null[][] => {
    return Array.from({ length: lines }, () => new Array(cols).fill(null));
  };

  /**
   * Vérifie si la grille de jeu est complètement pleine.
   */
  checkGridFull = (): boolean => {
    const totalCells = this.grid.length * this.grid[0].length;
    return this.totalTokens >= totalCells;
  };

  /**
   * Trouve le premier emplacement libre dans une colonne donnée de la grille, de bas en haut.
   */
  getFirstAvailableRow = (col: number): number => {
    for (let i = this.grid.length - 1; i >= 0; i--) {
      if (this.grid[i][col] === null) {
        return i;
      }
    }
    return -1;
  };

  /**
   * Ajoute un jeton dans la colonne spécifiée de la grille.
   */
  addTile = (col: number) => {
    if (this.disabledBoard) {
      return;
    }

    const index = this.getFirstAvailableRow(col);
    const miniMax = new Minimax();

    if (index < 0) {
      return;
    }

    this.disabledBoard = true;
    this.grid[index][col] = this.turn ? this.botColor : this.userColor;
    this.turn = !this.turn;
    this.totalTokens++;

    this.win = miniMax.isTerminal(this.grid);
    if (this.win.gameOver) {
      this.updateScore();
      this.setGameOver();
      return;
    }

    if (this.checkGridFull()) {
      this.setGameOver();
      return;
    }

    if (this.turn) {
      const nextmove = miniMax.getBestMove(
        this.grid,
        this.difficulty,
        this.botColor,
        this.userColor
      );

      setTimeout(() => {
        if (nextmove != null) {
          this.disabledBoard = false;
          this.addTile(nextmove);
        } else {
          this.disabledBoard = false;
        }
      }, 300);
    } else {
      this.disabledBoard = false;
    }
  };

  updateScore = () => {
    if (this.win.winner == this.botColor) this.gameScore.emit(1);
    else if (this.win.winner == this.userColor) this.gameScore.emit(0);
  };

  setGameOver = () => {
    if (this.win.winner != null) {
      this.disabledBoard = true;
      this.isGameOver.emit(this.win.winner);
    }
  };

  ngOnInit(): void {
    this.disabledBoard = false;
    this.grid = this.createEmptyGrid(6, 7);
    if (this.turn) this.addTile(3);
  }
}
