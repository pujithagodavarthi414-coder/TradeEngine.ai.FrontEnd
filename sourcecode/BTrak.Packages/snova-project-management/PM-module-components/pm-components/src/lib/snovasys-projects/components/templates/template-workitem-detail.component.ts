import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, ViewChildren, Type, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ToastrService } from "ngx-toastr";
import { Store, select } from "@ngrx/store";
import { Subject, EmptyError, empty } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";
import { ofType, Actions } from "@ngrx/effects";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "underscore";
import * as projectModuleReducers from "../../store/reducers/index";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { UserStory } from "../../models/userStory";
import { WorkflowStatus } from "../../models/workflowStatus";
import { WorkItemActionTypes, UpsertWorkItemTriggered } from "../../store/actions/template-userstories.action";

import { TabStripComponent } from "@progress/kendo-angular-layout";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { TranslateService } from '@ngx-translate/core';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CustomFormFieldModel } from '../../models/custom-fileds-model';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { ProjectModulesService } from '../../services/project.modules.service';
import { CustomFieldsComponent } from "@snovasys/snova-custom-fields";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  // tslint:disable-next-line:component-selector
  selector: "template-userstory-detail",
  templateUrl: "template-workitem-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateWorkItemComponent extends AppFeatureBaseComponent implements OnInit {

  @Input("userStory")
  set _userStoryId(data: any) {
    if (data) {
      if (this.tabstrip) {
        Promise.resolve(null).then(() => this.tabstrip.selectTab(0));
      }
      this.isEditorVisible = false;
      this.showEstimatedTime = false;
      this.isEditUserStory = true;
      this.userStoryId = data.userStoryId;
      this.formReferenceTypeId = data.userStoryTypeId;
      this.userStoryData = data;
      this.loadUserStoryData();
    }
  }
  @ViewChild('tabstrip')  tabstrip: TabStripComponent;
  @Output() userStoryCloseClicked = new EventEmitter<any>();
  @ViewChild('fileUpload') fileUploadExample: ElementRef;
  @ViewChildren("FileUploadPopup") FileUploadPopup;
  timeStamp: any;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  customFields$: Observable<CustomFormFieldModel[]> = empty();
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  userStoryIsInProgress$: Observable<boolean>;
  customFieldsInProgress$: Observable<boolean>;
  descriptionLoading$: Observable<boolean>;
  //uploadedFiles$: Observable<FileInputModel[]>;
  userStory$: Observable<UserStory>;
  filesUploaded: any;
  formReferenceTypeId: string;
  moduleTypeId: number = 4;
  userStoryTypes: UserStoryTypesModel[];
  bugUserStoryTypeModel: UserStoryTypesModel;
  userStoryTypeModel: UserStoryTypesModel;
  workflowStatus: WorkflowStatus[];
  isFileUpload: boolean;
  userStory: UserStory;
  versionName: string;
  userStoryName: string;
  estimatedTimeSet: any;
  estimatedTime: any;
  userStoryTypeId: string;
  projectId: string;
  isEditUserStory: boolean = true;
  selectedIndex: string = "GENERAL";
  ProjectId: string;
  userStoryId: string;
  selectedStoreId: null;
  referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
  isButtonVisible: boolean = true;
  userStoryData: any;
  onBoardProcessDate: Date;
  showEstimatedTime: boolean = false;
  descriptionSlug: any;
  description: string;
  canAccess_feature_CanSubmitCustomFieldsForProjectManagement: Boolean;
  isEditorVisible: boolean = false;
  isExtension: boolean = false;
  public ngDestroyed$ = new Subject();
  injector: any;
  customFieldComponent: any;
  customFieldModuleLoaded: boolean;

  public initSettings = {
    selector: '.dfree-header',
    menubar: false,
    inline: true,
    theme: 'inlite',
    insert_toolbar: 'undo redo',
    selection_toolbar: 'bold italic | h2 h3 | blockquote quicklink'
  };

  public initSettings1 = {
    plugins: "paste lists advlist",
    branding:false,
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  constructor(private store: Store<projectModuleReducers.State>,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private actionUpdates$: Actions,
    public dialog: MatDialog,
    private translateService: TranslateService,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private ngModuleRef: NgModuleRef<any>, private compiler: Compiler,
    private vcr: ViewContainerRef,
    private softLabelsPipe: SoftLabelPipe
  ) {
    super();
    this.injector = this.vcr.injector;
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(WorkItemActionTypes.UpsertWorkItemCompleted),
        tap(() => {
          this.isEditUserStory = true;
        })
      )
      .subscribe();

      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(WorkItemActionTypes.UpsertWorkItemFailed),
        tap(() => {
          this.loadUserStoryData();

        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(WorkItemActionTypes.GetWorkItemByIdCompleted),
        tap(() => {
          this.userStory$ = this.store.pipe(select(projectModuleReducers.getWorkItemById));
          this.userStory$.subscribe(x => this.userStory = x);
          this.timeStamp = this.userStory.timeStamp;
          this.userStoryData = this.userStory;
          this.loadUserStoryData();
          this.isEditorVisible = false;
          this.showEstimatedTime = false;
          this.isEditUserStory = true;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadCustomFieldModule();
    this.getSoftLabelConfigurations();
    this.userStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducers.upsertworkItemsLoading)
    );
    this.customFieldsInProgress$ = this.store.pipe(select(projectModuleReducers.loadingSearchCustomFields));
    let roleFeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.canAccess_feature_CanSubmitCustomFieldsForProjectManagement = _.find(roleFeatures, function (role: any){ return role.featureId.toLowerCase() == FeatureIds.Feature_CanSubmitCustomFieldsForProjectManagement.toString().toLowerCase(); }) != null;

  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  getSoftLabelConfigurations() {
   this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  closeUserStoryDetailWindow() {
    this.userStory = null;
    this.userStoryCloseClicked.emit();
  }

  loadUserStoryData() {
    this.userStoryName = this.userStoryData.userStoryName;
    this.estimatedTime = this.userStoryData.estimatedTime;
    this.estimatedTimeSet = this.estimatedTime;
    this.userStoryTypeId = this.userStoryData.userStoryTypeId;
    this.projectId = this.userStoryData.projectId;
    this.timeStamp = this.userStoryData.timeStamp;
    this.descriptionSlug = this.userStoryData.description;
    this.description =  this.userStoryData.description;
  }


  saveUserStory() {
    const userStory = new UserStory();
    userStory.userStoryName = this.userStoryName;
    userStory.userStoryId = this.userStoryData.userStoryId;
    userStory.timeStamp = this.timeStamp;
    userStory.templateId = this.userStoryData.templateId;
    userStory.estimatedTime = this.estimatedTimeSet;
    userStory.userStoryTypeId = this.userStoryData.userStoryTypeId;
    userStory.description = this.description;
    this.store.dispatch(
      new UpsertWorkItemTriggered(userStory)
    );
  }

  openEstimatedTime() {
    this.showEstimatedTime = !this.showEstimatedTime;
  }

  changeEstimatedTime(estimatedTime) {
    if (estimatedTime === 'null') {
      this.estimatedTimeSet = null;
    }
    else {
      this.estimatedTimeSet = estimatedTime;
    }
    if (this.estimatedTimeSet != null) {
      this.estimatedTimeSet = estimatedTime;
      this.saveUserStory();
    }
  }

  showMatFormField() {
    if(this.selectedIndex === 'GENERAL') {
      this.isEditUserStory = false;
    }
    else {
      this.isEditUserStory = true;
    }
  }

  updateUserStoryName() {
    if (this.userStoryName) {
      this.saveUserStory();
    }
    else {
      const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEENTERUSERSTORYNAME'), this.softLabels);
      this.toastr.warning("", message);
    }
  }

  openCustomForm() {
    // const formsDialog = this.dialog.open(CustomFormsComponent, {
    //   height: '62%',
    //   width: '60%',
    //   hasBackdrop: true,
    //   direction: "ltr",
    //   data: { moduleTypeId: this.moduleTypeId, referenceId: this.userStoryId, referenceTypeId: this.projectId, customFieldComponent: null },
    //   disableClose: true,
    //   panelClass: 'custom-modal-box'
    // });
    // formsDialog.componentInstance.closeMatDialog.subscribe(() => {
    //   this.dialog.closeAll();
    // });

  }

  checkIsDeletePermission(isDelete) {
    if (isDelete) {
      return true;
    } else {
      return false;
    }
  }

  checkIsAddPermission(isAdd) {
    if (isAdd) {
      return true;
    } else {
      return false;
    }
  }

  checkIsEditPermission(isUserStory) {
    if (isUserStory) {
      return true;
    } else {
      return false;
    }
  }

  enableEditor() {
    this.isEditorVisible = true;
  }

  handleDescriptionEvent(event) {
    this.description = this.descriptionSlug;
    this.saveUserStory();
  }

  descriptionReset() {
    this.description = this.userStoryData.description;
    this.descriptionSlug = this.description;
  }

  cancelDescription() {
    this.isEditorVisible = false;
    this.descriptionSlug = this.userStoryData.description;
  }

  public onTabSelect(tabIndex) {
    if (tabIndex.index === 0) {
      this.selectedIndex = 'GENERAL';
    }
    else {
      this.selectedIndex = '';
    }
  }

  loadCustomFieldModule(){
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any){ return module.modulePackageName == 'CustomFieldsPackageModule' });

    if(!module){
        console.error("No module found for CustomFieldsPackageModule");
    }

    var path = loader[module.modulePackageName];

        (path() as Promise<NgModuleFactory<any> | Type<any>>)
            .then(elementModuleOrFactory => {
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    // if ViewEngine
                    return elementModuleOrFactory;
                } else {
                    try {
                        // if Ivy
                        return this.compiler.compileModuleAsync(elementModuleOrFactory);
                    } catch (err) {
                        throw err;
                    }
                }
            })
      .then((moduleFactory: NgModuleFactory<any>) => {

        const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        var allComponentsInModule = (<any>componentService).components;

        this.ngModuleRef = moduleFactory.create(this.injector);

        var componentDetails = allComponentsInModule.find(elementInArray =>
            elementInArray.name.toLocaleLowerCase() === "Custom field comp".toLocaleLowerCase()
        );
        this.customFieldComponent = {};
        this.customFieldComponent.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.customFieldComponent.inputs = {
          moduleTypeId: this.moduleTypeId,
          referenceTypeId: this.formReferenceTypeId,
          referenceId: this.userStoryId,
          isEditFieldPermission: this.canAccess_feature_CanSubmitCustomFieldsForProjectManagement
        };

        this.customFieldComponent.outputs = {};
        this.customFieldModuleLoaded = true;

        this.cdRef.detectChanges();
    });    
  }

}

