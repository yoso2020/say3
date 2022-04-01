import {Piece} from './piece'
import {PlayerColor} from './types'

export class Player {
  logs: any[] = []
  color: PlayerColor
  steps = 0
  doMarking = false
  doDeleting = false
  doMoving = false
  won = false
  name: string

  constructor(color: PlayerColor) {
    this.color = color
    this.name = color === 'Red' ? '红色玩家' : '蓝色玩家'
  }

  move(piece: Piece, action: string) {
    this.logs.push({action, piece})
    this.steps++
  }
}