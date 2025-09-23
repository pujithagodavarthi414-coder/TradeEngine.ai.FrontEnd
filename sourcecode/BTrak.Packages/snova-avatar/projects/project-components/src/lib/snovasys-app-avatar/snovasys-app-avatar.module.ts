import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule, AvatarSource } from "ngx-avatar";

import { SnovasysAvatarComponent } from "./snovasys-app-avatar.component";

const avatarColors = ["#0000FF", "#A52A2A", "#D2691E", "#8B008B", "#8B0000", "#008000"];
const avatarSourcePriorityOrder = [AvatarSource.CUSTOM, AvatarSource.INITIALS]

@NgModule({
  imports: [
    CommonModule,
    AvatarModule.forRoot({
      colors: avatarColors,
      sourcePriorityOrder: avatarSourcePriorityOrder
    })
  ],
  declarations: [
    SnovasysAvatarComponent
  ],
  exports:[
    SnovasysAvatarComponent
  ]
})
export class SnovasysAvatarModule { }
