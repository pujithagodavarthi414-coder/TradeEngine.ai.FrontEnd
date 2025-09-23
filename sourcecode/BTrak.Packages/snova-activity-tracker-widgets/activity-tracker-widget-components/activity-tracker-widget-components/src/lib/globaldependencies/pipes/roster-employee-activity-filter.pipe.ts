import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { EmployeeListModel } from '../../activitytracker/models/employee-model copy';

@Pipe({
    name: 'rosterEmployeeActivityFilter'
})

@Injectable({
    providedIn: 'root',
  })
  
export class RosterEmployeeActivityFilterPipe implements PipeTransform {
    transform(items: EmployeeListModel[], shiftId: any, departmentId: any | string) {
        if(typeof (departmentId) == "object" && departmentId.length > 0){
            if(departmentId.length > 0 && departmentId[departmentId.length - 1] == 0){
                return items;
            }
        }
        if (items && items.length) {
            return items.filter(item => {
                let retValue = true;
                if (departmentId && item.departmentId
                    && ((typeof (departmentId) == "string" && item.departmentId != departmentId)
                        || (!departmentId.includes(item.departmentId) && item.departmentId != null))) {
                    retValue = false;
                }
                if (shiftId && item.shiftTimingId != shiftId) {
                    retValue = false;
                }
                return retValue;
            })
        } else {
            return items;
        }
    }
}
