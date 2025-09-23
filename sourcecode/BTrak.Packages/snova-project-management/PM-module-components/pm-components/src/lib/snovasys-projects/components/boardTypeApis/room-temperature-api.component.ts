import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core"
import { GoalModel } from "../../models/GoalModel";

@Component({
    selector: "app-pm-goal-board-type-api",
    templateUrl: "room-temperature-api.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class RoomTemperatureApiComponent implements OnInit {
    @Input() goal: GoalModel;
    @Input() isTheBoardLayoutKanban: boolean;
    @Output() getGoalRelatedBurnDownCharts = new EventEmitter<string>();
    @Output() getGoalCalenderView = new EventEmitter<string>();
    showCheckBox: boolean;

    ngOnInit() {
    }

    // ReportsList
  getChartDetails(event) {
    this.getGoalRelatedBurnDownCharts.emit("");
  }
  getCalanderView(event) {
    this.getGoalCalenderView.emit("");
  }
  }
