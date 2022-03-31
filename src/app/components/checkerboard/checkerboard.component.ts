import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BattleService} from "../../shared/services/battle.service";

@Component({
  selector: 'app-checkerboard',
  templateUrl: './checkerboard.component.html',
  styleUrls: ['./checkerboard.component.scss']
})
export class CheckerboardComponent implements OnInit, OnChanges {
  @Input() boardWidth = 0;
  basicWidth = 0;
  paddingStyle = {padding: ''};
  rotatedLength = 0;
  rotatedOffset = 0;

  constructor(public battleService: BattleService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.basicWidth = this.boardWidth / 8;
    this.paddingStyle.padding = this.basicWidth + 'px';
    this.rotatedLength = this.boardWidth - this.basicWidth * 2;
    this.rotatedOffset = Math.sqrt(this.rotatedLength * this.rotatedLength + this.rotatedLength * this.rotatedLength) / 2;
  }

  getStateText() {
    const player = this.battleService.currentPlayer
    if (player.doMarking) {
      return player.name + '执行删除标志'
    } else if (player.doDeleting) {
      return player.name + '删除对方棋子'
    } else if (player.doMoving) {
      return player.name + '移动棋子'
    } else {
      return this.battleService.state === 'Started' ? player.name + '行动' : player.name + '落子'
    }
  }
}
