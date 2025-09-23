import {
    Component,
    Input
  } from "@angular/core";
  
  @Component({
    selector: "app-profile-avatar",
    templateUrl: "./avatar.component.html",
   
  })
  export class AvatarProfileComponent {
    @Input() name: string;
    @Input() src: string;
    @Input() isRound: string;
    @Input() size: string;
    @Input() avatarClass: string ="btrak-avatar"
  }
  