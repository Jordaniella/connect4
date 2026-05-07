export type Tile = 'red' | 'yellow' | 'green' | 'white' | 'blue';
export type AiDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type MinimaxResult = {
  score: number;
  move: number | null;
};

export type TerminalState = {
  gameOver: boolean;
  winner: Tile | 'draw' | null;
};

type CandidateMove = {
  col: number;
  score: number;
};

const DIFFICULTY_DEPTH: Record<AiDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
  expert: 7,
};

const WIN_SCORE = 1_000_000;

export class Minimax {
  /**
   * Compte le nombre de jetons pour un joueur spécifique dans une séquence donnée.
   */
  countTokens(tokens: (Tile | null)[], player: Tile | null): number {
    return tokens.filter((token) => token === player).length;
  }

  /**
   * Génère toutes les séquences possibles de quatre jetons en ligne sur la grille.
   */
  allPossibleFourInARows(board: (Tile | null)[][]): (Tile | null)[][] {
    const sequences: (Tile | null)[][] = [];
    const rows = board.length;
    const cols = board[0].length;

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

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 3; r++) {
        sequences.push([
          board[r][c],
          board[r + 1][c],
          board[r + 2][c],
          board[r + 3][c],
        ]);
      }
    }

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
   * Évalue une fenêtre de quatre cases en donnant plus de poids aux menaces ouvertes.
   */
  evaluateWindow(
    window: (Tile | null)[],
    botPlayer: Tile,
    opponentPlayer: Tile
  ): number {
    const botTokens = this.countTokens(window, botPlayer);
    const opponentTokens = this.countTokens(window, opponentPlayer);
    const emptyCells = this.countTokens(window, null);

    if (botTokens === 4) return 100_000;
    if (opponentTokens === 4) return -100_000;
    if (botTokens === 3 && emptyCells === 1) return 900;
    if (opponentTokens === 3 && emptyCells === 1) return -1_200;
    if (botTokens === 2 && emptyCells === 2) return 80;
    if (opponentTokens === 2 && emptyCells === 2) return -100;
    if (botTokens === 1 && emptyCells === 3) return 8;

    return 0;
  }

  /**
   * Évalue la grille de Connect 4 du point de vue du bot.
   */
  heuristicEval(
    board: (Tile | null)[][],
    botPlayer: Tile,
    opponentPlayer: Tile
  ): number {
    let score = 0;
    const centerColumn = Math.floor(board[0].length / 2);
    const centerTokens = this.countTokens(
      board.map((row) => row[centerColumn]),
      botPlayer
    );
    score += centerTokens * 30;

    for (const window of this.allPossibleFourInARows(board)) {
      score += this.evaluateWindow(window, botPlayer, opponentPlayer);
    }

    return score;
  }

  copyBoard = (board: (Tile | null)[][]): (Tile | null)[][] => {
    return board.map((row) => [...row]);
  };

  getValidColumns(board: (Tile | null)[][]): number[] {
    return board[0]
      .map((cell, index) => (cell === null ? index : null))
      .filter((index): index is number => index !== null);
  }

  orderColumns(board: (Tile | null)[][]): number[] {
    const center = Math.floor(board[0].length / 2);
    return this.getValidColumns(board).sort(
      (first, second) => Math.abs(first - center) - Math.abs(second - center)
    );
  }

  dropToken(
    board: (Tile | null)[][],
    col: number,
    currentPlayer: Tile
  ): (Tile | null)[][] | null {
    if (board[0][col] !== null) return null;

    const newBoard = this.copyBoard(board);
    const row = this.findFirstEmptyRowInColumn(newBoard, col);

    if (row === -1) return null;

    newBoard[row][col] = currentPlayer;
    return newBoard;
  }

  /**
   * Génère toutes les nouvelles grilles possibles pour le joueur courant avec la colonne jouée.
   */
  generateNewBoards = (
    board: (Tile | null)[][],
    currentPlayer: Tile
  ): { board: (Tile | null)[][]; move: number }[] => {
    return this.orderColumns(board)
      .map((col) => ({ board: this.dropToken(board, col, currentPlayer), move: col }))
      .filter(
        (entry): entry is { board: (Tile | null)[][]; move: number } =>
          entry.board !== null
      );
  };

  /**
   * Détermine si le jeu est terminé et identifie le gagnant s'il y en a un.
   */
  isTerminal = (board: (Tile | null)[][]): TerminalState => {
    const directions = [
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 },
      { r: 1, c: -1 },
    ];

    const rows = board.length;
    const cols = board[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const currentPlayer = board[r][c];
        if (currentPlayer !== null) {
          for (const dir of directions) {
            let win = true;
            for (let i = 1; i < 4; i++) {
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

    const isDraw = board.every((row) => row.every((cell) => cell !== null));
    if (isDraw) {
      return { gameOver: true, winner: 'draw' };
    }

    return { gameOver: false, winner: null };
  };

  /**
   * Trouve la première rangée vide dans une colonne donnée.
   */
  findFirstEmptyRowInColumn(
    board: (Tile | null)[][],
    colIndex: number
  ): number {
    for (let rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
      if (board[rowIndex][colIndex] === null) {
        return rowIndex;
      }
    }

    return -1;
  }

  private terminalScore(
    board: (Tile | null)[][],
    botPlayer: Tile,
    opponentPlayer: Tile,
    depth: number
  ): number | null {
    const terminal = this.isTerminal(board);

    if (!terminal.gameOver) return null;
    if (terminal.winner === botPlayer) return WIN_SCORE + depth;
    if (terminal.winner === opponentPlayer) return -WIN_SCORE - depth;

    return 0;
  }

  minimaxWithAlphaBeta = (
    board: (Tile | null)[][],
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean,
    botPlayer: Tile,
    opponentPlayer: Tile
  ): MinimaxResult => {
    const terminalScore = this.terminalScore(
      board,
      botPlayer,
      opponentPlayer,
      depth
    );

    if (terminalScore !== null) {
      return { score: terminalScore, move: null };
    }

    if (depth === 0) {
      return {
        score: this.heuristicEval(board, botPlayer, opponentPlayer),
        move: null,
      };
    }

    let bestMove: number | null = null;

    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      for (const col of this.orderColumns(board)) {
        const newBoard = this.dropToken(board, col, botPlayer);
        if (newBoard === null) continue;

        const result = this.minimaxWithAlphaBeta(
          newBoard,
          depth - 1,
          alpha,
          beta,
          false,
          botPlayer,
          opponentPlayer
        );

        if (result.score > maxEval) {
          maxEval = result.score;
          bestMove = col;
        }

        alpha = Math.max(alpha, maxEval);
        if (alpha >= beta) break;
      }

      return { score: maxEval, move: bestMove };
    }

    let minEval = Infinity;
    for (const col of this.orderColumns(board)) {
      const newBoard = this.dropToken(board, col, opponentPlayer);
      if (newBoard === null) continue;

      const result = this.minimaxWithAlphaBeta(
        newBoard,
        depth - 1,
        alpha,
        beta,
        true,
        botPlayer,
        opponentPlayer
      );

      if (result.score < minEval) {
        minEval = result.score;
        bestMove = col;
      }

      beta = Math.min(beta, minEval);
      if (beta <= alpha) break;
    }

    return { score: minEval, move: bestMove };
  };

  findImmediateMove(
    board: (Tile | null)[][],
    player: Tile
  ): number | null {
    for (const col of this.orderColumns(board)) {
      const newBoard = this.dropToken(board, col, player);
      if (newBoard !== null && this.isTerminal(newBoard).winner === player) {
        return col;
      }
    }

    return null;
  }

  private pickRandomColumn(board: (Tile | null)[][]): number | null {
    const validColumns = this.getValidColumns(board);
    if (validColumns.length === 0) return null;

    return validColumns[Math.floor(Math.random() * validColumns.length)];
  }

  private pickBestScoredMove(moves: CandidateMove[]): number | null {
    if (moves.length === 0) return null;

    const bestScore = Math.max(...moves.map((move) => move.score));
    const bestMoves = moves.filter((move) => move.score === bestScore);

    return bestMoves[Math.floor(Math.random() * bestMoves.length)].col;
  }

  /**
   * Retourne le meilleur coup du bot selon le palier de difficulté choisi.
   */
  getBestMove(
    board: (Tile | null)[][],
    difficulty: AiDifficulty,
    botPlayer: Tile,
    opponentPlayer: Tile
  ): number | null {
    if (difficulty === 'easy') {
      return this.pickRandomColumn(board);
    }

    const winningMove = this.findImmediateMove(board, botPlayer);
    if (winningMove !== null) return winningMove;

    const blockingMove = this.findImmediateMove(board, opponentPlayer);
    if (blockingMove !== null) return blockingMove;

    const depth = DIFFICULTY_DEPTH[difficulty];
    const scoredMoves = this.orderColumns(board)
      .map((col) => {
        const newBoard = this.dropToken(board, col, botPlayer);
        if (newBoard === null) return null;

        return {
          col,
          score: this.minimaxWithAlphaBeta(
            newBoard,
            depth - 1,
            -Infinity,
            Infinity,
            false,
            botPlayer,
            opponentPlayer
          ).score,
        };
      })
      .filter((move): move is CandidateMove => move !== null);

    return this.pickBestScoredMove(scoredMoves);
  }
}
