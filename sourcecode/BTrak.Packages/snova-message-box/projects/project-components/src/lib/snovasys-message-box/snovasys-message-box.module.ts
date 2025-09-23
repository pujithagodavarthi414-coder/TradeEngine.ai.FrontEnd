import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";

import { SnovasysMessageBoxComponent } from "./snovasys-message-box.component";
import { SnNgMessageTemplateDirective } from "./snovasys-message-box.directive";

@NgModule({
  imports: [
    CommonModule,
    MatCardModule
  ],
  declarations: [
    SnovasysMessageBoxComponent,
    SnNgMessageTemplateDirective
  ],
  exports:[
    SnNgMessageTemplateDirective,
    SnovasysMessageBoxComponent
  ]
})
export class SnovasysMessageBoxModule { }
