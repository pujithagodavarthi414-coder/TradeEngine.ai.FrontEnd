import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyIntl } from './MyIntl';
import { SanitizeHtmlPipe } from "./pipes/sanitize.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SanitizeHtmlPipe
  ],
  exports:[
    SanitizeHtmlPipe
  ]
})
export class SnovasysAppPipesModule { }
