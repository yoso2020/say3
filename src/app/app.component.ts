import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <!--The content below is only a placeholder and can be replaced.-->
      <div class="content">
          <app-sidebar color="red"></app-sidebar>
          <app-checkerboard [boardWidth]="boardWidth"></app-checkerboard>
          <app-sidebar color="blue"></app-sidebar>
      </div>
  `,
  styles: [`
      .content {
        display: flex;
        align-items: center;
        padding: 2rem 0;
        background: #ddd;
        min-width: 600px;
      }
      app-sidebar {
        width: 33%;
        background: #eee;
      }
      app-checkerboard {
        width: 34%;
        background: #ddd;
      }
  `]
})
export class AppComponent {
  boardWidth = 0;

  @HostListener('window:resize')
  onResize() {
    this.boardWidth = Math.round(Math.max(window.innerWidth, 600)*0.34);
  }

  constructor() {
    this.onResize()
  }
}