import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, Inject, TemplateRef, NgModuleFactoryLoader, ViewContainerRef, Type, NgModuleRef, NgModuleFactory, Compiler } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Actions } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { SoftLabelConfigurationModel } from "../../dependencies/models/softlabels-model";
import { CreateAppDialogComponet } from "../create-app-dialog/create-app-dialog.component";
import { Observable, Subject, Subscription, of } from "rxjs";
import { DragedWidget } from "../../dependencies/models/dragedWidget";
import { WidgetList } from "../../dependencies/models/widgetlist";
import { WidgetService } from "../../dependencies/services/widget.service";
import { LoadWidgetsListTriggered } from "../../dependencies/store/actions/widgetslist.action";
import { CustomAppPopUpComponent } from "../custom-app-popup/custom-app-popup.component";
import { TagsModel } from "../../dependencies/models/tagsModel";
import { CustomTagModel } from "../../dependencies/models/customTagModel";
import * as _ from 'underscore';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as widgetModuleReducer from "../../dependencies/store/reducers/index";
import { State } from "../../dependencies/store/reducers/index";
import { RecentSearchType } from '../../dependencies/enum/recentSearchType.enum';
import { RecentSearchApiModel } from '../../dependencies/models/recentSearchApiModel';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap'
import { ToastrService } from 'ngx-toastr';
import { TagsAndWorkspacesDisplayComponent } from '../app-tags-worskpaces-display.component';
import { Router } from "@angular/router";
import { WorkspaceList } from '../../dependencies/models/workspaceList';
import { LoadUnHideWorkspacesListTriggered } from '../../dependencies/store/actions/Workspacelist.action';
import { AppStoreModulesService } from '../../dependencies/services/app-store.modules.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
@Component({
  selector: "app-widgetslist",
  templateUrl: "./widgetslist.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WidgetslistComponent extends CustomAppBaseComponent {

  @Input("tagsFilter")
  set _tagsFilter(data: string) {
    if (data !== undefined) {
      this.moreChildTags = false;
      this.tagsSearchText = data;
      this.filteredTagText = data;
      this.tagModel = [];
      this.selectedTagId = null;
      this.isFav = false;
      this.isRecent = false;
      if (this.tagsSearchText) {
        this.getChildTagsBasedOnTagName(this.tagsSearchText);
      } else {
        this.childTags = [];
      }
      if (!data) {
        this.isTagFilterVisible = false;
      }
      this.initializeWidgets();
    }
  }

  // @Input("deletedTagId") 
  // set _deletedTagId(data: any) {
  //   if(data != null) {
  //     this.removeTag(data);
  //   }
  // }

  @Input("fromSearch")
  set _fromSearch(data) {
    if(data)
    this.fromSearch = data;
    else 
    this.fromSearch = false;
    this.isTagFilterVisible = false;
  }

  @Input("isRecent")
  set _isRecent(data) {
    if (data == true) {
      this.isRecent = true;
      this.isFav = false;
      this.moreChildTags = false;
      this.tagsSearchText = '';
      this.selectedTagId = null;
      this.childTags = [];
      this.getRecentApps();
    }
  }


  @Input("isFavourite")
  set _isFavourite(data) {
    if (data == true) {
      this.isFav = true;
      this.isRecent = false;
      this.currentPage = 1;
      this.moreChildTags = false;
      this.tagsSearchText = '';
      this.selectedTagId = null;
      this.childTags = [];
      this.getWidgetsList();
    }
  }

  @Input("selectedTagId")
  set _selectedTagId(data) {
    if(data == '') {
      return;
    }
   this.selectedTagId = data;
   this.isRecent = false;
    this.isFav = false;
    this.currentPage = 1;
    this.tagModel = [];
    this.searchText = null;
    this.tagsSearchText = '';
    this.moreChildTags = false;
    if (this.selectedTagId) {
      this.getChildTags(this.selectedTagId);
    } else {
      this.childTags = [];
    }
    if (!data) {
      this.isTagFilterVisible = false;
    }
    //this.initializeWidgets();
    this.getWidgetsList();
  }
  @Output() closePopUp = new EventEmitter<any>();
  searchTextChanged = new Subject<any>();
  subscription: Subscription;
  pag: any;
  isRecent: boolean;
  isFav: boolean;
  selectedTagId: any;
  fromSearch: boolean = false;
  widgetsList$: Observable<WidgetList[]>;
  widgetTags: TagsModel[] = [];
  widgets: WidgetList[] = [];
  tempWidgets: any;
  selectedList: DragedWidget[];
  tagsLoadingInProgress = false;
  anyOperationInProgress$: Observable<boolean>;
  anyOperationInProgress: boolean;
  public ngDestroyed$ = new Subject();
  canAccessDragOption = true;
  loadingCompleted = false;
  showTitleTooltip = false;
  filteredTagText: string;
  isShowAutocomplete: boolean;
  tags: string[] = [];
  filteredTags: string[] = [];
  widget: WidgetList;
  childTags: string[] = [];
  searchText = "";
  isTagFilterVisible = true;
  tagsSearchText = "";
  tagModel: CustomTagModel[] = [];
  isShow: boolean;
  itemsPerPage: number = 16;
  currentPage: number = 1;
  totalItems: number = 0;
  hiddenDashboard: string;
  @Output() appsSelected = new EventEmitter<DragedWidget>();
  @Output() closeTagSearch = new EventEmitter<boolean>();
  @Output() searchAppText = new EventEmitter<string>();
  @Output() loadWidgetTags = new EventEmitter<string>();
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  @ViewChild("description") descriptionStatus: ElementRef;
  @ViewChild("workspaces") workspacesElement: ElementRef;
  @ViewChild("workspaceChips") workspaceChips: ElementRef;
  @ViewChild("tagsWorkSpacesPopUp") tagsWorkSpacesPopUp;
  @ViewChild('openAppaDialogComponent') openAppaDialogComponent: TemplateRef<any>;
  @ViewChild('createAppaDialogComponent') createAppaDialogComponent: TemplateRef<any>;
  @ViewChild('customAppPopUpComponent') customAppPopUpComponent: TemplateRef<any>;
  isCustomAppAddOrEditRequire: boolean = false;
  sub: Subscription;
  isFavouriteSelected: boolean;
  favouriteWidgets: any[] = [];
  loadingApps: boolean;
  loadingType: string;
  Array = Array;
  num = 16;
  moreChildTags: boolean;
  listView: boolean;  private ngModuleRef: NgModuleRef<any>;
  injector: any;
  loaded: boolean = false;
  dashboard: any

  constructor(
    private compiler: Compiler,
    private store: Store<State>, private _ds: WidgetService, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
    private dialog: MatDialog, private cookieService: CookieService
    , private widgetService: WidgetService
    , private toastr: ToastrService, private ngModuleFactoryLoader: NgModuleFactoryLoader, private vcr: ViewContainerRef,
    @Inject('AppStoreModuleLoader') public appStoreModulesService: any,
    private routes: Router) {
    super();
    this.injector = this.vcr.injector;
    this.anyOperationInProgress$ = this.store.pipe(select(widgetModuleReducer.getWidgetsListLoading));
    this.anyOperationInProgress$.subscribe(data => this.anyOperationInProgress = data);
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  ngOnInit() {
    super.ngOnInit();
    this.getCustomTags();
    // this.loadWidgetsList();
    //this.getWidgetsList();
    this.selectedList = [];
    this.getAddOrEditCustomAppIsRequired();
    this.subscription = this.searchTextChanged
    .pipe(debounceTime(800),
          distinctUntilChanged()
     )
    .subscribe(term => {
      this.searchText = term;
      if(this.isRecent) {
        this.getRecentApps();
      }
      else {
        this.getWidgetsList();
      }
    })
    //this.searchAppStore = _.debounce(this.searchAppStore, 1000);
    //this.searchTags = _.debounce(this.searchTags, 1000);
  }

  getWorkspaceWidth(dashboard, size) {
    if(dashboard.length > 0) {
    var workspaces = dashboard.toString();
    if(workspaces.length > 45) {
      if(size) { return true; };
      return '270px';
    }
  }
}

getTagsWidth(tag, size) {
  if(tag.length > 0) {
   var tags = tag.map(i => i.TagName).toString(); 
    if(tags.length > 45) {
      if(size) { return true; };
      return '270px';
    }
  }
}

getChildTagsWidth(childTags) {
  if(childTags.length > 0) {
    var tags = childTags.toString(); 
     if(tags.length > 45) {
       this.moreChildTags = true;
     }
   }
}

// removeTag(tagId) {
//   if(this.widgetTags.length > 0) {
//   this.widgetTags = this.widgetTags.filter(function(i)
//             { 
              
//               if(i.tagId.toLowerCase() != tagId.toLowerCase() ) {
//                 return i;
//               } 
//               else if(i.parentTagId) {
//                 i.parentTagId.toLowerCase() != tagId.toLowerCase()
//               }             
//           });
//   }
//   if(this.childTags.length > 0) {
//     if(this.selectedTagId.toLowerCase() != tagId.toLowerCase()) {
//       this.getChildTags(this.selectedTagId);
//     }
//   }
//   if(this.widgets.length > 0) {
//     if(this.isRecent) {
//       this.getRecentApps();
//     } else {
//     this.getWidgetsList();
//     }
//   }
  
// }

  getRecentApps() {
    var search = new RecentSearchApiModel();
    search.recentSearchType = RecentSearchType.widget;
    var widget = new WidgetList();
    widget.widgetId = "null";
    widget.isArchived = false;
    widget.pageSize = this.itemsPerPage;
    widget.pageNumber = this.currentPage;
    widget.sortDirectionAsc = true;
    widget.searchText = this.searchText;
    widget.tags = this.tagsSearchText;
    widget.tagId = this.selectedTagId;
    widget.isFavouriteWidget = this.isFav;
    widget.isFromSearch = this.fromSearch;
    this.loadingApps = true;
    this.widgetService.getRecentSearchedApps(widget)
      .subscribe((res: any) => {
        this.widgets = res.data;
        this.totalItems = this.widgets && this.widgets.length > 0 ? this.widgets[0].totalCount : 0;
        this.loadingApps = false;
        if(this.listView) {
          this.pag = { itemsPerPage: this.itemsPerPage, currentPage: this.currentPage, totalItems: this.totalItems }
        }
        this.cdRef.detectChanges();
        if (this.widgets.length > 0 && !this.listView) {
          this.getWidgetTagsAndWorkspaces();
        }
      });
  }

  changeViewType() {
    this.listView = !this.listView;
    if(this.listView) {
      this.pag = { itemsPerPage: this.itemsPerPage, currentPage: this.currentPage, totalItems: this.totalItems }
      //this.loadCustomAppsListViewComponent();
    }
    this.cdRef.detectChanges();
  }

  getCustomTags() {
    this.widgetService.getCustomTags(false).subscribe((response: any) => {
      if (response.success === true) {
        this.widgetTags = response.data;
      };
    });
  }


  getAddOrEditCustomAppIsRequired() {
    this.widgetService.getAddOrEditCustomAppIsRequired().subscribe((response: any) => {
      if (response.success === true) {
        this.isCustomAppAddOrEditRequire = response.data;
      };
    });
    // this.isCustomAppAddOrEditRequire = this.cookieService.get(LocalStorageProperties.AddOrEditCustomAppIsRequired) == 'true';
  }
  saveFavourites(widget, event) {
    this.isFavouriteSelected = false;
    var widgetModel = {
      widgetId: widget.widgetId,
      isFavouriteWidget: !widget.isFavouriteWidget
    };

    this.widgetService.addWidgetToFavourites(widgetModel)
      .subscribe((res: any) => {
        if (res.success == true) {
          let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
          this.cookieService.set(LocalStorageProperties.LoadFavouriteWidgets, JSON.stringify(true), null, environment.cookiePath, window.location.hostname, false, "Strict");
          //this.getWidgetsList();
          var widgetIndex = this.widgets.findIndex(obj => obj.widgetId.toLowerCase() == widget.widgetId.toLowerCase());
          this.widgets[widgetIndex].isFavouriteWidget = !widget.isFavouriteWidget;  
          this.cdRef.detectChanges();
          var favWidgetsJson = localStorage.getItem(LocalStorageProperties.FavouriteWidgets)
          if(!favWidgetsJson || favWidgetsJson == "null") {
            localStorage.setItem(LocalStorageProperties.FavouriteWidgets, JSON.stringify(this.widgets[widgetIndex]));
          } else {
            var favWidgets: WidgetList[]  = JSON.parse(favWidgetsJson);
            if( this.widgets[widgetIndex].isFavouriteWidget) {
            favWidgets.push(this.widgets[widgetIndex]);
            } else {
                var indexToDel = favWidgets.findIndex(i => i.widgetId.toLowerCase() == widget.widgetId.toLowerCase());
                favWidgets.splice(indexToDel, 1);
            }
           const favWidgetsStorage = favWidgets.sort((a, b) =>
            a.widgetName.toLowerCase() > b.widgetName.toLowerCase() ? 1 : -1
          );
            localStorage.setItem(LocalStorageProperties.FavouriteWidgets, JSON.stringify(favWidgetsStorage));            
          }
          // if (!widget.isFavouriteWidget)
          //   this.toastr.success("App added to your favourites");
          // else
          //   this.toastr.success("App removed from your favourites");
        } else {
          this.toastr.error(`Unable to update ${widget.widgetName} in your favourites`);
        }
      });
  }


  searchAppStore(event) {
    this.currentPage = 1;
    //this.initializeWidgets();
    this.loadingApps = true;
    this.searchTextChanged.next(this.searchText);
  }

  // loadWidgetsList() {
  //   // this.widget = new WidgetList();
  //   // this.widget.widgetId = "null";
  //   // this.widget.isArchived = false;
  //   // this.widget.pageSize = this.itemsPerPage;
  //   // this.widget.pageNumber = this.currentPage;
  //   // this.widget.sortDirectionAsc = true;
  //   // this.widget.searchText = this.searchText;
  //   // //this.widget.tags = this.tagsSearchText;
  //   // this.widget.tagId = this.selectedTagId;
  //   // this.store.dispatch(new LoadWidgetsListTriggered(this.widget));
  // };

  getWidgetsList() {
    //this.widgetsList$ = this.store.pipe(select(widgetModuleReducer.getWidgetAll));
    this.widget = new WidgetList();
    this.widget.widgetId = "null";
    this.widget.isArchived = false;
    this.widget.pageSize = this.itemsPerPage;
    this.widget.pageNumber = this.currentPage;
    this.widget.sortDirectionAsc = true;
    this.widget.searchText = this.searchText;
    this.widget.tags = this.tagsSearchText;
    this.widget.tagId = this.selectedTagId;
    this.widget.isFavouriteWidget = this.isFav;
    this.widget.isFromSearch = this.fromSearch;
    this.loadingApps = true;
    this.widgetService.GetWidgetsBasedOnUserId(this.widget)
      //  this.sub = this.widgetsList$
      .subscribe((s: any) => {
        this.widgets = s.data;
        this.totalItems = this.widgets && this.widgets.length > 0 ? this.widgets[0].totalCount : 0;
        if (this.widgets.length > 0) {
          if(!this.listView) {
            this.getWidgetTagsAndWorkspaces();
          }
        } else {
          this.totalItems = null;
        }
        this.loadingApps = false;
        if(this.listView) {
          this.pag = { itemsPerPage: this.itemsPerPage, currentPage: this.currentPage, totalItems: this.totalItems }
        //   this.dashboard.inputs = {
        //     selectedAppsFromAppStore: this.widgets,
        //     paginate: { itemsPerPage: this.itemsPerPage, currentPage: this.currentPage, totalItems: this.totalItems }
        // }  
        }
        this.cdRef.detectChanges();
        // this.extractTags(this.widgets);
      })
  }

  getWidgetTagsAndWorkspaces() {
    var widgetModel = this.widgets.map(function (item) {
      return {
        widgetId: item.widgetId,
        isCustomWidget: item.isCustomWidget,
        isHtml: item.isHtml,
        isProcess: item.isProcess
      }
    });
    this.widgetService.GetWidgetTagsAndWorkspaces(widgetModel)
      .subscribe((res: any) => {
        if (res.success && res.data != null && res.data != undefined && res.data.length > 0) {
          this.widgets.forEach((item, index) => {
            var widget = res.data.find(i => i.widgetId.toLowerCase() == item.widgetId.toLocaleLowerCase());
            if(widget) {
            this.widgets[index] = { ...this.widgets[index], isFavouriteWidget: widget.isFavouriteWidget , widgetTags: widget.widgetTags ? JSON.parse(widget.widgetTags) : null, widgetWorkSpaces: widget.widgetWorkSpaces ? widget.widgetWorkSpaces.split(',') : null };
            }
          });
          //this.widgets = [...this.widgets, res.data];
        }
        this.tempWidgets = JSON.stringify(this.widgets);
        this.cdRef.detectChanges();
      });
    // this.widgetService.GetWidgetTagsAndWorkspaces(widgetModel)
    //   .subscribe((res: any) => {

    //   });
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    //this.initializeWidgets();
    if(this.isRecent) {
      this.getRecentApps();
    } else {
    this.getWidgetsList();
    }
  }

  initializeWidgets() {
    //this.loadWidgetsList();
    this.getWidgetsList();
  }

  // extractTags(widgets) {
  //   this.tagsLoadingInProgress = true;
  //   this.tags = [];
  //   widgets.forEach((widget) => {
  //     const widgettags = widget.tags;
  //     if (widgettags) {
  //       // tslint:disable-next-line: quotemark
  //       widgettags.split(',').forEach((tag) => {
  //         if (this.tags.findIndex((p) => p.toLowerCase() === tag.toLowerCase()) === -1) {
  //           this.tags.push(tag);
  //         }
  //       });
  //     }
  //   });
  //   this.searchTags("");
  // }

  OnSelect(identifier) {
    const dragedWidget = new DragedWidget();
    dragedWidget.name = identifier.widgetName;
    dragedWidget.isCustomWidget = identifier.isCustomWidget;
    dragedWidget.customWidgetId = identifier.widgetId;
    dragedWidget.isHtml = identifier.isHtml;
    dragedWidget.isProc = identifier.isProc;
    dragedWidget.isProcess = identifier.isProcess;
    dragedWidget.procName = identifier.procName;
    dragedWidget.visualizationType = identifier.visualizationType;
    dragedWidget.xCoOrdinate = identifier.xCoOrdinate;
    dragedWidget.yCoOrdinate = identifier.yCoOrdinate;
    dragedWidget.customAppVisualizationId = identifier.customAppVisualizationId;
    dragedWidget.isEntryApp = identifier.isEntryApp;
    dragedWidget.isEditable = identifier.isEditable;
    this.appsSelected.emit(dragedWidget);
    event.preventDefault();
    event.stopPropagation();
  }

  // searchTags(data) {
  //   this.tagsSearchText = this.filteredTagText;
  //   this.currentPage = 1;
  //   this.initializeWidgets();
  // }

  displayFn(tagtext) {
    if (!tagtext) {
      return "";
    } else {
      const filteredTag = this.widgetTags.find((tag) => tag.tags === tagtext);
      return filteredTag.tags;
    }
  }

  // onChangeTag(tag) {
  //   this.tagsSearchText = tag;
  //   this.filteredTagText = tag;
  //   this.currentPage = 1;
  //   this.initializeWidgets();
  // }

  closeSearch() {
    this.searchText = "";
    this.currentPage = 1;
    this.itemsPerPage = 16;
    //this.initializeWidgets();
    if(this.isRecent) {
      this.getRecentApps();
    }
    else {
      this.getWidgetsList();
    }
    //this.closeTagSearch.emit(true);
  }

  // closeTagsSearch() {
  //   this.tagsSearchText = "";
  //   this.filteredTagText = "";
  //   this.childTags = [];
  //   this.closeTagSearch.emit(true);
  // }

  checkTitleTooltipStatus(description) {
    if (description && description.length > 195) {
      this.showTitleTooltip = true;
    } else {
      this.showTitleTooltip = false;
    }
  }

  checkTagTooltipStatus(tag) {
    if (tag && tag.length > 15) {
      this.showTitleTooltip = true;
    } else {
      this.showTitleTooltip = false;
    }
  }

  selectWidgetTag(tag) {
      this.tagModel = [];
      this.filteredTagText = tag.TagName;
      var tagData = this.widgetTags.find((x) => x.tagId.toLowerCase() == tag.TagId.toLowerCase());
      if (tagData && !tagData.parentTagId) {
          this.getChildTags(tag.TagId);        
      } 
      this.tagsSearchText = tag.TagName;
      if (tagData && tagData.parentTagId) {
          this.getChildTags(tagData.parentTagId);
        var parentTagData = this.widgetTags.find((x) => x.tagId == tagData.parentTagId);
        var tagsModel = new CustomTagModel();
        tagsModel.tag = parentTagData.tags;
        tagsModel.tagId = parentTagData.tagId;
        const index = this.tagModel.indexOf(tagsModel);
        // if (index > -1) {
        // } else {
        //   this.tagModel.push(tagsModel);
        // }
      }

      var tagsModel = new CustomTagModel();
      tagsModel.tag = tag.TagName;
      tagsModel.tagId = tagData ? tagData.tagId : null;
      const index = this.tagModel.indexOf(tagsModel);
      if (index > -1) {

      } else {
        this.tagModel.push(tagsModel);
      }
      if (tagData &&tagData.parentTagId) {
        this.searchAppText.emit(parentTagData.tags);
      } else {
        this.searchAppText.emit(tag.TagName);
      }
      //this.searchAppText.emit(tag.TagName);
      //this.initializeWidgets();
      this.selectedTagId = tag.TagId;
      this.getWidgetsList();
  }

  selectWidgetTagBasedOnTagName(tag) {
      this.tagModel = [];
      this.filteredTagText = tag;
      var tagData = this.widgetTags.find((x) => x.tags.toLowerCase() == tag.toLowerCase());
      if (tagData && !tagData.parentTagId) {
          this.getChildTags(tagData.tagId);
      }
      this.tagsSearchText = tag;
      if (tagData && tagData.parentTagId) {
          this.getChildTags(tagData.parentTagId);
        var parentTagData = this.widgetTags.find((x) => x.tagId == tagData.parentTagId);
        var tagsModel = new CustomTagModel();
        tagsModel.tag = parentTagData.tags;
        tagsModel.tagId = parentTagData.tagId;
        const index = this.tagModel.indexOf(tagsModel);
        // if (index > -1) {
        // } else {
        //   this.tagModel.push(tagsModel);
        // }
      }

      var tagsModel = new CustomTagModel();
      tagsModel.tag = tag;
      tagsModel.tagId = tagData ? tagData.tagId : null;
      const index = this.tagModel.indexOf(tagsModel);
      if (index > -1) {

      } else {
        this.tagModel.push(tagsModel);
      }
      if (tagData &&tagData.parentTagId) {
        this.searchAppText.emit(parentTagData.tags);
      } else {
        this.searchAppText.emit(tag);
      }
      //this.searchAppText.emit(tag.TagName);
      //this.initializeWidgets();
      this.selectedTagId = tagData.tagId;
       this.getWidgetsList();
  }

  getChildTags(tagId) {
    this.childTags = [];
    let tagData = this.widgetTags.find((x) => x.tagId.toLowerCase() == tagId.toLowerCase());

    if (this.widgetTags.length > 0) {
      let tagsResult = this.widgetTags;
      if (tagData) {
        let filteredResult = tagsResult.filter(function (tag) {
          return tag.parentTagId == tagData.tagId
        })
        if (filteredResult.length > 0) {
          let searchText = [];
          searchText = filteredResult.map((x) => x.tags);
          this.childTags = searchText;
        }
      }
    }

    if (tagData) {
      var tagsModel = new CustomTagModel();
      tagsModel.tag = tagData.tags;
      tagsModel.tagId = tagData.tagId;
      const index = this.tagModel.indexOf(tagsModel);
      if (index > -1) {

      } else {
        this.tagModel.push(tagsModel);
      }
    }
  }

  getChildTagsBasedOnTagName(tagName) {
    this.childTags = [];
    let tagData = this.widgetTags.find((x) => x.tagId.toLowerCase() == tagName.toLowerCase());

    if (this.widgetTags.length > 0) {
      let tagsResult = this.widgetTags;
      if (tagData) {
        let filteredResult = tagsResult.filter(function (tag) {
          return tag.parentTagId == tagData.tagId
        })
        if (filteredResult.length > 0) {
          let searchText = [];
          searchText = filteredResult.map((x) => x.tags);
          this.childTags = searchText;
        }
      }
    }

    if (tagData) {
      var tagsModel = new CustomTagModel();
      tagsModel.tag = tagData.tags;
      tagsModel.tagId = tagData.tagId;
      const index = this.tagModel.indexOf(tagsModel);
      if (index > -1) {

      } else {
        this.tagModel.push(tagsModel);
      }
    }
  }

  OpenAppInPopUp(widget) {
    const dragedWidget = new DragedWidget();
    if (widget) {
      dragedWidget.name = widget.widgetName;
      dragedWidget.isCustomWidget = widget.isCustomWidget;
      dragedWidget.customWidgetId = widget.widgetId;
      dragedWidget.isHtml = widget.isHtml;
      dragedWidget.isProc = widget.isProc;
      dragedWidget.isApi = widget.isApi;
      dragedWidget.isProcess = widget.isProcess;
      dragedWidget.isEntryApp = widget.isEntryApp;
      dragedWidget.procName = widget.procName;
      dragedWidget.visualizationType = widget.visualizationType;
      dragedWidget.xCoOrdinate = widget.xCoOrdinate;
      dragedWidget.yCoOrdinate = widget.yCoOrdinate;
      dragedWidget.customAppVisualizationId = widget.customAppVisualizationId;
      dragedWidget.isEditable = widget.isEditable;
    }
    let dialogId = 'custom-app-popup';
    const dialogRef = this.dialog.open(this.customAppPopUpComponent, {
      maxWidth: null,
      width: "98vw",
      minHeight: "70vh",
      maxHeight: "90vh",
      id: dialogId,
      data: { dragedWidget: dragedWidget, dialogId: dialogId }
    });
    if(dialogRef.componentInstance != undefined){
      dialogRef.componentInstance.closePopUp.subscribe((app) => {
      this.closePopUp.emit('');
      })
    }
    this.insertRecentAppSearch(widget.widgetName, widget.widgetId);
    //   dialogRef.componentInstance.closeMatDialog.subscribe((app) => {
    //  });
  }

  insertRecentAppSearch(name, id) {
    this.widgetService.insertRecentSearch({ name: name, recentSearchType: RecentSearchType.widget, itemId: id })
      .subscribe((res: any) => {
        if (res.success) {
          let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
          this.cookieService.set(LocalStorageProperties.LoadRecentSearches, JSON.stringify(true), null, environment.cookiePath, window.location.hostname, false, "Strict");
          var recentSearchesJson = localStorage.getItem(LocalStorageProperties.RecentSearches)
          if(!recentSearchesJson || recentSearchesJson == "null") {
            localStorage.setItem(LocalStorageProperties.RecentSearches, JSON.stringify({createdDateTime: new Date, itemId: id, recentSearch: name, recentSearchType: RecentSearchType.widget}));
          } else {
            var recentSearches = JSON.parse(recentSearchesJson);
            recentSearches.push({createdDateTime: new Date, itemId: id, recentSearch: name, recentSearchType: RecentSearchType.widget});
            localStorage.setItem(LocalStorageProperties.RecentSearches, JSON.stringify(recentSearches));            
          }
        }
      });
  }

  navigateToEdit(app) {
    event.stopPropagation();
    event.preventDefault();
    let dialogId = 'edit-apps-dialog';
    const dialogRef = this.dialog.open(this.createAppaDialogComponent, {
      width: "90vw",
      height: "90vh",
      id: dialogId,
      data: { appId: app.widgetId, isForHtmlApp: app.isHtml, appType: app.isProcess == true ? 3 : null , dialogId: dialogId}
    });
    // dialogRef.componentInstance.isReloadRequired.subscribe((isReloadRequired: boolean) => {
    //   if (isReloadRequired === true) {
    //     //this.loadWidgetsList();
    //     this.getWidgetsList();
    //     this.dialog.closeAll();
    //   }
    // });
  }

  navigateToCreate(isHtml, appType: number) {
    let dialogId = 'create-apps-dialog';
    const dialogRef = this.dialog.open(this.createAppaDialogComponent, {
      width: "90vw",
      height: "90vh",
      disableClose: true,
      id: dialogId,
      data: { appId: null, isForHtmlApp: isHtml, fromSearch: this.fromSearch, tag: this.tagsSearchText, tagModel: this.tagModel, appType: appType, dialogId: dialogId }
    });
    // dialogRef.componentInstance.isReloadRequired.subscribe((isReloadRequired: boolean) => {
    //   if (isReloadRequired === true) {
    //     this.loadWidgetsList();
    //     this.getWidgetsList();
    //     this.dialog.closeAll();
    //   }
    //   if (this.fromSearch == true) {
    //     this.loadWidgetTags.emit('');
    //   }
    // });
  }

  isReloadRequired(data: boolean) {
    if (data === true) {
      //this.loadWidgetsList();
      this.getWidgetsList();
      this.dialog.closeAll();
    }
    if (this.fromSearch == true) {
      this.loadWidgetTags.emit('');
    }
  }

  selectedTag(item) {
    if(item.TagId) {
      this.selectWidgetTag(item);
      }
      else {
        this.selectWidgetTagBasedOnTagName(item);
      }
  }

  selectedDashboard(item){
    this.navigateToDashboard(item);
  }

  openTagsOrWorkspaces(items, itemType) {
    let dialogId = 'more-tags-workspaces';
    const dialogRef = this.dialog.open(this.openAppaDialogComponent, {
      width: "25vw",
      disableClose: true,
      id: dialogId,
      data: { items: items, itemsType: itemType, dialogId: dialogId,tagsSearchText: this.tagsSearchText }
    });
    // dialogRef.componentInstance.selectedTag.subscribe((item: any) => {
    //   if(item.TagId) {
    //   this.selectWidgetTag(item);
    //   }
    //   else {
    //     this.selectWidgetTagBasedOnTagName(item);
    //   }
    // });
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    this.subscription.unsubscribe();
  }

  navigateToApp(widget) {
    if (widget.widgetId != null && widget.widgetId != undefined){
      this.insertRecentAppSearch(widget.widgetName, widget.widgetId);
      this.routes.navigateByUrl("dashboard-management/widgets/" + widget.widgetId);
      this.appsSelected.emit(null);
    }
      
  }
  navigateToDashboard(workspaceName) {
    var dashboards = localStorage.getItem(LocalStorageProperties.AllDashboards);
    if (dashboards && dashboards != "null") {
      var dashboardList = JSON.parse(dashboards);
      var dashboardObj = dashboardList.find(x => x.workspaceName.toLowerCase() == workspaceName.toLowerCase());
      if(!dashboardObj || dashboardObj.isHidden == true) {
        const workspaceModel = new WorkspaceList();
        workspaceModel.workspaceName = dashboardObj.workspaceName;
        workspaceModel.workspaceId = dashboardObj.workspaceId;
        workspaceModel.description = dashboardObj.description;
        workspaceModel.timeStamp = dashboardObj.timeStamp;
        workspaceModel.editRoleIds = dashboardObj.editRoleIds;
        workspaceModel.deleteRoleIds = dashboardObj.deleteRoleIds;
        workspaceModel.selectedRoleIds = dashboardObj.roleIds.toString();
        workspaceModel.isHidden = false;
        this.widgetService.UpsertWorkspace(workspaceModel)
            .subscribe((res: any) => {
              if(res.success) {
                const workspacelist = new WorkspaceList();
                workspacelist.workspaceId = "null";
                workspacelist.isHidden = false;
                this.widgetService.GetWorkspaceList(workspacelist)
                        .subscribe((res: any) => {
                          if(res.success) {
                            localStorage.setItem(LocalStorageProperties.Dashboards, JSON.stringify(res.data));
                            let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
                            this.cookieService.set(LocalStorageProperties.ReloadDashboards, JSON.stringify(true), null, environment.cookiePath, window.location.hostname, false, "Strict");
                            this.routes.navigateByUrl("dashboard-management/dashboard/" + dashboardObj.workspaceId);
                            this.appsSelected.emit(null);
                          }
                        })
              }
            })
      }
      else { 
        (dashboardObj != null && dashboardObj != undefined)
        this.routes.navigateByUrl("dashboard-management/dashboard/" + dashboardObj.workspaceId);
        this.appsSelected.emit(null);
      }
    }
  }

  loadCustomAppsListViewComponent() {
    var loader = this.appStoreModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
      var module: any = _.find(modules, function(module : any){
          var widget = _.find(module.apps, function(app : any){ return app.componentName.toLowerCase() == "customappslistviewcomponent" });
          if(widget){
            return true;
          }
          return false;
        })
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
            elementInArray.name === "Custom apps view"
          );
          
          const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          this.dashboard = {};
          this.dashboard.component = factory;
            this.dashboard.inputs = {
              selectedAppsFromAppStore: this.widgets,
              paginate: { itemsPerPage: this.itemsPerPage, currentPage: this.currentPage, totalItems: this.totalItems }
          }            
          this.loaded = true;
          this.cdRef.detectChanges();
        })
  }

  refreshSoftLabes(event){
    if(event){
      this.getSoftLabelConfigurations();
    }
  }

  returnScrollValue(){
    if(this.listView){
      return true;
    } else if(!this.fromSearch && this.listView){
      return true;
    } else {
      return false;
    }
  }
}




