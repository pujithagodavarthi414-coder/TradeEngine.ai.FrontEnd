import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'workItemStatusOrder' })
@Injectable({ providedIn: 'root' })
export class WorkItemStatusOrderPipe implements PipeTransform {

    transform(statusList: any[]): any[] {
        let status;
        if (statusList) {
            status = statusList.length > 0 ? statusList.slice().sort((statusAsc, statusDesc) => {
                return statusAsc.userStoryStatusName.localeCompare(statusDesc.userStoryStatusName);
            }) : [];
        }
        return status;
    }
}
