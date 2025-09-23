import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, HostListener } from "@angular/core";
import { TemplateModel } from "../../models/templates-model";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { GetTemplatessTriggered, TemplateActionTypes } from "../../store/actions/templates.action";
import { Observable, Subject } from "rxjs";
import * as projectModuleReducers from "../../store/reducers/index";
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UserStory } from "../../models/userStory";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
@Component({
  selector: "app-pm-component-templates",
  templateUrl: "templates-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesListComponent implements OnInit {
  @Input('projectId')
  set _projectId(data: string) {
    this.projectId = data;
    this.getTemplatesList();
  }
  @ViewChildren('addTemplatePopup') addTemplatePopUp;
  templatesModel$: Observable<TemplateModel[]>;
  anyOperationInProgress$: Observable<boolean>;
  templatesCount$: Observable<number>;
  projectSummaryLoading$: Observable<boolean>;
  projectId: string;
  templateWorkItemModel: UserStorySearchCriteriaInputModel;
  template: TemplateModel;
  workItem: UserStory;
  isTemplate: boolean;
  templateModel$: Observable<TemplateModel>;
  softLabels: SoftLabelConfigurationModel[];
  templateModelList: TemplateModel[] = [];
  templateModel: TemplateModel;
  openTemplateForm: boolean;
  templateId: string;
  showDiv: boolean;
  searchText: string;
  isNewDialog: boolean;
  clearCreateForm: boolean;
  refreshUserStoriesCall: boolean;
  selectedTemplateId: string;
  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>,
    private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TemplateActionTypes.GetTemplatesCompleted),
        tap(() => {
          this.templatesModel$ = this.store.pipe(
            select(projectModuleReducers.getTemplatesAll));
          this.templatesModel$.subscribe(x => this.templateModelList = x);
          if (this.templateModelList.length > 0) {
            this.refreshUserStoriesCall = true;
            this.template = this.templateModelList[0];
            this.browseTemplateUserStories();
          }
        })
      )
      .subscribe();

      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TemplateActionTypes.ArchiveTemplatesCompleted),
        tap(() => {
          this.templatesModel$ = this.store.pipe(
            select(projectModuleReducers.getTemplatesAll));
          this.templatesModel$.subscribe(x => this.templateModelList = x);
          if (this.templateModelList.length > 0) {
            this.refreshUserStoriesCall = true;
            this.template = this.templateModelList[0];
            this.browseTemplateUserStories();
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TemplateActionTypes.UpdateTemplatesField),
        tap(() => {
          this.templatesModel$ = this.store.pipe(
            select(projectModuleReducers.getTemplatesAll));
          this.templatesModel$.subscribe(x => this.templateModelList = x);
          if (this.templateModelList.length > 0) {
            this.refreshUserStoriesCall = false;
            this.templateModel$ = this.store.pipe(select(projectModuleReducers.getTemplateById));
            this.templateModel$.subscribe(x => this.templateModel = x);
            if (this.templateModel && this.templateModel.templateId === this.selectedTemplateId) {
              this.template = this.templateModel;
            }
            else {
              this.template = this.template;
            }
            this.browseTemplateUserStories();
          }
        })
      )
      .subscribe();

      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TemplateActionTypes.RefreshTemplatesList),
        tap(() => {
          this.templatesModel$ = this.store.pipe(
            select(projectModuleReducers.getTemplatesAll));
          this.templatesModel$.subscribe(x => this.templateModelList = x);
          if (this.templateModelList.length > 0) {
            this.refreshUserStoriesCall = true;
            this.template = this.templateModelList[0];
            this.browseTemplateUserStories();
          }
        })
      )
      .subscribe();

  }

  ngOnInit() {
    this.templatesModel$ = this.store.pipe(select(projectModuleReducers.getTemplatesAll));
    this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducers.getTemplatesLoading))
    this.templatesCount$ = this.store.pipe(select(projectModuleReducers.templatesCount));
    this.projectSummaryLoading$ = this.store.pipe(select(projectModuleReducers.getProjectViewStatusLoading))
    if (window.matchMedia("(min-width: 768px)").matches) {
      this.showDiv = true;
    }
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
  }

  getTemplatesList() {
    var templatesModel = new TemplateModel();
    templatesModel.projectId = this.projectId;
    this.store.dispatch(new GetTemplatessTriggered(templatesModel));
  }

  clearTemplateForm(addTemplatePopup) {
    this.clearCreateForm = !this.clearCreateForm;
    addTemplatePopup.openPopover();
  }

  closeSearch() {
    this.searchText = null;
  }

  browseTemplateUserStories() {
    this.selectedTemplateId = this.template.templateId;
    var searchCriteriaModel = new UserStorySearchCriteriaInputModel();
    searchCriteriaModel.templateId = this.selectedTemplateId;
    searchCriteriaModel.refreshUserStoriesCall = this.refreshUserStoriesCall;
    this.templateWorkItemModel = searchCriteriaModel;
  }

  handleClickOnGoalSummaryComponent(templateModel) {
    this.selectedTemplateId = templateModel.templateId;
    var searchCriteriaModel = new UserStorySearchCriteriaInputModel();
    searchCriteriaModel.templateId = this.selectedTemplateId;
    searchCriteriaModel.refreshUserStoriesCall = true;
    this.templateWorkItemModel = searchCriteriaModel;
    this.template = templateModel;
    this.cdRef.detectChanges();
  }

  closeTemplateDialog(event) {
    if (event == "new") {
      this.isNewDialog = false;
    } else {
      this.isNewDialog = true;
    }
    this.addTemplatePopUp.forEach((p) => p.closePopover());
  }

  selectedEvent(userStory) {
    this.workItem = userStory;
    if (window.matchMedia("(max-width: 768px)").matches) {
      this.showDiv = false;
    } else {
      this.showDiv = true;
    }
  }

  userStoryCloseClicked() {
    this.workItem = null;
    this.cdRef.detectChanges();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }


  @HostListener("window:resize", ["$event"])
  sizeChange(event) {
    if (window.matchMedia("(max-width: 768px)").matches) {
      this.showDiv = false;
    } else {
      this.showDiv = true;
    }
  }
}