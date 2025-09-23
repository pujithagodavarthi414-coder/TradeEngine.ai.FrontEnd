import { Component, Input, OnInit, ViewChildren } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ActivityModel } from "../../models/activityModel";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { ActivityService } from "../../services/activity.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-activity-list",
    templateUrl: "activity-list.component.html",
})

export class ActivityListComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("editActivityPopUp") editActivityPopover;
    @ViewChildren("deleteActivityPopover") deleteActivityPopover;

    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
    currentDialogId: any;
    currentDialog: any;
    matData: any;
    form: FormGroup;
    isArchived: boolean = false;
    isEdit: boolean;
    searchText: any;
    upsertInProgress: any;
    deleteOperationIsInprogress: any;
    public sort: SortDescriptor[] = [{
        field: 'activityName',
        dir: 'asc'
    }];
    isLoading: boolean;
    validationMessage: any;
    activities: any;
    temp: any;
    priorityData: any;
    deleteActivityDetails: any;
    constructor(public dialog: MatDialog,private toaster: ToastrService, private activityService: ActivityService,private currentDialog1:MatDialogRef<ActivityListComponent>) {
        super();

    }
    ngOnInit() {
        this.getActivities();
        this.clearForm();
    }
    getActivities() { 
        this.isLoading = true;
        let act = new ActivityModel();
        act.isArchive = this.isArchived;
        this.activityService.getActivity(act).subscribe((result: any) => {
          if (result.success) {
            this.activities = result.data;
            this.temp = result.data;
          }
          else {
            this.activities = [];
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toaster.error(this.validationMessage);
          }
          this.isLoading = false;
        })
    }

    onNoClick() {
        if (this.currentDialog) {
            this.currentDialog.close();
        }
      }
    
    clearForm() {
        this.form = new FormGroup({
            activityName: new FormControl(null),
            description: new FormControl(null),
            inputs: new FormControl(null)
        })
    }
    changeArchiveActivity(value) {
        this.isArchived = value;
        this.getActivities();
    } 

    deleteActivityItem(data, deletePopover) {
        this.deleteActivityDetails = data;
        deletePopover.openPopover();
    }

    removeActivityAtIndex(value) {
        this.deleteOperationIsInprogress = true;
        let activityModel = new ActivityModel();
        activityModel = Object.assign({}, this.deleteActivityDetails);
        activityModel.isArchive = value;
        this.activityService.upsertActivity(activityModel).subscribe((result: any) => {
            if (result.success) {
                this.deleteActivityDetails = null;
                this.deleteOperationIsInprogress = false;
                this.getActivities();
                this.closeDeleteActivityDialog();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
                this.deleteOperationIsInprogress = false;
            }
        });
    }

    closeDeleteActivityDialog() {
        this.deleteActivityDetails = null;
        this.deleteActivityPopover.forEach((p) => p.closePopover());
    }

    upsertActivity() {
        this.upsertInProgress = true;
        this.isLoading = true;
        let activityModel = new ActivityModel();
        if (this.isEdit == true) {
            activityModel = this.priorityData;
        }
        activityModel.activityName = this.form.controls["activityName"].value;
        activityModel.description = this.form.controls["description"].value;
        activityModel.inputs = this.form.controls["inputs"].value;
        this.activityService.upsertActivity(activityModel).subscribe((result: any) => {
            var id = result.data
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            else {
                this.clearForm();
                this.getActivities();
                this.closePopup();
            }
        })
        this.closePopup();
        this.upsertInProgress = false;
        this.isLoading = false;
        this.isEdit = false;
    }

    editActivity(data, activityPopup) {
        this.isEdit = true;
        this.priorityData = data;
        activityPopup.openPopover();
        this.form.patchValue(data);
    }
    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const values = this.temp.filter((p => (p.activityName.toLowerCase().indexOf(this.searchText) > -1)
            || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
        this.activities = values;
    }

    closeSearch() {
        this.searchText = "";
        const values = this.temp.filter((p => (p.activityName.toLowerCase().indexOf(this.searchText) > -1)
            || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
        this.activities = values;
    }

    closePopup() {
        this.editActivityPopover.forEach((p) => p.closePopover());
    }

    openAddPopover(priorityPopup) {
        this.isEdit = false;
        priorityPopup.openPopover();
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.activities = orderBy(this.activities, this.sort)
    }
}