import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { GenericFormService } from "../genericForm/services/generic-form.service";
import { SearchFilterPipe } from "../../pipes/search-filter.pipe";
import * as _ from "underscore";
import { Guid } from "guid-typescript";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-share-custom-application",
    templateUrl: "share-custom-app.component.html"
})

export class ShareCustomAppComponent implements OnInit {
    @Input("dataSourceId")
    set _dataSourceId(data: string) {
        this.dataSourceId = data;
    }
    @Input("applicationId")
    set _applicationId(data: string) {
        this.applicationId = data;
    }
    @Input("workflowIds")
    set _workflowIds(data: string) {
        this.workflowIds = data;
    }
    @ViewChild('rolesInput') rolesInput: ElementRef<HTMLInputElement>;
    @ViewChild('userToInput') toUserInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('toAuto') toMatAutocomplete: MatAutocomplete;
    @ViewChild('autocompleteTrigger') matACTrigger: MatAutocompleteTrigger;
    @ViewChild('userAutocompleteTrigger') matUserACTrigger: MatAutocompleteTrigger;
    @ViewChild('chipList') rolesList: MatChipList;
    @ViewChild('userChipList') toList: MatChipList;
    @Output() sharePopUps = new EventEmitter<any>();
    mailAlertForm: FormGroup;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    rolesDropdown: any[] = [];
    userDropdown: any[] = [];
    selectedRoleIds: any[] = [];
    selectedRoles: any[] = [];
    selectedToUsers: any[] = [];
    filteredRoles$: Observable<any[]>;
    filteredToUsers$: Observable<any[]>;
    applicationId: string;
    dataSourceId: string;
    workflowIds: string;
    isValidate: boolean;
    isMailLoading: boolean;
    removable: boolean;
    selectable: boolean;

