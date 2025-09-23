import { Component, ViewChildren, ViewChild, TemplateRef, Input, Output, EventEmitter, ElementRef, OnInit, HostListener, ChangeDetectorRef, Inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { take, takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
// import { State } from "app/shared/store/reducers/menuitems.reducers";
import { State } from "../../store/reducers/index";
import * as sharedModuleReducers from "./../../store/reducers/index";
import { tap } from "rxjs/operators";
import { GetAllMenuItemsTriggered } from "../../store/actions/menuitems.actions";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatInput } from "@angular/material/input";
import { CookieService } from "ngx-cookie-service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RecentSearchService } from "../../services/recentSearch.service";
import * as moment from "moment";
import { AuthenticationActionTypes, GetCompanyThemeTriggered } from "../../store/actions/authentication.actions";
import { ofType, Actions } from "@ngrx/effects";
import { SearchTaskType } from "./searchTask.enum";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SatPopover } from '@ncstate/sat-popover';
import * as _ from 'underscore';
import { CommonService } from '../../services/common-used.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { EmployeeListModel } from '../../models/employee';
import { EmployeeListInput } from '../../models/employee-List';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { IMenuItem } from '../../models/IMenuItem';
import { UserStory } from '../../models/userStory';
import { WidgetList } from '../../models/widgetlist';
import { DragedWidget } from '../../models/dragedWidget';
import { WorkspaceList } from '../../models/workspaceList';
import { RecentSearchModel, SearchTaskTypeModel } from '../../models/RecentSearchModel';
import { ThemeModel } from '../../models/themes.model';
import { WINDOW } from '../../../globaldependencies/helpers/window.helper';
import { ThemeService } from '../../services/theme.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { ProjectSearchCriteriaInputModel } from '../../models/ProjectSearchCriteriaInputModel';
import { MenuCategories } from '../../constants/menu-categories';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { RecentSearchType } from '../../enum/recentSearchType.enum';
import { ToastrService } from "ngx-toastr";
import { trigger, style, animate, transition } from '@angular/animations';
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../../services/authentication.service";

/** @dynamic */

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html"
})

export class MenuComponent extends CustomAppBaseComponent implements OnInit {
  [x: string]: any;

