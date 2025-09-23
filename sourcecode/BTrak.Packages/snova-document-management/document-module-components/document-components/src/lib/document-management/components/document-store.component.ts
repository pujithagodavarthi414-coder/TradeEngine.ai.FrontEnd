import { Component, ViewChildren, Input, Output, EventEmitter } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { FileModel } from "../models/file-model";
import { SprintModel } from "../models/sprints-model";
import { FolderModel } from "../models/folder-model";
import { SearchFolderModel } from "../models/search-folder-model";
import { GoalModel } from "../models/GoalModel";
import { FileElement } from '../models/file-element-model';
import "../../globaldependencies/helpers/fontawesome-icons";


@Component({
    selector: "app-document-store",
    templateUrl: "./document-store.component.html"
})

export class DocumentStoreComponent extends CustomAppBaseComponent {
    @ViewChildren("upsertFolderPopup") upsertFolderPopup;

    @Output() getDocumentStore = new EventEmitter<string>();
    @Output() getGoalCalenderView = new EventEmitter<string>();
    @Output() getGoalRelatedBurnDownCharts = new EventEmitter<string>();
    @Output() eventClicked = new EventEmitter<any>();
    @Output() getReportsBoard = new EventEmitter<boolean>();
    @Output() getCalenderViewClicked = new EventEmitter<boolean>();
    @Output() getGoalEmployeeTaskBoard = new EventEmitter<any>();

     @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }

    @Input("fileElement")
    set fileElement(data: FileElement) {
        this.folderReferenceId = data.folderReferenceId;
        this.folderReferenceTypeId = data.folderReferenceTypeId;
        this.isEnabled = data.isEnabled;
        this.isFromSprints = data.isFromSprints;
        this.getFolders();
    }

    @Input("isComponentRefresh")
    set _isComponentRefresh(data: boolean) {
        this.isComponentRefresh = data;
    }
    
    @Input("isFromAudits")
    set _isFromAudits(data: any) {
        this.isFromAudits = data;
    }

    @Input("isFromConducts")
    set _isFromConducts(data: any) {
        this.isFromConducts = data;
    }

    @Input("isFromConductUnique")
    set _isFromConductUnique(data: any) {
        this.isFromConductUnique = data;
    }

    @Input("goal") goal: GoalModel;
    @Input("sprint") sprint: SprintModel;
    userStoryId: any;
    isComponentRefresh: boolean;
    isFromSprints: boolean;
    selectedStoreId: string;
    selectedParentFolderId: string;
    isFolder: boolean;
    moduleTypeId: number = 9;
    isButtonVisible: boolean = true;
    isUserStore: boolean = false;
    userStoreId: string;
    folderReferenceId: string;
    folderReferenceTypeId: string;
    isUsersParentStore: boolean = false;
    isFromAudits:boolean = false;
    isFromConducts:boolean = false;
    isFromConductUnique:boolean = false;
    validationMessage: string;
    tab: string;
    projectId: string;
    isEnabled: boolean;
    description: string;
    isEditorVisible: boolean;
    canAccess_feature_ViewStores: Boolean;
    showTreeView: boolean = true;

    editFolderDetails: FolderModel;

    //Variables Related to gallery
    anyOperationInProgress$: Observable<boolean>;
    userStoreId$: Observable<string>;
    isGrid: boolean = false;
    isCalenderView: boolean = false;
    isReportsPage: boolean = false;
    isEmployeeTaskBoardPage: boolean = false;
    isTheBoardLayoutKanban: boolean;
    filesInput: SearchFolderModel;
    showCheckBox: boolean;
    selectedFileDetails: FileModel;
    isFileRenameInprogress: boolean = false;

    public ngDestroyed$ = new Subject();

    constructor() {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getFolders() {
        const searchFolderModel = new SearchFolderModel();
        if (this.selectedStoreId) {
            searchFolderModel.storeId = this.selectedStoreId;
        }
        if (this.selectedParentFolderId) {
            searchFolderModel.parentFolderId = this.selectedParentFolderId;
        }
        if (this.folderReferenceId) {
            searchFolderModel.folderReferenceId = this.folderReferenceId;
        }
        if (this.folderReferenceTypeId) {
            searchFolderModel.folderReferenceTypeId = this.folderReferenceTypeId;
        }
        searchFolderModel.isArchived = false;;
        searchFolderModel.sortDirectionAsc = false;
        searchFolderModel.isFromSprints = this.isFromSprints;
        this.filesInput = searchFolderModel;
    }

    addUpsertFolderPopup(upsertFolderPopover) {
        this.editFolderDetails = null;
        upsertFolderPopover.openPopover();
    }

    closeUpsertFolderPopup() {
        this.upsertFolderPopup.forEach((p) => p.closePopover());
        this.editFolderDetails = null;
    }

    getDocumentView(event) {
        this.getDocumentStore.emit("");
    }

    getCalanderView(event) {
        this.getGoalCalenderView.emit("");
    }

    getChartDetails(event) {
        this.getGoalRelatedBurnDownCharts.emit("");
    }

    getCalenderViewDetails(event) {
        this.getCalenderViewClicked.emit(true);
    }

    clickAfterEvent(event) {
        this.eventClicked.emit(event);
    }

    boardChange(event) {
        this.eventClicked.emit(event);
    }

    reportsBoardClicked() {
        this.getReportsBoard.emit(true);
    }

    getEmployeeTaskBoard(event) {
        this.getGoalEmployeeTaskBoard.emit('');
    }

    setParentFolderDetails(fileDetails) {
        if (fileDetails.dataItem) {
            this.selectedParentFolderId = fileDetails.dataItem.folderId;
        } else if (fileDetails.folderId) {
            this.selectedParentFolderId = fileDetails.folderId;
        }
        else {
            this.selectedParentFolderId = fileDetails;
        }
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
    }

}
