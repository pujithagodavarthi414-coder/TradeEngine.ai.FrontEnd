import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppBuilderModule, ApplicationFormRoutes } from "@thetradeengineorg1/snova-app-builder-creation-components";


@NgModule({
  imports: [
    AppBuilderModule,
    RouterModule.forChild(ApplicationFormRoutes),
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [],
  entryComponents: []
})

export class ApplicationFormModule { }
