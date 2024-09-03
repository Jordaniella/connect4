import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass } from '@angular/common';
import { Minimax } from '../../utils/minimax';
import { GameSettingComponent } from '../game-setting/game-setting.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [HeaderComponent, NgClass, GameSettingComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  @Output() userScore: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() botScore: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() round: EventEmitter<number> = new EventEmitter<number>();
  @Output() isGameOver: EventEmitter<string> = new EventEmitter<string>();

  @Input() userColor: Tile = 'red';
  @Input() botColor: Tile = 'yellow';

  grid: (Tile | null)[][] = [];
  // Determine le tour, quand turn = false, c'est l'user qui commence
  @Input() turn: boolean = false;
  totalTokens: number = 0; // Compteur pour suivre le nombre de jetons placés
  win: {
    gameOver: boolean;
    winner: Tile | 'draw' | null;
  } = {
    gameOver: false,
    winner: null,
  };
  disabledBoard: boolean = false;
  createEmptyGrid = (lines: number, cols: number): null[][] => {
    return Array.from({ length: lines }, () => new Array(cols).fill(null));
  };

  /**
   * Vérifie si la grille de jeu est complètement pleine.
   *
   * @returns {boolean} Retourne true si la grille est pleine, sinon false.
   */
  checkGridFull = (): boolean => {
    const totalCells = this.grid.length * this.grid[0].length;
    return this.totalTokens >= totalCells; // Comparer le nombre de jetons au nombre total de cellules
  };
  /**
   * Trouve le premier emplacement libre dans une colonne donnée de la grille, de bas en haut.
   * @param col - Index de la colonne à vérifier.
   * @returns {number} Index de la ligne du premier emplacement libre, ou -1 si la colonne est pleine.
   */
  getFirstAvailableRow = (col: number): number => {
    for (let i = this.grid.length - 1; i >= 0; i--) {
      if (this.grid[i][col] === null) {
        return i; // Retourne l'index de la première cellule libre rencontrée
      }
    }
    return -1; // Aucun emplacement libre trouvé
  };

  /**
   * Ajoute un jeton dans la colonne spécifiée de la grille. Le jeton est coloré en fonction du joueur actuel.
   * @param line - La ligne dans laquelle ajouter le jeton.
   * @param col - La colonne dans laquelle ajouter le jeton.
   */
  addTile = (col: number) => {
    // Trouver le premier emplacement libre dans la colonne
    let index = this.getFirstAvailableRow(col);
    let miniMax = new Minimax();
    if (index >= 0) {
      // Ajouter le jeton dans la cellule libre trouvée
      this.grid[index][col] = this.turn ? this.botColor : this.userColor;
      // Changer le tour après l'ajout du jeton
      this.turn = !this.turn;
      this.totalTokens++; // Incrémenter le compteur de jetons chaque fois qu'un jeton est ajouté
      if (this.checkGridFull()) {
        this.win = miniMax.isTerminal(this.grid);
        this.setGameOver();
      } else {
        let nextmove: number | null;
        if (this.turn) {
          nextmove = miniMax.minimaxWithAlphaBeta(
            this.grid,
            5,
            -Infinity,
            Infinity,
            true,
            this.botColor,
            this.userColor
          ).move;

          if (nextmove != null) {
            setTimeout(() => {
              if (nextmove != null) {
                this.addTile(nextmove);
              }
            }, 300);
          }
        }
      }
    }
    this.win = miniMax.isTerminal(this.grid);
    if (this.win !== null) {
      if (this.win.winner == this.botColor) this.botScore.emit(true);
      else if (this.win.winner == this.userColor) this.userScore.emit(true);
      this.setGameOver();
    }
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

type Tile = 'red' | 'yellow' | 'green' | 'white' | 'blue';
