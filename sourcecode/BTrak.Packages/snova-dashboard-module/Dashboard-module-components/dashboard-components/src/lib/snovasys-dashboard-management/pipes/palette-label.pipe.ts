import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PaletteModel } from '../models/palette.model';

@Pipe({ name: 'palettelabelpipe' })
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