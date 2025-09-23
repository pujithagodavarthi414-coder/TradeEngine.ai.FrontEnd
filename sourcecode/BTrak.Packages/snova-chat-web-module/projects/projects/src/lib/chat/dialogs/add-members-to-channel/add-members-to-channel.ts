import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChatService } from '../../services/chat.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { channelMembersSearchInputModel } from '../../models/channelMembersSearchInputModel';
import { ChannelMemberModel, ChannelUpdateModel } from '../../models/channelUpdateModel';

@Component({
    selector: 'app-add-members-dialog',
    templateUrl: './add-members-to-channel-dialog-template.html',
    styleUrls: ['./add-members-to-channel-dialog-styles.css'],
})
export class AddMembersToChannelDialog implements OnInit{

  memberName: string = '';
  addedMembers: any = [];
  allMembers: any = [];
  filteredOptions: Observable<any[]>;
  myControl = new FormControl();
  addedMemberDetails: any = []

  constructor(public dialogRef: MatDialogRef<AddMembersToChannelDialog>, private chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      
    }
  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.closeDialog();
      }
    });
    var inputModel = new channelMembersSearchInputModel();
      inputModel.channelId = this.data.channelId;
      inputModel.isAddMemberToChannel = true;
      inputModel.isDeleted = false;
      this.chatService.getChannelMembers(inputModel).subscribe((channelMembers) => {
        if(channelMembers.success) {
          this.allMembers = channelMembers.data;
          this.allMembers.forEach(element => {
            element.fullName = element.firstName + ' ' + element.surName
          });
          this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(state => state.length > 0 ? this._filterStates(state) : [])
          );
        }
      });
  }
  private _filterStates(value: string) {
    const filterValue = value.toLowerCase();

    return this.allMembers.filter(state => state.fullName.toLowerCase().indexOf(filterValue) != -1);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  onAddMembers() {
    var inputModel = new ChannelUpdateModel();
    inputModel.channelId = this.data.channelId;
    inputModel.channelName = this.data.channelName;
    inputModel.isDeleted = false;
    var temp: ChannelMemberModel[] =[]
    this.addedMembers.forEach(element => {
      var index = this.addedMemberDetails.findIndex(x => x.fullName == element);
      if(index != -1) {
        var member = new ChannelMemberModel();
      member.memberUserId = this.addedMemberDetails[index].id;
      member.isReadOnly = false;
      temp.push(member);
      }
    });
    inputModel.channelMemberModel = temp
    this.chatService.addEmployeesToChannel(inputModel).subscribe((res: any) => {
    });
    this.dialogRef.close();
  }
  removeMember(member) {
    const index = this.addedMembers.indexOf(member);
    if (index > -1) {
      this.addedMembers.splice(index, 1);
    }
    const index2 = this.addedMemberDetails.findIndex(x => x.fullName == member);
    if (index2 > -1) {
      this.allMembers.push(this.addedMemberDetails[index2])
      this.addedMemberDetails.splice(index2, 1);
    }
  }
  selected(member) {
    this.memberName = ''
    const index = this.allMembers.findIndex(x => x.fullName == member);
    if (index > -1) {
      this.addedMemberDetails.push(this.allMembers[index])
      this.allMembers.splice(index, 1);
    }
    this.addedMembers.unshift(member);
  }
}