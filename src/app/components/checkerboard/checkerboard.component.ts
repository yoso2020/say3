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
}
