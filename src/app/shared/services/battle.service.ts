import {Injectable} from '@angular/core';
import {Player} from "../models/player";
import {Piece} from "../models/piece";
import {BattleState, PieceState} from "../models/types";
import VisiblePieces from '../constants/visible-pieces'

const total = 6;
const center = 3;

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  private battleState: BattleState = "NotStarted";
  playerRed = new Player('Red')
  playerBlue = new Player('Blue')
  currentPlayer = this.playerRed;
  pieces: Piece[][] = [];


  constructor() {
    for (let row = 0; row <= total; row++) {
      const rowPieces = [];
      for (let col = 0; col <= total; col++) {
        const visiblePiece = VisiblePieces[row].find(x => x.y === col);
        let group = '';
        if (visiblePiece) {
          if (row < center && col < center) {
            group = 'top-left';
          } else if (row < center && col > center) {
            group = 'top-right';
          } else if (row > center && col < center) {
            group = 'bottom-left';
          } else if (row > center && col > center) {
            group = 'bottom-right';
          }
        }
        rowPieces.push(new Piece(!!visiblePiece, col, row, group, visiblePiece ? visiblePiece.neighbors : null))
      }
      this.pieces.push(rowPieces);
    }
  }

  get state(): BattleState {
    return this.battleState;
  }

  isRunning() {
    return ['Started', 'Preparing'].includes(this.battleState)
  }

  prepare() {
    if (this.isRunning() && !window.confirm('游戏已经开始，确定重新开始吗？')) {
      return;
    }
    this.battleState = "Preparing";
    this.currentPlayer = this.playerRed;
    this.pieces.forEach(row => row.forEach(p => {
      p.color = 'Unknown';
      p.state = 'Unactivated';
    }));

    // this.pieces = JSON.parse(localStorage.getItem('xx'));
    // this.setBatchState('Unactivated', 'Deleted')
    // this.pieces[0][0].color = 'Red'
    // this.pieces[1][3].color = 'Blue'
    // this.pieces[0][0].state = 'Activated'
    // this.pieces[1][3].state = 'Activated'
    // this.battleState = "Started";
  }

  start() {
    this.battleState = "Started";
    this.setBatchState('Marked', 'Deleted', true)
    this.currentPlayer = this.playerBlue;
  }

  move(piece: Piece) {
    switch (piece.state) {
      case "Unactivated":
        this.active(piece);
        break;
      case "Marking":
        this.mark(piece);
        break;
      case "Deleting":
        this.kill(piece);
        break;
      case "Activated":
        this.moveOut(piece)
        break;
      case "MovingIn":
        this.moveIn(piece)
        break;
      case "MovingOut":
        this.cancelMoveOut(piece)
        break;
    }
  }

  private active(piece: Piece) {
    if (this.currentPlayer.doMarking) {
      return;
    }
    piece.color = this.currentPlayer.color;
    piece.state = 'Activated';
    this.currentPlayer.move(piece, 'active');
    if (this.canSay3(piece)) {
      this.setMarking()
      return;
    }
    if (this.readyToStart()) {
      this.start();
    } else {
      this.switchPlayer();
    }
  }

  private setMarking() {
    this.pieces.forEach(row => {
      row.forEach(p => {
        if (p.visible && p.color !== this.currentPlayer.color && p.state === 'Activated') {
          p.state = 'Marking';
        }
      })
    });
    this.currentPlayer.doMarking = true;
    if (this.readyToStart()) {
      this.start();
    }
  }

  private setDeleting() {
    this.pieces.forEach(row => {
      row.forEach(p => {
        if (p.visible && p.color !== this.currentPlayer.color && p.state === 'Activated') {
          p.state = 'Deleting';
        }
      })
    });
    this.currentPlayer.doDeleting = true;
  }

  private moveOut(piece: Piece) {
    if (piece.color !== this.currentPlayer.color) {
      console.log('Not your piece');
      return;
    }
    if (this.state === 'Preparing') {
      console.log('Cannot active again');
      return;
    }
    piece.state = 'MovingOut';
    piece.neighbors
      .map(x => this.pieces[x[1]][x[0]])
      .filter(x => x.state === 'Deleted')
      .forEach(x => x.state = 'MovingIn');
    this.currentPlayer.doMoving = true;
  }

  private cancelMoveOut(piece: Piece) {

    piece.state = 'Activated';
    piece.neighbors
      .map(x => this.pieces[x[1]][x[0]])
      .filter(x => x.state === 'MovingIn')
      .forEach(x => x.state = 'Deleted');
    this.currentPlayer.doMoving = false;
  }


  private moveIn(piece: Piece) {
    piece.state = 'Activated';
    piece.color = this.currentPlayer.color;
    this.currentPlayer.move(piece, 'move');

    const outPiece = piece.neighbors
      .map(x => this.pieces[x[1]][x[0]])
      .find(x => x.state === 'MovingOut');
    outPiece.state = 'Deleted';
    outPiece.color = 'Unknown';
    this.currentPlayer.doMoving = false;
    this.setBatchState('MovingIn', 'Deleted')
    if (this.canSay3(piece)) {
      this.setDeleting()
    } else {
      this.switchPlayer();
    }
  }

  private mark(piece: Piece) {
    piece.state = 'Marked';
    this.setBatchState('Marking', 'Activated')
    this.currentPlayer.doMarking = false;
    this.switchPlayer();
  }

  private kill(piece: Piece) {
    piece.state = 'Deleted';
    piece.color = "Unknown"
    this.setBatchState('Deleting', 'Activated')
    this.currentPlayer.doDeleting = false;
    if (this.win()) {
      this.battleState = 'Finished'
      this.currentPlayer.won = true
    } else {
      this.switchPlayer();
    }
  }

  private switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.playerRed ? this.playerBlue : this.playerRed;
  }

  private canSay3(piece: Piece) {
    return this.compareRow(piece) || this.compareColumn(piece) || this.compareOblique(piece);
  }

  private compareRow(piece: Piece): boolean {
    return this.pieces[piece.rowIndex]
      .filter(x => piece.rowIndex !== center || (x.colIndex > center && piece.colIndex > center) || (x.colIndex < center && piece.colIndex < center))
      .filter(x => x.state === 'Activated' && this.compare(x, piece)).length === 3;
  }

  private compareColumn(piece: Piece): boolean {
    return this.pieces.filter(row => row.some(x => {
      return (piece.colIndex !== center || (x.rowIndex > center && piece.rowIndex > center) || (x.rowIndex < center && piece.rowIndex < center))
        && x.colIndex === piece.colIndex && x.state === 'Activated' && this.compare(x, piece);
    })).length >= 3
  }

  private compareOblique(piece: Piece): boolean {
    return piece.obliqueGroup && this.pieces.filter(row => {
      return row.some(x => x.obliqueGroup === piece.obliqueGroup && x.state === "Activated" && x.color === piece.color);
    }).length >= 3;
  }

  private compare(target: Piece, source: Piece): boolean {
    return target.state === 'Activated' && target.color === source.color && target.visible;
  }

  private setBatchState(from: PieceState, to: PieceState, clearColor = false) {
    this.pieces.forEach(row => {
      row.forEach(p => {
        if (p.state === from) {
          p.state = to;
          if (clearColor) {
            p.color = 'Unknown';
          }
        }
      })
    });
  }

  private readyToStart() {
    return !this.pieces.some(row => {
      return row.some(x => x.visible && x.state === "Unactivated");
    });
  }

  private win() {
    let count = 0;
    this.pieces.forEach(row => {
      count += row.filter(p => p.visible && p.color !== this.currentPlayer.color && p.state === 'Activated').length
    })
    return count < 3
  }
}
