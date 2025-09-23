import { OnInit, Component, ViewChildren, ViewChild, Input, EventEmitter, Output ,ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { WidgetService } from "../../dependencies/services/widget.service";
import { DragulaService } from "ng2-dragula";
import { Subject, Subscription, of } from "rxjs";
import { Observable } from "rxjs";
import { State } from "../../dependencies/store/reducers/index";
import { LoadTagsReorderTriggered, WidgetsActionTypes } from "../../dependencies/store/actions/widgetslist.action";
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, tap } from "rxjs/operators";
import * as widgetModuleReducer from "../../dependencies/store/reducers/index";
import { TagsModel } from "../../dependencies/models/tagsModel";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { CustomTagModel } from "../../dependencies/models/customTagModel";
import { ToastrService } from "ngx-toastr";
import { SatPopover } from "@ncstate/sat-popover";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import {   MediaChange, MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';


@Component({
  selector: "app-store",
  templateUrl: "./app-store.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DragulaService]
})


export class AppStoreComponent extends CustomAppBaseComponent implements OnInit {

  @Input("canInstall")
  set __canInstall(data: boolean) {
    if (data != null) {
      this.canInstall = data;
    }
  }
  deletingTag: any;
  deletedTagId: any;
  isFavourite: boolean;
  isRecent: boolean;
  canInstall: boolean;
  tagsModel: TagsModel;
  searchText: string;
  tags: TagsModel[];
  selectedTag: string;
  tagsSearchText: string;
  selectAllTagsByDefault: boolean = true;
  originalTags: TagsModel[];
  tagSearchText: string;
  fetchInProgress: boolean;
  subs = new Subscription();
  reOrderOperationInProgress$: Observable<boolean>;
  reOrderIsInProgress: boolean;
  public ngDestroyed$ = new Subject();
  isDraggable: boolean;
  orderedtags: string[];
  addTagForm: FormGroup;
  isAnyOperationIsInprogress: boolean = false;
  selectedTagId: any;
  currentEditedTagId: string = null;
  currentEditedTagName: string = null
  @ViewChildren("addTagPopup") addTagPopover;
  @ViewChildren("deleteTagPopover") deleteTagPopover;
  @ViewChild("addTag") addTagPopup: SatPopover;
  @ViewChild("addTagDirective") addTagDirective: FormGroupDirective;
  @Output() appsSelected = new EventEmitter<any>();
  Array = Array;
  mediaQuery$: Subscription;
  activeMediaQuery: string;
  size: string ="20";
  widgetSize: string = "80";
  num = 10;
  fromRoute: boolean;
  isTreeviewPinned: boolean = true;
  constructor(
    private actionUpdates$: Actions,
    private store: Store<State>,
    private ws: WidgetService,
    private dragulaService: DragulaService,
    private cdRef: ChangeDetectorRef,
    public media: MediaObserver,
    public routes: Router,
    private toastr: ToastrService) {
    super();
    dragulaService.createGroup("tags", {
      revertOnSpill: true
      // removeOnSpill: true
    });

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(WidgetsActionTypes.LoadTagsReorderCompleted),
      tap(() => {
        this.dragulaService.find('tags').drake.cancel(true);
      })
    ).subscribe();

    this.subs.add(this.dragulaService.drag("tags")
      .subscribe(({ el }) => {
        this.reOrderOperationInProgress$.subscribe(x => this.reOrderIsInProgress = x);
        if (this.reOrderIsInProgress) {
          this.dragulaService.find('tags').drake.cancel(true);
        }
      })
    );

    this.subs.add(this.dragulaService.drop("tags").pipe(
      takeUntil(this.ngDestroyed$))
      .subscribe(({ name, el, target, source, sibling }) => {
        var orderedListLength = target.children.length;
        let orderedTagList = [];
        for (var i = 0; i < orderedListLength; i++) {
          var tagId = target.children[i].attributes["data-tagid"].value;
          orderedTagList.push(tagId.toLowerCase());
        }
        this.store.dispatch(new LoadTagsReorderTriggered(orderedTagList));
      })
    );
  }

 

  changeMedia() {
    //this.mediaQuery$ = 
    this.media.media$.subscribe( (change: MediaChange) => {
      this.activeMediaQuery = `${change.mqAlias}`;
      if (this.activeMediaQuery === 'xs' || this.activeMediaQuery === 'sm') {
          // Here goes code for update data in xs or sm (small screen)
            // this.size = "30";
            // this.widgetSize = "70";
            this.isTreeviewPinned = false;
      } else if (this.activeMediaQuery === 'md') {
        this.isTreeviewPinned = true;
        if(!this.canInstall) {
          this.size = "24";
          this.widgetSize = "76";
        } else {
          this.size = "28";
          this.widgetSize = "72";
        }
      }
      else if(this.activeMediaQuery === 'lg'){
          // Here goes code for update data in gt-sm (bigger screen)
          this.isTreeviewPinned = true;
         if(this.canInstall) {
            this.size = "25";
            this.widgetSize = "75";
          } else {
            this.size = "22";
            this.widgetSize = "78"
          } 
      }      
    this.cdRef.detectChanges();
  });
  }

  ngOnInit() {
    super.ngOnInit();
    this.getCustomTags();
    this.reOrderOperationInProgress$ = this.store.pipe(select(widgetModuleReducer.getWidgetsReorderLoading));
    this.initializeAddTagForm();
    this.changeMedia();

    if (this.routes.url.includes("app-store/widgets")) {
      this.fromRoute = true;
    }
  }

  pinTreeView() {
    this.isTreeviewPinned = !this.isTreeviewPinned;
  }

  getCustomTags() {
    this.fetchInProgress = true;
    this.ws.getCustomTags(true)
      .subscribe((res: any) => {
        this.tags = res.data;
        this.originalTags = this.tags
        this.fetchInProgress = false;
      });
  }

  openAddTagPopup(popup) {
    this.currentEditedTagId = null;
    this.initializeAddTagForm();
    popup.openPopover();
  }

  openEditTagPopup(tag,popup){
    this.currentEditedTagId = tag.tagId;
    this.currentEditedTagName = tag.tags;
    this.addTagForm.get("tagName").patchValue(tag.tags);
    popup.openPopover();
  }

  addTagForMainTag(event) {
    event.preventDefault();
    event.stopPropagation();
    const tagsModel = new CustomTagModel();
    tagsModel.tag = this.addTagForm.get("tagName").value;
    this.upsertTag(tagsModel);
  }

  updateTag(event) {
    event.preventDefault();
    event.stopPropagation();
    const tagsModel = new CustomTagModel();
    tagsModel.tagId = this.currentEditedTagId;
    tagsModel.tag = this.addTagForm.get("tagName").value;
    if(tagsModel.tag == this.currentEditedTagName) {
      this.addTagDirective.resetForm();
        this.closeTagForm();
    } else {
    this.upsertTag(tagsModel);
    }
    this.currentEditedTagName = null;
  }

  upsertTag(tagsModel) {
    this.isAnyOperationIsInprogress = true;
    this.ws.upsertTag(tagsModel).subscribe((result: any) => {
      if (result.success != true) {
        var validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);

      } else {
        tagsModel.tagId = result.data;
        if (!this.currentEditedTagId) {
          const tagAdded = new TagsModel();
          tagAdded.parentTagId = null;
          tagAdded.tagId = tagsModel.tagId;
          tagAdded.tags = tagsModel.tag;
          this.tags.push(tagAdded);
        } else {
           let currentEditedTag = this.tags.find(x=>x.tagId == this.currentEditedTagId);
           currentEditedTag.tags = tagsModel.tag;
           let index = this.tags.indexOf(currentEditedTag);
           this.tags[index] = currentEditedTag;
        }

        this.addTagDirective.resetForm();
        this.closeTagForm();
      }
      this.isAnyOperationIsInprogress = false;
    });
  }

  closeTagForm() {
    this.addTagDirective.resetForm();
    this.addTagPopover.forEach((p) => p.closePopover());
  }

  initializeAddTagForm() {
    this.addTagForm = new FormGroup({
      tagName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      )
    });
  }

  searchTextstring(text) {
    this.selectedTag = text;
    this.selectedTagId = '';
    this.selectAllTagsByDefault = false;
  }

  searchTags() {
    // this.selectAllTagsByDefault = false;
    const tagText = this.tagsSearchText;
    if (!tagText) {
      this.tags = this.originalTags;
    } else {
      this.tags = [];
      this.originalTags.forEach((item: any) => {
        if (item && item.tags.toLowerCase().indexOf(tagText.toLowerCase().trim()) != -1) {
          this.tags.push(item);
        }
      });
    }
  }

  closeTagsSearch() {
    this.tagsSearchText = "";
    !this.selectedTag ? this.selectAllTagsByDefault = true : null;
    this.searchTags();
  }
  deleteTags() {
    if(this.deletingTag) {
      const tagsModel = new CustomTagModel();
      tagsModel.tag = this.deletingTag.tags;
      tagsModel.tagId = this.deletingTag.tagId;
      this.ws.upsertTag({...tagsModel, isForDelete: true})
              .do((res: any) => {

              })
              .switchMap((res: any) => {
                if(res.success) {
                  this.tags = this.tags.filter(function(i)
                  { 
                    
                    if(i.tagId.toLowerCase() != res.data.toLowerCase().toLowerCase() ) {
                      return i;
                    } 
                    else if(i.parentTagId) {
                      i.parentTagId.toLowerCase() != res.data.toLowerCase().toLowerCase()
                    }             
                });
                this.originalTags = this.tags;
                  if( this.selectedTagId && this.selectedTagId.toLowerCase() ==  res.data.toLowerCase()) {
                    this.selectAll();
                  }
                  else {
                  this.deletedTagId = res.data;
                  }
                }                
                this.deletingTag = null;
                this.closePopover();
                this.cdRef.detectChanges();
                return of(null);
              }).subscribe();
    }
  }

  closePopover() {
    this.deleteTagPopover.forEach((p) => p.closePopover());
  }

  openDeleteTagPopOver(tag, deleteTagPopover) {
    this.deletingTag = tag;
    deleteTagPopover.openPopover();
  }

  selectAll() {
    this.tagSearchText = '';
    this.selectedTag = '';
    this.selectedTagId = null;
    this.isRecent = false;
    this.isFavourite = false;
    this.selectAllTagsByDefault = true;
    this.searchTags();
  }

  selectTag(tag) {
    this.tagSearchText = tag.tags;
    this.selectAllTagsByDefault = false;
    this.selectedTag = tag.tags;
    this.selectedTagId = tag.tagId;
    this.isRecent = false;
    this.isFavourite = false;
  }

  selectRecentOrFavouriteApps(isFav: boolean) {
    this.tagSearchText = '';
    this.selectAllTagsByDefault = false;
    this.selectedTag = '';
    this.selectedTagId = '';
    this.isRecent = isFav == false;
    this.isFavourite = isFav == true;
  }

  selectAppsWithNoTags() {
    this.tagSearchText = '';
    this.selectAllTagsByDefault = false;
    this.selectedTag = '';
    this.isRecent = false;
    this.isFavourite = false;
  }

  closeTagSearch(data) {
    this.tagSearchText = '',
      this.selectedTag = '';
    this.selectAllTagsByDefault = true;
    this.isRecent = false;
    this.isFavourite = false;
  }
  
  appSelected(app) {
    this.appsSelected.emit(app);
}

  loadTags() {
    this.getCustomTags();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
    this.dragulaService.destroy("tags");
  }

}