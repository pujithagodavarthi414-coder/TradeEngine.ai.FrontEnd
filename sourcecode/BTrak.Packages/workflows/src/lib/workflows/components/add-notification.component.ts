import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { Guid } from "guid-typescript";
import { Observable } from "rxjs";
import { SearchFilterPipe } from "../pipes/search-filter.pipe";
import { WorkflowService } from "../services/workflow.service";
import { map, startWith } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import * as _ from 'underscore';

@Component({
    selector: "app-add-notification",
    templateUrl: "./add-notification.component.html"
})

export class AddNotificationComponent implements OnInit {
    @ViewChild('rolesInput') rolesInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('autocompleteTrigger') matACTrigger: MatAutocompleteTrigger;
    @ViewChild('chipList') rolesList: MatChipList;
    @ViewChild('userToInput') toUserInput: ElementRef<HTMLInputElement>;
    @ViewChild('userAutocompleteTrigger') matUserACTrigger: MatAutocompleteTrigger;
    rolesDropdown: any[] = [];
    userDropdown: any[] = [];
    selectedRoleIds: any[] = [];
    selectedToUsers: any[] = [];
    selectedRoles: any[] = [];
    filteredRoles$: Observable<any[]>;
    filteredToUsers$: Observable<any[]>;
    selectable: boolean = true;
    removable: boolean = true;
    notificationType: string;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        this.clearForm();
        if (this.matData) {
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.formname = this.matData.name;
            this.isEdit = this.matData.isEdit;
            this.notificationType = this.matData.notificationType;
            this.formValue = this.matData.formValue;
            if (this.isEdit == false) {
                this.id = Guid.create().toString();
            } else {
                this.id = this.formValue.id;
                this.notificationForm.patchValue(this.formValue);
            }
        }
    }
    notificationTypes: any[] = [];
    matData: any;
    config = {
        init: {
            plugins: 'link, table, preview, advlist, image, searchreplace, code, autolink, lists, autoresize, media',
            default_link_target: '_blank',
            toolbar: 'formatselect | bold italic strikethrough | link image table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
            height: 350,
            branding: false,
            table_responsive_width: true,
            image_advtab: true,
            autoresize_bottom_margin: 20,
            relative_urls: 0,
            remove_script_host: 0
        }
    }
    currentDialogId: any;
    currentDialog: any;
    formValue: any;
    formname: string;
    id: string;
    isEdit: boolean;
    isHidden: boolean;
    notificationForm: FormGroup;
    constructor(private dialog: MatDialog, private searchFilterPipe: SearchFilterPipe, private workflowService: WorkflowService,
        private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        this.isHidden = true;
        this.notificationTypes = [
            {
                "text": "Create",
                "value": "Create"
            },
            {
                "text": "Edit",
                "value": "Edit"
            },
            {
                "text": "Delete",
                "value": "Delete"
            }
        ]
        this.getRolesDropdown();
        this.getAllUsers();

    }

    ngOnInit() {

    }

    getRolesDropdown() {
        this.workflowService.getAllRoles().subscribe((response: any) => {
            if (response.success) {
                this.rolesDropdown = response.data;
                this.filteredRoles$ = this.notificationForm.get('rolesInput').valueChanges.pipe(
                    startWith(null),
                    map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));
                if (this.isEdit) {
                    this.bindRoleNames();
                }
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    getAllUsers() {
        var searchModel: any = {};
        searchModel.isArchived = false;
        this.workflowService.GetAllUsers(searchModel).subscribe((response: any) => {
            let usersDropdown = response.data;
            usersDropdown.forEach((user) => {
                if (user.roleIds) {
                    user.roleIdsArray = user.roleIds.split(",");
                }
            })
            this.userDropdown = usersDropdown;
            this.filteredToUsers$ = this.notificationForm.get('toInput').valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));
            if (this.isEdit) {
                this.bindToUserNames(this.formValue.toUsersString);
            }
        })

    }

    clearForm() {
        this.notificationForm = new FormGroup({
            name: new FormControl(null, Validators.compose([Validators.required])),
            //title: new FormControl(null, Validators.compose([])),
            notificationText: new FormControl(null, Validators.compose([Validators.required])),
            roleIds: new FormControl('', Validators.compose([Validators.required
            ])),
            rolesInput: new FormControl('', this.validateRoles),
            toUsers: new FormControl('', Validators.compose([Validators.required])),
            toInput: new FormControl('', this.validateToUsers),
            navigationUrl: new FormControl(null, Validators.compose([]))
        })
        this.filteredRoles$ = this.notificationForm.get('rolesInput').valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));
        this.filteredToUsers$ = this.notificationForm.get('toInput').valueChanges.pipe(
            startWith(null),
            map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

        this.selectedRoleIds = [];
        this.selectedRoles = [];
        this.selectedToUsers = [];
        this.selectedRoleIds = [];
        this.selectedRoles = [];
        this.selectedToUsers = [];
    }

    private validateRoles(roles: FormControl) {
        if ((roles.value && roles.value.length === 0)) {
            return {
                validateRolesArray: { valid: false }
            };
        }
        return null;
    }

    private validateToUsers(users: FormControl) {
        if ((users.value && users.value.length === 0)) {
            return {
                validatUsersArray: { valid: false }
            };
        }

        return null;
    }

    onNoClick() {
        this.currentDialog.close();
    }

    addNotification() {
        let formSubmission = this.notificationForm.value;
        if (this.selectedToUsers.length > 0) {
            formSubmission.notifyToUsersJson = JSON.stringify(this.selectedToUsers);
        }
        var toRoleIds = this.notificationForm.value.roleIds;
        var toUsers = this.notificationForm.value.toUsers;
        if (toRoleIds.length > 0) {
            formSubmission.toRoleIdsString = toRoleIds.join(",");
        }
        if (toUsers.length > 0) {
            formSubmission.toUsersString = toUsers.join(",");
        }
        formSubmission.notificationType = this.notificationType;
        this.currentDialog.close(formSubmission);
    }

    cancelNotification() {
        this.clearForm();
        this.currentDialog.close();
    }

    bindRoleNames() {
        let roleIds = this.formValue.toRoleIdsString;
        let roleDropdown = this.rolesDropdown;
        let rolesArray = roleIds.split(",");
        rolesArray.forEach((role) => {
            let filteredList = _.filter(roleDropdown, function (role1) {
                return role1.roleId == role;
            })
            this.selectedRoles.push(filteredList[0]);
        })
        this.selectedRoleIds = rolesArray;
        this.notificationForm.get('roleIds').setValue(rolesArray);
        this.notificationForm.get('rolesInput').setValue('');

        this.cdRef.detectChanges();
    }

    bindToUserNames(users) {
        let userDropdown = this.userDropdown;
        let userArray = [];
        if (users) {
            userArray = users.split(",");
            let filteredList = [];
            userArray.forEach((user) => {
                let filteredList = _.filter(userDropdown, function (user1) {
                    return user == user1.email
                })
                if (filteredList.length > 0) {
                    let selectedUsersList = this.selectedToUsers;
                    let filteredList1 = _.filter(selectedUsersList, function (user2) {
                        return user2.email == user
                    })
                    if(filteredList1.length == 0) {
                        var userModel: any = {};
                        userModel.fullName = filteredList[0].fullName;
                        userModel.userId = filteredList[0].userId;
                        userModel.email = filteredList[0].email;
                        this.selectedToUsers.push(userModel);
                    }
                  
                }
            })
        }

        let userIds = this.selectedToUsers.map(x => x.email);
        this.notificationForm.get('toUsers').setValue(userIds);
        this.notificationForm.get('toInput').setValue('');
        this.cdRef.detectChanges();
    }


    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.rolesDropdown.filter(role => role.roleName.toLowerCase().indexOf(filterValue) >= 0);
    }

    _filterUser(value: string) {
        const filterValue = value.toLowerCase();
        return this.userDropdown.filter(user => user.email.toLowerCase().indexOf(filterValue) >= 0);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            let filteredList = this.rolesDropdown.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
            let filteredSelectedRoles = this.selectedRoles.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
            if (filteredSelectedRoles.length == 0) {
                this.selectedRoles.push(filteredList[0]);
            }
            requestAnimationFrame(() => {
                this.openAuto(this.matACTrigger);
            })
            let roleIds = this.selectedRoles.map(x => x.roleId);
            this.selectedRoleIds = roleIds;
            this.notificationForm.get('roleIds').setValue(roleIds);
            this.notificationForm.get('rolesInput').setValue('');
            let usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedRoleIds);
            if (usersList.length > 0) {
                let userNames = usersList.map(x => x.email);
                let userNamesArray = userNames.join(",");
                this.bindToUserNames(userNamesArray);
            }
        }
        if (input) {
            input.value = '';
        }
    }

    selected(options) {
        let usersList = [];
        let rolesDropdown = this.rolesDropdown;
        let filteredList = _.filter(rolesDropdown, function (role) {
            return role.roleId == options
        })
        if (filteredList.length > 0) {
            let selectedRoles = this.selectedRoles;
            let filteredRole = _.filter(selectedRoles, function (filter) {
                return filter.roleId == options;
            })
            if (filteredRole.length > 0) {
                let index = this.selectedRoles.indexOf(filteredRole[0]);
                if (index > -1) {
                    this.selectedRoles.splice(index, 1);
                }
            } else {
                this.selectedRoles.push(filteredList[0])
            }
            this.rolesInput.nativeElement.value = '';
            requestAnimationFrame(() => {
                this.openAuto(this.matACTrigger);
            })
            let roleIds = this.selectedRoles.map(x => x.roleId);
            this.selectedRoleIds = roleIds;
            this.notificationForm.get('roleIds').setValue(roleIds);
            this.notificationForm.get('rolesInput').setValue('');
            usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedRoleIds);
        }
        if (usersList.length > 0) {
            let userNames = usersList.map(x => x.email);
            let userNamesArray = userNames.join(",");
            this.bindToUserNames(userNamesArray);
        }

    }

    addToUser(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            let filteredList = this.userDropdown.filter(user => user.email.toLowerCase().indexOf(value) >= 0);
            if (filteredList.length > 0) {
                let filteredSelectedUsers = this.selectedToUsers.filter(user => user.email.toLowerCase().indexOf(value) >= 0);
                if (filteredSelectedUsers.length == 0) {
                    var userModel: any = {};
                    userModel.fullName = filteredList[0].fullName;
                    userModel.userId = filteredList[0].userId;
                    userModel.email = filteredList[0].email;
                    this.selectedToUsers.push(userModel);
                }
                if (input) {
                    input.value = '';
                }
            }
            let userIds = this.selectedToUsers.map(x => x.email);
            this.notificationForm.get('toUsers').setValue(userIds);
            this.notificationForm.get('toInput').setValue('');
            requestAnimationFrame(() => {
                this.openUserAuto(this.matUserACTrigger);
            })

        }
    }

    selectedTo(options) {
        let userDropdown = this.userDropdown;
        let filteredList = _.filter(userDropdown, function (user) {
            return user.userId == options
        })
        if (filteredList.length > 0) {
            let selectedUsers = this.selectedToUsers;
            let filteredSelectedUsers = _.filter(selectedUsers, function (user) {
                return user.userId == options;
            })
            if (filteredSelectedUsers.length > 0) {
                let index = this.selectedToUsers.indexOf(filteredSelectedUsers[0]);
                if (index > -1) {
                    this.selectedToUsers.splice(index, 1);
                }
            } else {
                var userModel: any = {};
                userModel.fullName = filteredList[0].fullName;
                userModel.userId = filteredList[0].userId;
                userModel.email = filteredList[0].email;
                this.selectedToUsers.push(userModel);
            }
            this.toUserInput.nativeElement.value = '';
            let userIds = this.selectedToUsers.map(x => x.email);
            this.notificationForm.get('toUsers').setValue(userIds);
            this.notificationForm.get('toInput').setValue('');
        }

        requestAnimationFrame(() => {
            this.openUserAuto(this.matUserACTrigger);
        })

    }

    openAuto(trigger: MatAutocompleteTrigger) {
        trigger.openPanel();
        this.rolesInput.nativeElement.focus();
    }
    openUserAuto(trigger: MatAutocompleteTrigger) {
        trigger.openPanel();
        this.toUserInput.nativeElement.focus();
    }

    removeSelectedRole(role, type) {
        let index = this.selectedRoles.indexOf(role);
        this.selectedRoles.splice(index, 1);
        let roleIds = this.selectedRoles.map(x => x.roleId);
        this.selectedRoleIds = roleIds;
        this.notificationForm.get('roleIds').setValue(roleIds);
        this.notificationForm.get('rolesInput').setValue('');
    }

    removeSelectedUser(user) {
        let index = this.selectedToUsers.indexOf(user);
        this.selectedToUsers.splice(index, 1);
        let userIds = this.selectedToUsers.map(x => x.email);
        this.notificationForm.get('toUsers').setValue(userIds);
        this.notificationForm.get('toInput').setValue('');
    }
}