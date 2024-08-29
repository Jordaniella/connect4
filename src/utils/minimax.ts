type MinimaxResult = {
  score: number;
  move: number | null; // Le coup (la colonne) associé au score optimal
};

export class Minimax {
  /**
   * Détermine le joueur opposé.
   *
   * @param currentPlayer Le joueur actuel.
   * @returns Le joueur opposé.
   */
  opponent(currentPlayer: 'red' | 'yellow'): 'red' | 'yellow' {
    return currentPlayer === 'red' ? 'yellow' : 'red';
  }

  /**
   * Compte le nombre de jetons pour un joueur spécifique dans une séquence donnée.
   *
   * @param tokens La séquence de jetons à analyser.
   * @param player Le joueur pour lequel compter les jetons.
   * @returns Le nombre de jetons appartenant au joueur spécifié dans la séquence.
   */
  countTokens(
    tokens: ('red' | 'yellow' | null)[],
    player: 'red' | 'yellow' | null
  ): number {
    return tokens.filter((token) => token === player).length;
  }

  /**
   * Génère toutes les séquences possibles de quatre jetons en ligne sur la grille.
   *
   * @param board La grille de jeu.
   * @returns Une liste de toutes les séquences de quatre jetons en ligne.
   */
  allPossibleFourInARows(
    board: ('red' | 'yellow' | null)[][]
  ): ('red' | 'yellow' | null)[][] {
    let sequences: ('red' | 'yellow' | null)[][] = [];

    const rows = board.length;
    const cols = board[0].length;

    // Horizontales
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 3; c++) {
        sequences.push([
          board[r][c],
          board[r][c + 1],
          board[r][c + 2],
          board[r][c + 3],
        ]);
      }
    }

    // Verticales
    for (let c = 0; c < cols; c++) {
      for (let r = rows - 1; r >= 3; r--) {
        sequences.push([
          board[r][c],
          board[r - 1][c],
          board[r - 2][c],
          board[r - 3][c],
        ]);
      }
    }

    // Diagonales vers le bas à droite
    for (let r = 0; r < rows - 3; r++) {
      for (let c = 0; c < cols - 3; c++) {
        sequences.push([
          board[r][c],
          board[r + 1][c + 1],
          board[r + 2][c + 2],
          board[r + 3][c + 3],
        ]);
      }
    }

    // Diagonales vers le bas à gauche
    for (let r = 0; r < rows - 3; r++) {
      for (let c = 3; c < cols; c++) {
        sequences.push([
          board[r][c],
          board[r + 1][c - 1],
          board[r + 2][c - 2],
          board[r + 3][c - 3],
        ]);
      }
    }

    return sequences;
  }
  /**
   * Évalue la grille de Connect 4 pour un joueur donné.
   *
   * @param board La grille de jeu actuelle représentée comme un tableau 2D de 'red', 'yellow', ou null.
   * @param player Le joueur actuel ('red' ou 'yellow').
   * @returns Le score heuristique basé sur l'état actuel de la grille.
   */
  heuristicEval(
    board: ('red' | 'yellow' | null)[][],
    player: 'red' | 'yellow'
  ): number {
    let score = 0;
    const opponent = this.opponent(player);
    const groups = this.allPossibleFourInARows(board);

    // Favoriser les positions centrales
    const centerColumn = Math.floor(board[0].length / 2);
    const centerScore =
      this.countTokens(
        board.map((row) => row[centerColumn]),
        player
      ) * 4;
    score += centerScore;

    // Vérifier les alignements horizontaux pour deux jetons adverses côte à côte
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length - 1; col++) {
        if (board[row][col] === opponent && board[row][col + 1] === opponent) {
          score -= 500; // Forte pénalité si deux jetons adverses sont côte à côte horizontalement
        }
      }
    }

    // Vérifier les alignements verticaux pour deux jetons adverses alignés
    for (let col = 0; col < board[0].length; col++) {
      for (let row = 0; row < board.length - 1; row++) {
        if (
          board[row][col] === opponent &&
          board[row + 1][col] === opponent &&
          (row === board.length - 2 || board[row + 2][col] === null) // S'assurer qu'il y a de la place pour placer un jeton ou c'est la limite de la grille
        ) {
          score -= 500; // Forte pénalité si deux jetons adverses sont alignés verticalement
        }
      }
    }

    // Évaluer les séquences de quatre jetons
    for (const group of groups) {
      const countPlayer = this.countTokens(group, player);
      const countOpponent = this.countTokens(group, opponent);

      if (countPlayer === 4) {
        score += 1000; // Gagner immédiatement
      } else if (countPlayer === 3 && countOpponent === 0) {
        score += 100; // Menace de gagner
      } else if (countPlayer === 2 && countOpponent === 0) {
        score += 10; // Avantage positionnel
      }

      if (countOpponent === 3 && countPlayer === 0) {
        score -= 100; // L'adversaire menace de gagner
      } else if (countOpponent === 2 && countPlayer === 0) {
        score -= 20; // Bloquer l'adversaire
      }
    }

    return score;
  }

  copyBoard = (board: ('red' | 'yellow' | null)[][]) => {
    return board.map((row) => [...row]); // Crée une copie profonde de la grille
  };
  /**
   * Génère toutes les nouvelles grilles possibles résultant du placement d'un jeton par le joueur courant.
   * Chaque grille générée reflète un état du jeu après que le joueur courant a placé un jeton dans une colonne qui n'est pas pleine.
   *
   * @param board - La grille actuelle du jeu, représentée comme un tableau 2D de valeurs 'red', 'yellow', ou null.
   * @param currentPlayer - Le joueur qui doit jouer, peut être 'red' ou 'yellow'.
   *
   * @returns Un tableau de nouvelles grilles, chacune représentant un état de jeu possible après le coup du joueur courant.
   *
   * @description
   * La fonction parcourt chaque colonne de la grille donnée pour déterminer si un coup est possible, c'est-à-dire si la colonne n'est pas pleine (la cellule en haut de la colonne est null).
   * Pour chaque colonne où un coup est possible, la fonction:
   * 1. Crée une copie de la grille pour éviter de modifier l'état original.
   * 2. Place le jeton du joueur courant dans la première position libre disponible depuis le bas de cette colonne.
   * 3. Ajoute la nouvelle grille modifiée à la liste des grilles résultantes.
   *
   * Cette méthode est utile pour les algorithmes de recherche comme Minimax, où chaque possibilité doit être explorée pour prendre la meilleure décision stratégique.
   */
  generateNewBoards = (
    board: ('red' | 'yellow' | null)[][],
    currentPlayer: 'red' | 'yellow'
  ) => {
    let newBoards = [];
    for (let col = 0; col < board[0].length; col++) {
      if (board[0][col] === null) {
        // Vérifie si la colonne n'est pas pleine
        let newBoard = this.copyBoard(board);
        for (let row = board.length - 1; row >= 0; row--) {
          if (newBoard[row][col] === null) {
            newBoard[row][col] = currentPlayer; // Place le jeton du joueur courant
            newBoards.push(newBoard);
            break;
          }
        }
      }
    }
    return newBoards;
  };

  /**
   * Détermine si le jeu est terminé et identifie le gagnant s'il y en a un.
   *
   * @param board La grille de jeu.
   * @returns Un objet contenant le statut de fin de jeu et le gagnant s'il y en a un.
   */
  isTerminal = (
    board: ('red' | 'yellow' | null)[][]
  ): {
    gameOver: boolean;
    winner: ('red' | 'yellow' | null) | 'draw' | null;
  } => {
    // Vérifier les quatre alignements dans toutes les directions
    const directions = [
      { r: 0, c: 1 }, // Horizontal
      { r: 1, c: 0 }, // Vertical
      { r: 1, c: 1 }, // Diagonale vers le bas à droite
      { r: 1, c: -1 }, // Diagonale vers le bas à gauche
    ];

    const rows = board.length;
    const cols = board[0].length;

    // Parcourir chaque cellule de la grille
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const currentPlayer = board[r][c];
        if (currentPlayer !== null) {
          // Vérifier chaque direction à partir de cette cellule
          for (const dir of directions) {
            let win = true;
            for (let i = 1; i < 4; i++) {
              // Vérifier les trois prochaines positions
              const nr = r + dir.r * i;
              const nc = c + dir.c * i;
              if (
                nr < 0 ||
                nr >= rows ||
                nc < 0 ||
                nc >= cols ||
                board[nr][nc] !== currentPlayer
              ) {
                win = false;
                break;
              }
            }
            if (win) {
              return { gameOver: true, winner: currentPlayer };
            }
          }
        }
      }
    }

    // Vérifier si la grille est complètement remplie
    const isDraw = board.every((row) => row.every((cell) => cell !== null));
    if (isDraw) {
      return { gameOver: true, winner: 'draw' };
    }

    // Si aucune des conditions ci-dessus n'est remplie, le jeu continue
    return { gameOver: false, winner: null };
  };
  /*
   * Trouve la première rangée vide dans une colonne donnée pour la grille de Connect 4.
   *
   * @param board La grille de jeu actuelle.
   * @param colIndex L'indice de la colonne à vérifier.
   * @returns L'indice de la première rangée vide dans la colonne, ou -1 si la colonne est pleine.
   */
  findFirstEmptyRowInColumn(
    board: ('red' | 'yellow' | null)[][],
    colIndex: number
  ): number {
    if (colIndex < 0) {
      for (let rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
        for (let j = 0; j < board[rowIndex].length; j++) {
          if (board[rowIndex][j] === null) {
            return rowIndex; // Retourne l'index de la première rangée vide trouvée.
          }
        }
      }
    } else {
      for (let rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
        if (board[rowIndex][colIndex] === null) {
          return rowIndex; // Retourne l'index de la première rangée vide trouvée.
        }
      }
    }
    return -1; // Retourne -1 si la colonne est pleine.
  }
  /**
   * Fonction Minimax avec élagage alpha-bêta pour évaluer les meilleurs coups possibles dans le jeu Connect 4.
   *
   * @param board - La grille actuelle du jeu.
   * @param depth - La profondeur maximale de recherche.
   * @param alpha - La meilleure valeur déjà disponible pour le maximiseur le long du chemin vers la racine.
   * @param beta - La meilleure valeur déjà disponible pour le minimiseur le long du chemin vers la racine.
   * @param isMaximizingPlayer - Booléen indiquant si le joueur actuel est le maximiseur.
   * @param currentPlayer - Le joueur ('red' ou 'yellow') qui joue actuellement.
   *
   * @returns La valeur heuristique du nœud évalué.
   */
  // minimaxWithAlphaBeta = (
  //   board: ('red' | 'yellow' | null)[][],
  //   depth: number,
  //   alpha: number,
  //   beta: number,
  //   isMaximizingPlayer: boolean,
  //   currentPlayer: 'red' | 'yellow'
  // ): number => {
  //   // If fin de la profondeur ou que la grille est déjà en gameOver
  //   if (depth === 0 || this.isTerminal(board).gameOver) {
  //     return this.heuristicEval(board, currentPlayer);
  //   }

  //   let newBoards = this.generateNewBoards(board, currentPlayer);
  //   // Quand le noeud est max
  //   if (currentPlayer === 'red') {
  //     for (let i = 0; i < newBoards.length; i++) {
  //       alpha = Math.max(
  //         alpha,
  //         this.minimaxWithAlphaBeta(
  //           newBoards[i],
  //           depth - 1,
  //           alpha,
  //           beta,
  //           false,
  //           'yellow'
  //         )
  //       );
  //       if (alpha >= beta) {
  //         return alpha;
  //       }
  //     }
  //     return alpha;
  //   }
  //   // Quand le noeud est min
  //   else {
  //     for (let i = 0; i < newBoards.length; i++) {
  //       beta = Math.min(
  //         beta,
  //         this.minimaxWithAlphaBeta(
  //           newBoards[i],
  //           depth - 1,
  //           alpha,
  //           beta,
  //           true,
  //           'red'
  //         )
  //       );
  //       if (beta <= alpha) return beta;
  //     }
  //     return beta;
  //   }
  // };
  minimaxWithAlphaBeta = (
    board: ('red' | 'yellow' | null)[][],
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean,
    currentPlayer: 'red' | 'yellow'
  ): MinimaxResult => {
    // Si fin de la profondeur ou que la grille est déjà en gameOver
    if (depth === 0 || this.isTerminal(board).gameOver) {
      return {
        score: this.heuristicEval(board, currentPlayer),
        move: null, // Pas de mouvement associé ici, car c'est une évaluation finale
      };
    }

    let bestMove: number | null = null;

    // Le noeud est max
    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      for (let col = 0; col < board[0].length; col++) {
        if (board[0][col] === null) {
          const newBoard = this.copyBoard(board);
          for (let row = board.length - 1; row >= 0; row--) {
            if (newBoard[row][col] === null) {
              newBoard[row][col] = currentPlayer;
              break;
            }
          }

          const result = this.minimaxWithAlphaBeta(
            newBoard,
            depth - 1,
            alpha,
            beta,
            false,
            this.opponent(currentPlayer)
          );

          if (result.score > maxEval) {
            maxEval = result.score;
            bestMove = col;
          }

          alpha = Math.max(alpha, maxEval);
          if (alpha >= beta) return { score: alpha, move: bestMove }; // Coupure alpha-bêta
        }
      }
      return { score: alpha, move: bestMove };
    } else {
      let minEval = Infinity;
      for (let col = 0; col < board[0].length; col++) {
        if (board[0][col] === null) {
          const newBoard = this.copyBoard(board);
          for (let row = board.length - 1; row >= 0; row--) {
            if (newBoard[row][col] === null) {
              newBoard[row][col] = currentPlayer;
              break;
            }
          }

          const result = this.minimaxWithAlphaBeta(
            newBoard,
            depth - 1,
            alpha,
            beta,
            true,
            this.opponent(currentPlayer)
          );

          if (result.score < minEval) {
            minEval = result.score;
            bestMove = col;
          }

          beta = Math.min(beta, minEval);
          if (beta <= alpha) return { score: beta, move: bestMove }; // Coupure alpha-bêta
        }
      }
      return { score: beta, move: bestMove };
    }
  };
}
