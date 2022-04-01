import {PlayerColor, PieceState} from './types'

export class PieceHost {
    x = 0
    y = 0
    id:string
    visible = true
    obliqueGroup: string
    constructor(visible: boolean, x: number, y: number, group:string ) {
        this.visible = visible
        this.x = x
        this.y = y
        this.obliqueGroup = group
        this.id = `${x}_${y}`
    }
}
