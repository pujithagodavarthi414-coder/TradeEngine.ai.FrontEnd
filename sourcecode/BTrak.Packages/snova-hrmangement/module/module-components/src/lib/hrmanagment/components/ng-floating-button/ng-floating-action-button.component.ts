import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ng-floating-action-button',
  templateUrl: './ng-floating-action-button.component.html',
})
export class NgFloatingActionButtonComponent implements OnInit {
  @Input() iconClass: string;
  @Input() label: string;
  @Input() customClass?: string;
  @Input() iconType?: string ='mat-icon';
  
  @Output() buttonClick = new EventEmitter<any>();

  constructor() {}

  emitClickEvent($event: Event) {
    this.buttonClick.emit($event);
  }

  ngOnInit() {}
}
