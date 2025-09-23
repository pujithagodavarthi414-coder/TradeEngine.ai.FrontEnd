import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent } from '../admin-layout.component';
import { WidgetTestComponet } from '../widget-test.component';
import { AppBuilderModule, GenericFormRoutes } from 'app-builder-module-components/app-builder-components/src/public-api';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import info from '../app.module/models/modules';
import { DocumentEditorAllModule } from '@syncfusion/ej2-angular-documenteditor';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import { ToolbarModule, TabModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListModule, ComboBoxModule, DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { SliderModule, NumericTextBoxModule, ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { DialogModule } from '@syncfusion/ej2-angular-popups';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children:  //GenericFormRoutes,
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
        AppBuilderModule.forChild({ modules: info.modules }),
        FlexLayoutModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressBarModule,
        FormsModule,
        MatTooltipModule,
        MatButtonModule,
        MatMenuModule,
        MatAutocompleteModule,
        DocumentEditorAllModule,
        DocumentEditorContainerModule,
        ToolbarModule,
        TabModule,
        DropDownListModule,
        ComboBoxModule,
        DropDownListAllModule,
        MultiSelectAllModule,
        SliderModule,
        NumericTextBoxModule,
        ColorPickerModule,
        TreeViewModule,
        DialogModule

    ],
    declarations: [AdminLayoutComponent,WidgetTestComponet],
    exports: [],
    entryComponents: []
})

export class TesterModule { }