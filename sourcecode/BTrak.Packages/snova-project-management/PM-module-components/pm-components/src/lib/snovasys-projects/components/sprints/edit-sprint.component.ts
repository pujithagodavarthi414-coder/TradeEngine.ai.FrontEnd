import { ChangeDetectionStrategy, Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, ViewChild, ElementRef, ViewChildren, QueryList, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, Type, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { SprintModel } from "../../models/sprints-model";
import { Store, select } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { State } from "../../store/reducers/index";
import * as _ from "underscore";
import * as projectModuleReducers from "../../store/reducers/index";
import { takeUntil, tap } from "rxjs/operators";
import { ofType, Actions } from "@ngrx/effects";
import { SprintActionTypes, UpsertSprintsTriggered } from "../../store/actions/sprints.action";
import { Subject, Observable } from "rxjs";
import { BoardTypesActionTypes } from "../../store/actions/board-types.action";
import { BoardType } from "../../models/boardtypes";
import { boardTypeapi } from "../../models/boardTypeApi";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProjectMember } from "../../models/projectMember";
import { ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { TestSuiteList } from '../../models/testsuite';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as testRailModuleReducers from "@snovasys/snova-testrepo";
import { ProjectModulesService } from '../../services/project.modules.service';
import { TestSuiteEditComponent } from "@snovasys/snova-testrepo";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "app-edit-sprint",
    templateUrl: "edit-sprint.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})


export class EditSprintComponent extends AppFeatureBaseComponent implements OnInit {
    testSuitEdit: any = {};
    @Input("sprint")
    set _sprint(data: SprintModel) {
        this.sprint = data;
        this.boardTypeId = this.sprint.boardTypeId;
        this.description = this.sprint.description;
        this.initializeSprintsForm();
        this.sprintForm.patchValue(this.sprint);
    }
    @Input("isEnableTestRepo")
    set _isEnableTestRepo(data: boolean) {
        this.isEnableTestRepo = data;
    }
    @Output() closeEditSprintPopUp = new EventEmitter<string>();
    @ViewChildren("addTestSuitePopover") addTestSuitePopovers;
    boardTypes$: Observable<BoardType[]>;
    boardTypesApi$: Observable<boardTypeapi[]>;
    testSuitesList$: Observable<TestSuiteList[]>;
    sprintOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    projectMembers$: Observable<ProjectMember[]>;
    softLabels: SoftLabelConfigurationModel[];
    projectMembers: ProjectMember[];
    boardTypes: BoardType[];
    boardTypeId: string;
    selectedMember: string;
    description: string;
    sprint: SprintModel;
    sprintModel: SprintModel;
    sprintForm: FormGroup;
    showAPI: boolean;
    isDescriptionValidation: boolean;
    showVersion: boolean;
    showTestSuite: boolean;
    isEnableTestRepo: boolean;
    loadAddTestSuite: boolean;
    public ngDestroyed$ = new Subject();
    injector: any;
    
  public initSettings = {
    plugins: "paste lists advlist",
    branding: false,
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

    constructor(private store: Store<State>, private actionUpdates$: Actions, private translateService: TranslateService,
        private ngModuleRef: NgModuleRef<any>,
        private compiler: Compiler,
        @Inject('ProjectModuleLoader') public projectModulesService: any,
        private vcr: ViewContainerRef,
        private cdRef: ChangeDetectorRef, private testRailStore: Store<testRailModuleReducers.State>) {
        super();
        this.injector = this.vcr.injector;
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.UpsertSprintsCompleted),
                tap(() => {
                    this.closeSprintPopup();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(BoardTypesActionTypes.LoadBoardTypesCompleted),
                tap(() => {
                    this.boardTypes$ = this.store.pipe(select(projectModuleReducers.getBoardTypesAll),
                        tap((result) => {
                            if (result) {
                                this.boardTypes = result;
                                if (this.sprint) {
                                    this.selectConfiguration(this.sprint.boardTypeId);
                                }
                            }
                        }));
                })

            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
                tap(() => {
                    this.projectMembers$ = this.store.pipe(select(projectModuleReducers.getProjectMembersAll),
                        tap((result) => {
                            if (result) {
                                this.projectMembers = result;
                                if (this.sprint) {
                                    this.getAssigneeValue(this.sprint.sprintResponsiblePersonId);
                                }
                            }
                        }));
                })

            )
            .subscribe();
    }

    initializeSprintsForm() {
        this.sprintForm = new FormGroup({
            sprintName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
            description: new FormControl('', []),
            boardTypeId: new FormControl('', Validators.compose([Validators.required])),
            boardTypeApiId: new FormControl('', []),
            version: new FormControl('', []),
            testSuiteId: new FormControl('', []),
            sprintResponsiblePersonId: new FormControl('', [])
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.boardTypes$ = this.store.pipe(select(projectModuleReducers.getBoardTypesAll));
        this.boardTypesApi$ = this.store.pipe(select(projectModuleReducers.getBoardTypesApiAll));
        this.testSuitesList$ = this.testRailStore.pipe(select(testRailModuleReducers.getTestSuiteAll));
        this.sprintOperationInProgress$ = this.store.pipe(select(projectModuleReducers.upsertSprintsLoading));
        this.projectMembers$ = this.store.pipe(select(projectModuleReducers.getProjectMembersAll));
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    selectConfiguration(boardTypeId) {
        let isBugBoard = false;
        if (this.boardTypes && this.boardTypes.length > 0) {
            const index = this.boardTypes.findIndex((x: { boardTypeId: any; }) => x.boardTypeId === boardTypeId);
            isBugBoard = this.boardTypes[index].isBugBoard;
        }

        if (boardTypeId === ConstantVariables.BoardTypeIdForAPI) {
            this.showAPI = true;
            this.showVersion = false;
            this.showTestSuite = false;
            this.sprintForm.controls["version"].setValue("");
            this.sprintForm.controls["testSuiteId"].setValue("");

        } else if (isBugBoard) {
            this.showAPI = false;
            this.showVersion = true;
            this.showTestSuite = false;
            this.sprintForm.controls["testSuiteId"].setValue("");
            this.sprintForm.controls["boardTypeApiId"].setValue("");
        } else {
            this.showAPI = false;
            this.showVersion = false;
            this.showTestSuite = true;
            this.sprintForm.controls["boardTypeApiId"].setValue("");
            this.sprintForm.controls["version"].setValue("");
        }

    }

    checkMaxLengthValidation(event) {
        this.sprintForm.controls["version"].setValidators([
            Validators.maxLength(50)
        ]);
        this.sprintForm.get("version").updateValueAndValidity();
    }


    getAssigneeValue(selectedEvent) {
        const projectMembers = this.projectMembers;
        // tslint:disable-next-line: only-arrow-functions
        const filteredList = _.find(projectMembers, function (member) {
            return member.projectMember.id === selectedEvent;
        })
        if (filteredList) {
            this.selectedMember = filteredList.projectMember.name;
            this.cdRef.detectChanges();
        }
    }

    checkCharactersLength(comments) {
        const description = comments.event.target.textContent.length;
        if (description.length > 800) {
            this.isDescriptionValidation = true;
        } else {
            this.isDescriptionValidation = false;
        }
    }

    changeTestSuiteId(event) {
        if(event == 0) {
          this.sprintForm.controls['testSuiteId'].setValue('');
        }
      }


    saveSprint() {
        if (this.boardTypeId != this.sprintForm.value.boardTypeId) {
            localStorage.setItem("boardtypeChanged", "true");
        }
        this.sprintModel = this.sprintForm.value;
        this.sprintModel.sprintId = this.sprint.sprintId;
        this.sprintModel.timeStamp = this.sprint.timeStamp;
        this.sprintModel.projectId = this.sprint.projectId;
        this.sprintModel.sprintStartDate = this.sprint.sprintStartDate;
        this.sprintModel.sprintEndDate = this.sprint.sprintEndDate;
        this.sprintModel.isReplan = this.sprint.isReplan;
        this.sprintModel.editSprint = true;
        this.store.dispatch(new UpsertSprintsTriggered(this.sprintModel));
    }

    cancelSprintPopup() {
        this.closeSprintPopup();
    }

    closeSprintPopup() {
        this.closeEditSprintPopUp.emit("");
    }

    closeTestSuiteDialog() {
        this.loadAddTestSuite = false;
        this.addTestSuitePopovers.forEach((p: { closePopover: () => void; }) => p.closePopover());
    }


    openTestSuiteDialog(addTestSuitePopover) {
        var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any){ return module.modulePackageName == 'TestRepoPackageModule' });
    if(!module){
        console.error("No module found for TestRepoPackageModule");
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
            elementInArray.name.toLocaleLowerCase() === "Test Suite Edit".toLocaleLowerCase()
        );
        this.testSuitEdit = {};
        this.testSuitEdit.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.testSuitEdit.inputs = {
          projectId: this.sprint.projectId
        };
        this.testSuitEdit.outputs = {
          closeTestSuite: param => this.closeTestSuiteDialog()
        };

        this.loadAddTestSuite = true;
        addTestSuitePopover.openPopover();
        
        this.cdRef.detectChanges();
      });
    }
}