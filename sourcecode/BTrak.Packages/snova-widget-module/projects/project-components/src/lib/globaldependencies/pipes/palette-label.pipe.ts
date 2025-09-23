import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PaletteModel } from '../../widget-module/dependencies/models/palette.model';


@Pipe({ name: 'palettelabelpipe' })

@Injectable({
    providedIn: "root"
})
export class PaletteLabelPipe implements PipeTransform {

    constructor(private translateService: TranslateService) {}

    transform(data: PaletteModel): PaletteModel {
        if (!data) {
            return null;
        }

        // let dataModel = data.map(x => this.translateService.instant(x.label));
        
        data.palette.forEach(x => {
            x.label = this.translateService.instant(x.label)
        })
        return data;
    }
}