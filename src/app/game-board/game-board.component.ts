import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass } from '@angular/common';
import { Minimax } from '../../utils/minimax';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [HeaderComponent, NgClass],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  userScore: number = 0;
  botScore: number = 0;
  round: number = 1;
  grid: ('red' | 'yellow' | null)[][] = [];
  // Determine le tour, quand turn = false, c'est l'user qui commence
  turn: boolean = false;
  totalTokens: number = 0; // Compteur pour suivre le nombre de jetons placés
  win: {
    gameOver: boolean;
    winner: ('red' | 'yellow' | null) | 'draw' | null;
  } = {
    gameOver: false,
    winner: null,
  };

  /**
   * Crée une matrice de dimensions spécifiées, initialisée à `null`.
   * Chaque cellule représente l'état d'une position dans le jeu qui peut être `red`, `yellow` ou `null` pour vide.
   *
   * @param lines - Nombre de lignes de la matrice.
   * @param cols - Nombre de colonnes de la matrice.
   * @returns Une matrice [lines x cols] où chaque cellule est initialisée à `null`.
   */
  restartGame = () => {
    this.grid = this.createEmptyGrid(6, 7);
    this.win = {
      gameOver: false,
      winner: null,
    };
    this.turn = false;
    this.botScore = 0;
    this.userScore = 0;
    this.round = 1;
    this.totalTokens = 0;
  };
  nextRound = () => {
    if (this.round + 1 < 4) {
      this.win = {
        gameOver: false,
        winner: null,
      };
      this.round++;
    } else {
      this.win = {
        gameOver: true,
        winner: this.botScore > this.userScore ? 'red' : 'yellow',
      };
    }
    this.turn = false;
    this.grid = this.createEmptyGrid(6, 7);
    this.totalTokens = 0;
  };
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
      this.grid[index][col] = this.turn ? 'red' : 'yellow';
      // Changer le tour après l'ajout du jeton
      this.turn = !this.turn;
      this.totalTokens++; // Incrémenter le compteur de jetons chaque fois qu'un jeton est ajouté
      if (this.checkGridFull()) {
        this.win = miniMax.isTerminal(this.grid);
        console.log("C'est plein");
      } else {
        let nextmove: number | null;
        if (this.turn) {
          nextmove = miniMax.minimaxWithAlphaBeta(
            this.grid,
            4,
            -Infinity,
            Infinity,
            true,
            'red'
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
      if (this.win.winner == 'red') this.botScore++;
      else if (this.win.winner == 'yellow') this.userScore++;
    }
  };

  ngOnInit(): void {
    this.grid = this.createEmptyGrid(6, 7);
  }
}
