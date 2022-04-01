import {Component, Input, OnChanges} from '@angular/core'
import {Piece} from '../../shared/models/piece'
import {BattleService} from '../../shared/services/battle.service'

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss']
})
export class PieceComponent implements OnChanges {
  @Input() piece: Piece
  @Input() basicWidth: number
  pieceStyle = {}
  constructor(public battleService: BattleService) {
  }

  ngOnChanges(): void {
    // piece length is 0.5 basic length
    // piece offset is 50% piece length, so offset = index + 1 - 0.5 / 2 = 0.75
    // border width is 3px
    const pieceLength = this.basicWidth / 2
    const pieceLengthStyle = pieceLength + 'px'
    this.pieceStyle = {
      left: (this.piece.colIndex + 0.75)  * this.basicWidth + (this.piece.colIndex+1) * 2 + 'px',
      top: (this.piece.rowIndex + 0.75) * this.basicWidth + (this.piece.rowIndex +1) * 2 + 'px',
      width: pieceLengthStyle,
      height: pieceLengthStyle
    }
  }

  move(piece: Piece) {
    if (this.battleService.state === 'NotStarted') {
      return
    }
    if (this.battleService.currentPlayer.doDeleting && piece.state !== 'Deleting') {
      return
    }
    if (this.battleService.currentPlayer.doMoving && !['MovingIn', 'MovingOut'].includes(piece.state)) {
      return
    }
    this.battleService.move(piece)
  }
}
