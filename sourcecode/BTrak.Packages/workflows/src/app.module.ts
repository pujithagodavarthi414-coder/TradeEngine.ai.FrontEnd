import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ApplicationRef, Injector } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";
import { StoreModule, ReducerManager } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { WorkflowWidgetModule } from './lib/workflows/workflow.module';
import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { WorkflowListComponent } from './lib/workflows/components/workflow-list/workflow-list.component';
import { JwtInterceptor } from './lib/globaldependencies/helpers/jwt.interceptor';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        WorkflowWidgetModule,
        FlexLayoutModule,
        FormsModule,
        MatInputModule,
        MatCardModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        ToastrModule.forRoot({
            timeOut: 5000
        }),
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MatDialogRef, useValue: {} },
        ReducerManager],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {
    constructor(private injector: Injector) {
        const createForm = createCustomElement(WorkflowListComponent, { injector : this.injector});
        customElements.define('app-workflow-list', createForm);
    }
    public ngDoBootstrap(appRef: ApplicationRef): void { }
}
