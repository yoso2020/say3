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
    // piece width is 0.5 basic width
    // piece offset is 50% piece width, so offset = index + 1 - 0.5 / 2 = 0.75
    const pieceWidth = this.basicWidth / 2
    const pieceWidthStyle = pieceWidth + 'px'
    // didn't know why this offset happens
    const xOffset = this.piece.colIndex < 3 ? -2 : this.piece.colIndex > 3 ? 2 : 0
    const yOffset = this.piece.rowIndex < 3 ? -2 : 0
    this.pieceStyle = {
      left: (this.piece.colIndex + 0.75) * this.basicWidth + xOffset + 'px',
      top: (this.piece.rowIndex + 0.75) * this.basicWidth + yOffset + 'px',
      width: pieceWidthStyle,
      height: pieceWidthStyle
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
