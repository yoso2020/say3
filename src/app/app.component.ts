import {Component, HostListener} from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
      <!--The content below is only a placeholder and can be replaced.-->
      <div class="content">
          <app-sidebar color="red" *ngIf="!isMobile"></app-sidebar>
          <app-checkerboard [boardWidth]="boardWidth"></app-checkerboard>
          <app-sidebar color="blue" *ngIf="!isMobile"></app-sidebar>
      </div>
  `,
  styles: [`
      .content {
          display: flex;
          align-items: center;
          background: #ddd;
          min-width: 300px;
          height: 100vh;
      }

      app-sidebar {
          width: 33%;
          background: #eee;
      }

      app-checkerboard {
          width: 34%;
          background: #ddd;
      }

      @media screen and (max-width: 600px) {
          app-checkerboard {
              width: 100%;
          }

          app-sidebar {
              width: 0;
          }
      }
      
      @media screen and (max-width: 600px) {
        app-checkerboard {
          width: 100%;
        }
        app-sidebar {
          width: 0;
        }
      }
  `]
})

export class AppComponent {
  boardWidth = 0
  isMobile = false

  @HostListener('window:resize')
  onResize() {
    this.debounce(this.setBoardWidth)()
  }

  constructor() {
    this.setBoardWidth()
  }

  private setBoardWidth() {
    this.isMobile = window.innerWidth <= 600
    this.boardWidth = this.isMobile ? window.innerWidth : Math.round(window.innerWidth * 0.34)
  }

  private timer = null

  private debounce(fn, delay = 500) {
    return (...args) => {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(() => fn.apply(this, args), delay)
    }
  }
}