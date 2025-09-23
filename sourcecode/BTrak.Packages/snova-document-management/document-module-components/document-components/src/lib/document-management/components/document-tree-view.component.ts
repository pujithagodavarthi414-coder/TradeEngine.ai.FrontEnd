import { FolderTreeModel } from './../models/FolderTreeModel';
import { StoreManagementService } from './../services/store-management.service';
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, QueryList, ViewChildren, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchFolderModel } from '../models/search-folder-model';
import { TreeItemDropEvent, DropPosition, TreeItemLookup, DropAction } from '@progress/kendo-angular-treeview';
import { FolderModel } from '../models/folder-model';
import { ToastrService } from 'ngx-toastr';
import { FileModel } from '../models/file-model';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, tap } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import "../../globaldependencies/helpers/fontawesome-icons";
import { ActivatedRoute, Router } from '@angular/router';
import { FileActionTypes } from '@snovasys/snova-file-uploader';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../constants/constant-variables';
import { DatePipe } from '@angular/common';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';


const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);

const isFile = (name: string) => name.split('.').length > 1;

@Component({
    selector: 'my-document-tree-view',
    templateUrl: `document-tree-view.component.html`
})
export class DocumentTreeView extends CustomAppBaseComponent implements OnInit {
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChildren("upsertFolderFilePopup") upsertFolderFilePopup;
    @ViewChildren("upsertFolderPopup") upsertFolderPopup;
    @ViewChildren("deleteFolderFilePopup") deleteFolderFilePopup;

