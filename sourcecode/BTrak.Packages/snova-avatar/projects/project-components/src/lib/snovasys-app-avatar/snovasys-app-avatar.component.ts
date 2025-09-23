import {
  Component,
  Input
} from "@angular/core";

@Component({
  selector: "app-avatar",
  templateUrl: "./snovasys-app-avatar.component.html",
 
})
export class SnovasysAvatarComponent {
  @Input() name: string;
  @Input() src: string;
  @Input() isRound: string;
  @Input() size: string;
  @Input() avatarClass: string ="btrak-avatar"
}
