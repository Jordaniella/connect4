import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NgClass } from '@angular/common';
import { Minimax } from '../../utils/minimax';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [HeaderComponent, NgClass],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit{

  userScore : number = 0;
  botScore: number = 0;
  grid: ('red' | 'yellow' | null)[][] = [];
  // Determine le tour, quand turn = false, c'est l'user qui commence
  turn : boolean = false;
  totalTokens:number = 0; // Compteur pour suivre le nombre de jetons placés

  /**
  * Crée une matrice de dimensions spécifiées, initialisée à `null`.
  * Chaque cellule représente l'état d'une position dans le jeu qui peut être `red`, `yellow` ou `null` pour vide.
  * 
  * @param lines - Nombre de lignes de la matrice.
  * @param cols - Nombre de colonnes de la matrice.
  * @returns Une matrice [lines x cols] où chaque cellule est initialisée à `null`.
  */
  createEmptyGrid = (lines: number, cols: number): (null)[][] => {
    return Array.from({ length: lines }, () => new Array(cols).fill(null));
  };

  /**
   * Vérifie si la grille de jeu est complètement pleine.
   * 
   * @returns {boolean} Retourne true si la grille est pleine, sinon false.
   */
  checkGridFull = (): boolean => {
    const totalCells = this.grid.length * this.grid[0].length;
    return this.totalTokens >= totalCells;  // Comparer le nombre de jetons au nombre total de cellules
  }
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
  }
  
  /**
   * vérifier si le dernier coup est gagnant
   * @param col - la position de la colonne du dernier jeton ajouter.
   * @param row - la position de la ligne du dernier jeton ajouter.
   */
  // checkWinner(row: number, col: number): boolean {
  //   // Vérification dans toutes les directions nécessaires
  //   if (
  //     this.checkLine(row, col, 0, 1) + this.checkLine(row, col, 0, -1) > 3 || // Horizontal
  //     this.checkLine(row, col, 1, 0) > 3 || // Vertical
  //     this.checkLine(row, col, 1, 1) + this.checkLine(row, col, -1, -1) > 3 || // Diagonale montante
  //     this.checkLine(row, col, 1, -1) + this.checkLine(row, col, -1, 1) > 3 // Diagonale descendante
  //   ) {
  //     return true; // Gagnant si une ligne a 4 jetons ou plus
  //   }
  //   return false;
  // }
  // /**
  //  * Compte le nombre de jetons consécutifs appartenant au joueur actuel dans une direction donnée à partir d'une position spécifiée.
  //  * Cette méthode est utilisée pour vérifier si il y a quatre jetons alignés, ce qui constituerait une victoire dans le jeu Connect 4.
  //  *
  //  * @param row - L'indice de la ligne de départ pour la vérification.
  //  * @param col - L'indice de la colonne de départ pour la vérification.
  //  * @param dRow - Le déplacement vertical à effectuer pour chaque étape de vérification. 
  //  *               Une valeur de 1 vérifie vers le bas, -1 vérifie vers le haut, et 0 reste sur la même ligne.
  //  * @param dCol - Le déplacement horizontal à effectuer pour chaque étape de vérification. 
  //  *               Une valeur de 1 vérifie vers la droite, -1 vérifie vers la gauche, et 0 reste sur la même colonne.
  //  * 
  //  * @returns Le nombre de jetons consécutifs dans la direction spécifiée. Ce comptage n'inclut pas le jeton de départ.
  //  */
  // checkLine(row: number, col: number, dRow: number, dCol: number): number {
  //   let count = 0;
  //   let r = row + dRow;
  //   let c = col + dCol;
  //   const currentPlayer = this.turn ? 'red' : 'yellow';

  //   // Continuer la vérification tant que les conditions suivantes sont vraies :
  //   // 1. Les indices sont à l'intérieur des limites de la grille.
  //   // 2. La cellule examinée contient un jeton du joueur actuel.
  //   while (r >= 0 && r < this.grid.length && c >= 0 && c < this.grid[0].length && this.grid[r][c] === currentPlayer) {
  //     count++;
  //     r += dRow;
  //     c += dCol;
  //   }
  //   return count;
  // }

  /**
   * Ajoute un jeton dans la colonne spécifiée de la grille. Le jeton est coloré en fonction du joueur actuel.
   * @param line - La ligne dans laquelle ajouter le jeton.
   * @param col - La colonne dans laquelle ajouter le jeton.
   */
  addTile = (line:number,col: number) => {
    // Trouver le premier emplacement libre dans la colonne
    let index = this.getFirstAvailableRow(col);
    if(index >= 0) {
      // Ajouter le jeton dans la cellule libre trouvée
      this.grid[index][col] = this.turn ? 'red' : 'yellow'; 
      // Changer le tour après l'ajout du jeton
      this.turn = !this.turn; 
      this.totalTokens++;  // Incrémenter le compteur de jetons chaque fois qu'un jeton est ajouté
      // if (this.checkWinner(line, col)) console.log(this.turn ? "red" : "yellow")
      let nextmove: Move;
      let miniMax = new Minimax()
      if(this.turn)
        console.log("col, row = ",miniMax.minimaxWithAlphaBeta(this.grid, 3, -Infinity, Infinity, true,'red').move )

    }
  }

  ngOnInit(): void {
    this.grid = this.createEmptyGrid(6,7)
  }
}
type Move = {
    col: number;
    row: number;
};