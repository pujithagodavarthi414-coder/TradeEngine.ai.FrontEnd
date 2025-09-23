import {
    Component,
    Input
  } from "@angular/core";
  
  @Component({
    selector: "app-avatar-c",
    templateUrl: "./avatar.component.html",
   
  })
  export class AvatarComponent {
    @Input() name: string;
    @Input() src: string;
    @Input() isRound: string;
    @Input() size: string;
    @Input() avatarClass: string ="btrak-avatar"
  }
  