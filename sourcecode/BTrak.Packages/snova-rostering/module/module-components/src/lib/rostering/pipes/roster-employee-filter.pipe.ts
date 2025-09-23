import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeListModel } from '../models/employee-model';
@Pipe({
    name: 'rosterEmployeeFilter'
})
export class RosterEmployeeFilterPipe implements PipeTransform {
    transform(items: EmployeeListModel[], shiftId: any, departmentId: any | string) {
        if (items && items.length) {
            return items.filter(item => {
                let retValue = true;
                if (departmentId && item.departmentId
                    && ((typeof (departmentId) == "string" && item.departmentId != departmentId)
                        || (!departmentId.includes(item.departmentId)))) {
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
