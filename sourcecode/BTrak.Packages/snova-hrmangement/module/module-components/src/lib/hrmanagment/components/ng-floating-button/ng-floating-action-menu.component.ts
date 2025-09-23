import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ng-floating-action-menu',
  templateUrl: './ng-floating-action-menu.component.html'
})
export class NgFloatingActionMenuComponent implements OnInit {
  public isOpen = false;
  public state = 'closed';

  @Input() placement: string;
  @Input() effect: string;
  @Input() label: string;
  @Input() iconClass: string;
  @Input() activeIconClass: string;
  @Input() mainButtonClass?: string;
  @Input() iconType?: string ='mat-icon';
  @Input() toggle = 'click';
  @Input() tooltipText: string;

  constructor() {}

  clicked() {
    if (this.toggle !== 'click') {
      return false;
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.state = 'open';
    } else {
      this.state = 'closed';
    }
  }

  childButtonClick($event){
         
  }

  entered() {
    if (this.toggle !== 'hover') {
      return false;
    }
    this.state = 'open';
  }

  leaved() {
    if (this.toggle !== 'hover') {
      return false;
    }
    this.state = 'closed';
  }

  ngOnInit() {}
}