    @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }

    @Input("filesInput")
    set _filesInput(data: SearchFolderModel) {
        this.filesInput = data;
        if (this.filesInput) {
            this.getfolderView();
        }
    }

    @Input("selectedFolderId")
    set _selectedFolderId(data: any) {
        if (data) {
            this.index = null;
            this.findIndexCategorydata(data);
        }
    }

    @Input("updatedFileId")
    set _updatedFileId(data: any) {
        if (data) {
            this.getFileDetailsById(data, false);
        }
    }

    @Input("updatedFolderId")
    set _updatedFolderId(data: any) {
        if (data) {
            this.getFolderDetailsById(data, false);
        }
    }

    @Input("deletedFileId")
    set _deletedFileId(data: any) {
        if (data) {
            this.getFileDetailsById(data, true);
        }
    }

    @Input("deletedFolderId")
    set _deletedFolderId(data: any) {
        if (data) {
            this.getFolderDetailsById(data, true);
        }
    }

    @Input("storeDetails")
    set _storeDetails(data: any) {
        this.storeDetails = data;
    }

    @Input("isFileUploadCompleted")
    set _isFileUploadCompleted(data: any) {
        this.isFileUploadCompleted = data;
        if (this.isFileUploadCompleted) {
            this.getfolderView();
        }
    }

    @Input("isFolderUploadCompleted")
    set _isFolderUploadCompleted(data: any) {
        this.isFolderUploadCompleted = data;
        if (this.isFolderUploadCompleted) {
            this.getfolderView();
        }
    }

    @Input("isFromDocumentsApp")
    set _isFromDocumentsApp(data: boolean) {
        this.isFromDocumentsApp = data;
    }

    @Input("permissionToUpload")
    set _permissionToUpload(data: boolean) {
        this.permissionToUpload = data;
    }

    @Input("isTreeviewExpanded")
    set _isTreeviewExpanded(data: boolean) {
        if (data) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    @Output() fileDetails = new EventEmitter<any>();
    @Output() fileRename = new EventEmitter<any>();
    @Output() fileOrFolderMoved = new EventEmitter<any>();
    @Output() fileDetailsLength = new EventEmitter<any>();
    @Output() deleteFolderDetails = new EventEmitter<any>();
    @Output() parentFolderId = new EventEmitter<any>();
    @Output() isSubFolder = new EventEmitter<any>();
    @Output() folderDelete = new EventEmitter<any>();
    @Output() fileDelete = new EventEmitter<any>();
    folderTreeModel: FolderTreeModel[];
    userStoryId: string;
    isFileUploadCompleted: boolean = false;
    isFolderUploadCompleted: boolean = false;
    isFromDocumentsApp: boolean = false;
    permissionToUpload: boolean;
    isTreeviewExpanded: boolean;
    folderStructure: string;
    data: any[];
    loading: boolean = false;
    havePermission: Boolean;
    dashboardName: string;
    filesInput: SearchFolderModel;
    uploadFileForm: FormGroup;
    public selectedKeys: any[] = ['0'];
    keyIndexes: any = [];
    contextMenuPosition = { x: '0', y: '0' };
    selectedNodeDetails: any;
    isFolderEdit: boolean = false;
    isFolderDelete: boolean = false;
    isFileDelete: boolean = false;
    isFileRenameInprogress: boolean = false;
    index: any;
    recursiveIndex: any;
    filesList: any;
    parentFolderDeatilId: any;
    storeDetails: any;
    folderDetails: any;
    public allParentNodes = [];
    softLabels: SoftLabelConfigurationModel[];
    public expandKeys = this.allParentNodes.slice();

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Document store";
        }
    }

    public ngDestroyed$ = new Subject();

    constructor(private storeManagementService: StoreManagementService, private cookieService: CookieService,
        private actionUpdates$: Actions, private route: Router, private activatedRoute: ActivatedRoute,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService, private snackbar: MatSnackBar,
        private translateService: TranslateService, private datePipe: DatePipe,) {
        super();
        this.getSoftLabelConfigurations();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FileActionTypes.CreateFileCompleted),
                tap(() => {
                    this.getfolderView();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initializeFileForm();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    iconClass({ extension }: any): any {
        return {
            'k-i-file-pdf': (extension == '.PDF' || extension == '.pdf'),
            'k-i-folder': extension == null,
            'k-i-video-external': (extension == '.mp4' || extension == '.ogg' || extension == '.MP4' || extension == '.OGG'),
            'k-i-audio': (extension == '.mp3' || extension == '.wav' || extension == '.m3u' || extension == '.M3U' || extension == '.WAV' || extension == '.MP3' || extension == '.m4a' || extension == '.M4A'),
            'k-i-html': (extension == '.HTML' || extension == '.html'),
            'k-i-doc': (extension == '.doc' || extension == '.DOC' || extension == '.docx' || extension == '.DOCX'),
            'k-i-excel': (extension == '.XLS' || extension == '.XLSB' || extension == '.XLSX' || extension == '.xls' || extension == '.xlsb' || extension == '.xlsx'),
            'k-i-image': (extension == '.PNG' || extension == '.JPG' || extension == '.JPEG' || extension == '.jpeg' || extension == '.png' || extension == '.jpg'),
            'k-i-file': (extension != null && (extension.toLowerCase() != '.pdf' &&
                extension.toLowerCase() != '.mp4' && extension.toLowerCase() != '.ogg' &&
                extension.toLowerCase() != '.mp3' && extension.toLowerCase() != '.wav' &&
                extension.toLowerCase() != '.m3u' && extension.toLowerCase() != '.html' &&
                extension.toLowerCase() != '.doc' && extension.toLowerCase() != '.xlsx' &&
                extension.toLowerCase() != '.xlsb' && extension.toLowerCase() != '.png' &&
                extension.toLowerCase() != '.jpg' && extension.toLowerCase() != '.jpeg' &&
                extension.toLowerCase() != '.docx' && extension.toLowerCase() != '.xls')),
            // 'k-i-files': true,
            'k-icon': true
        };
    }

    getfolderView() {
        this.loading = true;
        if (this.filesInput) {
            const fileTreeModel = this.filesInput;
            fileTreeModel.isTreeView = true;
            this.storeManagementService.getTreeView(fileTreeModel).subscribe((response: any) => {
                if (response.success) {
                    this.folderStructure = response.data;
                    this.folderTreeModel = JSON.parse(this.folderStructure);
                    if (this.folderTreeModel.length > 0) {
                        let parentNode = this.folderTreeModel[0].folderId;
                        this.parentFolderDeatilId = parentNode;
                        this.parentFolderId.emit(parentNode);
                        // this.fileDetails.emit(this.folderTreeModel[0]);
                    }
                    // for (let i = 0; i < this.folderTreeModel.length; i++) {
                    //     this.keyIndexes.push(i.toString());
                    // }
                    this.fileDetailsLength.emit(this.folderTreeModel);
                    this.getParentTextProperties(this.folderTreeModel);
                    this.getAllTextProperties(this.folderTreeModel);
                    this.cdRef.markForCheck();
                    this.loading = false;
                }
                else {
                    this.loading = false;
                }
                this.cdRef.markForCheck();
            });
        }
    }

    getAllTextProperties(items: Array<any>) {
        items.forEach(i => {
            if (i.children) {
                this.allParentNodes.push(i.folderId);
                this.getAllTextProperties(i.children);
            }
        })
    }

    getParentTextProperties(items: Array<any>) {
        let parentLevels = [];
        items.forEach(element => {
            parentLevels.push(element.folderId);
        });
        if (this.expandKeys && this.expandKeys.length > 0) { } else {
            this.expandKeys = parentLevels;
        }
    }

    selecteNodeDetils(nodeDetails) {
        this.filesList = [];
        this.folderTreeModel.forEach(element => {
            if (element.folderId == nodeDetails.folderId) {
                nodeDetails.filesList = element.children;
            } else if (element.children && element.children.length > 0) {
                this.filterDetails(nodeDetails, element.children, nodeDetails.folderId);
                nodeDetails.filesList = this.filesList;
            }
        });
        this.fileDetails.emit(nodeDetails);
    }

    filterDetails(nodeDetails, childrenNodes, folderId) {
        childrenNodes.forEach(element => {
            if (element.folderId == folderId) {
                let fileDetails = element.children;
                if (fileDetails) {
                    let selectedFileIndex = fileDetails.findIndex(x => x.fileId == nodeDetails.fileId);
                    this.filesList.push(fileDetails[selectedFileIndex]);
                    fileDetails.splice(selectedFileIndex, 0);
                    fileDetails.forEach(element => {
                        this.filesList.push(element);
                    });
                }
            } else if (element.children && element.children.length > 0) {
                this.filterDetails(nodeDetails, element.children, folderId);
            }
        });
    }

    public keys: string[] = this.keyIndexes;

    /**
     * A function that checks whether a given node index exists in the expanded keys collection.
     * If the index can be found, the node is marked as expanded.
     */
    public isExpanded = (dataItem: any, index: string) => {
        return this.keys.indexOf(index) > -1;
    }

    expand() {
        this.expandKeys = this.allParentNodes.slice();

    }
    collapse() {
        this.expandKeys = [];
    }

    /**
     * A `collapse` event handler that will remove the node hierarchical index
     * from the collection, collapsing its children.
     */
    public handleCollapse(node) {
        this.keys = this.keys.filter(k => k !== node.index);
    }

    /**
     * An `expand` event handler that will add the node hierarchical index
     * to the collection, expanding the its children.
     */
    public handleExpand(node) {
        this.keys = this.keys.concat(node.index);
    }

    public getDragStatus(action: DropAction, destinationItem: TreeItemLookup): string {
        if (destinationItem && action === DropAction.Add && isFile(destinationItem.item.dataItem.text)) {
            return 'k-i-cancel';
        }

        switch (action) {
            case DropAction.Add: return 'k-i-plus';
            case DropAction.InsertTop: return 'k-i-insert-up';
            case DropAction.InsertBottom: return 'k-i-insert-down';
            case DropAction.InsertMiddle: return 'k-i-insert-middle';
            case DropAction.Invalid:
            default: return 'k-i-cancel';
        }
    }

    public log(event: string, args?: any): void {
        console.log(event, args);
    }

    public handleDrop(event: TreeItemDropEvent): void {
        this.log('nodeDrop', event);
        if (event.destinationItem.item.dataItem.filePath && event.dropPosition === DropPosition.Over) {
            event.setValid(false);
        }
        else if (event.sourceItem.item.dataItem.extension == null) {
            let folderDetails = new FolderModel();
            folderDetails.folderId = event.sourceItem.item.dataItem.folderId;
            folderDetails.parentFolderId = event.destinationItem.item.dataItem.folderId;
            folderDetails.folderName = event.sourceItem.item.dataItem.folderName;
            folderDetails.storeId = event.sourceItem.item.dataItem.storeId;
            folderDetails.folderReferenceId = event.sourceItem.item.dataItem.folderReferenceId;
            folderDetails.folderReferenceTypeId = event.sourceItem.item.dataItem.folderReferenceTypeId;
            folderDetails.timeStamp = event.sourceItem.item.dataItem.timeStamp;
            this.storeManagementService.upsertFolder(folderDetails).subscribe((response: any) => {
                if (response.success) {
                    this.fileOrFolderMoved.emit(folderDetails);
                    this.getFolderDetailsById(response.data, false);
                } else {
                    event.setValid(false);
                    this.toastr.warning(response.apiResponseMessages[0].message);
                }
            });
        }
        else {
            let fileDetails = new FileModel();
            fileDetails.fileId = event.sourceItem.item.dataItem.fileId;
            fileDetails.uploadFileId = event.sourceItem.item.dataItem.fileId;
            fileDetails.folderId = event.destinationItem.item.dataItem.folderId;
            fileDetails.fileName = event.sourceItem.item.dataItem.folderName;
            fileDetails.filePath = event.sourceItem.item.dataItem.filePath;
            fileDetails.fileSize = event.sourceItem.item.dataItem.fileSize;
            fileDetails.fileExtension = event.sourceItem.item.dataItem.extension;
            fileDetails.storeId = event.sourceItem.item.dataItem.storeId;
            fileDetails.referenceId = event.sourceItem.item.dataItem.folderReferenceId;
            fileDetails.referenceTypeId = event.sourceItem.item.dataItem.folderReferenceTypeId;
            fileDetails.timeStamp = event.sourceItem.item.dataItem.timeStamp;
            this.storeManagementService.upsertFileDetails(fileDetails).subscribe((response: any) => {
                if (response.success) {
                    this.fileOrFolderMoved.emit(fileDetails);
                    this.getFileDetailsById(fileDetails.fileId, false);
                } else {
                    event.setValid(false);
                    // this.toastr.warning(response.apiResponseMessages[0].message);
                }
            });
        }
    }

    upsertFolder(folderDetails: FolderModel) {
        this.storeManagementService.upsertFolder(folderDetails).subscribe((response: any) => {
            if (response.success) {
                this.getfolderView();
            } else {
                this.toastr.warning(response.apiResponseMessages[0].message);
            }
        });
    }

    openContextMenu(event: MouseEvent, selectedNodeData: any) {
        this.selectedNodeDetails = selectedNodeData;
        event.preventDefault();
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            this.contextMenuPosition.x = event.clientX.toString();
            this.contextMenuPosition.y = event.clientY.toString();
            contextMenu.openMenu();
        }
    }

    initializeFileForm() {
        this.uploadFileForm = new FormGroup({
            fileName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(800)
                ])
            )
        });
    }

    editFileFolderNamePopupOpen(selectedNodeData: any, upsertFolderFilePopup) {
        this.selectedNodeDetails = selectedNodeData;
        upsertFolderFilePopup.openPopover();
        if (this.selectedNodeDetails && this.selectedNodeDetails.extension != null) {
            this.selectedNodeDetails.fileName = this.selectedNodeDetails.fileName == null ? this.selectedNodeDetails.folderName : this.selectedNodeDetails.fileName;
            this.isFolderEdit = false;
            this.patchFolderForm(this.selectedNodeDetails);
        } else {
            this.isFolderEdit = true;
        }
    }

    deleteFolderFilePopupOpen(selectedNodeData: any, deleteFolderFilePopup) {
        this.selectedNodeDetails = selectedNodeData;
        this.deleteFolderDetails.emit(this.selectedNodeDetails);
        deleteFolderFilePopup.openPopover();
        if (this.selectedNodeDetails && this.selectedNodeDetails.extension != null) {
            this.selectedNodeDetails.fileName = this.selectedNodeDetails.fileName == null ? this.selectedNodeDetails.folderName : this.selectedNodeDetails.fileName;
            this.isFolderDelete = false;
            this.isFileDelete = true;
            this.patchFolderForm(this.selectedNodeDetails);
        } else {
            this.isFolderDelete = true;
            this.isFileDelete = false;
        }
    }

    patchFolderForm(fileModel: FileModel) {
        this.uploadFileForm = new FormGroup({
            fileName: new FormControl(fileModel.fileName,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            )
        })
    }

    closeUpsertFolderPopup(isFolderEdit) {
        this.upsertFolderFilePopup.forEach((p) => p.closePopover());
        if (isFolderEdit && this.selectedNodeDetails) {
            this.getFolderDetailsById(this.selectedNodeDetails.folderId, false);
        }
        this.isFolderDelete = false;
        this.isFileDelete = false;
        this.isFolderEdit = false;
        // this.trigger.closeMenu();
    }

    cancelFolderFileDelete(result) {
        this.deleteFolderFilePopup.forEach((p) => p.closePopover());
        if (result && this.isFolderDelete) {
            this.findFolderIndexCategorydata(this.folderTreeModel, this.selectedNodeDetails.folderId, null, true);
            if (this.isFromDocumentsApp) {
                this.folderDelete.emit();
            }
        } else if (result && this.isFileDelete) {
            this.findFileIndexCategorydata(this.folderTreeModel, this.selectedNodeDetails.fileId, null, true);
            if (this.isFromDocumentsApp) {
                this.fileDelete.emit();
            }
        }
        this.isFolderDelete = false;
        this.isFileDelete = false;
        this.isFolderEdit = false;
        // this.trigger.closeMenu();
    }

    upsertFileName() {
        this.isFileRenameInprogress = true;
        const fileModel = new FileModel();
        fileModel.fileId = this.selectedNodeDetails.fileId;
        fileModel.fileExtension = this.selectedNodeDetails.fileExtension;
        fileModel.fileName = this.uploadFileForm.get('fileName').value;
        fileModel.filePath = this.selectedNodeDetails.filePath;
        fileModel.fileSize = this.selectedNodeDetails.fileSize;
        fileModel.timeStamp = this.selectedNodeDetails.timeStamp;
        fileModel.isArchived = false;
        this.storeManagementService.upsertFileName(fileModel)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                if (!success) {
                    this.isFileRenameInprogress = false;
                    this.toastr.warning("", responseData.apiResponseMessages[0].message);
                } else {
                    this.getFileDetailsById(responseData.data, false);
                    this.closeUpsertFolderPopup(false);
                    this.isFileRenameInprogress = false;
                    this.filesInput = null;
                }
            })
    }

    public handleSelection({ index }: any): void {
        this.selectedKeys = [index];
    }

    public isItemSelected = (_: any, index: string) => this.selectedKeys.indexOf(index) > -1;

    findIndexCategorydata(folderId) {
        if (this.folderTreeModel) {
            for (let i = 0; i < this.folderTreeModel.length; i++) {
                if (this.folderTreeModel[i].folderId == folderId.toLowerCase()) {
                    this.index = i;
                    this.selectedKeys = [this.index.toString()];
                }
                else if (this.folderTreeModel[i].children && this.folderTreeModel[i].children.length > 0) {
                    let checkSubSections = this.recursiveFindIndexSectiondata(this.folderTreeModel[i].children, folderId, i);
                    if (checkSubSections != undefined)
                        this.selectedKeys = [this.index.toString()];
                }
            }
        }
    }

    recursiveFindIndexSectiondata(childList, folderId, index) {
        if (childList) {
            for (let i = 0; i < childList.length; i++) {
                if (childList[i].folderId == folderId.toString().toLowerCase()) {
                    this.index = this.index != null ? this.index.toString() + '_' + i.toString() : index.toString() + '_' + i.toString();
                    return this.index;
                }
                else if (childList[i].children && childList[i].children.length > 0) {
                    this.index = this.index != null ? this.index.toString() + '_' + i.toString() : index.toString() + '_' + i.toString();
                    let checkSubSections = this.recursiveFindIndexSectiondata(childList[i].children, folderId, i);
                    if (checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    getFileDetailsById(fileId, isDeletion) {
        let filesList = [];
        filesList.push(fileId);
        this.storeManagementService.getFilesById(filesList).subscribe((responseData: any) => {
            let details = responseData.data;
            this.fileRename.emit(details[0]);
            this.isFileRenameInprogress = false;
            this.findFileIndexCategorydata(this.folderTreeModel, details[0].fileId, details[0], isDeletion);
        });
    }

    getFolderDetailsById(folderId, isDeletion) {
        this.storeManagementService.getFolderDetailsById(folderId).subscribe((responseData: any) => {
            let details = responseData.data;
            this.findFolderIndexCategorydata(this.folderTreeModel, details.folderId, details, isDeletion);
        });
    }

    findFileIndexCategorydata(nodeDetails, fileId, fileDetails, isDeletion) {
        if (nodeDetails) {
            for (let i = 0; i < nodeDetails.length; i++) {
                if (nodeDetails[i].fileId == fileId) {
                    if (isDeletion) {
                        nodeDetails = nodeDetails.splice(i, 1);
                    }
                    else if (!isDeletion && fileDetails && !fileDetails.folderName) {
                        fileDetails.folderName = fileDetails.fileName;
                        fileDetails.extension = fileDetails.fileExtension;
                        fileDetails.folderReferenceId = fileDetails.referenceId;
                        fileDetails.folderReferenceTypeId = fileDetails.referenceTypeId;
                        fileDetails.children = nodeDetails[i].children;
                        nodeDetails[i] = fileDetails;
                    }
                    this.cdRef.detectChanges();
                }
                else if (nodeDetails[i].children && nodeDetails[i].children.length > 0) {
                    let checkSubSections = this.recursiveFindFileIndexSectiondata(nodeDetails[i].children, fileId, fileDetails, isDeletion);
                    if (checkSubSections != undefined && checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    recursiveFindFileIndexSectiondata(childList, fileId, fileDetails, isDeletion) {
        if (childList) {
            for (let i = 0; i < childList.length; i++) {
                if (childList[i].fileId == fileId) {
                    if (isDeletion) {
                        childList = childList.splice(i, 1);
                    }
                    else if (!isDeletion && fileDetails && !fileDetails.folderName) {
                        fileDetails.folderName = fileDetails.fileName;
                        fileDetails.extension = fileDetails.fileExtension;
                        fileDetails.folderReferenceId = fileDetails.referenceId;
                        fileDetails.folderReferenceTypeId = fileDetails.referenceTypeId;
                        fileDetails.children = childList[i].children;
                        childList[i] = fileDetails;
                    }
                    this.cdRef.detectChanges();
                }
                else if (childList[i].children && childList[i].children.length > 0) {
                    let checkSubSections = this.recursiveFindFileIndexSectiondata(childList[i].children, fileId, fileDetails, isDeletion);
                    if (checkSubSections != undefined && checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    findFolderIndexCategorydata(nodeDetails, folderId, fileDetails, isDeletion) {
        if (nodeDetails) {
            for (let i = 0; i < nodeDetails.length; i++) {
                if (nodeDetails[i].fileId == null && nodeDetails[i].folderId == folderId) {
                    if (isDeletion) {
                        nodeDetails = nodeDetails.splice(i, 1);
                    }
                    else if (!isDeletion) {
                        fileDetails.children = nodeDetails[i].children;
                        nodeDetails[i] = fileDetails;
                    }
                    this.cdRef.detectChanges();
                }
                else if (nodeDetails[i].children && nodeDetails[i].children.length > 0) {
                    let checkSubSections = this.recursiveFindFolderIndexSectiondata(nodeDetails[i].children, folderId, fileDetails, isDeletion);
                    if (checkSubSections != undefined && checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    recursiveFindFolderIndexSectiondata(childList, folderId, fileDetails, isDeletion) {
        if (childList) {
            for (let i = 0; i < childList.length; i++) {
                if (childList[i].fileId == null && childList[i].folderId == folderId) {
                    if (isDeletion) {
                        childList = childList.splice(i, 1);
                    }
                    else if (!isDeletion) {
                        fileDetails.children = childList[i].children;
                        childList[i] = fileDetails;
                    }
                    this.cdRef.detectChanges();
                }
                else if (childList[i].children && childList[i].children.length > 0) {
                    let checkSubSections = this.recursiveFindFolderIndexSectiondata(childList[i].children, folderId, fileDetails, isDeletion);
                    if (checkSubSections != undefined && checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    istoShowEditandDeleteIcons(dataItem) {
        let companyStoreId;
        let isStoreDataEditable;
        if (this.storeDetails && this.cookieService.get('CompanyName')) {
            let companyName = this.cookieService.get('CompanyName') + ' doc store';
            this.storeDetails.forEach(element => {
                if (element.storeName == companyName) {
                    companyStoreId = element.storeId;
                }
            });
        }
        this.activatedRoute.params.subscribe((routeParams) => {
            if (routeParams.storeId) {
                if (companyStoreId == routeParams.storeId) {
                    isStoreDataEditable = false;
                } else {
                    isStoreDataEditable = true;
                }
            }
        })

        if (this.route.url.includes("/projects/projectstatus") || isStoreDataEditable) {
            return true;
        } else {
            if (dataItem.fileId == null && this.parentFolderDeatilId == dataItem.folderId) {
                return false;
            } else {
                return true;
            }
        }
    }

    openFolderMenu(event: MouseEvent, viewChild: MatMenuTrigger, dataItem: any) {
        if (this.istoShowEditandDeleteIcons(dataItem)) {
            event.preventDefault();
            viewChild.openMenu();
        }
    }

    openFileMenu(event: MouseEvent, viewChild: MatMenuTrigger, dataItem: any) {
        if (this.istoShowEditandDeleteIcons(dataItem)) {
            event.preventDefault();
            viewChild.openMenu();
        }
    }

    copyFileUrl(dataItem) {
        const copyText = dataItem.filePath;
        const selBox = document.createElement("textarea");
        selBox.value = copyText;
        document.body.appendChild(selBox);
        selBox.select();
        selBox.setSelectionRange(0, 99999)   // For Mobile
        document.execCommand("copy");
        document.body.removeChild(selBox);
        this.snackbar.open(this.translateService.instant("USERSTORY.LINKCOPIEDSUCCESSFULLY"), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
    }

    downloadFile(file) {
        file.extension = file.extension == null ? file.fileExtension : file.extension;
        file.name = file.name == null ? file.folderName : file.name;
        let extension = file.extension;
        if (extension == ".pdf") {
            this.downloadPdf(file.filePath, file.folderName, file.extension);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = file.filePath;
            downloadLink.target = "_blank";
            downloadLink.download = file.folderName + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + "-File" + file.fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf, fileName, extension) {
        let fileType;
        fileType = extension == ".pdf" ? "data:application/pdf;base64," : (extension == ".xls" || extension == ".xlsx") ?
            "data:application/vnd.ms-excel," : null;
        this.storeManagementService.downloadFile(pdf).subscribe((responseData: any) => {
            const linkSource = fileType + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + extension;
            downloadLink.click();
        })
    }

    openPreview(file) {
        this.selecteNodeDetils(file);
    }

    addFolderFromParent(dataItem, upsertFolderPopover) {
        this.folderDetails = dataItem;
        upsertFolderPopover.openPopover();
    }

    closeFolderPopup(event) {
        if (event) {
            this.isSubFolder.emit();
            this.getfolderView();
        }
        this.upsertFolderPopup.forEach((p) => p.closePopover());
    }
}