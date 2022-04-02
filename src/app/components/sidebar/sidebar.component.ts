import {Component, Input, OnInit} from '@angular/core'
import {BattleService} from '../../shared/services/battle.service'
import {Player} from '../../shared/models/player'
import {PlayerColor} from '../../shared/models/types'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() color: PlayerColor
  player: Player
  colorStyle = {color: ''}

  constructor(public battleService: BattleService) {
  }

  ngOnInit(): void {
    this.player = this.color === 'Red' ? this.battleService.playerRed : this.battleService.playerBlue
    this.colorStyle.color = this.color
  }
}
