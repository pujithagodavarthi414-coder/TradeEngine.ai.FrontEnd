import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent } from '../admin-layout.component';
import { WidgetTestComponet } from '../widget-test.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { AppStoreModule } from 'projects/project-components/src/public-api';
import dynamicComponentsJson from '../models/modules';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children:
                [
                    {
                        path: "",
                        component: WidgetTestComponet,
                        data: { title: "Widget", breadcrumb: "Widget" }
                      },
                ]
            }
        ]),
        CommonModule,
        AppStoreModule.forChild({ modules: dynamicComponentsJson.modules }),
        FlexLayoutModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressBarModule,
        FormsModule,
        MatTooltipModule,
        MatButtonModule,
        MatMenuModule,
        MatAutocompleteModule

    ],
    declarations: [AdminLayoutComponent,WidgetTestComponet],
    exports: [],
    providers: [],
    entryComponents: []
})

export class TesterModule { }