  @ViewChildren("openMenuPopUp") openMenuPopOver;
  @ViewChild("menuTrigger") menuTrigger: MatMenuTrigger;
  @ViewChild("element") element: ElementRef;
  @ViewChild("workspaceElement") workspaceElement: ElementRef;
  @ViewChild("menuElement") menuElement: ElementRef;
  @ViewChild("addWorkspace") addWorkSpacePopOver: SatPopover;
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("allEditSelected") private allEditSelected: MatOption;
  @ViewChild("allDeleteSelected") private allDeleteSelected: MatOption;
  @ViewChild('infoPopOver') infoPopOver: TemplateRef<any>
  @Output() isOpened = new EventEmitter<any>();
  @Output() openNewDashboard = new EventEmitter<string>();
  e: Element;
  searchText: string;
  focus: boolean = false;
  softLabels: SoftLabelConfigurationModel[];
  public menuItems$: Observable<IMenuItem[]>;
  userStoriesList$: Observable<UserStory[]>;
  menuItem: IMenuItem[];
  items = [];
  menuItemName: string = "";
  widgets: WidgetList[];
  originalWidgets: WidgetList[];
  selectedList: DragedWidget[];
  widget: WidgetList;
  selectedApps: any;
  url: string;
  selectedDashboard: any;
  defaultDashboard: any;
  subLevels: string[] = [];
  stateLvl1: string;
  level3Link1: string;
  level3Link2: string;
  subLevelsForLevel2: string;
  companyMainLogo: string;
  companyMiniLogo: string;
  rolesDropDown: any[];
  workspacesList$: Observable<WorkspaceList[]>;
  workspaces: WorkspaceList[];
  workspacesForLoop: any;
  display: boolean;
  adminTools: any = [];
  tools: any;
  selectedRowIndex: any;
  itemClicked: any;
  t: any;
  wd: any;
  ws: any;
  rs: any;
  allsearches: RecentSearchModel[] = [];
  recentSearches: RecentSearchModel[] = [];
  projectRoleText: string = "Project role configuration";
  canAccess_feature_AddOrUpdateApplications: Boolean;
  canAccess_feature_AddOrUpdateForm: Boolean;
  canAccess_feature_ViewForms: Boolean;
  canAccess_feature_ManageProjectRolePermissions: Boolean;
  canAccess_feature_ViewRoles: Boolean;
  canAccess_feature_AddOrUpdateApplications$: Observable<Boolean>;
  canAccess_feature_AddOrUpdateForm$: Observable<Boolean>;
  canAccess_feature_ViewForms$: Observable<Boolean>
  canAccess_feature_ManageProjectRolePermissions$: Observable<Boolean>
  canAccess_feature_ViewRoles$: Observable<Boolean>;
  companySettingsMOdel$: Observable<any[]>;
  disableWorkspace = false;
  disableWorkspaceDelete = false;
  disableWorkspacehide = false;
  forms: any;
  custapp: any;
  projectRoleConfiguration: any;
  roleConfiguration: any;
  themeModel: ThemeModel;
  employeeList: any[] = [];
  themeModel$: Observable<ThemeModel>;
  themeBaseColor: string;
  selectedEmployee: string;
  loadedEmployeeList: EmployeeListModel[] = [];
  selectedEmployeeIndex: number = null;
  viewEmployeePermission: boolean;
  canAccess_feature_CanEditOtherEmployeeDetails: Boolean;
  projectList: any = [];
  projectIndex: any;
  searchByTextLoading: boolean;
  @Input("reload")
  set reloadAll(data: boolean) {
    if (data) {
      this.adminTools = [];
      this.tools = [];
      this.ngOnInit();
    }
  }
  public ngDestroyed$ = new Subject();
  userStoryList: any = [];
  userStorySearchList: any = [];
  goalSearchList: any = [];
  isEnableBugBoard: boolean;
  selectedRoleIds: string[] = [];
  dashboardUpdateInProgress: boolean;
  users: any;
  goalIndex: any;
  workspaceForm: FormGroup;
  projectSearchResults: any;
  delayTimeInput = new Subject<any>();
  menusfetchInProgress: boolean;
  workspacesfetchInProgress: boolean;
  widgetsfetchInProgress: boolean;
  recentSearchesfetchInProgress: boolean;
  searchTasks: SearchTaskTypeModel;
  loadingSearchMenuData: boolean = false;
  defaultDashboardId: string;
  searchById: boolean;
  searchByText: boolean;
  constructor(
    private store: Store<State>,
    private cookieService: CookieService,
    public routes: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    public authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private rss: RecentSearchService,
    private location: Location,
    private themeService: ThemeService,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    @Inject(WINDOW) private window: Window,
    private googleAnalyticsService: GoogleAnalyticsService,
    private commonService: CommonService
  ) {
    super();
    //this.onFocus();

    // let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    // this.cookieService.set(LocalStorageProperties.SearchClick, JSON.stringify(false), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.canAccess_feature_CanEditOtherEmployeeDetails$ = this.store.pipe(select(sharedModuleReducers.doesUserHavePermission, { featureId: FeatureIds.Feature_CanEditOtherEmployeeDetails }));
    this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
      this.canAccess_feature_CanEditOtherEmployeeDetails = result;
    })
    this.initializeWorkspaceForm();
    this.routes.events.subscribe(val => {
      if (this.location.path() != "") {
        this.url = this.location.path();
      }
    });
    // this.widgetService.selectedWorkspace.subscribe(id => {
    //   this.selectedDashboard = id;
    // });
    // this.actionUpdates$
    //   .pipe(
    //     takeUntil(this.ngDestroyed$),
    //     ofType(AuthenticationActionTypes.GetCompanyThemeCompleted),
    //     tap(() => {
    //this.themeModel$ = this.store.pipe(select(sharedModuleReducers.getThemeModel));
    //this.themeModel$.subscribe(x => this.themeModel = x);
    // this.getTheme();
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.themeModel = this.cookieService.check('CompanyTheme') ? JSON.parse(this.cookieService.get("CompanyTheme")) : null;
    this.themeService.changeTheme(this.themeModel);
    this.cookieService.set(LocalStorageProperties.CompanyMainLogo, this.themeModel.companyMainLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.cookieService.set(LocalStorageProperties.CompanyMiniLogo, this.themeModel.companyMiniLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    this.themeModel = this.cookieService.check('CompanyTheme') ? JSON.parse(this.cookieService.get("CompanyTheme")) : null;

    var companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));

    this.companyMainLogo = companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo").value : this.companyMainLogo;
    this.companyMiniLogo = companySettingsModel.find(x => x.key.toLowerCase() == "minilogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "minilogo").value : this.companyMiniLogo;

    document.getElementById("shortcut-fav-icon").setAttribute("href", this.themeModel.companyMiniLogo);
    this.themeBaseColor = localStorage.getItem('themeColor');
    // // this.themeModel = this.cookieService.check('CompanyTheme') ? JSON.parse(this.cookieService.get("CompanyTheme")) : null;
    // // if (this.themeModel && this.themeModel.companyThemeId !== "00000000-0000-0000-0000-000000000000") {
    // //   this.themeService.changeTheme(this.themeModel);
    // //   this.cookieService.set(LocalStorageProperties.CompanyMainLogo, this.themeModel.companyMainLogo, null);
    // //   this.cookieService.set(LocalStorageProperties.CompanyMiniLogo, this.themeModel.companyMiniLogo, null);
    // // }
    // // else {
    // //   var themeModel = new ThemeModel()
    // //   themeModel.companyThemeId = "0929D35A-3573-4B06-93FB-C7D46AAFA918";
    // //   // themeModel.companyMiniLogo = "assets/images/Logo-favicon.png";
    // //   // themeModel.companyMainLogo = "assets/images/Main-Logo.png";
    // //   this.themeModel = themeModel;
    // //   this.themeService.changeTheme(themeModel);
    // //   this.cookieService.set(LocalStorageProperties.CompanyMainLogo, this.themeModel.companyMainLogo, null);
    // //   this.cookieService.set(LocalStorageProperties.CompanyMiniLogo, this.themeModel.companyMiniLogo, null);
    // // }
    // // this.companyMainLogo = this.cookieService.get(LocalStorageProperties.CompanyMainLogo);
    // // this.companyMiniLogo = this.cookieService.get(LocalStorageProperties.CompanyMiniLogo);
    // // //this.changeFavIcon();
    // // this.themeBaseColor = localStorage.getItem('themeColor');
    //this.cdRef.detectChanges();
    //   })
    // )
    // .subscribe();


    // this.actionUpdates$
    //   .pipe(
    //     takeUntil(this.ngDestroyed$),
    //     ofType(WorkspacesActionTypes.LoadWorkspaceByIdCompleted),
    //     tap((data: any) => {
    //       var workspacesList = data.searchWorkspacesSuccess;
    //       this.dashboardUpdateInProgress = false;
    //       // this.closeAddWorkspaceDialog();
    //       this.disableWorkspace = false;
    //       if (workspacesList.length > 0) {
    //         this.workspaces.push(workspacesList[0]);
    //         this.display = false;
    //         this.isOpened.emit(this.display);
    //         this.openNewDashboard.emit(workspacesList[0].workspaceId)
    //       }

    //     })
    //   ).subscribe();

    //this.getAllProjects();

    this.delayTimeInput.pipe(
      debounceTime(2000),
      distinctUntilChanged())
      .subscribe(value => {
        this.SearchItem(value);
      });

  }

  getTheme() {
    this.authenticationService.getThemes().subscribe((response: any) => {
      if (response.success) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        this.cookieService.set('CompanyTheme', JSON.stringify(response.data), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        this.themeModel = this.cookieService.check('CompanyTheme') ? JSON.parse(this.cookieService.get("CompanyTheme")) : null;
        this.themeService.changeTheme(this.themeModel);
        this.cookieService.set(LocalStorageProperties.CompanyMainLogo, this.themeModel.companyMainLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        this.cookieService.set(LocalStorageProperties.CompanyMiniLogo, this.themeModel.companyMiniLogo, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        this.siteUrl = response.data.registrerSiteAddress;
        this.themeModel = this.cookieService.check('CompanyTheme') ? JSON.parse(this.cookieService.get("CompanyTheme")) : null;

        var companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));

        this.companyMainLogo = companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo").value : this.companyMainLogo;
        this.companyMiniLogo = companySettingsModel.find(x => x.key.toLowerCase() == "minilogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "minilogo").value : this.companyMiniLogo;

        if (this.companyMainLogo == "" || this.companyMainLogo == null || this.companyMainLogo == undefined) {
          this.companyMainLogo = response.data.companyMainLogo;
        }
        if (this.companyMiniLogo == "" || this.companyMiniLogo == null || this.companyMiniLogo == undefined) {
          this.companyMiniLogo = response.data.companyMiniLogo;
        }
        document.getElementById("shortcut-fav-icon").setAttribute("href", this.themeModel.companyMiniLogo);
        this.themeBaseColor = localStorage.getItem('themeColor');
        this.cdRef.detectChanges();
      }
    });
  }

  @HostListener('document:keydown.control.q', [])
  keyOpenEvent() {
    this.element.nativeElement.focus();
    this.display = true;
    this.searchByText = false;
    this.searchById = false;
    this.isOpened.emit(this.display);
    this.onFocus()
  }

  @HostListener('document:keydown.control.m', [])
  keyCloseEvent() {
    this.element.nativeElement.blur();
    this.display = false;
    this.searchText = '';
    this.searchByText = false;
    this.searchById = false;
    this.isOpened.emit(this.display);
  }

  @HostListener('document:keydown.control.b', [])
  remoteSearchByText() {
    this.searchById = false;
    this.searchByText = true
    this.element.nativeElement.focus();
    //this.display = true;
    this.isOpened.emit(this.display);
  }

  @HostListener('document:keydown.control.y', [])
  remoteSearchById() {
    this.searchByText = false
    this.searchById = true;
    this.element.nativeElement.focus();
    //this.display = true;
    this.isOpened.emit(this.display);
  }

  convertToLocalTime(time) {
    var utcDate = moment.utc(time).format();
    var localDate = moment.utc(utcDate).local().format();
    return localDate;
  }

  initializeWorkspaceForm() {
    this.selectedRoleIds = null;
    this.disableWorkspace = false;
    this.disableWorkspacehide = false;
    this.workspaceForm = new FormGroup({
      workspaceName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      selectedRoles: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      description: new FormControl(null,
        Validators.compose([
          Validators.maxLength(1000)
        ])
      ),
      editRoleIds: new FormControl(null, []),
      deleteRoleIds: new FormControl(null, [])
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.defaultDashboardId = this.cookieService.check(LocalStorageProperties.DefaultDashboard) ? JSON.parse(this.cookieService.get(LocalStorageProperties.DefaultDashboard)) : null;;

    //this.store.dispatch(new GetCompanyThemeTriggered());
    this.adminTools = [];
    // var dashboards = JSON.parse(localStorage.getItem(LocalStorageProperties.Dashboards));
    // if (dashboards && dashboards != "null") {
    //   this.workspaces = this.workspacesForLoop = dashboards;
    // }
    // var menuItems = JSON.parse(localStorage.getItem(LocalStorageProperties.MenuItems))
    // if (menuItems && menuItems != "null") {
    //   this.menuItem = menuItems;
    //   this.items = this.menuItem.filter(item => item.type != "dropDown");
    //   this.itemClicked = this.items[0];
    // }
    // var widgets = JSON.parse(localStorage.getItem(LocalStorageProperties.FavouriteWidgets));
    // if (widgets && widgets != "null") {
    //   this.widgets = this.originalWidgets = widgets;
    // }
    // var recentSearches = JSON.parse(localStorage.getItem(LocalStorageProperties.RecentSearches));
    // if (recentSearches && recentSearches != "null") {
    //   this.allsearches = this.recentSearches = recentSearches;
    // }
    // this.loadWidgetsList();
    //  this.loadWorkspacesList();
    this.getSoftLabelConfigurations();
    this.getCompanySettings();
    this.menuItems$ = this.store.pipe(
      select(sharedModuleReducers.getCurrentActiveMenuCategoryMenuItems),
      tap(menuList => console.log(menuList))
    );
    // this.menuItems$.subscribe(x => {
    //   var a = x;
    //   var b = this.menuItem.filter(item => item.type != "dropDown");

    //   //this.itemClicked = this.items[0];
    //   //this.menusfetchInProgress = false;
    // });

    // this.store.dispatch(new GetAllMenuItemsTriggered(MenuCategories.Main));

    var companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));

    this.companyMainLogo = companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo").value : this.companyMainLogo;
    this.companyMiniLogo = companySettingsModel.find(x => x.key.toLowerCase() == "minilogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "minilogo").value : this.companyMiniLogo;

    if (this.companyMainLogo == "" || this.companyMainLogo == null || this.companyMainLogo == undefined) {
      this.companyMainLogo = this.cookieService.get(LocalStorageProperties.CompanyMainLogo);
    }
    if (this.companyMiniLogo == "" || this.companyMiniLogo == null || this.companyMiniLogo == undefined) {
      this.companyMiniLogo = this.cookieService.get(LocalStorageProperties.CompanyMiniLogo);
    }

    if (document.getElementById('shortcut-fav-icon')) {
      document.getElementById('shortcut-fav-icon').setAttribute("href", this.companyMiniLogo);
    }
    //this.getRecentSearches();
    this.selectedList = [];

    // this.custapp = {
    //   name: "Custom applications",
    //   link: "/applications/custom-applications",
    //   permission: this.canAccess_feature_AddOrUpdateApplications$
    // }
    // this.forms = {
    //   name: "Forms",
    //   link: "/applications/view-forms",
    //   permission: this.canAccess_feature_ViewForms$
    // }
    // this.projectRoleConfiguration = {
    //   name: "Project role configuration",
    //   link: "/rolemanagement/entityrolemanagement",
    //   permission: this.canAccess_feature_ManageProjectRolePermissions$
    // }
    // this.roleConfiguration = {
    //   name: "Role configuration",
    //   link: "/rolemanagement/rolemanagement",
    //   permission: this.canAccess_feature_ViewRoles$
    // }
    // this.canAccess_feature_AddOrUpdateApplications$ = this.store.pipe(select(sharedModuleReducers.doesUserHavePermission, { featureId: FeatureIds.Feature_AddOrUpdateApplications }));
    // this.canAccess_feature_AddOrUpdateApplications$.subscribe((result) => {
    //   this.canAccess_feature_AddOrUpdateApplications = result;
    //   if (result) {
    //     this.adminTools.some((flow) => flow.name == 'Custom applications') ? null : this.adminTools.push(this.custapp);
    //   }
    // })
    // this.canAccess_feature_AddOrUpdateForm$ = this.store.pipe(select(sharedModuleReducers.doesUserHavePermission, { featureId: FeatureIds.Feature_AddOrUpdateForm }));
    // this.canAccess_feature_AddOrUpdateForm$.subscribe((result) => {
    //   this.canAccess_feature_AddOrUpdateForm = result;
    //   if (result) {
    //     this.adminTools.some((flow) => flow.name == 'Forms') ? null : this.adminTools.push(this.forms);
    //   }
    // })
    // this.canAccess_feature_ViewForms$ = this.store.pipe(select(sharedModuleReducers.doesUserHavePermission, { featureId: FeatureIds.Feature_ViewForms }));    // //this.route.url.subscribe((url) => this.url = url.toString());
    // this.canAccess_feature_ViewForms$.subscribe((result) => {
    //   this.canAccess_feature_ViewForms = result;
    //   if (result) {
    //     this.adminTools.some((flow) => flow.name == 'Forms') ? null : this.adminTools.push(this.forms);
    //   }
    // })
    // this.canAccess_feature_ManageProjectRolePermissions$ = this.store.pipe(select(sharedModuleReducers.doesUserHavePermission, { featureId: FeatureIds.Feature_ManageProjectRolePermissions }));
    // this.canAccess_feature_ManageProjectRolePermissions$.subscribe((result) => {
    //   this.canAccess_feature_ManageProjectRolePermissions = result;
    //   if (result) {
    //     this.adminTools.some((flow) => flow.name == 'Project role configuration') ? null : this.adminTools.push(this.projectRoleConfiguration);
    //   }
    // })
    // this.canAccess_feature_ViewRoles$ = this.store.pipe(select(sharedModuleReducers.doesUserHavePermission, { featureId: FeatureIds.Feature_ViewRoles }));
    // this.canAccess_feature_ViewRoles$.subscribe((result) => {
    //   this.canAccess_feature_ViewRoles = result;
    //   if (result) {
    //     this.adminTools.some((flow) => flow.name == 'Role configuration') ? null : this.adminTools.push(this.roleConfiguration);
    //   }
    // })
    // this.canAccess_feature_CanEditOtherEmployeeDetails$ = this.store.pipe(select(sharedModuleReducers.doesUserHavePermission, { featureId: FeatureIds.Feature_CanEditOtherEmployeeDetails }));
    // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
    //   this.canAccess_feature_CanEditOtherEmployeeDetails = result;
    //   if (result) {
    //    // this.getAllEmployees();
    //   }
    // })
    this.tools = this.adminTools;
    //this.selectedRowIndex = 0;
    //this.getAllEmployees();
    // this.loadWidgetsList(null);
    // this.loadWorkspacesList();
    this.userStorySearchList = [];
    this.goalSearchList = [];
    // if(this.items.length>0) {
    //   this.selectedRowIndex = 0; this.itemClicked = this.items[0];
    // } else if(this.tools.length>0) {
    //   this.t=0; this.itemClicked = this.tools[0];
    // } else if(this.workspaces.length>0) {
    //   this.ws = 0; this.itemClicked =this.workspaces[0];
    // }  

    this.SearchItem = _.debounce(this.SearchItem, 1000);
    this.routes.events
      .subscribe(
        (event: any) => {
          if (event instanceof NavigationEnd) {
            this.routerActive();
          }
        });
  }

  openInfo(infoPopOver) {
    infoPopOver.openPopover();
  }

  // getAllProjects() {
  //   const projectSearchResult = new ProjectSearchCriteriaInputModel();
  //   projectSearchResult.isArchived = false;
  //   this.commonService.searchProjects(projectSearchResult).subscribe((response: any) => {
  //     if (response.success == true) {
  //       if (response.data) {
  //         this.projectSearchResults = response.data;
  //       }
  //     }
  //     else {
  //       this.validationMessage = response.apiResponseMessages[0].message;
  //       this.projectSearchResults = [];
  //       this.toastr.error(this.validationMessage);
  //     }
  //   })
  // }

  getCompanySettings() {
    let companySettingsModel = [];
    this.companySettingsMOdel$ = this.store.pipe(select(sharedModuleReducers.getCompanySettings));
    this.companySettingsMOdel$.subscribe((x) => companySettingsModel = x);
    let bugBoardResult = companySettingsModel.filter(item => item.key.trim() == "EnableBugBoard");
    if (bugBoardResult && bugBoardResult.length > 0) {
      this.isEnableBugBoard = bugBoardResult[0].value == "1" ? true : false;
    }

    this.companyMainLogo = companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo").value : this.companyMainLogo;
    this.companyMiniLogo = companySettingsModel.find(x => x.key.toLowerCase() == "minilogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "minilogo").value : this.companyMiniLogo;

    if (document.getElementById('shortcut-fav-icon')) {
      document.getElementById('shortcut-fav-icon').setAttribute("href", this.companyMiniLogo);
    }
  }

  loadSearchData() {
    var menuItems = JSON.parse(localStorage.getItem(LocalStorageProperties.MenuItems))
    if (menuItems && menuItems != "null") {
      this.menuItem = menuItems;
      this.items = this.menuItem.filter(item => item.type != "dropDown");
      this.itemClicked = this.items[0];
    }
    var widgets = JSON.parse(localStorage.getItem(LocalStorageProperties.FavouriteWidgets));
    if (widgets && widgets != "null") {
      this.widgets = this.originalWidgets = widgets;
    }
    var recentSearches = JSON.parse(localStorage.getItem(LocalStorageProperties.RecentSearches));
    if (recentSearches && recentSearches != "null") {
      this.allsearches = this.recentSearches = recentSearches;
    }
  }
  translateapplicationname(item) {
    if (item == null) {
      return null;
    }
    var localvariable = item.trim();
    var name = this.translateService.instant("APP." + localvariable);
    if (name.indexOf("APP.") != -1) {
      return item;
    }
    else {
      return name;
    }
  }

  onFocus() {
    if (!this.searchById && !this.searchByText) {
      var retrieveDashboards: boolean = true;
      var dashboards = localStorage.getItem(LocalStorageProperties.Dashboards);
      if (dashboards && dashboards != "null") {
        retrieveDashboards = false;
        this.workspacesForLoop = JSON.parse(dashboards);
        if (this.searchText) {
          this.workspaces = this.workspacesForLoop.filter(
            item =>
              item.workspaceName
                .toLowerCase()
                .includes(this.searchText.toLowerCase()) !==
              false
          );
        } else {
          this.workspaces = this.workspacesForLoop;
        }
      }
      if (!(this.cookieService.check(LocalStorageProperties.SearchClick) && JSON.parse(this.cookieService.get(LocalStorageProperties.SearchClick)) == true)) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        this.cookieService.set(LocalStorageProperties.SearchClick, JSON.stringify(true), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
        // this.loadWidgetsList(null);
        // this.loadWorkspacesList();
        // this.getAllMenuItems();

        this.loadingSearchMenuData = true;
        this.rss.searchMenuData(retrieveDashboards)
          .subscribe((res: any) => {
            if (res.success && res.data) {
              if (res.data.workspaces) {
                this.workspaces = res.data.workspaces;
                localStorage.setItem(LocalStorageProperties.Dashboards, JSON.stringify(this.workspaces));
                this.workspacesForLoop = this.workspaces;
                //this.defaultDashboard = this.workspaces.find(i => i.isDefault == true);
              }
              if (res.data.widgets) {
                this.originalWidgets = res.data.widgets.sort((a, b) =>
                  a.widgetName.toLowerCase() > b.widgetName.toLowerCase() ? 1 : -1
                );
                this.widgets = this.originalWidgets;
                localStorage.setItem(LocalStorageProperties.FavouriteWidgets, JSON.stringify(this.widgets));
              }
              if (res.data.menuItems) {
                // var applications = res.data.menuItems.filter(function (x) {
                //   return (
                //     x.menuCategory &&
                //     MenuCategories.Main &&
                //     x.menuCategory.toLowerCase() === MenuCategories.Main.toLowerCase()
                //   );
                // })
                this.menuItem = res.data.menuItems;
                localStorage.setItem(LocalStorageProperties.MenuItems, JSON.stringify(this.menuItem));
                this.items = this.menuItem.filter(item => item.type != "dropDown");
                //this.itemClicked = this.items[0];
              }
              if (res.data.recentSearch) {
                this.allsearches = res.data.recentSearch;
                this.recentSearches = this.allsearches;
                localStorage.setItem(LocalStorageProperties.RecentSearches, JSON.stringify(this.allsearches));
              }
              let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
              this.cookieService.set(LocalStorageProperties.LoadFavouriteWidgets, JSON.stringify(false), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
              this.cookieService.set(LocalStorageProperties.LoadRecentSearches, JSON.stringify(false), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
              this.routerActive();
            }
            this.loadingSearchMenuData = false;
          });
      } else {
        this.loadSearchData();
      }
      // else {
      //   if (!(this.cookieService.check(LocalStorageProperties.LoadFavouriteWidgets) && JSON.parse(this.cookieService.get(LocalStorageProperties.LoadFavouriteWidgets)) == false)) {
      //     this.loadWidgetsList(null, true);
      //     let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
      //     this.cookieService.set(LocalStorageProperties.LoadFavouriteWidgets, JSON.stringify(false), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
      //   }
      //   if (!(this.cookieService.check(LocalStorageProperties.LoadRecentSearches) && JSON.parse(this.cookieService.get(LocalStorageProperties.LoadRecentSearches)) == false)) {
      //     this.getRecentSearches();
      //     let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
      //     this.cookieService.set(LocalStorageProperties.LoadRecentSearches, JSON.stringify(false), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
      //   }
      //   this.routerActive();
      // }
      this.routerActive();
    }
    this.display = true;
    this.isOpened.emit(this.display);
  }

  routerActive() {
    if (this.routes.url.includes("dashboard-management/dashboard") && this.routes.url.split("/")[3]) {
      var dashboardId = this.routes.url.split("/")[3];
      if (dashboardId && this.workspaces.length > 0) {
        var index = this.workspaces.findIndex(i => i.workspaceId == dashboardId);
        this.ws = index;
        this.selectedRowIndex = this.wd = this.rs = null;
        this.itemClicked = this.workspaces[this.ws];
      }
    } else if (this.routes.url.includes("dashboard-management/widgets") && this.routes.url.split("/")[3]) {
      var widgetId = this.routes.url.split("/")[3];
      if (widgetId && this.widgets.length > 0) {
        var index = this.widgets.findIndex(i => i.widgetId == widgetId);
        if (index > 0) {
          this.wd = index;
          this.selectedRowIndex = this.ws = this.rs = null;
          this.itemClicked = this.widgets[this.wd];
        } else if (this.recentSearches && this.recentSearches.length > 0) {
          var indexRs = this.recentSearches.findIndex(i => i.itemId == widgetId)
          this.rs = indexRs;
          this.selectedRowIndex = this.ws = this.wd = null;
          this.itemClicked = this.recentSearches[this.rs];
        }
      }
    } else if (this.items.length > 0) {
      var index = this.items.findIndex(i => this.routes.url == "/" + i.state);
      this.selectedRowIndex = index;
      this.ws = this.wd = this.rs = null;
      this.itemClicked = this.items[this.selectedRowIndex];
      this.cdRef.detectChanges();
    }
  }

  loadWorkspacesList() {
    this.workspacesfetchInProgress = true;
    var workspacelist = new WorkspaceList();
    workspacelist.workspaceId = "null";
    workspacelist.isHidden = false;
    this.commonService.GetWorkspaceList(workspacelist).subscribe((result: any) => {
      this.workspaces = result.data;
      localStorage.setItem(LocalStorageProperties.Dashboards, JSON.stringify(result.data));
      this.workspacesForLoop = this.workspaces;
      this.defaultDashboard = this.workspaces.find(i => i.isDefault == true);
      this.workspacesfetchInProgress = false;
    });
    // this.store.dispatch(new LoadWorkspacesListTriggered(this.workspacelist));
  };

  openApps() {
    this.routes.navigate(["app-store/widgets"]);
  }

  loadWidgetsList(searchText, store = false) {
    this.widgetsfetchInProgress = true;
    this.widget = new WidgetList();
    this.widget.widgetId = "null";
    this.widget.isArchived = false;
    this.widget.pageNumber = null;
    this.widget.pageSize = null;
    this.widget.sortDirectionAsc = true;
    this.widget.isFavouriteWidget = true;
    if (searchText)
      this.widget.searchText = searchText;

    this.commonService.GetWidgetsBasedOnUser(this.widget).subscribe((result: any) => {
      this.widgets = [];
      if (result.success) {
        this.originalWidgets = result.data.sort((a, b) =>
          a.widgetName.toLowerCase() > b.widgetName.toLowerCase() ? 1 : -1
        );
        this.widgets = this.originalWidgets;
        if (store) {
          localStorage.setItem(LocalStorageProperties.FavouriteWidgets, JSON.stringify(this.widgets));
        }
        this.widgetsfetchInProgress = false;
        this.cdRef.detectChanges();
      }

    });

    var companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));

    this.companyMainLogo = companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "mainlogo").value : this.companyMainLogo;
    this.companyMiniLogo = companySettingsModel.find(x => x.key.toLowerCase() == "minilogo") != null ? companySettingsModel.find(x => x.key.toLowerCase() == "minilogo").value : this.companyMiniLogo;
    // this.companyMainLogo = this.cookieService.get(LocalStorageProperties.CompanyMainLogo);
    // this.companyMiniLogo = this.cookieService.get(LocalStorageProperties.CompanyMiniLogo);

    if (this.companyMainLogo == "" || this.companyMainLogo == null || this.companyMainLogo == undefined) {
      this.companyMainLogo = this.cookieService.get(LocalStorageProperties.CompanyMainLogo);
    }
    if (this.companyMiniLogo == "" || this.companyMiniLogo == null || this.companyMiniLogo == undefined) {
      this.companyMiniLogo = this.cookieService.get(LocalStorageProperties.CompanyMiniLogo);
    }

    if (document.getElementById('shortcut-fav-icon')) {
      document.getElementById('shortcut-fav-icon').setAttribute("href", this.companyMiniLogo);
    }
  }


  getAllEmployees() {
    this.canAccess_feature_CanEditOtherEmployeeDetails$ = this.store.pipe(select(sharedModuleReducers.doesUserHavePermission, { featureId: FeatureIds.Feature_CanEditOtherEmployeeDetails }));
    this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
      this.canAccess_feature_CanEditOtherEmployeeDetails = result;
    })
    let employeeSpentTime = new EmployeeListInput();
    employeeSpentTime.sortDirectionAsc = true;
    employeeSpentTime.isActive = true;
    // this.hrDashboarService.GetAllEmployees(employeeSpentTime).subscribe((result: any) => {
    //   if (result.success) {
    //     this.loadedEmployeeList = result.data;
    //     if (!(this.canAccess_feature_CanEditOtherEmployeeDetails)) {
    //       var currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    //       this.loadedEmployeeList = this.loadedEmployeeList.filter(x => (x.userId.toLowerCase() == currentUserId.toLowerCase()));
    //     }
    //     this.employeeList = this.loadedEmployeeList;
    //   }
    // })

    const employeeListSearchResult = new EmployeeListModel();
    employeeListSearchResult.sortDirectionAsc = true;
    this.commonService.getAllEmployees(employeeListSearchResult).subscribe((result: any) => {
      if (result.success) {
        this.loadedEmployeeList = result.data;
        if (!(this.canAccess_feature_CanEditOtherEmployeeDetails)) {
          var currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
          this.loadedEmployeeList = this.loadedEmployeeList.filter(x => (x.userId.toLowerCase() == currentUserId.toLowerCase()));
        }
        this.employeeList = this.loadedEmployeeList;
      }
    })
  }
  // ngAfterViewInit() {
  //   this.e = this.element.nativeElement;
  //   let outSideClick =  this.e.addEventListener('blur',()=>{
  //     this.display = false;
  // });
  // }

  OpenMenuItems(openMenuPopUp) {
    openMenuPopUp.openPopover();
  }

  openLevel2Menu(link, event) {
    this.stateLvl1 = link;
    this.subLevels = event;
  }

  openLevel3Menu(link1, link2, event) {
    this.level3Link1 = link1;
    this.level3Link2 = link2;
    this.subLevelsForLevel2 = event;
  }

  getAllMenuItems() {
    this.menusfetchInProgress = true;
    this.store.dispatch(new GetAllMenuItemsTriggered(MenuCategories.Main));
    const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
    this.defaultDashboardId = this.cookieService.check(LocalStorageProperties.DefaultDashboard) ? JSON.parse(this.cookieService.get(LocalStorageProperties.DefaultDashboard)) : null;;
    if (this.defaultDashboardId && userReference != "null" && userReference != null) {
      this.routes.navigateByUrl("dashboard-management/dashboard/" + this.defaultDashboardId + "/form/" + userReference);
    } else if (this.defaultDashboardId) {
      this.routes.navigateByUrl("dashboard-management/dashboard/" + this.defaultDashboardId);
    }
    // this.routes.navigateByUrl("lives/welcome");
  }

  navigateToUrl(workspaceId) {
    const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
    if (userReference != "null" && userReference != null) {
      this.routes.navigateByUrl("dashboard-management/dashboard/" + workspaceId + "/form/" + userReference);
    } else {
      this.routes.navigateByUrl("dashboard-management/dashboard/" + workspaceId);
    }
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  getSearchMenuItems() {
    if (this.searchByText) {
      this.searchByTextLoading = true;
      this.rss.getSearchMenuItems({ searchText: this.searchText, searchUniqueId: null })
        .subscribe((response: any) => {
          if (response.success && response.data != null && response.data != undefined) {
            if (response.data.length > 0) {
              if (this.searchText) {
                this.projectList = response.data.filter(us => us.itemType == SearchTaskType.Project);
                this.userStorySearchList = response.data.filter(us => (us.itemType == SearchTaskType.workItemORBug) || (us.itemType == SearchTaskType.adhoc));
                this.goalSearchList = response.data.filter(us => us.itemType == SearchTaskType.goal || (us.itemType == SearchTaskType.sprint));
                const users = response.data.filter(us => us.itemType == SearchTaskType.Employee);
                this.loadedEmployeeList = users;
                if (!(this.canAccess_feature_CanEditOtherEmployeeDetails)) {
                  var currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
                  this.loadedEmployeeList = this.loadedEmployeeList.filter((x: any) => (x.itemId.toLowerCase() == currentUserId.toLowerCase()));
                }
                this.employeeList = this.loadedEmployeeList;
                if (this.projectList && this.projectList.length > 0) {
                  this.ws = this.t = this.rs = this.wd = this.selectedRowIndex = this.goalIndex = this.users = this.selectedEmployeeIndex = null;
                  this.projectIndex = 0;
                  this.itemClicked = this.projectList[0];
                }
                else if (this.userStorySearchList && this.userStorySearchList.length > 0) {
                  this.ws = this.t = this.rs = this.wd = this.selectedRowIndex = this.goalIndex = this.selectedEmployeeIndex = null;
                  this.users = 0;
                  this.itemClicked = this.userStorySearchList[0];
                } else if (this.goalSearchList && this.goalSearchList.length > 0) {
                  this.ws = this.t = this.rs = this.wd = this.selectedRowIndex = this.users = this.projectIndex = this.selectedEmployeeIndex = null;
                  this.goalIndex = 0;
                  this.itemClicked = this.goalSearchList[0];
                } else if (this.employeeList && this.employeeList.length > 0) {
                  this.ws = this.t = this.rs = this.wd = this.selectedRowIndex = this.users = this.projectIndex = this.goalIndex = null;
                  this.selectedEmployeeIndex = 0;
                  this.itemClicked = this.employeeList[0];
                } else {
                  this.users = this.goalIndex = this.projectIndex = this.selectedEmployeeIndex = null;
                }
                this.cdRef.detectChanges();
              }
            } else {
              this.userStorySearchList = [];
              this.goalSearchList = [];
            }
          }
          this.searchByTextLoading = false;
        })
    }
  }

  onProjectSelect(item, event) {
    if (event.which == 1) {
      this.searchText = '';
      this.projectList = [];
      this.InsertSearch(item.itemName, RecentSearchType.project, item.itemId);
      this.routes.navigateByUrl("projects/projectstatus/" + item.itemId + "/active-goals");
    } else {
      return;
    }
  }

  SearchItem(event) {
    this.userStorySearchList = [];
    this.goalSearchList = [];
    this.themeBaseColor = localStorage.getItem('themeColor');
    var element =
      !!document.getElementById("style-1");
    element ? document.getElementById("style-1").scrollTop = 0 : null;
    var elem =
      !!document.getElementById("style-2");
    elem ? document.getElementById("style-2").scrollTop = 0 : null;
    var emp = !!document.getElementById("style-3");
    emp ? document.getElementById("style-3").scrollTop = 0 : null;
    var widget = !!document.getElementById("style-4");
    widget ? document.getElementById("style-4").scrollTop = 0 : null;
    //this.display = true;
    this.isOpened.emit(this.display);
    if (event.target.value) {
      if (this.searchByText) {
        return this.getSearchMenuItems();
      }
      else if (this.searchById) {
        return;
      }
      this.items = this.menuItem.filter(
        item =>
          item.menu.toLowerCase().includes(event.target.value.toLowerCase()) !==
          false && item.type != "dropDown"
      );
      this.workspaces = this.workspacesForLoop.filter(
        item =>
          item.workspaceName
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) !==
          false
      );
      this.adminTools ? this.tools = this.adminTools.filter(
        item =>
          item.name.toLowerCase().includes(event.target.value.toLowerCase()) !==
          false
      ) : null;
      //this.loadWidgetsList(event.target.value);
      this.originalWidgets ? this.widgets = this.originalWidgets.filter(
        item =>
          item.widgetName.toLowerCase().includes(event.target.value.toLowerCase()) !==
          false
      ) : null;
      this.employeeList = this.loadedEmployeeList.length > 0 ? (this.loadedEmployeeList.filter(x =>
      ((x.fullName.toLowerCase().includes(event.target.value.toLowerCase()) !== false)
        || (x.employeeNumber.toLowerCase().includes(event.target.value.toLowerCase()) !== false)
        || (x.surName.toLowerCase().includes(event.target.value.toLowerCase()) !== false))
      )) : null;
      // this.allsearches ? this.recentSearches = this.allsearches.filter(
      //   item =>
      //     item.recentSearch.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
      // ) : null;
      this.allsearches ? this.recentSearches = this.allsearches.filter(
        item =>
          item.recentSearch.toLowerCase().includes(event.target.value.toLowerCase()) !==
          false
      ) : null;

      if (event.target.value && event.target.value.search('-') > 0) {
        this.rss.searchGoalTasks(event.target.value).subscribe((response: any) => {
          if (response.success && response.data != null && response.data != undefined) {
            if (response.data.length > 0) {
              if (this.searchText) {
                this.userStorySearchList = response.data.filter(us => (us.type == SearchTaskType.workItemORBug) || (us.type == SearchTaskType.adhoc));
                this.goalSearchList = response.data.filter(us => us.type == SearchTaskType.goal || (us.type == SearchTaskType.sprint));
                if (!((this.items.length > 0 && this.items) || (this.tools && this.tools.length > 0) || (this.workspaces && this.workspaces.length > 0) || (this.widgets && this.widgets.length > 0))) {
                  if (this.userStorySearchList && this.userStorySearchList.length > 0) {
                    this.ws = this.t = this.rs = this.wd = this.selectedRowIndex = this.goalIndex = null;
                    this.users = 0;
                    this.itemClicked = this.userStorySearchList[0];
                  } else if (this.goalSearchList && this.goalSearchList.length > 0) {
                    this.ws = this.t = this.rs = this.wd = this.selectedRowIndex = this.users = null;
                    this.goalIndex = 0;
                    this.itemClicked = this.goalSearchList[0];
                  } else {
                    this.users = this.goalIndex = null;
                  }
                  this.cdRef.detectChanges();
                }
              }
            } else {
              this.userStorySearchList = [];
              this.goalSearchList = [];
            }
          }
        })
      }



      //   const userStorySearchCriteriaTemp = new UserStorySearchCriteriaInputModel();
      //   userStorySearchCriteriaTemp.pageSize = 1000;
      //   userStorySearchCriteriaTemp.searchText = event.target.value;
      //   //.replace(/\s/g, "");

      //  // if (event.target.value.indexOf('-')) {
      //     this.userService.searchUserStories(userStorySearchCriteriaTemp).subscribe((response: any) => {

      //       this.userStorySearchList = [];
      //       let companySettingsModel = [];

      //       if (response.success && response.data != null && response.data != undefined && response.data.length > 0) {
      //         var userStoriesList = response.data;
      //         this.companySettingsMOdel$ = this.store.pipe(select(sharedModuleReducers.getCompanySettings));
      //         this.companySettingsMOdel$.subscribe((x) => companySettingsModel = x);
      //         let bugBoardResult = companySettingsModel.filter(item => item.key.trim() == "EnableBugBoard");
      //         if (bugBoardResult.length > 0) {
      //           this.isEnableBugBoard = bugBoardResult[0].value == "1" ? true : false;
      //         }
      //         if (!this.isEnableBugBoard) {
      //           userStoriesList = userStoriesList.map((x) => x.isBug == false);
      //         }

      //         this.userStorySearchList = userStoriesList.map(function (item) {
      //           return {
      //             goalId: item.goalId,
      //             goalName: item.goalName,
      //             goalShortName: item.goalShortName,
      //             goalUniqueName: item.goalUniqueName,
      //             projectId: item.projectId,
      //             projectName: item.projectName,
      //             sprintId: item.sprintId,
      //             sprintName: item.sprintName,
      //             userStoryId: item.userStoryId,
      //             userStoryName: item.userStoryName,
      //             userStoryStatusName: item.userStoryStatusName,
      //             userStoryTypeName: item.userStoryTypeName,
      //             userStoryUniqueName: item.userStoryUniqueName
      //           }
      //         });

      //         this.cdRef.detectChanges();
      //       }
      //     });
      //  // }

      //   let searchGoals = new GoalSearchCriteriaApiInputModel();
      //   searchGoals.searchText = event.target.value;
      //   //.replace(/\s/g, "");
      //   //if (event.target.value.indexOf('-')) {
      //   this.userService.searchGoals(searchGoals).subscribe((response: any) => {
      //     this.goalSearchList = [];

      //     if (response.success && response.data != null && response.data != undefined && response.data.length > 0) {
      //       this.goalSearchList = response.data.map(function (item) {
      //         return {
      //           goalId: item.goalId,
      //           goalName: item.goalName,
      //           goalShortName: item.goalShortName,
      //           goalUniqueName: item.goalUniqueName,
      //           projectId: item.projectId,
      //           projectName: item.projectName
      //         }
      //       });

      //       this.cdRef.detectChanges();
      //     }

      //   })
      // //}

      // if (!(this.items.length > 0) && !(this.employeeList.length > 0) && !(this.recentSearches.length > 0) && !(this.widgets.length > 0) && !(this.tools.length > 0) && !(this.workspaces.length > 0)) {
      if (!(this.items.length > 0) && !(this.recentSearches.length > 0) && !(this.widgets.length > 0) && !(this.tools.length > 0) && !(this.workspaces.length > 0)) {
        this.itemClicked = this.t = this.ws = this.wd = this.selectedRowIndex = this.selectedEmployeeIndex = this.rs = this.goalIndex = this.users = null
      }
      if (this.items && this.items.length > 0) {
        this.selectedRowIndex = 0;
        this.wd = this.ws = this.rs = this.goalIndex = this.users = this.selectedEmployeeIndex = null;
        this.t = null;
        this.itemClicked = this.items[0];
      }
      else if (this.tools && this.tools.length > 0) {
        this.selectedRowIndex = this.goalIndex = this.selectedEmployeeIndex = this.users = null;
        this.wd = this.ws = this.rs = null;
        this.t = 0;
        this.itemClicked = this.tools[0];
      } else if (this.workspaces &&
        this.workspaces.length > 0
      ) {
        this.selectedRowIndex = this.goalIndex = this.selectedEmployeeIndex = this.users = null;
        this.wd = this.t = this.rs = null;
        this.ws = 0;
        this.itemClicked = this.workspaces[0];
      } else if (
        this.widgets &&
        this.widgets.length > 0
      ) {
        this.selectedRowIndex = this.goalIndex = this.selectedEmployeeIndex = this.users = null;
        this.ws = this.t = this.rs = null;
        this.wd = 0;
        this.itemClicked = this.widgets[0];
      } else if (
        this.employeeList &&
        this.employeeList.length > 0
      ) {
        this.selectedRowIndex = null;
        this.ws = this.t = this.wd = this.rs = this.goalIndex = this.users = null;
        this.selectedEmployeeIndex = 0;
        this.itemClicked = this.employeeList[0];
      } else if (
        this.recentSearches &&
        this.recentSearches.length > 0
      ) {
        this.selectedRowIndex = null;
        this.ws = this.t = this.wd = this.users = this.goalIndex = null;
        this.rs = 0;
        this.itemClicked = this.recentSearches[0];
      }
    } else {
      if (this.menuItem) {
        this.items = this.menuItem
          .filter(item => item.type != "dropDown");
      } else {
        this.items = [];
      }
      this.workspaces = this.workspacesForLoop;
      this.tools = this.adminTools;
      this.widgets = this.originalWidgets;
      this.userStorySearchList = [];
      this.goalSearchList = [];
      this.projectList = [];
      this.recentSearches = this.allsearches;
      //this.employeeList = (this.loadedEmployeeList && this.loadedEmployeeList.length > 0) ? this.loadedEmployeeList : [];
      this.employeeList = [];
      // this.ws = this.wd = this.rs = this.t = this.users = this.goalIndex = null;
      // this.selectedRowIndex = 0;
      // this.itemClicked = this.items.length > 0 ? this.items[0] : null;
      this.searchText == "" ? (this.searchText = undefined) : null;
    }
    this.cdRef.detectChanges();
  }

  closeSearch(event) {
    this.searchText = '';
    this.items = this.menuItem
      .filter(item => item.type != "dropDown")
      .sort((a, b) => (a.menu.toLowerCase() > b.menu.toLowerCase() ? 1 : -1));
    this.workspaces = this.workspacesForLoop;
    this.widgets = this.originalWidgets;
    this.tools = this.adminTools;
    this.recentSearches = this.allsearches;
    this.ws = this.wd = this.rs = this.t = this.users = this.selectedEmployeeIndex = this.goalIndex = null;
    this.selectedRowIndex = 0;
    this.itemClicked = this.items[0];
    this.display = true;
    this.userStorySearchList = [];
    this.goalSearchList = [];
    this.projectList = [];
    this.element.nativeElement.focus();
    this.employeeList = this.loadedEmployeeList.length > 0 ? this.loadedEmployeeList : [];
    this.isOpened.emit(this.display);
  }

  navigate(event, item) {
    if (this.searchById) {
      this.searchByTextLoading = true;
      this.rss.getSearchMenuItems({ searchText: null, searchUniqueId: this.searchText })
        .subscribe((res: any) => {
          if (res.success) {
            if (res.data.length > 0) {
              this.redirectToRoute(res.data[0]);
            } else {
              this.toastr.warning('Given Id is not valid, please provide correct id to navigate');
            }
          } else if (!res.success) {
            this.toastr.error(res.apiResponseMessages[0].message);
          }
          this.searchByTextLoading = false;
        });
    }
    else if (item) {
      this.redirectToRoute(item);
    }
  }

  redirectToRoute(item) {
    var name;
    if (this.searchByText || this.searchById) {
      if (item.itemType && (item.itemType == SearchTaskType.workItemORBug) || (item.itemType == SearchTaskType.adhoc)) {
        this.searchText = '';
        this.element.nativeElement.blur();
        //this.InsertSearch(item.uniquenName);
        //if (this.projectSearchResults.filter(element => element.projectId == item.projectId).length > 0) {
        if (item.itemType == SearchTaskType.workItemORBug) {
          this.InsertSearch(this.searchById ? item.itemUniqueName : item.itemName, RecentSearchType.workItemOrBug, item.itemId);
          this.routes.navigate(["projects/workitem", item.itemUniqueName], { fragment: 'unique' });
        } else {
          this.InsertSearch(this.searchById ? item.itemUniqueName : item.itemName, RecentSearchType.adhoc, item.itemId);
          this.routes.navigate(["dashboard/adhoc-workitem", item.itemId]);
        }
        // }
      } else if (item.itemType && (item.itemType == SearchTaskType.goal || item.itemType == SearchTaskType.sprint)) {
        this.searchText = '';
        this.element.nativeElement.blur();
        //if (this.projectSearchResults.filter(element => element.projectId == item.projectId).length > 0) {
        if (item.itemType == SearchTaskType.goal) {
          this.InsertSearch(this.searchById ? item.itemUniqueName : item.itemName, RecentSearchType.goal, item.itemId);
          this.routes.navigate(["projects/goal", item.itemUniqueName], { fragment: 'unique' });
        } else {
          this.InsertSearch(this.searchById ? item.itemUniqueName : item.itemName, RecentSearchType.sprint, item.itemId);
          this.routes.navigate(["projects/sprint", item.itemUniqueName], { fragment: 'unique' });
        }
        // }
      }
      else if (item.itemType == SearchTaskType.Employee) {
        this.searchText = '';
        this.element.nativeElement.blur();
        this.InsertSearch(this.searchById ? item.itemUniqueName : item.itemName, RecentSearchType.employee, item.itemId);
        this.routes.navigateByUrl(
          "/dashboard/profile/" + item.itemId + "/overview"
        );
      } else if (item.itemType == SearchTaskType.Project) {
        this.searchText = '';
        this.InsertSearch(this.searchById ? item.itemUniqueName : item.itemName, RecentSearchType.project, item.itemId);
        this.element.nativeElement.blur();
        this.routes.navigateByUrl("projects/projectstatus/" + item.itemId + "/active-goals");
      }
    }

    else if (item.menu) {
      this.searchText = '';
      this.element.nativeElement.blur();
      name = item.menu;
      this.routes.navigate([item.state]);
      this.InsertSearch(name, RecentSearchType.menu, item.id);
    }
    // else if (item.permission) {
    //   this.searchText = '';
    //   this.element.nativeElement.blur();
    //   name = item.name;
    //   this.InsertSearch(name, Rece);
    //   this.routes.navigate([item.link]);
    // } 
    else if (item.workspaceId) {
      this.searchText = '';
      this.element.nativeElement.blur();
      name = item.workspaceName;
      this.InsertSearch(name, RecentSearchType.dashboard, item.workspaceId);
      const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
      if (userReference != "null" && userReference != null) {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + item.workspaceId + "/form/" + userReference);
      } else {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + item.workspaceId);
      }
    } else if (item.widgetId) {
      this.searchText = '';
      this.element.nativeElement.blur();
      name = item.widgetName;
      this.InsertSearch(name, RecentSearchType.widget, item.widgetId);
      this.RedirectToApp(item);
    }
    else {
      this.SearchRecentItem(item, event);
    }
  }


  InsertSearch(name, recentSearchType, id) {
    this.rss.insertRecentSearch({ name: name, recentSearchType: recentSearchType, itemId: id }).subscribe((response: any) => {
      if (response.success) {
        // this.recentSearches.includes(name)
        //   ? (this.recentSearches.splice(this.recentSearches.indexOf(name), 1),
        //     this.recentSearches.splice(0, 0, name))
        //   : this.recentSearches.unshift(name);
        this.getRecentSearches();
      }
    });
  }

  SearchRecentItem(search, event) {
    this.display = true;
    this.isOpened.emit(this.display);
    if (search.recentSearchType == RecentSearchType.menu) {
      var item = this.items.filter(
        item =>
          item.menu.toLowerCase() == search.recentSearch.toLowerCase()
      );
      item.length > 0 ? this.navigate(event, item[0]) : null
    } else if (search.recentSearchType == RecentSearchType.dashboard) {
      this.searchText = '';
      this.element.nativeElement.blur();
      this.InsertSearch(search.recentSearch, RecentSearchType.dashboard, search.itemId);
      const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
      if (userReference != "null" && userReference != null) {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + search.itemId + "/form/" + userReference);
      } else {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + search.itemId);
      }
    } else if (search.recentSearchType == RecentSearchType.widget) {
      this.searchText = '';
      this.element.nativeElement.blur();
      this.InsertSearch(search.recentSearch, RecentSearchType.widget, search.itemId);
      this.routes.navigate(
        ["dashboard-management/widgets", search.itemId]
      );
    } else if (search.recentSearchType == RecentSearchType.adhoc) {
      this.searchText = '';
      this.element.nativeElement.blur();
      this.InsertSearch(search.recentSearch, RecentSearchType.adhoc, search.itemId);
      this.routes.navigate(["dashboard/adhoc-workitem", search.itemId]);
    } else if (search.recentSearchType == RecentSearchType.workItemOrBug) {
      this.searchText = '';
      this.element.nativeElement.blur();
      this.InsertSearch(search.recentSearch, RecentSearchType.workItemOrBug, search.itemId);
      this.routes.navigate(["projects/workitem", search.itemUniqueName], { fragment: 'unique' });
    } else if (search.recentSearchType == RecentSearchType.goal) {
      this.searchText = '';
      this.element.nativeElement.blur();
      this.InsertSearch(search.recentSearch, RecentSearchType.goal, search.itemId);
      this.routes.navigate(["projects/goal", search.itemUniqueName], { fragment: 'unique' });
    } else if (search.recentSearchType == RecentSearchType.sprint) {
      this.searchText = '';
      this.element.nativeElement.blur();
      this.InsertSearch(search.recentSearch, RecentSearchType.sprint, search.itemId);
      this.routes.navigate(["projects/sprint", search.itemUniqueName], { fragment: 'unique' });
    } else if (search.recentSearchType == RecentSearchType.project) {
      this.searchText = '';
      this.element.nativeElement.blur();
      this.InsertSearch(search.recentSearch, RecentSearchType.project, search.itemId);
      this.routes.navigateByUrl("projects/projectstatus/" + search.itemId + "/active-goals");
    } else if (search.recentSearchType == RecentSearchType.employee) {
      this.searchText = '';
      this.element.nativeElement.blur();
      this.InsertSearch(search.recentSearch, RecentSearchType.employee, search.itemId);
      this.routes.navigateByUrl(
        "/dashboard/profile/" + search.itemId + "/overview"
      );
    }
    event.stopPropagation();
    event.preventDefault();
  }

  selectMenu(event, click) {
    if (click.which == 1 && event.workspaceId != undefined) {
      this.display = false;
      this.searchByText = false;
      this.searchById = false;
      this.isOpened.emit(this.display);
      this.searchText = '';
      const userReference = localStorage.getItem(LocalStorageProperties.UserReferenceId);
      if (userReference != "null" && userReference != null) {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + event.workspaceId + "/form/" + userReference);
      } else {
        this.routes.navigateByUrl("dashboard-management/dashboard/" + event.workspaceId);
      }
      this.selectedDashboard = event.workspaceId;
      this.element.nativeElement.blur();
      this.menuItemName = event.workspaceName;
      this.rss
        .insertRecentSearch({ name: event.workspaceName, recentSearchType: RecentSearchType.dashboard, itemId: event.workspaceId })
        .subscribe((response: any) => {
          if (response.success) {
            // this.recentSearches.includes(event.workspaceName)
            //   ? (this.recentSearches.splice(
            //       this.recentSearches.indexOf(event.workspaceName),
            //       1
            //     ),
            //     this.recentSearches.splice(0, 0, event.workspaceName))
            //   : this.recentSearches.unshift(event.workspaceName);
            this.getRecentSearches();
          }
        });
    } else {
      return;
    }
  }

  selectEmployee(event, click) {
    if (click.which == 1) {
      this.display = false;
      this.searchByText = false;
      this.searchById = false;
      this.isOpened.emit(this.display);
      this.searchText = '';
      this.routes.navigateByUrl(
        "/dashboard/profile/" + event.itemId + "/overview"
      );
      this.selectedDashboard = event.workspaceId;
      this.selectedEmployee = event.itemId;
      this.element.nativeElement.blur();
      this.menuItemName = event.itemName;
      this.rss
        .insertRecentSearch({ name: event.itemName, recentSearchType: RecentSearchType.employee, itemId: event.itemId })
        .subscribe((response: any) => {
          if (response.success) {
            this.rss.getRecentSearch().subscribe((responseData: any) => {
              if (responseData.success) {
                this.allsearches = responseData.data;
                localStorage.setItem(LocalStorageProperties.RecentSearches, JSON.stringify(this.allsearches));
                this.recentSearches = responseData.data;
              }
            });
          }
        });
    }
    else {
      return;
    }
  }

  selectAdimnTool(link, event, item) {
    if (event.which == 1) {
      this.display = false;
      this.searchByText = false;
      this.searchById = false;
      this.isOpened.emit(this.display);
      this.searchText = '';
      this.routes.navigate([link]);
      this.element.nativeElement.blur();
      this.rss.insertRecentSearch({ name: item.menu, recentSearchType: RecentSearchType.menu, itemId: item.id }).subscribe((response: any) => {
        if (response.success) {
          // this.recentSearches.includes(name)
          //   ? (this.recentSearches.splice(this.recentSearches.indexOf(name), 1),
          //     this.recentSearches.splice(0, 0, name))
          //   : this.recentSearches.unshift(name);
          this.getRecentSearches();
        }
      });
    } else {
      return;
    }
  }


  OnSelect(widget, event) {
    if (event.which == 1) {
      this.searchText = '';
      this.RedirectToApp(widget);
      this.rss
        .insertRecentSearch({ name: widget.widgetName, recentSearchType: RecentSearchType.widget, itemId: widget.widgetId })
        .subscribe((response: any) => {
          if (response.success) {
            // this.recentSearches.includes(widget.widgetName)
            //   ? (this.recentSearches.splice(
            //       this.recentSearches.indexOf(widget.widgetName),
            //       1
            //     ),
            //     this.recentSearches.splice(0, 0, widget.widgetName))
            //   : this.recentSearches.unshift(widget.widgetName);
            this.getRecentSearches();
          }
        });
    } else {
      return;
    }
  }


  getRecentSearches() {
    this.recentSearchesfetchInProgress = true;
    this.rss.getRecentSearch().subscribe((responseData: any) => {
      if (responseData.success) {
        this.allsearches = responseData.data;
        this.recentSearches = responseData.data;
        localStorage.setItem(LocalStorageProperties.RecentSearches, JSON.stringify(this.allsearches));
        this.recentSearchesfetchInProgress = false;
        this.cdRef.detectChanges();
      }
    });
  }

  RedirectToApp(widget) {
    this.routes.navigate(
      ["dashboard-management/widgets", widget.widgetId]
    );
  }



  OnGoalSelect(goal, event) {
    if (event.which == 1) {
      this.searchText = '';
      this.RedirectToGoal(goal);
    } else {
      return;
    }
  }

  RedirectToGoal(goal) {
    //if (this.projectSearchResults.filter(item => item.projectId == goal.projectId).length > 0) {
    if (goal.itemType == SearchTaskType.goal) {
      this.InsertSearch(goal.itemName, RecentSearchType.goal, goal.itemId);
      this.routes.navigate(["projects/goal", goal.itemUniqueName], { fragment: 'unique' });
    } else {
      this.InsertSearch(goal.itemName, RecentSearchType.sprint, goal.itemId);
      this.routes.navigate(["projects/sprint", goal.itemUniqueName], { fragment: 'unique' });
    }
    this.goalSearchList = [];
    this.display = true;
    this.isOpened.emit(this.display);
  }
  //  }

  OnUserStorySelect(userStory, event) {
    if (event.which == 1) {
      this.searchText = '';
      this.RedirectToUserStory(userStory);
    } else {
      return;
    }
  }

  RedirectToUserStory(userStory) {
    //if (this.projectSearchResults.filter(item => item.projectId == userStory.projectId).length > 0) {
    if (userStory.itemType == SearchTaskType.workItemORBug) {
      this.InsertSearch(userStory.itemName, RecentSearchType.workItemOrBug, userStory.itemId);
      this.routes.navigate(["projects/workitem", userStory.itemUniqueName], { fragment: 'unique' });
    } else {
      this.InsertSearch(userStory.itemName, RecentSearchType.adhoc, userStory.itemId);
      this.routes.navigate(["dashboard/adhoc-workitem", userStory.itemId]);
    }
    this.userStorySearchList = [];
    this.display = true;
    this.isOpened.emit(this.display);
  }
  // }

  Set() {
    this.display = false;
    this.isOpened.emit(this.display);
    // if (
    //   this.searchText == undefined ||
    //   this.searchText == null ||
    //   this.searchText === ""
    // ) {
    //   this.ws = this.wd = this.rs = this.selectedEmployeeIndex = this.t = null;
    //   this.selectedRowIndex = 0;
    //   this.itemClicked = this.items[0];
    // }
  }
  arrowDownEventForSearchByText() {
    if (this.itemClicked.itemType == SearchTaskType.Project && this.projectIndex < this.projectList.length - 1) {
      document.getElementById("style-7").scrollTop += 45;
      this.projectIndex++;
      this.itemClicked = this.projectList[this.projectIndex];
    } else if (this.itemClicked.itemType == SearchTaskType.Project && this.projectIndex == this.projectList.length - 1 && this.userStorySearchList && this.userStorySearchList.length > 0) {
      document.getElementById("style-5").scrollTop = 0;
      this.selectedEmployeeIndex = this.projectIndex = this.goalIndex = null;
      this.users = 0;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.itemType == SearchTaskType.Project && this.projectIndex == this.projectList.length - 1 && this.goalSearchList && this.goalSearchList.length > 0) {
      document.getElementById("style-6").scrollTop = 0;
      this.selectedEmployeeIndex = this.projectIndex = this.users = null;
      this.goalIndex = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.itemType == SearchTaskType.Project && this.projectIndex == this.projectList.length - 1 && this.employeeList && this.employeeList.length > 0) {
      document.getElementById("style-4").scrollTop = 0;
      this.goalIndex = this.projectIndex = this.users = null;
      this.selectedEmployeeIndex = 0;
      this.itemClicked = this.employeeList[0];
    } else if ((this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.users < this.userStorySearchList.length - 1) {
      document.getElementById("style-5").scrollTop += 45;
      this.users++;
      this.itemClicked = this.userStorySearchList[this.users];
    } else if ((this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.users == this.userStorySearchList.length - 1
      && this.goalSearchList && this.goalSearchList.length > 0) {
      document.getElementById("style-6").scrollTop += 45;
      this.selectedEmployeeIndex = this.projectIndex = this.users = null;
      this.goalIndex = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if ((this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.users == this.userStorySearchList.length - 1
      && this.employeeList && this.employeeList.length > 0) {
      document.getElementById("style-4").scrollTop = 0;
      this.goalIndex = this.projectIndex = this.users = null;
      this.selectedEmployeeIndex = 0;
      this.itemClicked = this.employeeList[0];
    } else if ((this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.goalIndex < this.goalSearchList.length - 1) {
      document.getElementById("style-6").scrollTop += 45;
      this.goalIndex++;
      this.itemClicked = this.goalSearchList[this.goalIndex];
    } else if ((this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.goalIndex == this.goalSearchList.length - 1
      && this.employeeList && this.employeeList.length > 0) {
      document.getElementById("style-4").scrollTop = 0;
      this.goalIndex = this.projectIndex = this.users = null;
      this.selectedEmployeeIndex = 0;
      this.itemClicked = this.employeeList[0];
    } else if (this.itemClicked.itemType == SearchTaskType.Employee && this.selectedEmployeeIndex < this.employeeList.length - 1) {
      document.getElementById("style-4").scrollTop += 45;
      this.selectedEmployeeIndex++;
      this.itemClicked = this.employeeList[this.selectedEmployeeIndex];
    }
  }
  arrowDownEvent() {
    // if (
    //   this.searchText != undefined ||
    //   this.searchText != null ||
    //   this.searchText === ""
    // ) {
    //   return;
    // }
    if (this.searchByText && this.searchText) {
      this.arrowDownEventForSearchByText();
    }
    else if (
      this.itemClicked.menu &&
      this.selectedRowIndex < this.items.length - 1
    ) {
      //this.menuElement.nativeElement.scrollBy(0, 100);
      document.getElementById("style-1").scrollTop += 45;
      this.selectedRowIndex++;
      this.itemClicked = this.items[this.selectedRowIndex];
      // this.highlight(nextrow);
    } else if (
      this.itemClicked.workspaceId &&
      this.ws < this.workspaces.length - 1
    ) {
      this.ws++;
      document.getElementById("style-2").scrollTop += 41;
      this.itemClicked = this.workspaces[this.ws];
      // this.highlight(nextrow);
    } else if (this.itemClicked.widgetId && this.wd < this.widgets.length - 1) {
      document.getElementById("style-3").scrollTop += 48;
      this.wd++;
      this.itemClicked = this.widgets[this.wd];
    } else if (this.itemClicked.employeeNumber && this.selectedEmployeeIndex < this.employeeList.length - 1) {
      document.getElementById("style-4").scrollTop += 45;
      this.selectedEmployeeIndex++;
      this.itemClicked = this.employeeList[this.selectedEmployeeIndex];
      // this.highlight(nextrow);
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.users < this.userStorySearchList.length - 1) {
      document.getElementById("style-5").scrollTop += 45;
      this.users++;
      this.itemClicked = this.userStorySearchList[this.users];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.goalIndex < this.goalSearchList.length - 1) {
      document.getElementById("style-6").scrollTop += 45;
      this.goalIndex++;
      this.itemClicked = this.goalSearchList[this.goalIndex];
    } else if (this.itemClicked.recentSearch && this.rs < 8) {
      this.rs++;
      this.itemClicked = this.recentSearches[this.rs];
    } else if (this.itemClicked.menu && this.selectedRowIndex == this.items.length - 1 && this.workspaces && this.workspaces.length > 0) {
      document.getElementById("style-2").scrollTop = 0;
      this.t = null;
      this.wd = this.rs = this.selectedRowIndex = this.selectedEmployeeIndex = this.users = this.goalIndex = null;
      this.ws = 0;
      this.itemClicked = this.workspaces[0];
    } else if (this.itemClicked.menu && this.selectedRowIndex == this.items.length - 1 && this.widgets && this.widgets.length > 0) {
      this.selectedRowIndex = null;
      document.getElementById("style-3").scrollTop = 0;
      this.t = this.ws = this.rs = this.selectedEmployeeIndex = this.users = this.goalIndex = null;
      this.wd = 0;
      this.itemClicked = this.widgets[0];
    } else if (this.itemClicked.menu && this.selectedRowIndex == this.items.length - 1 && this.employeeList && this.employeeList.length > 0) {
      this.t = null;
      document.getElementById("style-4").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      this.itemClicked = this.employeeList[0];
    } else if (this.itemClicked.menu && this.selectedRowIndex == this.items.length - 1 && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.t = null;
      document.getElementById("style-5").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.goalIndex = null;
      this.users = 0;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.menu && this.selectedRowIndex == this.items.length - 1 && this.goalSearchList && this.goalSearchList.length > 0) {
      this.t = null;
      document.getElementById("style-6").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.goalIndex = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.menu && this.selectedRowIndex == this.items.length - 1 && this.recentSearches && this.recentSearches.length > 0) {
      this.t = null;
      this.wd = this.goalIndex = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.rs = 0;
      this.itemClicked = this.recentSearches[0];
    } else if (this.itemClicked.workspaceId && this.ws == this.workspaces.length - 1 && this.widgets && this.widgets.length > 0) {
      this.selectedRowIndex = null;
      document.getElementById("style-3").scrollTop = 0;
      this.t = this.ws = this.rs = this.selectedEmployeeIndex = this.users = this.goalIndex = null;
      this.wd = 0;
      this.itemClicked = this.widgets[0];
    } else if (this.itemClicked.workspaceId && this.ws == this.workspaces.length - 1 && this.employeeList && this.employeeList.length > 0) {
      this.t = null;
      document.getElementById("style-4").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      this.itemClicked = this.employeeList[0];
    } else if (this.itemClicked.workspaceId && this.ws == this.workspaces.length - 1 && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.t = null;
      document.getElementById("style-5").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.goalIndex = null;
      this.users = 0;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.workspaceId && this.ws == this.workspaces.length - 1 && this.goalSearchList && this.goalSearchList.length > 0) {
      this.t = null;
      document.getElementById("style-6").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.goalIndex = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.workspaceId && this.ws == this.workspaces.length - 1 && this.recentSearches && this.recentSearches.length > 0) {
      this.t = null;
      this.wd = this.goalIndex = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.rs = 0;
      this.itemClicked = this.recentSearches[0];
    } else if (this.itemClicked.widgetId && this.wd == this.widgets.length - 1 && this.employeeList && this.employeeList.length > 0) {
      this.t = null;
      document.getElementById("style-4").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      this.itemClicked = this.employeeList[0];
    } else if (this.itemClicked.widgetId && this.wd == this.widgets.length - 1 && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.t = null;
      document.getElementById("style-5").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.goalIndex = null;
      this.users = 0;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.widgetId && this.wd == this.widgets.length - 1 && this.goalSearchList && this.goalSearchList.length > 0) {
      this.t = null;
      document.getElementById("style-6").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.goalIndex = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.widgetId && this.wd == this.widgets.length - 1 && this.recentSearches && this.recentSearches.length > 0) {
      this.t = null;
      this.wd = this.goalIndex = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.rs = 0;
      this.itemClicked = this.recentSearches[0];
    } else if (this.itemClicked.employeeNumber && this.selectedEmployeeIndex == this.employeeList.length - 1 && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.t = null;
      document.getElementById("style-5").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.goalIndex = null;
      this.users = 0;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.employeeNumber && this.selectedEmployeeIndex == this.employeeList.length - 1 && this.goalSearchList && this.goalSearchList.length > 0) {
      this.t = null;
      document.getElementById("style-6").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.goalIndex = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.employeeNumber && this.selectedEmployeeIndex == this.employeeList.length - 1 && this.recentSearches && this.recentSearches.length > 0) {
      this.t = null;
      this.wd = this.goalIndex = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.rs = 0;
      this.itemClicked = this.recentSearches[0];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) &&
      this.users == this.userStorySearchList.length - 1 && this.goalSearchList && this.goalSearchList.length > 0) {
      this.t = null;
      document.getElementById("style-6").scrollTop = 0;
      this.wd = this.rs = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.goalIndex = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) &&
      this.users == this.userStorySearchList.length - 1 && this.recentSearches && this.recentSearches.length > 0) {
      this.t = null;
      this.wd = this.goalIndex = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.rs = 0;
      this.itemClicked = this.recentSearches[0];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) &&
      this.goalIndex == this.goalSearchList.length - 1 && this.recentSearches && this.recentSearches.length > 0) {
      this.t = null;
      this.wd = this.goalIndex = this.selectedRowIndex = this.t = this.ws = this.selectedEmployeeIndex = this.users = null;
      this.rs = 0;
      this.itemClicked = this.recentSearches[0];
    }


    // else if (this.itemClicked.workspaceId && this.ws == this.workspaces.length - 1 && this.widgets && this.widgets.length > 0) {
    //   document.getElementById("style-4").scrollTop = 0;
    //   this.t = null;
    //   this.ws = this.rs = this.selectedRowIndex = this.selectedEmployeeIndex = null;
    //   this.wd = 0;
    //   this.itemClicked = this.widgets[0];
    // } else if (this.itemClicked.workspaceId && this.ws == this.workspaces.length - 1 && this.employeeList && this.employeeList.length > 0) {
    //   document.getElementById("style-3").scrollTop = 0;
    //   this.wd = null;
    //   this.ws = this.rs = this.selectedRowIndex = null;
    //   this.selectedEmployeeIndex = 0;
    //   this.itemClicked = this.employeeList[0];
    // } else if (this.itemClicked.workspaceId && this.ws == this.workspaces.length - 1 && this.recentSearches && this.recentSearches.length > 0) {
    //   this.wd = null;
    //   this.ws = this.rs = this.selectedEmployeeIndex = this.selectedRowIndex = null;
    //   this.rs = 0;
    //   this.itemClicked = this.recentSearches[0];
    // } else if (this.itemClicked.widgetId && this.wd == 8 && this.employeeList && this.employeeList.length > 0) {
    //   document.getElementById("style-3").scrollTop = 0;
    //   this.wd = null;
    //   this.ws = this.rs = this.selectedRowIndex = null;
    //   this.rs = null;
    //   this.selectedEmployeeIndex = 0
    //   this.itemClicked = this.employeeList[0];
    // }
    // else if (this.itemClicked.widgetId && this.wd == 8 && this.recentSearches && this.recentSearches.length > 0) {
    //   this.wd = null;
    //   this.ws = this.rs = this.selectedEmployeeIndex = this.selectedRowIndex = null;
    //   this.rs = 0;
    //   this.itemClicked = this.recentSearches[0];
    // }
    // else if (this.itemClicked.fullName && this.selectedEmployeeIndex == this.employeeList.length - 1 && this.recentSearches && this.recentSearches.length > 0) {
    //   this.wd = null;
    //   this.ws = this.rs = this.selectedEmployeeIndex = this.selectedRowIndex = null;
    //   this.rs = 0;
    //   this.itemClicked = this.recentSearches[0];
    // }
    // else {
    //   if (this.rs !== null && this.rs !== undefined && this.recentSearches.length > 8 && this.rs < 8) {
    //     this.rs++;
    //     this.itemClicked = this.recentSearches[this.rs];
    //     // this.highlight(nextrow);
    //   }
    //   else if (this.rs !== null && this.rs !== undefined && (this.recentSearches.length) - 1 > this.rs && this.rs < 8) {
    //     this.rs++;
    //     this.itemClicked = this.recentSearches[this.rs];
    //   }
    // }


  }
  arrowUpEventForSearchByText() {
    if (this.itemClicked.itemType == SearchTaskType.Project && this.projectIndex > 0) {
      this.projectIndex--;
      document.getElementById("style-7").scrollTop -= 45;
      this.itemClicked = this.projectList[this.projectIndex];
    } else if ((this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.itemClicked.itemId == this.userStorySearchList[0].itemId && this.users == 0 && this.projectList && this.projectList.length > 0) {
      this.selectedEmployeeIndex = this.users = this.goalIndex = null;
      this.projectIndex = this.projectList.length - 1;
      this.itemClicked = this.projectList[this.projectIndex];
      document.getElementById("style-7").scrollTop = document.getElementById("style-7").scrollHeight;
    } else if ((this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.users > 0) {
      this.users--;
      document.getElementById("style-5").scrollTop -= 45;
      this.itemClicked = this.userStorySearchList[this.users];
    } else if ((this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.itemClicked.itemId == this.goalSearchList[0].itemId && this.goalIndex == 0 && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.projectIndex = this.goalIndex = this.selectedEmployeeIndex = null;
      this.users = this.userStorySearchList.length - 1;
      this.itemClicked = this.userStorySearchList[this.users];
      document.getElementById("style-5").scrollTop = document.getElementById("style-5").scrollHeight;
    } else if ((this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.itemClicked.itemId == this.goalSearchList[0].itemId && this.goalIndex == 0 && this.projectList && this.projectList.length > 0) {
      this.selectedEmployeeIndex = this.users = this.goalIndex = null;
      this.projectIndex = this.projectList.length - 1;
      this.itemClicked = this.projectList[this.projectIndex];
      document.getElementById("style-7").scrollTop = document.getElementById("style-7").scrollHeight;
    } else if ((this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.goalIndex > 0) {
      this.goalIndex--;
      document.getElementById("style-6").scrollTop -= 45;
      this.itemClicked = this.goalSearchList[this.goalIndex];
    } else if (this.itemClicked.itemType == SearchTaskType.Employee && this.itemClicked.itemId == this.employeeList[0].itemId && this.selectedEmployeeIndex == 0 && this.goalSearchList && this.goalSearchList.length > 0) {
      this.projectIndex = this.selectedEmployeeIndex = this.users = null;
      this.goalIndex = this.goalSearchList.length - 1;
      this.itemClicked = this.goalSearchList[this.goalIndex];
      document.getElementById("style-6").scrollTop = document.getElementById("style-6").scrollHeight;
    } else if (this.itemClicked.itemType == SearchTaskType.Employee && this.itemClicked.itemId == this.employeeList[0].itemId && this.selectedEmployeeIndex == 0 && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.projectIndex = this.goalIndex = this.selectedEmployeeIndex = null;
      this.users = this.userStorySearchList.length - 1;
      this.itemClicked = this.userStorySearchList[this.users];
      document.getElementById("style-5").scrollTop = document.getElementById("style-5").scrollHeight;
    } else if (this.itemClicked.itemType == SearchTaskType.Employee && this.itemClicked.itemId == this.employeeList[0].itemId && this.selectedEmployeeIndex == 0 && this.projectList && this.projectList.length > 0) {
      this.selectedEmployeeIndex = this.users = this.goalIndex = null;
      this.projectIndex = this.projectList.length - 1;
      this.itemClicked = this.projectList[this.projectIndex];
      document.getElementById("style-7").scrollTop = document.getElementById("style-7").scrollHeight;
    } else if (this.itemClicked.itemType == SearchTaskType.Employee && this.selectedEmployeeIndex > 0) {
      this.selectedEmployeeIndex--;
      document.getElementById("style-4").scrollTop -= 45;
      this.itemClicked = this.employeeList[this.selectedEmployeeIndex];
    }
  }
  arrowUpEvent() {
    // if (
    //   this.searchText != undefined ||
    //   this.searchText != null ||
    //   this.searchText === ""
    // ) {
    //   return;
    // } 
    if (this.searchByText && this.searchText) {
      this.arrowUpEventForSearchByText();
    }
    //From menus
    else if (this.itemClicked.menu && this.selectedRowIndex > 0) {
      this.selectedRowIndex--;
      document.getElementById("style-1").scrollTop -= 45;
      this.itemClicked = this.items[this.selectedRowIndex];
    }
    //From workspaces
    else if (
      this.itemClicked.workspaceId &&
      this.itemClicked.workspaceId == this.workspaces[0].workspaceId && this.ws == 0 &&
      this.items && this.items.length > 0
    ) {
      this.ws = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = null;
      this.selectedRowIndex = this.items.length - 1;
      this.itemClicked = this.items[this.selectedRowIndex];
      document.getElementById("style-1").scrollTop = document.getElementById("style-1").scrollHeight;
    } else if (this.itemClicked.workspaceId && this.ws > 0) {
      document.getElementById("style-2").scrollTop -= 41;
      this.ws--;
      this.itemClicked = this.workspaces[this.ws];
    }
    //From widgets    
    else if (this.itemClicked.widgetId && this.wd > 0) {
      document.getElementById("style-3").scrollTop -= 48;
      this.wd--;
      this.itemClicked = this.widgets[this.wd];
    } else if (this.itemClicked.widgetId && this.itemClicked.widgetId == this.widgets[0].widgetId && this.wd == 0 &&
      this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.ws = this.workspaces.length - 1;
      this.itemClicked = this.workspaces[this.ws];
      document.getElementById("style-2").scrollTop = document.getElementById("style-2").scrollHeight;
    } else if (this.itemClicked.widgetId && this.itemClicked.widgetId == this.widgets[0].widgetId && this.wd == 0 &&
      this.items && this.items.length > 0) {
      this.ws = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.selectedRowIndex = this.items.length - 1;
      this.itemClicked = this.items[this.selectedRowIndex];
      document.getElementById("style-1").scrollTop = document.getElementById("style-1").scrollHeight;
    }
    //From Employees   
    else if (this.itemClicked.employeeNumber && this.selectedEmployeeIndex > 0) {
      document.getElementById("style-4").scrollTop -= 45;
      this.selectedEmployeeIndex--;
      this.itemClicked = this.employeeList[this.selectedEmployeeIndex];
    } else if (this.itemClicked.employeeNumber && this.itemClicked.employeeNumber == this.employeeList[0].employeeNumber && this.selectedEmployeeIndex == 0 &&
      this.widgets && this.widgets.length > 0) {
      this.ws = this.t = this.selectedRowIndex = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.wd = this.widgets.length - 1;
      this.itemClicked = this.widgets[this.wd];
      document.getElementById("style-3").scrollTop = document.getElementById("style-3").scrollHeight;
    } else if (this.itemClicked.employeeNumber && this.itemClicked.employeeNumber == this.employeeList[0].employeeNumber && this.selectedEmployeeIndex == 0 &&
      this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.ws = this.workspaces.length - 1;
      this.itemClicked = this.workspaces[this.ws];
      document.getElementById("style-2").scrollTop = document.getElementById("style-2").scrollHeight;
    } else if (this.itemClicked.employeeNumber && this.itemClicked.employeeNumber == this.employeeList[0].employeeNumber && this.selectedEmployeeIndex == 0 &&
      this.workspaces && this.workspaces.length > 0) {
      this.ws = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.selectedRowIndex = this.items.length - 1;
      this.itemClicked = this.items[this.selectedRowIndex];
      document.getElementById("style-1").scrollTop = document.getElementById("style-1").scrollHeight;
    }
    //From WI/Bug         NEED TO DO 
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc)
      && this.users > 0) {
      document.getElementById("style-5").scrollTop -= 45;
      this.users--;
      this.itemClicked = this.userStorySearchList[this.users];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) &&
      this.users == 0 && this.employeeList && this.employeeList.length > 0) {
      this.ws = this.t = this.selectedRowIndex = this.users = this.wd = this.goalIndex = this.rs = null;
      this.selectedEmployeeIndex = this.employeeList.length - 1;
      this.itemClicked = this.employeeList[this.selectedEmployeeIndex];
      document.getElementById("style-4").scrollTop = document.getElementById("style-4").scrollHeight;
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) &&
      this.users == 0 && this.widgets && this.widgets.length > 0) {
      this.selectedRowIndex = this.t = this.ws = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.wd = this.widgets.length - 1;
      this.itemClicked = this.widgets[this.wd];
      document.getElementById("style-3").scrollTop = document.getElementById("style-3").scrollHeight;
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) &&
      this.users == 0 && this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.ws = this.workspaces.length - 1;
      this.itemClicked = this.workspaces[this.ws];
      document.getElementById("style-2").scrollTop = document.getElementById("style-2").scrollHeight;
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) &&
      this.users == 0 && this.workspaces && this.workspaces.length > 0) {
      this.ws = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.selectedRowIndex = this.items.length - 1;
      this.itemClicked = this.items[this.selectedRowIndex];
      document.getElementById("style-1").scrollTop = document.getElementById("style-1").scrollHeight;
    }
    //From goal/sprint
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint)
      && this.goalIndex > 0) {
      document.getElementById("style-6").scrollTop -= 45;
      this.goalIndex--;
      this.itemClicked = this.goalSearchList[this.goalIndex];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) &&
      this.goalIndex == 0 && this.userStoryList && this.userStoryList.length > 0) {
      this.ws = this.t = this.selectedRowIndex = this.selectedEmployeeIndex = this.wd = this.goalIndex = this.rs = null;
      this.users = this.employeeList.length - 1;
      this.itemClicked = this.userStoryList[this.users];
      document.getElementById("style-5").scrollTop = document.getElementById("style-5").scrollHeight;
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) &&
      this.goalIndex == 0 && this.employeeList && this.employeeList.length > 0) {
      this.ws = this.t = this.selectedRowIndex = this.users = this.wd = this.goalIndex = this.rs = null;
      this.selectedEmployeeIndex = this.employeeList.length - 1;
      this.itemClicked = this.employeeList[this.selectedEmployeeIndex];
      document.getElementById("style-4").scrollTop = document.getElementById("style-4").scrollHeight;
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) &&
      this.goalIndex == 0 && this.widgets && this.widgets.length > 0) {
      this.selectedRowIndex = this.t = this.ws = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.wd = this.widgets.length - 1;
      this.itemClicked = this.widgets[this.wd];
      document.getElementById("style-3").scrollTop = document.getElementById("style-3").scrollHeight;
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemTypetype == SearchTaskType.sprint) &&
      this.goalIndex == 0 && this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.ws = this.workspaces.length - 1;
      this.itemClicked = this.workspaces[this.ws];
      document.getElementById("style-2").scrollTop = document.getElementById("style-2").scrollHeight;
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) &&
      this.goalIndex == 0 && this.workspaces && this.workspaces.length > 0) {
      this.ws = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.selectedRowIndex = this.items.length - 1;
      this.itemClicked = this.items[this.selectedRowIndex];
      document.getElementById("style-1").scrollTop = document.getElementById("style-1").scrollHeight;
    }
    //From recent searches
    else if (this.itemClicked.recentSearch && this.rs > 0) {
      this.rs--;
      this.itemClicked = this.recentSearches[this.rs];
    } else if (this.itemClicked.recentSearch && this.rs == 0 &&
      this.goalSearchList && this.goalSearchList.length > 0) {
      this.ws = this.t = this.selectedRowIndex = this.users = this.selectedEmployeeIndex = this.wd = this.rs = null;
      this.goalIndex = this.goalSearchList.length - 1;
      this.itemClicked = this.goalSearchList[this.goalIndex];
      document.getElementById("style-6").scrollTop = document.getElementById("style-6").scrollHeight;
    } else if (this.itemClicked.recentSearch && this.rs == 0 &&
      this.userStoryList && this.userStoryList.length > 0) {
      this.ws = this.t = this.selectedRowIndex = this.wd = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.users = this.userStoryList.length - 1;
      this.itemClicked = this.userStoryList[this.users];
      document.getElementById("style-5").scrollTop = document.getElementById("style-5").scrollHeight;
    } else if (this.itemClicked.recentSearch && this.rs == 0 &&
      this.employeeList && this.employeeList.length > 0) {
      this.ws = this.t = this.selectedRowIndex = this.wd = this.wd = this.goalIndex = this.rs = null;
      this.selectedEmployeeIndex = this.employeeList.length - 1;
      this.itemClicked = this.employeeList[this.selectedEmployeeIndex];
      document.getElementById("style-4").scrollTop = document.getElementById("style-4").scrollHeight;
    } else if (this.itemClicked.recentSearch && this.rs == 0 &&
      this.widgets && this.widgets.length > 0) {
      this.ws = this.t = this.selectedRowIndex = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.wd = this.widgets.length - 1;
      this.itemClicked = this.widgets[this.wd];
      document.getElementById("style-3").scrollTop = document.getElementById("style-3").scrollHeight;
    } else if (this.itemClicked.recentSearch && this.rs == 0 &&
      this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.ws = this.workspaces.length - 1;
      this.itemClicked = this.workspaces[this.ws];
      document.getElementById("style-2").scrollTop = document.getElementById("style-2").scrollHeight;
    } else if (this.itemClicked.recentSearch && this.rs == 0 &&
      this.workspaces && this.workspaces.length > 0) {
      this.ws = this.t = this.wd = this.users = this.selectedEmployeeIndex = this.goalIndex = this.rs = null;
      this.selectedRowIndex = this.items.length - 1;
      this.itemClicked = this.items[this.selectedRowIndex];
      document.getElementById("style-1").scrollTop = document.getElementById("style-1").scrollHeight;
    }


    // else if (this.itemClicked.recentSearch && this.rs == 0 && this.employeeList && this.employeeList.length > 0) {
    //   document.getElementById("style-3").scrollTop = document.getElementById("style-3").scrollHeight;
    //   this.selectedEmployeeIndex = this.employeeList.length - 1;
    //   this.rs = this.t = this.ws = this.wd = this.selectedRowIndex = null;
    //   this.itemClicked = this.employeeList[this.selectedEmployeeIndex];
    // } else if (this.itemClicked.recentSearch && this.rs == 0 && this.widgets && this.widgets.length > 0) {
    //   this.wd = this.widgets.length - 1;
    //   this.rs = this.selectedRowIndex = this.t = this.selectedEmployeeIndex = this.ws = null;
    //   this.itemClicked = this.widgets[this.wd];
    // } else if (this.itemClicked.recentSearch && this.rs == 0 && this.workspaces && this.workspaces.length > 0) {
    //   this.ws = this.workspaces.length - 1;
    //   this.rs = this.selectedRowIndex = this.selectedEmployeeIndex = this.t = this.wd = null;
    //   this.itemClicked = this.workspaces[this.ws];
    // } else if (this.itemClicked.recentSearch && this.rs == 0 && this.tools && this.tools.length > 0) {
    //   this.t = this.tools.length - 1;
    //   this.rs = this.selectedRowIndex = this.selectedEmployeeIndex = this.ws = this.wd = null;
    //   this.itemClicked = this.workspaces[this.t];
    // } else if (this.itemClicked.recentSearch && this.rs == 0 && this.items && this.items.length > 0) {
    //   this.selectedRowIndex = this.items.length - 1;
    //   this.rs = this.t = this.ws = this.selectedEmployeeIndex = this.wd = null;
    //   this.itemClicked = this.items[this.t];
    // } else if (this.itemClicked.fullName && this.selectedEmployeeIndex == 0 && this.widgets && this.widgets.length > 0) {
    //   document.getElementById("style-4").scrollTop = document.getElementById("style-4").scrollHeight;
    //   this.wd = 8;
    //   this.rs = this.selectedRowIndex = this.selectedEmployeeIndex = this.t = this.ws = null;
    //   this.itemClicked = this.widgets[this.wd];
    // } else if (this.itemClicked.fullName && this.selectedEmployeeIndex == 0 && this.workspaces && this.workspaces.length > 0) {
    //   this.ws = this.workspaces.length - 1;
    //   this.rs = this.selectedRowIndex = this.selectedEmployeeIndex = this.t = this.wd = null;
    //   this.itemClicked = this.workspaces[this.ws];
    // } else if (this.itemClicked.fullName && this.selectedEmployeeIndex == 0 && this.tools && this.tools.length > 0) {
    //   this.t = this.tools.length - 1;
    //   this.rs = this.selectedRowIndex = this.selectedEmployeeIndex = this.ws = this.wd = null;
    //   this.itemClicked = this.workspaces[this.t];
    // } else if (this.itemClicked.fullName && this.selectedEmployeeIndex == 0 && this.items && this.items.length > 0) {
    //   this.selectedRowIndex = this.items.length - 1;
    //   this.rs = this.t = this.ws = this.selectedEmployeeIndex = this.wd = null;
    //   this.itemClicked = this.items[this.t];
    // } else if (this.itemClicked.widgetId && this.wd == 0 && this.workspaces && this.workspaces.length > 0) {
    //   document.getElementById("style-2").scrollTop = document.getElementById("style-2").scrollHeight;
    //   this.ws = this.workspaces.length - 1;
    //   this.rs = this.selectedRowIndex = this.t = this.wd = null;
    //   this.itemClicked = this.workspaces[this.ws];
    //   document.getElementById("style-2").scrollTop = document.getElementById("style-2").scrollHeight;
    // } else if (this.itemClicked.widgetId && this.wd == 0 && this.tools && this.tools.length > 0) {
    //   this.t = this.tools.length - 1;
    //   this.rs = this.selectedRowIndex = this.ws = this.wd = null;
    //   this.itemClicked = this.workspaces[this.t];
    // } else if (this.itemClicked.widgetId && this.wd == 0 && this.items && this.items.length > 0) {
    //   this.selectedRowIndex = this.items.length - 1;
    //   this.rs = this.t = this.ws = this.wd = null;
    //   this.itemClicked = this.items[this.t];
    // } else if (this.itemClicked.workspaceId && this.ws == 0 && this.tools && this.tools.length > 0) {
    //   this.t = this.tools.length - 1;
    //   this.rs = this.selectedRowIndex = this.ws = this.wd = null;
    //   this.itemClicked = this.tools[this.t];
    // } else if (this.itemClicked.workspaceId && this.ws == 0 && this.items && this.items.length > 0) {
    //   this.selectedRowIndex = this.items.length - 1;
    //   this.rs = this.t = this.ws = this.wd = null;
    //   this.itemClicked = this.items[this.selectedRowIndex];
    // } else if (this.itemClicked.permission && this.t == 0 && this.items && this.items.length > 0) {
    //   this.selectedRowIndex = this.items.length - 1;
    //   this.rs = this.t = this.ws = this.wd = null;
    //   document.getElementById("style-1").scrollTop = document.getElementById("style-1").scrollHeight;
    //   this.itemClicked = this.items[this.selectedRowIndex];
    // } else {
    //   if (this.rs !== null && this.rs !== undefined && this.rs > 0) {
    //     this.rs--;
    //     this.itemClicked = this.recentSearches[this.rs];
    //     // this.highlight(nextrow);
    //   }
    // }
  }
  arrowLeftEventForSearchByText() {
    if (this.itemClicked.itemType == SearchTaskType.Project) {
      return;
    }
    else if ((this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.projectList && this.projectList.length > 0) {
      document.getElementById("style-7").scrollTop = 0;
      this.users = this.goalIndex = this.selectedEmployeeIndex = null
      this.projectIndex = 0;
      this.itemClicked = this.projectList[0];
    } else if ((this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.userStorySearchList && this.userStorySearchList.length > 0) {
      document.getElementById("style-5").scrollTop = 0;
      this.projectIndex = this.goalIndex = this.selectedEmployeeIndex = null
      this.users = 0;
      this.itemClicked = this.userStorySearchList[0];
    } else if ((this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.projectList && this.projectList.length > 0) {
      document.getElementById("style-7").scrollTop = 0;
      this.users = this.goalIndex = this.selectedEmployeeIndex = null
      this.projectIndex = 0;
      this.itemClicked = this.projectList[0];
    } else if (this.itemClicked.itemType == SearchTaskType.Employee && this.goalSearchList && this.goalSearchList.length > 0) {
      document.getElementById("style-6").scrollTop = 0;
      this.projectIndex = this.users = this.selectedEmployeeIndex = null
      this.goalIndex = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.itemType == SearchTaskType.Employee && this.userStorySearchList && this.userStorySearchList.length > 0) {
      document.getElementById("style-5").scrollTop = 0;
      this.projectIndex = this.goalIndex = this.selectedEmployeeIndex = null
      this.users = 0;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.itemType == SearchTaskType.Employee && this.projectList && this.projectList.length > 0) {
      document.getElementById("style-7").scrollTop = 0;
      this.users = this.goalIndex = this.selectedEmployeeIndex = null
      this.projectIndex = 0;
      this.itemClicked = this.projectList[0];
    }
  }
  arrowLeftEvent() {
    // if (
    //   this.searchText != undefined ||
    //   this.searchText != null ||
    //   this.searchText === ""
    // ) {
    //   return;
    // }
    if (this.searchByText && this.searchText) {
      this.arrowLeftEventForSearchByText();
    }
    else if (this.itemClicked.menu) {
      return;
    }
    //From workspaces
    else if (this.itemClicked.workspaceId && this.items && this.items.length > 0) {
      document.getElementById("style-1").scrollTop = 0;
      this.t = this.wd = this.ws = this.rs = this.selectedEmployeeIndex = this.users = this.goalIndex = null;
      this.selectedRowIndex = 0;
      this.itemClicked = this.items[0];
    }
    //from widgets
    else if (this.itemClicked.widgetId && this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.ws = 0;
      document.getElementById("style-2").scrollTop = 0;
      this.itemClicked = this.workspaces[0];
    } else if (this.itemClicked.widgetId && this.items && this.items.length > 0) {
      this.ws = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.selectedRowIndex = 0;
      document.getElementById("style-1").scrollTop = 0;
      this.itemClicked = this.items[0];
    }
    //From employees
    else if (this.itemClicked.employeeNumber && this.widgets && this.widgets.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.ws = this.t = this.rs = this.users = this.goalIndex = null;
      this.wd = 0;
      document.getElementById("style-3").scrollTop = 0;
      this.itemClicked = this.widgets[0];
    } else if (this.itemClicked.employeeNumber && this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.ws = 0;
      document.getElementById("style-2").scrollTop = 0;
      this.itemClicked = this.workspaces[0];
    } else if (this.itemClicked.employeeNumber && this.items && this.items.length > 0) {
      this.ws = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.selectedRowIndex = 0;
      document.getElementById("style-1").scrollTop = 0;
      this.itemClicked = this.items[0];
    }
    //From WI/Bug
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc)
      && this.employeeList && this.employeeList.length > 0) {
      this.selectedRowIndex = this.wd = this.ws = this.t = this.rs = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      document.getElementById("style-4").scrollTop = 0;
      this.itemClicked = this.employeeList[0];
    }
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc)
      && this.widgets && this.widgets.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.ws = this.t = this.rs = this.users = this.goalIndex = null;
      this.wd = 0;
      document.getElementById("style-3").scrollTop = 0;
      this.itemClicked = this.widgets[0];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc)
      && this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.ws = 0;
      document.getElementById("style-2").scrollTop = 0;
      this.itemClicked = this.workspaces[0];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc)
      && this.items && this.items.length > 0) {
      this.ws = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.selectedRowIndex = 0;
      document.getElementById("style-1").scrollTop = 0;
      this.itemClicked = this.items[0];
    }
    //From Goal/Sprint
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint)
      && this.userStoryList && this.userStoryList.length > 0) {
      this.selectedRowIndex = this.wd = this.ws = this.t = this.rs = this.selectedEmployeeIndex = this.goalIndex = null;
      this.users = 0;
      document.getElementById("style-5").scrollTop = 0;
      this.itemClicked = this.userStoryList[0];
    }
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint)
      && this.employeeList && this.employeeList.length > 0) {
      this.selectedRowIndex = this.wd = this.ws = this.t = this.rs = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      document.getElementById("style-4").scrollTop = 0;
      this.itemClicked = this.employeeList[0];
    }
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint)
      && this.widgets && this.widgets.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.ws = this.t = this.rs = this.users = this.goalIndex = null;
      this.wd = 0;
      document.getElementById("style-3").scrollTop = 0;
      this.itemClicked = this.widgets[0];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint)
      && this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.ws = 0;
      document.getElementById("style-2").scrollTop = 0;
      this.itemClicked = this.workspaces[0];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint)
      && this.items && this.items.length > 0) {
      this.ws = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.selectedRowIndex = 0;
      document.getElementById("style-1").scrollTop = 0;
      this.itemClicked = this.items[0];
    }
    //From recent searches
    else if (this.itemClicked.recentSearch
      && this.goalSearchList && this.goalSearchList.length > 0) {
      this.selectedRowIndex = this.wd = this.ws = this.t = this.rs = this.selectedEmployeeIndex = this.users = null;
      this.goalIndex = 0;
      document.getElementById("style-6").scrollTop = 0;
      this.itemClicked = this.goalSearchList[0];
    }
    else if (this.itemClicked.recentSearch
      && this.userStoryList && this.userStoryList.length > 0) {
      this.selectedRowIndex = this.wd = this.ws = this.t = this.rs = this.selectedEmployeeIndex = this.goalIndex = null;
      this.users = 0;
      document.getElementById("style-5").scrollTop = 0;
      this.itemClicked = this.userStoryList[0];
    }
    else if (this.itemClicked.recentSearch
      && this.employeeList && this.employeeList.length > 0) {
      this.selectedRowIndex = this.wd = this.ws = this.t = this.rs = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      document.getElementById("style-4").scrollTop = 0;
      this.itemClicked = this.employeeList[0];
    }
    else if (this.itemClicked.recentSearch
      && this.widgets && this.widgets.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.ws = this.t = this.rs = this.users = this.goalIndex = null;
      this.wd = 0;
      document.getElementById("style-3").scrollTop = 0;
      this.itemClicked = this.widgets[0];
    } else if (this.itemClicked.recentSearch
      && this.workspaces && this.workspaces.length > 0) {
      this.selectedRowIndex = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.ws = 0;
      document.getElementById("style-2").scrollTop = 0;
      this.itemClicked = this.workspaces[0];
    } else if (this.itemClicked.recentSearch
      && this.items && this.items.length > 0) {
      this.ws = this.selectedEmployeeIndex = this.wd = this.t = this.rs = this.users = this.goalIndex = null;
      this.selectedRowIndex = 0;
      document.getElementById("style-1").scrollTop = 0;
      this.itemClicked = this.items[0];
    }
  }
  arrowRightEventForSearchByText() {
    if (this.itemClicked.itemType == SearchTaskType.Project && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.projectIndex = this.goalIndex = this.selectedEmployeeIndex = null;
      this.users = 0;
      document.getElementById("style-5").scrollTop = 0;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.itemType == SearchTaskType.Project && this.goalSearchList && this.goalSearchList.length > 0) {
      this.projectIndex = this.users = this.selectedEmployeeIndex = null;
      this.goalIndex = 0;
      document.getElementById("style-6").scrollTop = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.itemType == SearchTaskType.Project && this.employeeList && this.employeeList.length > 0) {
      this.projectIndex = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      document.getElementById("style-4").scrollTop = 0;
      this.itemClicked = this.employeeList[0];
    } else if ((this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.goalSearchList && this.goalSearchList.length > 0) {
      this.projectIndex = this.users = this.selectedEmployeeIndex = null;
      this.goalIndex = 0;
      document.getElementById("style-6").scrollTop = 0;
      this.itemClicked = this.goalSearchList[0];
    } else if ((this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc) && this.employeeList && this.employeeList.length > 0) {
      this.projectIndex = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      document.getElementById("style-4").scrollTop = 0;
      this.itemClicked = this.employeeList[0];
      this.itemClicked = this.goalSearchList[0];
    } else if ((this.itemClicked.itemType == SearchTaskType.goal || this.itemClicked.itemType == SearchTaskType.sprint) && this.employeeList && this.employeeList.length > 0) {
      this.projectIndex = this.users = this.goalIndex = null;
      this.selectedEmployeeIndex = 0;
      this.itemClicked = this.employeeList[0];
    }
  }
  arrowRightEvent() {
    // if (
    //   this.searchText == undefined ||
    //   this.searchText == null ||
    //   this.searchText === ""
    // ) {
    //   return;
    // } 
    if (this.searchByText && this.searchText) {
      this.arrowRightEventForSearchByText();
    }
    else if (this.itemClicked.recentSearch) {
      return;
    }
    //From menus
    else if (this.itemClicked.menu && this.workspaces && this.workspaces.length > 0) {
      this.t = null;
      document.getElementById("style-2").scrollTop = 0;
      this.wd = this.selectedRowIndex = this.selectedEmployeeIndex = this.rs = this.users = this.goalIndex = null;
      this.ws = 0;
      this.itemClicked = this.workspaces[0];
    } else if (this.itemClicked.menu && this.widgets && this.widgets.length > 0) {
      this.wd = 0;
      document.getElementById("style-3").scrollTop = 0;
      this.ws = this.rs = this.selectedRowIndex = this.selectedEmployeeIndex = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.widgets[0];
    } else if (this.itemClicked.menu && this.employeeList && this.employeeList.length > 0) {
      this.selectedEmployeeIndex = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.employeeList[0];
    } else if (this.itemClicked.menu && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.users = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.goalIndex = null;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.menu && this.goalSearchList && this.goalSearchList.length > 0) {
      this.goalIndex = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.users = null;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.menu && this.recentSearches && this.recentSearches.length > 0) {
      this.rs = 0;
      this.ws = this.wd = this.selectedEmployeeIndex = this.selectedRowIndex = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.recentSearches[0];
    }
    //From workspaces
    else if (this.itemClicked.workspaceId && this.widgets && this.widgets.length > 0) {
      this.wd = 0;
      document.getElementById("style-3").scrollTop = 0;
      this.ws = this.rs = this.selectedEmployeeIndex = this.selectedRowIndex = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.widgets[0];
    } else if (this.itemClicked.workspaceId && this.employeeList && this.employeeList.length > 0) {
      this.selectedEmployeeIndex = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.employeeList[0];
    } else if (this.itemClicked.workspaceId && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.users = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.goalIndex = null;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.workspaceId && this.goalSearchList && this.goalSearchList.length > 0) {
      this.goalIndex = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.users = null;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.workspaceId && this.recentSearches && this.recentSearches.length > 0) {
      this.rs = 0;
      this.ws = this.wd = this.selectedEmployeeIndex = this.selectedRowIndex = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.recentSearches[0];
    }
    //From widgets
    else if (this.itemClicked.widgetId && this.employeeList && this.employeeList.length > 0) {
      this.selectedEmployeeIndex = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.employeeList[0];
    } else if (this.itemClicked.widgetId && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.users = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.goalIndex = null;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.widgetId && this.goalSearchList && this.goalSearchList.length > 0) {
      this.goalIndex = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.users = null;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.widgetId && this.recentSearches && this.recentSearches.length > 0) {
      this.rs = 0;
      this.ws = this.wd = this.selectedEmployeeIndex = this.selectedRowIndex = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.recentSearches[0];
    }
    //From Employees
    else if (this.itemClicked.employeeNumber && this.userStorySearchList && this.userStorySearchList.length > 0) {
      this.users = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.goalIndex = null;
      this.itemClicked = this.userStorySearchList[0];
    } else if (this.itemClicked.employeeNumber && this.goalSearchList && this.goalSearchList.length > 0) {
      this.goalIndex = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.users = null;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.employeeNumber && this.recentSearches && this.recentSearches.length > 0) {
      this.rs = 0;
      this.ws = this.wd = this.selectedEmployeeIndex = this.selectedRowIndex = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.recentSearches[0];
    }
    //From WI/Bug
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc)
      && this.goalSearchList && this.goalSearchList.length > 0) {
      this.goalIndex = 0;
      this.ws = this.rs = this.selectedRowIndex = this.wd = this.t = this.selectedEmployeeIndex = this.users = null;
      this.itemClicked = this.goalSearchList[0];
    } else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.workItemORBug || this.itemClicked.itemType == SearchTaskType.adhoc)
      && this.recentSearches && this.recentSearches.length > 0) {
      this.rs = 0;
      this.ws = this.wd = this.selectedEmployeeIndex = this.selectedRowIndex = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.recentSearches[0];
    }
    //From Goal/Sprint
    else if (this.itemClicked.itemType && (this.itemClicked.itemType == SearchTaskType.sprint || this.itemClicked.itemType == SearchTaskType.goal)
      && this.recentSearches && this.recentSearches.length > 0) {
      this.rs = 0;
      this.ws = this.wd = this.selectedEmployeeIndex = this.selectedRowIndex = this.t = this.users = this.goalIndex = null;
      this.itemClicked = this.recentSearches[0];
    }
  }

  openWorkspaceForm() {
    this.addWorkSpacePopOver.open();
    this.display = true;
    this.isOpened.emit(this.display);
    this.getAllRoles();
  }

  getAllRoles() {
    this.commonService.GetallRoles().subscribe((responseData: any) => {
      this.rolesDropDown = responseData.data;
      this.rolesDropDown.forEach((p) => {
        const id = p.roleId.toLowerCase();
        p.roleId = id;
      });
    });
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  compareSelectedRolesFn() { }
  compareEditSelectedRolesFn() { }
  compareDeleteSelectedRolesFn() { }
  upsertWorkspace() { }
  toggleAllRolesSelected() { }
  toggleEditAllRolesSelected() { }
  toggleDeleteAllRolesSelected() { }
  closeAddWorkspaceDialog() { }
}
