import { OnInit, Component, TemplateRef, ViewChild, ViewEncapsulation, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Guid } from "guid-typescript";
import { FormComponents } from "../../models/new-program-model";
import { Router } from "@angular/router";
import { MatMenuTrigger } from "@angular/material/menu";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LivesManagementService } from "../../services/lives-management.service";
import { ToastrService } from "ngx-toastr";
import { ProgramModel } from "../../models/programs-model";
import { RoleModel } from "../../models/role-model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { ClientOutPutModel } from "../../models/client-model";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, State } from "@progress/kendo-data-query";
import { UserService } from "../../services/user.service";
import { UserModel } from "../../models/userModel";
import { FileUploadService } from "../../services/fileUpload.service";
import { UserLevelAccess } from "../../models/userLevelAccess";

@Component({
    selector: 'app-program',
    templateUrl: './program-component.html',
    encapsulation: ViewEncapsulation.None,
})

export class ProgramComponent implements OnInit {
    @ViewChild("AddProgramComponent") addProgramComponent: TemplateRef<any>;
    @ViewChild("menuTrigger") trigger: MatMenuTrigger;
    @ViewChildren("permissionsPopup") permissionsPopup;
    @ViewChildren("archivePopup") archivePopup;
    dateKeys: any[] = [];
    selectedRowValue: any = [];
    anyOperationInProgress: boolean;
    data: any;
    archiveValue: any = false;
    programs: ProgramModel[] = [];
    isArchived: boolean = false;
    submittedResult: any;
    newItemId: any;
    dataSetId: any;
    selectedRowDetails: any;
    q88Form: any;
    roleRequired: any;
    userRequired: any;
    levelRequired: any;
    roles: any = [{ id: '1', roleName: 'Super Admin' }, { id: '2', roleName: 'Client' }];
    users: any; //[{ id: '1', userName: 'Srihari', roleId: '1' }, { id: '2', userName: 'Sirisha', roleId: '1' }, { id: '3', userName: 'Nishitha', roleId: '2' }, { id: '4', userName: 'Ankitha', roleId: '2' }, { id: '5', userName: 'Parithosh', roleId: '2' }];
    levels: any = [{ id: 'E78444E9-07F3-4FAA-BF91-CC1A664B54F9', level: 'Level 1 - Program Basic Information', levelName: 'Level - 1' }, { id: '98B3DA9D-2989-468F-9E12-16F1DBF97983', level: 'Level 2 - KPI & Tasks', levelName: 'Level - 2' }, { id: '8964657D-706D-472B-956A-95482C374E85', level: 'Level 3 - Budget & Investment', levelName: 'Level - 3' }];
    level1Id = 'E78444E9-07F3-4FAA-BF91-CC1A664B54F9';
    level2Id = '98B3DA9D-2989-468F-9E12-16F1DBF97983';
    level3Id = '8964657D-706D-472B-956A-95482C374E85';
    rolesTest: any;
    usersTest: any;
    levelsTest: any;
    rolesList: RoleModel[] = [];
    clientsList: ClientOutPutModel[] = [];
    selectedClients: ClientOutPutModel[] = [];
    fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    validationMessage: string;
    file = new FormControl();
    kpiListData: GridDataResult = {
        data: [],
        total: 0
    };

    state: State = {
        skip: 0,
        take: 10,
    };
    clientimageUrl: string;
    showFilter: any;
    constructor(private dialog: MatDialog, private router: Router, private livesService: LivesManagementService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService, private billingDashboardService: BillingDashboardService,
        private fileUploadService: FileUploadService, private userService: UserService) {
        this.submittedResult = null;
        this.dataSetId = null;
        this.getData();
        this.initForm();
    }

    ngOnInit() {
        this.getRoles();
        this.getClients();
    }

