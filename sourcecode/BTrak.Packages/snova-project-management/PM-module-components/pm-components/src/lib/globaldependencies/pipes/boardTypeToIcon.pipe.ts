import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { BoardTypeIds } from '../constants/board-types';

@Pipe({ name: "boardTypeToIcon", pure: true })
@Injectable({ providedIn: 'root' })
export class BoardTypeToIconPipe implements PipeTransform {
  transform(goal: any): string {
    if (!goal) {
      return "";
    }

    if (goal.isBugBoard) {
      return "bug";
    }
    return null;
  }
}

@Pipe({ name: "boardTypeTooltip", pure: true })
@Injectable({ providedIn: 'root' })
export class BoardTypeTooltipPipe implements PipeTransform {
  transform(boardTypeId: string): string {
    if (!boardTypeId) {
      return "";
    }

    if (boardTypeId.toUpperCase() == BoardTypeIds.KanbanBugsKey) {
      return "Bug board";
    }
    if (boardTypeId.toUpperCase() == BoardTypeIds.KanbanKey) {
      return "Kanban";
    }
    if (boardTypeId.toUpperCase() == BoardTypeIds.SuperAgileKey) {
      return "Super agile";
    }
    if (boardTypeId.toUpperCase() == BoardTypeIds.ApiKey) {
      return "Api board";
    }
    return "";
  }
}
