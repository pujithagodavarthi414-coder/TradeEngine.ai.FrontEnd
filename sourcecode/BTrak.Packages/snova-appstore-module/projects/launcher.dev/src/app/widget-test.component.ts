import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { CustomAppBaseComponent } from '../../../../projects/project-components/src/lib/globaldependencies/components/componentbase';
import * as _ from 'underscore';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from 'projects/project-components/src/lib/globaldependencies/constants/localstorage-properties';

@Component({
    selector: "widgets-test",
    templateUrl: "./widget-test.component.html"

})

export class WidgetTestComponet extends CustomAppBaseComponent {

    constructor(cookieService: CookieService
    ) {
        super();
        cookieService.set(LocalStorageProperties.AddOrEditCustomAppIsRequired, "true", null);
    }
}