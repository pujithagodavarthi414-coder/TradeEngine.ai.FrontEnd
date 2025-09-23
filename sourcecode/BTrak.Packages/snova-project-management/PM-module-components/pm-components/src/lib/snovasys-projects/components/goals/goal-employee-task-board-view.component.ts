import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from "@angular/core";
import { Observable } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil, take } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SatPopover } from "@ncstate/sat-popover";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { UserStory } from "../../models/userStory";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { DatePipe, JsonPipe } from "@angular/common";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DragedWidget } from '../../models/dragedWidget';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { WidgetService } from '../../services/widget.service';
import { ProjectGoalsService } from '../../services/goals.service';

@Component({
    selector: "app-goal-employee-task-board-view",
    templateUrl: "goal-employee-task-board-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [JsonPipe]
})

export class GoalEmployeeTaskBoardViewComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild("filterThreeDotsPopover") filterthreeDotsPopOver: SatPopover;
    @ViewChild("uniqueUserstoryDialog1") private uniqueUserstoryDialog: TemplateRef<any>;
    @ViewChild("adhocUserstoryDetailDialog1") private adhocUserstoryDetailDialog: TemplateRef<any>;

    @Output() eventClicked = new EventEmitter<any>();
    @Output() getGoalCalenderView = new EventEmitter<string>();
    @Output() getGoalRelatedBurnDownCharts = new EventEmitter<string>();
    @Output() getDocumentStore = new EventEmitter<string>();
    @Output() getGoalEmployeeTaskBoard = new EventEmitter<string>();
    @Output() completeUserStory = new EventEmitter<any>();
    @Output() removeUserStory = new EventEmitter<any>();

    @Input("goal")
    set _goal(data) {
        if (data)
            this.goal = data;
        else
            this.goal = null;
    }

    @Input("uesrStoriesData")
    set _uesrStoriesData(data) {
        if (data) {
            this.initializeBoardData(data);
        }
    }

    @Input('notFromAudits')
    set _notFromAudits(data: boolean) {
        if (data || data == false) {
            this.notFromAudits = data;
        }
        else
            this.notFromAudits = true;
    }

    @Input('isFromGoalBrowseBoard')
    set _isFromGoalBrowseBoard(data: boolean) {
        if (data != null) {
            this.isFromGoalBrowseBoard = data;
        }
    }

    userStories$: Observable<UserStory[]>;

    public ngDestroyed$ = new Subject();

    selectedApps: DragedWidget;
    dashboardFilter: DashboardFilterModel;
    userStories: UserStory[];
    uniqueUserStories: UserStory[];
    assignees: UserStory[];

    goal: any;

    ownerUserList: string;
    reloadDashboard: string = null;
    appTagSearchText = "goal";
    selectedWorkspaceId: string;
    validationMessage: string;
    isTheBoardLayoutKanban: boolean = false;
    showCheckBox: boolean = false;
    isCalenderView: boolean = false;
    isReportsPage: boolean = false;
    isEmployeeTaskBoardPage: boolean = true;
    notFromAudits: boolean = true;
    taskBoardView: boolean = false;
    isFromGoalBrowseBoard: boolean = false;
    tasks:string="tasks";

    ngOnInit() {
        super.ngOnInit();
    }

    constructor(
        private actionUpdates$: Actions, private store: Store<State>, private cdref: ChangeDetectorRef, private widgetService: WidgetService,
        private translateService: TranslateService, private snackbar: MatSnackBar, public dialog: MatDialog,
        private toastr: ToastrService, private datePipe: DatePipe, private jsonPipe: JsonPipe,
        private goalService: ProjectGoalsService) {
        super();

        // this.actionUpdates$
        //     .pipe(
        //         takeUntil(this.ngDestroyed$),
        //         ofType(userStoryActions.UserStoryActionTypes.SearchComplete),
        //         tap((result: any) => {
        //             if (result && result.userStoryList) {
        //                 this.userStories = result.userStoryList;
        //                 if (this.userStories.length > 0) {
        //                     let uniqueAssignees = this.userStories.filter(function (item, pos, self) {
        //                         if (item.ownerUserId == null)
        //                             return false;
        //                         else
        //                             return self.findIndex(x => x.ownerUserId.toLowerCase() == item.ownerUserId.toLowerCase()) == pos;
        //                     });
        //                     this.assignees = uniqueAssignees;
        //                     this.cdref.markForCheck();
        //                 }
        //                 this.cdref.markForCheck();
        //             }
        //         })
        //     )
        //     .subscribe();

        this.userStories$ = this.store.pipe(select(projectModuleReducer.getAllUserStories));
        // this.userStories$.subscribe((result) => {
        //     if (result) {
        //         this.userStories = result;
        //         let userStoryUnique = result;
        //         if (userStoryUnique.length > 0) {
        //             let uniqueAssignees = userStoryUnique.filter(function (item, pos, self) {
        //                 if (item.ownerUserId == null)
        //                     return false;
        //                 else
        //                     return self.findIndex(x => x.ownerUserId.toLowerCase() == item.ownerUserId.toLowerCase()) == pos;
        //             });
        //             this.assignees = uniqueAssignees.sort(function (a, b) {
        //                 return a.ownerName.localeCompare(b.ownerName);
        //             });
        //             this.cdref.markForCheck();
        //         }
        //         let sampleUserStories = [];
        //         userStoryUnique.forEach((x, i) => {
        //             sampleUserStories.push(Object.assign({}, x));
        //             let index = x.userStoryName.lastIndexOf(x.userStoryUniqueName);
        //             if (index != -1)
        //                 sampleUserStories[i].userStoryName = x.userStoryName.substring(0, index - 1);
        //         });
        //         if (sampleUserStories.length > 0) {
        //             this.uniqueUserStories = sampleUserStories.filter(function (item, pos, self) {
        //                 return self.findIndex(x => x.userStoryName == item.userStoryName) == pos;
        //             });
        //             this.cdref.markForCheck();
        //         }
        //         this.cdref.markForCheck();
        //     }
        // });
    }

    initializeBoardData(data) {
        if (data) {
            this.userStories = data;
            let userStories = this.userStories;
            var filteredUserStories = this.getFilterUserStories(this.userStories);
            filteredUserStories.forEach((userStory) => {
                if (userStory.subUserStoriesList.length > 0) {
                  var subTasks = userStory.subUserStoriesList;
                  subTasks.forEach((task) => {
                      var subUserStory = new UserStory();
                      subUserStory = task;
                      var idx = userStories.indexOf(subUserStory);
                      if (idx == -1) {
                        userStories.push(subUserStory);
                      }
                  })
                }
              })
             this.userStories = userStories;
            let userStoryUnique = data;
            if (userStoryUnique && userStoryUnique.length > 0) {
                let uniqueAssignees = userStoryUnique.filter(function (item, pos, self) {
                    if (item.ownerUserId == null)
                        return false;
                    else
                        return self.findIndex(x => x.ownerUserId && x.ownerUserId.toLowerCase() == item.ownerUserId.toLowerCase()) == pos;
                });
                this.assignees = uniqueAssignees.sort(function (a, b) {
                    return a.ownerName.toLowerCase().localeCompare(b.ownerName.toLowerCase());
                });
            }
            let sampleUserStories = [];
            if (userStoryUnique && userStoryUnique.length > 0) {
                userStoryUnique.forEach((x, i) => {
                    sampleUserStories.push(Object.assign({}, x));
                    let index = x.userStoryName.toLowerCase().lastIndexOf(x.userStoryUniqueName);
                    if (index != -1)
                        sampleUserStories[i].userStoryName = x.userStoryName.substring(0, index - 1);
                });
            }
            if (sampleUserStories.length > 0) {
                this.uniqueUserStories = sampleUserStories.filter(function (item, pos, self) {
                    return self.findIndex(x => x.userStoryName.toLowerCase() == item.userStoryName.toLowerCase()) == pos;
                });
            }
        }
    }

    getDeadLineDate(ownerName, userStoryName) {
        if (this.userStories && this.userStories.length > 0) {
            let index = this.userStories.findIndex(x => x.ownerName && x.ownerName.toLowerCase() == ownerName.toLowerCase() && x.userStoryName.toLowerCase() == userStoryName.toLowerCase());
            if (this.taskBoardView == false) {
                if (index != -1 && this.userStories[index].deadLineDate)
                    return this.datePipe.transform(this.userStories[index].deadLineDate, 'mediumDate');
                else if (index != -1 && this.userStories[index].deadLineDate == null)
                    return '';
                else if (index == -1)
                    return 'N/A';
            }
            else {
                if (index != -1 && this.userStories[index].userStoryCustomFields && this.userStories[index].userStoryCustomFields.length > 0) {
                    let objects = [];
                    this.userStories[index].userStoryCustomFields.forEach(x => {
                        objects.push(JSON.parse(x.formDataJson));
                    });
                    let keyValues = Object.assign({}, ...objects);
                    let values = [];
                    Object.keys(keyValues).forEach(function (key) {
                        values.push(keyValues[key]);
                    });
                    return values.toString();
                }
                else if (index != -1 && this.userStories[index].userStoryCustomFields == null)
                    return '';
                else if (index == -1)
                    return 'N/A';
            }
        }
    }

    setColorForStatus(ownerName, userStoryName) {
        if (this.userStories && this.userStories.length > 0) {
            let index = this.userStories.findIndex(x => x.ownerName && x.ownerName.toLowerCase() == ownerName.toLowerCase() && x.userStoryName.toLowerCase() == userStoryName.toLowerCase());
            if (this.taskBoardView == false) {
                let styles = {
                    "color": 'white',
                    "background-color": ''
                };
                if (index != -1 && this.userStories[index].deadLineDate != null) {
                    styles['background-color'] = "#42CA49";
                    return styles;
                }
                else if (index != -1 && this.userStories[index].deadLineDate == null) {
                    styles['background-color'] = "#F44336";
                    return styles;
                } else if (index == -1) {
                    styles['background-color'] = "#8f8888";
                    return styles;
                }
            }
            else {
                let styles = {
                    "color": 'white',
                    "background-color": ''
                };
                if (index != -1 && this.userStories[index].userStoryCustomFields && this.userStories[index].userStoryCustomFields.length > 0) {
                    styles['background-color'] = "#42CA49";
                    return styles;
                } else if (index != -1 && this.userStories[index].userStoryCustomFields.length == 0) {
                    styles['background-color'] = "#F44336";
                    return styles;
                }
                else if (index == -1) {
                    styles['background-color'] = "#8f8888";
                    return styles;
                }
            }
        }
    }

    getCompletePercentage(ownerUserId) {
        if (this.uniqueUserStories.length > 0) {
            let assigneeUserstoriesLength = 0;
            this.uniqueUserStories.forEach(x => {
                if (x.ownerUserId && ownerUserId && x.ownerUserId.toLowerCase() == ownerUserId.toLowerCase())
                    assigneeUserstoriesLength = assigneeUserstoriesLength + 1;
            });
            if (this.taskBoardView) {
                let workCount = 0;
                this.uniqueUserStories.forEach(x => {
                    if (x.ownerUserId && ownerUserId && x.ownerUserId.toLowerCase() == ownerUserId.toLowerCase() && x.userStoryCustomFields.length > 0)
                        workCount = workCount + 1;
                });
                let value = (workCount / assigneeUserstoriesLength) * 100 ;
                return Math.round(value);
            }
            else {
                let workCount = 0;
                this.uniqueUserStories.forEach(x => {
                    if (x.ownerUserId && ownerUserId && x.ownerUserId.toLowerCase() == ownerUserId.toLowerCase() && x.deadLineDate != null)
                        workCount = workCount + 1;
                });
                let value = (workCount / assigneeUserstoriesLength) * 100 ;
                return Math.round(value);
            }
        }
    }

    print() {
        window.print();
    }

    ClickAfterEvent(event) {
        this.eventClicked.emit(event);
    }

    getCalanderView(event) {
        this.getGoalCalenderView.emit("");
    }

    getChartDetails(event) {
        this.getGoalRelatedBurnDownCharts.emit("");
    }

    getDocumentView(event) {
        this.getDocumentStore.emit('');
    }

    getEmployeeTaskBoard(event) {
        this.getGoalEmployeeTaskBoard.emit('');
    }

    getOpenUniquePage(ownerName, userStoryName, isAdhoc) {
        if (this.userStories && this.userStories.length > 0) {
            if (!isAdhoc) {
                let index = this.userStories.findIndex(x => x.ownerName && x.ownerName.toLowerCase() == ownerName.toLowerCase() && x.userStoryName.toLowerCase() == userStoryName.toLowerCase());
                if (index > -1) {
                    let selectedUserStoryDetails = this.userStories[index];
                    let dialogId = "userboard-unique-userstory-dialog";
                    const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
                        height: "90vh",
                        width: "70%",
                        direction: 'ltr',
                        id: dialogId,
                        data: { userStory: selectedUserStoryDetails, notFromAudits: this.notFromAudits, dialogId: dialogId },
                        disableClose: true,
                        panelClass: 'userstory-dialog-scroll'
                    });
                    dialogRef.afterClosed().subscribe((result: any) => {
                        if (result.success == 'yes') {
                            this.removeUserStory.emit(selectedUserStoryDetails.userStoryId);
                        }
                        else if (result.success == 'no') {
                            this.completeUserStory.emit(selectedUserStoryDetails.userStoryId);
                        }
                        else {
                            this.completeUserStory.emit(selectedUserStoryDetails.userStoryId);
                        }
                        if (this.isFromGoalBrowseBoard) {
                            this.getParentUserStoryData(selectedUserStoryDetails.userStoryId);
                        }
                    });
                }
            }
            else {
                let index = this.userStories.findIndex(x => x.ownerName && x.ownerName.toLowerCase() == ownerName.toLowerCase() && x.userStoryName.toLowerCase() == userStoryName.toLowerCase());
                if (index > -1) {
                    let selectedUserStoryDetails = this.userStories[index];
                    let dialogId = "userboard-adhoc-userstory-detail-dialog";
                    const dialogRef = this.dialog.open(this.adhocUserstoryDetailDialog, {
                        height: "70%",
                        width: "80%",
                        direction: 'ltr',
                        id: dialogId,
                        data: { userStory: selectedUserStoryDetails, dialogId: dialogId },
                        disableClose: true,
                        panelClass: 'userstory-dialog-scroll'
                    });
                    dialogRef.afterClosed().subscribe((result: any) => {
                        if (result.success) {
                            this.completeUserStory.emit(selectedUserStoryDetails.userStoryId);
                        }
                    });
                }
            }
        }
    }

    getParentUserStoryData(userStoryId) {
        this.goalService.GetUserStoryById(userStoryId).subscribe((result: any) => {
            if (result.success) {
                let userStoryData = result.data;
                if (this.userStories && userStoryData) {
                    let index = this.userStories.findIndex(x => x.userStoryId.toLowerCase() == userStoryId.toLowerCase());
                    if (index > -1) {
                        this.userStories[index] = userStoryData;
                        this.initializeBoardData(this.userStories);
                    }
                    this.cdref.detectChanges();
                }
            }
        })
    }

    taskBoardViewChange(event) {
        this.taskBoardView = event;
    }

    printTaskboard() {

    }

    getFilterUserStories(userStories) {
        userStories.forEach(userStory => {
          userStory.subUserStoriesList = [];
          if (userStory.subUserStories) {
            var subLists = [];
            let featuresListJson = JSON.parse(userStory.subUserStories);
            var subUserStoriesList = featuresListJson.ChildUserStories;
            subUserStoriesList.forEach((userStory) => {
              var userStoryModel = new UserStory();
              userStoryModel = userStory;
              subLists.push(userStoryModel);
            })
            userStory.subUserStoriesList = subLists;
          }
          else {
            userStory.subUserStoriesList = [];
          }
        })
        return userStories;
      }

    ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
