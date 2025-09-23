import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'sortByComponent' })
@Injectable({ providedIn: 'root' })

export class SortByComparatorPipe implements PipeTransform {

        transform(data: any[], sortBy: any): any[] {
                if (data && data.length > 0) {
                        if (sortBy == 'counterPartyName') {
                                return data.sort((dataSortAsc, dataSortDesc) => {
                                        return dataSortAsc.clientTypeName.localeCompare(dataSortDesc.clientTypeName);
                                });
                        } else if (sortBy == 'formName') {
                                return data.sort((formSortAsc, formSortDesc) => {
                                        return formSortAsc.clientKycName.localeCompare(formSortDesc.clientKycName);
                                });
                        }
                       
                }
                else {
                    return [];
                }
        }
}