import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GoalModel } from "../../models/GoalModel";

@Component({
  selector: "app-userstory-detail-dialog",
  templateUrl: "userstory-detail-dialog.component.html"
})
export class UserstoryDetailDialogComponent implements OnInit {
  goalId: string;
  goal: GoalModel;
  selectedUserStory: any;
  goalReplanId: string;
  selectedTab: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UserstoryDetailDialogComponent>
  ) {
    this.goalId = data.goalId;
    this.goal = data.goal;
    this.selectedUserStory = data.selectedUserStory;
    this.goalReplanId = data.goalReplanId;
    this.selectedTab = data.selectedTab;
  }

  filterData: any;

  ngOnInit() {
    this.dialogRef.updatePosition({ top: `0px`, right: `0px` });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  userStoryCloseClicked(): void {
    this.dialogRef.close();
  }
}
