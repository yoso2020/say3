import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { SidebarComponent } from './components/sidebar/sidebar.component'
import { CheckerboardComponent } from './components/checkerboard/checkerboard.component'
import { BattleService } from './shared/services/battle.service'
import { PieceComponent } from './components/piece/piece.component'

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CheckerboardComponent,
    PieceComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [BattleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
