import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
// import '../../../globaldependencies/helpers/fontawesome-icons'
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Guid } from 'guid-typescript';
import { CollaborationModel } from '../../../models/collaboration-model';
import { SampleCollaborationModel } from '../../../models/sample-collaboration-model';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-colloboration-table-component',
  templateUrl: './collaboration-table-component.html'
})

export class CollaborationTableComponent extends AppBaseComponent implements OnInit {
	@ViewChild("menu") trigger: MatMenuTrigger;
    @ViewChild("AddValiationDialogComponent") collaborationConfigDialog: TemplateRef<any>;
    collaborationListData: GridDataResult = {
        data: [],
        total: 0
    };

    state: State = {
        skip: 0,
        take: 10,
    };
    collaborationList: any = [];
    isArchived: boolean;
    collaborationId: Guid;
    isFilterVisible: boolean;
    selectedRowDetails: any;
    isInprogress: boolean;
    constructor(private router: Router, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
        private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, public dialog: MatDialog) {
        super();
        this.collaborationList=SampleCollaborationModel;
        this.collaborationListData = {
          data: this.collaborationList,
          total: this.collaborationList.length > 0 ? this.collaborationList.length : 0,
      }
    }

    ngOnInit() {

    }
    onChange(event: any) {}
    openCollaborationDialog(){
        this.collaborationId = Guid.create()['value'];
        let dialogId = "app-collaboration-dialog";
        const dialogRef = this.dialog.open(this.collaborationConfigDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                isEdit: false,
                collaborationId : this.collaborationId
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if(result.success == true){
            var collaboration = new CollaborationModel();
            collaboration.dataSetId = this.collaborationId;
            collaboration.formData = result.formData;
            collaboration.isArchived = false;
          this.collaborationList.push(collaboration);
          this.collaborationListData = {
              data: this.collaborationList,
              total: this.collaborationList.length > 0 ? this.collaborationList.length : 0,
          }
        }
        });
    }

    dataStateChange(event) {

    }
    archive() {
        this.isArchived = !this.isArchived;
        this.getCollaborations();
    }
    selectedRow(event) {

    }
    filterClick() {
        this.isFilterVisible = !this.isFilterVisible;
    }					
    openOptionsMenu(data) {
        this.selectedRowDetails = data;
        let selectedRowDetails = this.selectedRowDetails;
    }
    editCollaboration(selectedCollaboration){
        let dialogId = "edit-collaboration-dialog";
        const dialogRef = this.dialog.open(this.collaborationConfigDialog, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                isEdit: true,
                collaborationId : selectedCollaboration.dataSetId,
                collaborationDetails : selectedCollaboration
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if(result.success == true){
          let collaborations = this.collaborationList
          let updatedNewCollaborations = [];
          collaborations.forEach((comp) => {
              if(comp.dataSetId == selectedCollaboration.dataSetId){
                  selectedCollaboration.formData = result.formData;
                  updatedNewCollaborations.push(selectedCollaboration);
              } else{
                updatedNewCollaborations.push(comp);
              }
          })
          this.collaborationList = updatedNewCollaborations;
          this.getCollaborations();
        }
        });

    }
    archiveCollaboration(selectedCollaboration){
        let collaborations = this.collaborationList
        let updatedNewCollaborations = [];
        collaborations.forEach((comp) => {
            if(comp.dataSetId == selectedCollaboration.dataSetId){
                selectedCollaboration['isArchived'] = this.isArchived ? false : true;
                updatedNewCollaborations.push(selectedCollaboration);
            } else{
              updatedNewCollaborations.push(comp);
            }
        })
        this.collaborationList = updatedNewCollaborations;
        this.getCollaborations();
    }
    getCollaborations(){
        this.isInprogress = true;
        this.collaborationList=SampleCollaborationModel;
        let collaborations = this.collaborationList;
        if (!this.isArchived) {
            collaborations = collaborations.filter(function (data) {
                return data.isArchived == false
            })
            this.collaborationList = collaborations;

        } else {
            collaborations = collaborations.filter(function (data) {
                return data.isArchived == true
            })
            this.collaborationList = collaborations;
        }
      this.collaborationListData = {
        data: this.collaborationList,
        total: this.collaborationList.length > 0 ? this.collaborationList.length : 0,
    }
    this.isInprogress = false;
    this.cdRef.detectChanges();
    }
    closePopup() {
        this.trigger.closeMenu();
    }
}
