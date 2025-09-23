import { Output, EventEmitter, Inject, Component, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
    selector: "app-tags-worskpaces-display",
    template: `
    <div class="custom-dialog">
      <div class="custom-close" mat-dialog-close (click)="onNoClick()">
          <fa-icon icon="times" class="project-dialog"></fa-icon>
      </div>
  </div>
  <div mat-dialog-content class="project-dialogContent">
  <mat-card class="p-0 mb-0">
    <mat-card-title class="text-center mat-bg-primary" style="position: sticky; top:0">
    <div class="card-title-text mb-1">{{ itemType == 'Workspaces' ? dashboardItemType : itemType }}</div>
  </mat-card-title>
  
  <mat-card-content id="style-1" style="max-height: 50vh !important">
  <mat-chip-list class="mat-chip-list-stacked">
  <ng-container  *ngIf="itemType == 'Tags'">
    <mat-chip *ngFor="let item of items | orderBy : 'Tags'" class="text-center" [ngStyle]="{cursor: 'pointer'}" 
    (click)="onTagClick(item)">
      {{item.TagName}}
    </mat-chip>
    </ng-container>
    <ng-container  *ngIf="itemType == 'Workspaces' || itemType == 'Child tags'">
    <mat-chip *ngFor="let item of items | orderBy : 'Workspaces'" class="text-center" [ngStyle]="{cursor: 'pointer'}" 
    (click)="onTagClick(item)" [ngClass]="item == tagsSearchText ? 'widget-primary-color': 'widget-tag-color'">
      {{item}}
    </mat-chip>
    </ng-container>
  </mat-chip-list>
  </mat-card-content>
    </mat-card>
    </div>`
  })
  
  export class TagsAndWorkspacesDisplayComponent {
    
    @Input("data") 
    set _data(data: any) {
        if (data && data !== undefined) {
          this.items = data[0].items;
          this.itemType = data[0].itemsType;
          if(this.itemType == 'Workspaces')
          this.dashboardItemType = 'Dashboards'
          this.currentDialogId = data[0].dialogId;
          this.tagsSearchText = data[0].tagsSearchText;
          this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    dashboardItemType: string;
    items: any;
    itemType: string;
    currentDialog: any;
    currentDialogId: any;
    tagsSearchText: string;
    @Output() closeMatDialog = new EventEmitter<string>();
    @Output() selectedTag = new EventEmitter<any>();
    @Output() selectedDashboard = new EventEmitter<any>();
    constructor(
      public AppDialog: MatDialogRef<TagsAndWorkspacesDisplayComponent>, public dialog : MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
          // if(data) {
          //     this.items = data.items;
          //     this.itemType = data.itemsType;
          // }
      }
  
      ngOnInit() {
      }
  
      onTagClick(item) {
        if(this.itemType == 'Workspaces') {
          this.selectedDashboard.emit(item);
        } else {
        this.tagsSearchText = item;
        this.selectedTag.emit(item);
        }
        this.currentDialog.close();
      }
  
      onNoClick(): void {
        //this.AppDialog.close();
        this.currentDialog.close();
    }
  }