    getRoles() {
        var companyModel = new RoleModel();
        companyModel.isArchived = false;
        this.billingDashboardService.getRoles(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rolesList = response.data;
                this.cdRef.detectChanges()
            }
        });
    }

    getClients() {
        this.anyOperationInProgress = true;
        let clientSearchResult = new ClientSearchInputModel();;
        this.billingDashboardService.getClients(clientSearchResult)
            .subscribe((responseData: any) => {
                this.selectedRowValue = [];
                if (responseData.success) {
                    this.clientsList = responseData.data;
                }
            });
    }

    archive() {
        this.isArchived = !this.isArchived;
        this.getData();
    }

    categorizeData() {
        if (this.archiveValue) {
            this.programs = this.data.filter(x => x.isArchived == true);
        } else {
            this.programs = this.data.filter(x => x.isArchived == false);
        }
    }

    initForm() {
        this.q88Form = new FormGroup({
            role: new FormControl(null, Validators.compose([
                Validators.required
            ])),
            user: new FormControl(null, Validators.compose([
                Validators.required
            ])),
            level: new FormControl(null, Validators.compose([
                Validators.required
            ]))
        });
    }

    savePermissions() {
        var referenceText = this.q88Form.value.level.some(this.getReferenceTextForLevel3) ? this.level3Id : this.q88Form.value.level.some(this.getReferenceTextForLevel2) ? this.level2Id : this.level1Id;
        var model = {userIds: this.q88Form.value.user, levelIds: this.q88Form.value.level, programId: this.selectedRowDetails.programId, referenceText: referenceText};
        this.userService.upsertUserLevelAccess(model)
            .subscribe((res: any) => {
                if (res.success) {
                    this.toastr.success("Updated permissions for the program");
                }
                this.permissionsPopup.forEach((p) => p.closePopover());
                this.closePopup();
                this.selectedRowDetails = null;
            });
    }

    getReferenceTextForLevel3 = (level: any) => {
        return this.level3Id.toLowerCase() == level.toLowerCase();
    }

    getReferenceTextForLevel2 = (level: any) => {
        return this.level2Id.toLowerCase() == level.toLowerCase();
    }
    

    openProgramDialog() {
        if(this.selectedRowDetails) {
            this.dataSetId = this.selectedRowDetails.programId;
        } else {
            this.dataSetId = Guid.create().toString();
        }
        let dialogId = "app-kpi-dialog";
        const dialogRef = this.dialog.open(this.addProgramComponent, {
            minWidth: "80vw",
            minHeight: "50vh",
            maxHeight: "95vh",
            id: dialogId,
            data: {
                dialogId: dialogId,
                dataSetId: this.dataSetId,
                formComponents: FormComponents,
                isFromProgram: true,
                formData: this.selectedRowDetails ? this.selectedRowDetails.programData : null
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {

            } else if (result.formData) {
                this.submittedResult = result;
                this.clientimageUrl = result.imageUrl;
                this.upsertProgram();
            }
            this.submittedResult = null;
            this.selectedRowDetails = null;
            this.dataSetId = null;
        });
    }

    onActivate(event) {
        if (event.type == 'click') {
            this.router.navigate([
                "lives/program",
                event.dataItem.programId,
                'kpi'
            ]);
        }
    }

    emitEvent(event) {
        console.log(event);
        this.dateKeys = event;
    }


    upsertProgram() {
        this.anyOperationInProgress = true;
        let programModel = new ProgramModel();
        programModel.template = 'Programs';
        //programModel.dataSourceId = '2f764f6c-8144-44e1-91a8-ce16f4fdad56';
        programModel.dataSourceId = '56607d0a-8806-4306-a3ac-659ec0560e9c';
        programModel.programName = this.submittedResult.formData.programName;
        if (this.selectedRowDetails) {
            programModel.id = this.selectedRowDetails.programId;
            programModel.isNewRecord = false;
            programModel.programUniqueId = this.selectedRowDetails.programUniqueId;
        } else {
            programModel.id = this.dataSetId;
            programModel.isNewRecord = true;
            programModel.programUniqueId = null;
        }
        if (this.dateKeys.length > 0) {
            var unique = [...new Set(this.dateKeys)];
            unique.forEach((x: any) => {
                var value = this.submittedResult.formData[x];
                if (value.length > 0) {
                    var splitArray = value.split("T");
                    this.submittedResult.formData[x] = splitArray[0];
                }
            });
        }
        programModel.formData = JSON.stringify(this.submittedResult.formData);
        programModel.imageUrl = this.clientimageUrl;

        this.livesService.upsertProgram(programModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.anyOperationInProgress = false;
                    this.getData();
                    this.selectedRowDetails = null;
                    this.cdRef.detectChanges();
                }
                else {
                    this.anyOperationInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    deleteProgram() {
        this.anyOperationInProgress = true;
        let programData = new ProgramModel;
        programData = this.selectedRowDetails;
        programData.template = 'Programs';
        // programData.dataSourceId = '2f764f6c-8144-44e1-91a8-ce16f4fdad56';
        programData.dataSourceId = '56607d0a-8806-4306-a3ac-659ec0560e9c';
        programData.programName = this.selectedRowDetails.programData.programName;
        programData.id = this.selectedRowDetails.programId;
        programData.isArchived = !this.isArchived;
        this.livesService.upsertProgram(programData)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.anyOperationInProgress = false;
                    this.getData();
                    this.selectedRowDetails = null;
                    this.closeArchivePopUp();
                    this.cdRef.detectChanges();
                }
                else {
                    this.anyOperationInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    getData() {
        this.anyOperationInProgress = true;
        let programModel = new ProgramModel();
        programModel.template = 'Programs';
        programModel.isArchived = this.isArchived;
        this.livesService.getPrograms(programModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    if (responseData.data) {
                        this.programs = responseData.data;
                        this.kpiListData = {
                            data: responseData.data,
                            total: responseData.data?.length > 0 ? responseData.data?.length : 0,
                        }
                        this.programs.forEach(element => {
                            element.programData = JSON.parse(element.formData);
                            element.programData['imageUrl'] = element.imageUrl;
                        });
                    }
                    this.anyOperationInProgress = false;
                    this.cdRef.detectChanges();
                }
                else {
                    this.anyOperationInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }


    openOptionsMenu(data) {
        this.selectedRowDetails = data;
    }

    closePopup() {
        this.q88Form.reset();
        this.trigger.closeMenu();
    }

    getUsersBasedOnId() {
        var model = new UserLevelAccess();
        model.roleIds = this.q88Form.value.role;
        model.programId = this.selectedRowDetails.programId;
        this.userService.getUserLevelAccess(model)
            .subscribe((responseData: any) => {
                this.selectedRowValue = [];
                if (responseData.success) {
                    this.users = responseData.data;
                }
            });
    }

    changeValidators(type) {
        if (type == 'role') {
            this.getUsersBasedOnId();
        }
    }

    permissionsPopUpOpen(row, popUp) {
        popUp.openPopover();
    }

    closePermissionPopUp() {
        this.permissionsPopup.forEach((p) => p.closePopover());
        this.closePopup();
    }

    closeArchivePopUp() {
        this.archivePopup.forEach((p) => p.closePopover());
        this.closePopup();
    }

    archivePopUpOpen(row, popUp) {
        popUp.openPopover();
    }

    archiveItem() {

    }

    selectedRow(event) {

    }

    dataStateChange(event) {

    }

    clientuploadEventHandler(files: FileList) {
        //this.anyOperationInProgress = true;
        var file = files.item(0);
        var fileName = file.name;
        var fileExtension = fileName.split('.');
        if (this.fileTypes.includes(file.type)) {
            var moduleTypeId = 15;
            var formData = new FormData();
            formData.append("file", file);
            formData.append("isFromProfileImage", 'true');
            this.fileUploadService.UploadFile(formData, moduleTypeId).subscribe((response: any) => {
                if (response.data) {
                    this.clientimageUrl = response.data[0].filePath;
                    //this.anyOperationInProgress = false;
                }
                else {
                    this.validationMessage = response.apiResponseMessages;
                }
            })
        }
        else {
            this.toastr.error("Please select images with extension .jpg, .png, .jpeg");
        }
    }

      getLocation(item) {
        var a = item.toString();
        return a;
      }

}

