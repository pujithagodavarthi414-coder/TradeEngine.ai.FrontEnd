import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from 'ngx-toastr';
import { ComponentModel } from "@thetradeengineorg1/snova-comments";
import { UserService } from "../services/user.Service";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment))

@Component({
  selector: "video-call-join",
  templateUrl: "./video-call-join.component.html",
})
export class VideoCallJoinComponent implements OnInit {

  componentModel: ComponentModel = new ComponentModel();
  receiverId: any;
  roomName: any;
  currentUserId: any;
  canComment: boolean = false;
  companyMainLogo: string = 'assets/images/Main-Logo.png';

  ngOnInit() {
    var currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
    if (currentUser != null && currentUser != undefined) {
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    }
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
    if (this.cookieService.get(LocalStorageProperties.CompanyMainLogo) && this.cookieService.get(LocalStorageProperties.CompanyMainLogo) != "") {
        this.companyMainLogo = this.cookieService.get(LocalStorageProperties.CompanyMainLogo);
    }
  }

  constructor(public route: Router, private router: ActivatedRoute, private  userService: UserService,
        private cookieService: CookieService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
      this.router.params.subscribe((params: Params) => {
      if (params) {
        this.roomName = params["roomname"];
        this.receiverId = params["id"];
        this.checkForUser();
        this.cdRef.detectChanges();
      }
    });
  }

  checkForUser() {
    var currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    if (currentUser != null && currentUser != undefined && currentUser != "" && this.currentUserId != null && this.currentUserId != undefined && this.currentUserId != "") {
      // this.getTwilioToken();
      this.canComment = true;
    } else {
      this.canComment = false;
    }
  }
}