    constructor(private genericFormService: GenericFormService, private cdRef: ChangeDetectorRef,
        private searchFilterPipe: SearchFilterPipe, private toastr: ToastrService) {
        this.selectable = true;
        this.removable = true;
        this.clearMailForm();
        this.getAllRoles();
        this.getAllUsers();
        this.filteredRoles$ = this.mailAlertForm.get('rolesInput').valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));

        this.filteredToUsers$ = this.mailAlertForm.get('toInput').valueChanges.pipe(
            startWith(null),
            map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

        this.mailAlertForm.get('roleIds').statusChanges.subscribe(
            status => this.rolesList.errorState = status === 'INVALID'
        );
        this.mailAlertForm.get('toUsers').statusChanges.subscribe(
            status => this.toList.errorState = status === 'INVALID'
        );
    }

    ngOnInit() {

    }

    getAllRoles() {
        this.genericFormService.getAllRoles().subscribe((response: any) => {
            this.rolesDropdown = response.data;
            this.filteredRoles$ = this.mailAlertForm.get('rolesInput').valueChanges.pipe(
                startWith(null),
                map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));
        })
    }

    getAllUsers() {
        var searchModel: any = {};
        searchModel.isArchived = false;
        this.genericFormService.GetAllUsers(searchModel).subscribe((response: any) => {
            let usersDropdown = response.data;
            usersDropdown.forEach((user) => {
                if (user.roleIds) {
                    user.roleIdsArray = user.roleIds.split(",");
                }
            })
            this.userDropdown = usersDropdown;
            this.filteredToUsers$ = this.mailAlertForm.get('toInput').valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));
        })
    }

    clearMailForm() {
        this.mailAlertForm = new FormGroup({
            roleIds: new FormControl('', Validators.compose([Validators.required
            ])),
            rolesInput: new FormControl('', this.validateRoles),
            toUsers: new FormControl('', Validators.compose([Validators.required])),
            toInput: new FormControl('', this.validateToUsers),
        })
        this.selectedRoleIds = [];
        this.selectedRoles = [];
        this.selectedToUsers = [];
        this.filteredRoles$ = this.mailAlertForm.get('rolesInput').valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));

        this.filteredToUsers$ = this.mailAlertForm.get('toInput').valueChanges.pipe(
            startWith(null),
            map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

        this.mailAlertForm.get('roleIds').statusChanges.subscribe(
            status => this.rolesList.errorState = status === 'INVALID'
        );
        this.mailAlertForm.get('toUsers').statusChanges.subscribe(
            status => this.toList.errorState = status === 'INVALID'
        );

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

    _filter(value: string): any[] {
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
            this.mailAlertForm.get('roleIds').setValue(roleIds);
            this.mailAlertForm.get('rolesInput').setValue('');
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

    selectedRole(options) {
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
            this.mailAlertForm.get('roleIds').setValue(roleIds);
            this.mailAlertForm.get('rolesInput').setValue('');
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
                    this.selectedToUsers.push(filteredList[0]);
                }
                if (input) {
                    input.value = '';
                }
            } else {
                let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                var validate = regex.test(value);
                if (validate) {
                    var emailModel: any = {};
                    emailModel.email = value;
                    this.selectedToUsers.push(emailModel);
                    this.isValidate = false;
                    // Reset the input value
                    if (input) {
                        input.value = '';
                    }
                } else {
                    this.isValidate = true;
                }
            }
            let userIds = this.selectedToUsers.map(x => x.email);
            this.mailAlertForm.get('toUsers').setValue(userIds);
            this.mailAlertForm.get('toInput').setValue('');
            requestAnimationFrame(() => {
                this.openUserAuto(this.matUserACTrigger);
            })
        } else {
            this.isValidate = false;
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
                this.selectedToUsers.push(filteredList[0]);
            }
            this.toUserInput.nativeElement.value = '';
            let userIds = this.selectedToUsers.map(x => x.email);
            this.mailAlertForm.get('toUsers').setValue(userIds);
            this.mailAlertForm.get('toInput').setValue('');

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

    bindToUserNames(users) {
        let userDropdown = this.userDropdown;
        let userArray = users.split(",");
        let filteredList = [];
        userArray.forEach((user) => {
            let filteredList = _.filter(userDropdown, function (user1) {
                return user == user1.email
            })
            if (filteredList.length > 0) {
                let index = this.selectedToUsers.indexOf(filteredList[0]);
                if (index == -1) {
                    this.selectedToUsers.push(filteredList[0]);
                }
            } else {
                var userModel: any = {};
                userModel.email = user;
                this.selectedToUsers.push(userModel);
            }
        })
        let userIds = this.selectedToUsers.map(x => x.email);
        this.mailAlertForm.get('toUsers').setValue(userIds);
        this.mailAlertForm.get('toInput').setValue('');

        this.cdRef.detectChanges();
    }

    removeSelectedRole(role) {
        let index = this.selectedRoles.indexOf(role);
        this.selectedRoles.splice(index, 1);
        let roleIds = this.selectedRoles.map(x => x.roleId);
        this.selectedRoleIds = roleIds;
        this.mailAlertForm.get('roleIds').setValue(roleIds);
        this.mailAlertForm.get('rolesInput').setValue('');
    }

    removeSelectedUser(user) {
        let index = this.selectedToUsers.indexOf(user);
        this.selectedToUsers.splice(index, 1);
        let userIds = this.selectedToUsers.map(x => x.email);
        this.mailAlertForm.get('toUsers').setValue(userIds);
        this.mailAlertForm.get('toInput').setValue('');
    }

    shareMail() {
        let submittedId = Guid.create();
        var emailForm: any = {};
        if (this.mailAlertForm.value.roleIds != null && this.mailAlertForm.value.roleIds.length > 0) {
            emailForm.roleIds = this.mailAlertForm.value.roleIds.join(",");
        }
        if (this.mailAlertForm.value.toUsers != null && this.mailAlertForm.value.toUsers.length > 0) {
            emailForm.Tomails = this.mailAlertForm.value.toUsers.join(",");
        }
        emailForm.customApplicationId = this.applicationId;
        emailForm.formId = this.dataSourceId;
        emailForm.submittedId = submittedId["value"];
        emailForm.workflowIds = this.workflowIds;
        this.isMailLoading = true;
        console.log(emailForm);
        this.genericFormService.shareNewGenericForm(emailForm).subscribe((response: any) => {
            this.isMailLoading = false;
            if (response.success) {
                this.clearMailForm();
                this.closePopUp();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    closePopUp() {
        this.sharePopUps.emit('');
    }
}