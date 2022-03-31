import {PlayerColor, PieceState} from "./types";

export class Piece {
    colIndex = 0;
    rowIndex = 0;
    id:string;
    visible = true;
    color: PlayerColor = "Unknown";
    state: PieceState  = 'Unactivated';
    obliqueGroup: string;
    neighbors: number[][];
    constructor(visible: boolean, x: number, y: number, group:string, neighbors) {
        this.visible = visible;
        this.colIndex = x;
        this.rowIndex = y;
        this.obliqueGroup = group;
        this.id = `${x}_${y}`;
        this.neighbors = neighbors;
    }
}
