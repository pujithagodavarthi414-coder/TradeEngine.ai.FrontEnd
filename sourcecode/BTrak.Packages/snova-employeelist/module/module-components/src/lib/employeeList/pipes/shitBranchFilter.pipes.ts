import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "shiftBranchFilter"
})

@Injectable()
export class ShiftBranchFilterPipe implements PipeTransform {
  transform(shift: any[], branch: string): any[] {
    if (!branch) return shift;
    return _.filter(shift, function (s) {
      return branch.includes(s.branchId);
    });
  }
}