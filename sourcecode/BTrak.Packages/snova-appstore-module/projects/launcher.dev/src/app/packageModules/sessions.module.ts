import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SessionsModule, SessionsRoutes } from "@snovasys/snova-authentication-module";



@NgModule({
  imports: [
    SessionsModule,
    RouterModule.forChild([
      {
        path: '',
        children: SessionsRoutes
      }
    ]),
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [],
  entryComponents: []
})

export class SessionModule { }
