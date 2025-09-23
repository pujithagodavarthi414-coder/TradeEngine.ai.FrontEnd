import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  SecurityContext,
  ViewChild,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter
} from "@angular/core";
import { Observable } from "rxjs";
import { CommentApiReturnModel } from "../models/commentApiReturnModel";
import { ComponentModel } from "../models/componentModel";
import { FormControl } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { MatTabChangeEvent, MatTab } from '@angular/material/tabs';

@Component({
  selector: 'snovasys-crm',
  templateUrl: './snovasys-crm.component.html',
  styleUrls: ['./snovasys-crm.component.scss'],
  inputs: ['receiverId', 'componentModel', 'isPermissionExists', 'isCRM', 'isMobileNuberOnly'],
  encapsulation: ViewEncapsulation.None
})

export class SnovasysCRMComponent implements OnInit {
  @ViewChild('tabGroup') public tabGroup: any;
  public activeTabIndex: number | undefined = undefined;
  public activeTabLabel: any;

  receiverId
  @Input('receiverId')
  set _receiverId(data: string) {
    this.receiverId = data;
  }

  componentModel
  @Input('componentModel')
  set _componentModel(data: ComponentModel) {
    this.componentModel = data;
    console.log(this.componentModel);
    this.componentModel.callBackFunction(this.componentModel.parentComponent);
  }

  isMobileNuberOnly
  @Input('isMobileNuberOnly')
  set _isMobileNuberOnly(data: any){
    this.isMobileNuberOnly = data;
  }

  @Input() mobileNumber: string;

  @Input() isPermissionExists: boolean;

  @Input() isCRM: boolean;
  @Input() canComment: boolean;
  @Input() canCall: boolean;
  @Input() canVideoCall: boolean;
  @Input() canCreateRoom: boolean;
  @Input() canViewVideoLog: boolean;
  @Input() canJoinRoomOnly: boolean;
  @Input() canPay: boolean;
  @Input() canSMS: boolean;
  @Input() isVideoCallFromPopup: boolean;
  @Output() paymentDetails = new EventEmitter<any>();

  @ViewChildren(MatTab) tabs: QueryList<MatTab>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.activeTabIndex = this.tabGroup.selectedIndex;
    this.activeTabLabel = this.tabs.first.textLabel;
  }

  public handleTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
    this.activeTabLabel = event.tab.textLabel;
  }

  paymentInfo(data){
    this.paymentDetails.emit(data);
  }

}
