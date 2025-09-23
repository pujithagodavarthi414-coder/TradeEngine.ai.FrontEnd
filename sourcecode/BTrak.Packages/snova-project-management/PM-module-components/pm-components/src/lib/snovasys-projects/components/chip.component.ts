import {
    Component,
    Input
  } from "@angular/core";
  
  @Component({
    selector: "app-chip",
    templateUrl: "./chip.component.html",
   
  })
  export class ChipComponent {
    @Input() src: string;
    @Input() name: string;
    @Input() size: string;
    @Input() isNameRequired?: boolean = true;
  }
  