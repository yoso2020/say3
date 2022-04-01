import {Component, Input, OnInit} from '@angular/core'
import {BattleService} from '../../shared/services/battle.service'
import {Player} from '../../shared/models/player'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() color: string
  player: Player
  colorStyle = {color: ''}
  constructor(public battleService: BattleService) {
  }

  ngOnInit(): void {
    this.player = this.color === 'red' ? this.battleService.playerRed : this.battleService.playerBlue
    this.colorStyle.color = this.color
  }

}
