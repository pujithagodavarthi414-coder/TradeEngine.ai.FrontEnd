import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ChangeDetectionStrategy, ViewChildren, QueryList, ChangeDetectorRef } from "@angular/core";
import { SatPopover } from "@ncstate/sat-popover";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserStoryLinksModel } from "../../models/userstory-links.model";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import * as projectModuleReducers from "../../store/reducers/index";
import { State } from "../../store/reducers/index";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Component({
  selector: "userstory-link-summary",
  templateUrl: "user-story-link-summary.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
  .deadline-date {
    top: 5px;
    position: relative;
  }

  .deadline-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media only screen and (max-width: 1440px) {
    .link-status-small {
        max-width: 80px !important;
        min-width: 80px !important;
    }
  }
  `],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class UserStoryLinkSummaryComponent implements OnInit {
  @Input('userStory')
  set _userStory(data: UserStoryLinksModel) {
    this.userStory = data;
  }
  @Input('isArchivePermission')
  set _isArchivePermission(data: boolean) {
    this.isArchivePermission = data;
  }
  @Input('isSelected') isSelected: boolean;
  @Input('userStoryId') userStoryId: string;
  @Input("isSprintUserStories") isSprintUserStories: boolean;
  @Output() highLightUserStory = new EventEmitter<string>();
  @Output() selectUserStory = new EventEmitter<string>();
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild("archiveUserStoryPopover") archiveUserStory: SatPopover;
  @ViewChildren("archivePopOver") archivePopUps
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  userStory: UserStoryLinksModel;
  isArchivePermission: boolean;
  selectedUserStoryId: string;
  isUserStorySelected: boolean;
  isArchivePopUp: boolean;
  defaultProfileImage = "assets/images/faces/18.png";
  profileImage: string;
  uniqueNumberUrl: string;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(private cdRef: ChangeDetectorRef,
    private router: Router,
    private store: Store<State>,
    private snackbar: MatSnackBar,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }


  openContextMenu(event: MouseEvent, userStory) {
    this.selectedUserStoryId = userStory.linkUserStoryId;
    this.isUserStorySelected = false;
    event.preventDefault();
    var contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      console.log(event);
      this.contextMenuPosition.x = (event.clientX) + 'px';
      this.contextMenuPosition.y = (event.clientY - 30) + 'px';
      this.cdRef.detectChanges();
      contextMenu.openMenu();
      this.selectUserStory.emit(userStory.linkUserStoryId);
    }
  }

  openArchivePopUp() {
    this.isArchivePopUp = true;
  }

  onClick(event) {
    this.selectedUserStoryId = null;
    this.isUserStorySelected = true;
    this.selectUserStory.emit('');
  }

  closeArchivePopUp() {
    this.isArchivePopUp = false;
    this.selectedUserStoryId = null;
    this.archivePopUps.forEach((p) => p.closePopover());
    var contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  navigateToUserStoriesPage(userStory) {
    this.router.navigate([
      "projects/workitem",
      userStory.userStoryId
    ]);
  }

  applyClassForUniqueName(userStoryTypeColor) {
    if (userStoryTypeColor) {
      return "asset-badge"
    } else {
      return "userstory-unique"
    }
  }


  copyLink() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/workitem/' + this.userStory.userStoryId;


    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.uniqueNumberUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbar.open(this.translateService.instant('USERSTORY.LINKCOPIEDSUCCESSFULLY'), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
  }

  openInNewTab() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/workitem/' + this.userStory.userStoryId;
    window.open(this.uniqueNumberUrl, "_blank");
  }
}