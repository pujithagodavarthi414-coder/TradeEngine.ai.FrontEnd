import { Output, EventEmitter, Inject, Component, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-break-timings-display",
  template: `
  <div class="custom-dialog">
    <div class="custom-close" mat-dialog-close (click)="onNoClick()">
      <fa-icon icon="times" class="project-dialog"></fa-icon>
    </div>
  </div>
  <div mat-dialog-content>
    <mat-card class="p-0">
      <mat-card-title class="text-center mat-bg-primary" style="position: sticky; top:0">
        <div class="card-title-text">{{ 'FEEDTIMESHEET.BREAKDETAILS' | translate }}</div>
      </mat-card-title>
  
      <mat-card-content class="mt-02" id="style-1" style="height: 300px">
        <mat-chip-list class="mat-chip-list-stacked">
          <mat-chip *ngFor="let item of items" class="text-center">
            {{ item.BreakDifference}} (
            {{ item.BreakIn | timeZoneData: "HH:mm" : currentUserTimeZoneOffset }} <span *ngIf="item.BreakIn"
              matTooltip="{{ item.BreakInTimeZone  | timeZoneName : currentUserTimeZoneName }}">{{ item.BreakInAbbreviation | timeZoneName : currentUserTimeZoneAbbr }}</span> -
            {{ item.BreakOut | timeZoneData: "HH:mm" : currentUserTimeZoneOffset }} <span *ngIf="item.BreakOut"
              matTooltip="{{ item.BreakOutTimeZone | timeZoneName : currentUserTimeZoneName}}">{{ item.BreakOutAbbreviation | timeZoneName : currentUserTimeZoneAbbr }}</span>)
          </mat-chip>
        </mat-chip-list>
      </mat-card-content>
    </mat-card>
  </div>`
})

export class BreakTimeDisplayComponent {

  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      const breaks = JSON.parse(data[0].breakDetails);
      this.items = breaks.Breaks;
      this.currentDialogId = data[0].dialogId;
      this.currentUserTimeZoneName = data[0].currentUserTimeZoneName;
      this.currentUserTimeZoneOffset = data[0].currentUserTimeZoneOffset;
      this.currentUserTimeZoneAbbr = data[0].currentUserTimeZoneAbbr;
      this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    }
  }

  items: any;
  itemType: string;
  currentDialog: any;
  currentDialogId: any;
  currentUserTimeZoneName: string = null;
  currentUserTimeZoneOffset: string = null;
  currentUserTimeZoneAbbr: string = null;
  @Output() closeMatDialog = new EventEmitter<string>();
  @Output() selectedTag = new EventEmitter<any>();

  constructor(
    public AppDialog: MatDialogRef<BreakTimeDisplayComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.currentDialog.close();
  }
}