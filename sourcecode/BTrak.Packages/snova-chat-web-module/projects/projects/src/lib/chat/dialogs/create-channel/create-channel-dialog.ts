import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AddMembersToChannelDialog } from "../../dialogs/add-members-to-channel/add-members-to-channel";
import { ChatService } from '../../services/chat.service';
import { ChannelUpdateModel } from '../../models/channelUpdateModel';
import { ChannelMemberModel } from '../../models/channelUpdateModel';
import { CookieService } from "ngx-cookie-service";
import { Guid } from "guid-typescript";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-create-channel-dialog',
    templateUrl: './create-channel-dialog-template.html',
    styleUrls: ['./create-channel-dialog-styles.css'],
})
export class CreateChannelDialog implements OnInit{
    channelName: string = '';
    loggedInUserId = this.cookieService.get("CurrentUserId");
  constructor(public dialogRef: MatDialogRef<CreateChannelDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService, private dialog: MatDialog, private chatService: ChatService,
    private toastr: ToastrService) { }
  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.closeDialog();
      }
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  onCreate() {
    var inputModel = new ChannelUpdateModel();
    inputModel.channelName = this.channelName;
    inputModel.channelImage = this.data.loggedInuserProfileImage;
    inputModel.isDeleted = false;
    var member = new ChannelMemberModel();
    member.memberUserId = this.loggedInUserId;
    member.isReadOnly = false;
    inputModel.channelMemberModel = [member];
    this.chatService.upsertChannel(inputModel).subscribe((res: any) => {
      if(res.success == false) {
        if(res.apiResponseMessages[0].message != '' && res.apiResponseMessages[0].message != null && 
        res.apiResponseMessages[0].message != undefined && res.apiResponseMessages[0].message != 'null' && res.apiResponseMessages[0].message != 'undefined') {
          this.toastr.error(res.apiResponseMessages[0].message,"Failed");
        } else {
          this.dialogRef.close();
          this.toastr.error("Topic Creation failed","Failed");
        }
      } else {
        this.dialogRef.close();
        this.openAddMembersToChannelDiloag(res.data);
      }
    });
  }
  openAddMembersToChannelDiloag (channelId) {
    let addMembersDialogRef = this.dialog.open(AddMembersToChannelDialog, {
      data: {channelId: channelId,
      channelName: this.channelName
      },
      width: '600px',
      disableClose: true,
    });
  }
}