import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ComponentModel } from '@snovasys/snova-comments';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'video-call-candidate',
  templateUrl: 'video-call-candidate.component.html',
})
export class VideoCallCandidateComponent implements OnInit {

  componentModel: ComponentModel = new ComponentModel();
  receiverId: any;
  roomName: any;
  currentUserId: any;
  canComment = false;

  ngOnInit() {
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction =
    ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }

  constructor(
    private cookieService: CookieService, private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef) {
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.roomName = params['roomname'.toString()];
        this.receiverId = params['id'.toString()];
        this.checkForUser();
        this.cdRef.detectChanges();
      }
    });
  }

  checkForUser() {
    const currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    if (currentUser != null && currentUser !== undefined && currentUser !== ''
     && this.currentUserId != null && this.currentUserId !== undefined && this.currentUserId !== '') {
      this.canComment = true;
    } else {
      this.canComment = false;
    }
  }
}
