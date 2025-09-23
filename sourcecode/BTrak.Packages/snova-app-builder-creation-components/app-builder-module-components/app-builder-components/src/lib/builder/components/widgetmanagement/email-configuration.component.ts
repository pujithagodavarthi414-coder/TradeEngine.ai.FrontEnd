import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { Observable } from "rxjs";
import { RoleManagementService } from "../../services/role-management.service";
import { map, startWith } from "rxjs/operators";
import { GenericFormService } from "../genericForm/services/generic-form.service";
import { SearchFilterPipe } from "../../pipes/search-filter.pipe";
import * as _ from 'underscore';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'email-configuration',
    templateUrl: './email-configuration.component.html'
})

export class EmailConfigurationComponent implements OnInit {
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.isPdf = this.matData?.isPdf;
            if (this.isPdf) {
                this.configureDetails = this.matData?.emailDetails;
                this.message = this.configureDetails?.message;
                this.subject = this.configureDetails?.subject;
            }
            else {
                this.pdfDetails = this.matData?.pdfDetails;
                this.message = this.pdfDetails?.message;
                this.subject = this.pdfDetails?.subject;
            }
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.clearDocForm();
            this.getAllUsers();
            this.getRoles();
            if (this.configureDetails || this.pdfDetails) {
                this.patchDocForm();
            }
        }
    }
    @ViewChild('chipList') rolesChipList: MatChipList;
    @ViewChild('userChipList') toChipList: MatChipList;
    @ViewChild('rolesInput') rolesInput: ElementRef<HTMLInputElement>;
    @ViewChild('userToInput') toUserInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('toAuto') toMatAutocomplete: MatAutocomplete;
    @ViewChild('autocompleteTrigger') matACTrigger: MatAutocompleteTrigger;
    @ViewChild('userAutocompleteTrigger') matUserACTrigger: MatAutocompleteTrigger;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    matData: any;
    docForm: FormGroup;
    rolesList: any[] = [];
    userDropdown: any[] = [];
    selectedRoleIds: any[] = [];
    selectedRoles: any[] = [];
    selectedToUsers: any[] = [];
    selectedUserIds: any[] = [];
    filteredRoles$: Observable<any[]>;
    filteredToUsers$: Observable<any[]>;
    removable: boolean = true;
    configureDetails: any;
    isPdf: boolean;
    subject: string;
    pdfDetails: any;
    selectable: boolean;
    isValidate: boolean;
    currentDialog: any;
    currentDialogId: string;
    message: string;
    config = {
        plugins: 'link, table, preview, advlist, image, searchreplace, code, autolink, lists, autoresize, media',
        default_link_target: '_blank',
        toolbar: 'formatselect | bold italic strikethrough | link image table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
        height: 450,
        branding: false,
        table_responsive_width: true,
        image_advtab: true,
        autoresize_bottom_margin: 20,
        relative_urls: 0,
        remove_script_host: 0
    }
    constructor(private roleService: RoleManagementService, private genericFormService: GenericFormService,
        private searchFilterPipe: SearchFilterPipe,
        private dialog: MatDialog, private cdRef: ChangeDetectorRef) {

    }
    ngOnInit() {

    }

    clearDocForm() {
        this.docForm = new FormGroup({
            roleIds: new FormControl('', Validators.compose([Validators.required
            ])),
            rolesInput: new FormControl('', this.validateRoles),
            toUsers: new FormControl('', Validators.compose([Validators.required])),
            toInput: new FormControl('', this.validateToUsers),
            subject: new FormControl('', Validators.compose([Validators.required])),
            message: new FormControl('', Validators.compose([Validators.required]))
        })
        this.selectedRoleIds = [];
        this.selectedRoles = [];
        this.selectedToUsers = [];
        this.filteredRoles$ = this.docForm.get('rolesInput').valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.rolesList.slice()));

        this.filteredToUsers$ = this.docForm.get('toInput').valueChanges.pipe(
            startWith(null),
            map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

        this.docForm.get('roleIds').statusChanges.subscribe(
            status => this.rolesChipList.errorState = status === 'INVALID'
        );
        this.docForm.get('toUsers').statusChanges.subscribe(
            status => this.toChipList.errorState = status === 'INVALID'
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
        return this.rolesList.filter(role => role.roleName.toLowerCase().indexOf(filterValue) >= 0);
    }

    _filterUser(value: string) {
        const filterValue = value.toLowerCase();
        return this.userDropdown.filter(user => user.email.toLowerCase().indexOf(filterValue) >= 0);
    }

    getRoles() {
        this.roleService.getAllRoles().subscribe((result: any) => {
            if (result.success) {
                this.rolesList = result.data;
                this.filteredRoles$ = this.docForm.get('rolesInput').valueChanges.pipe(
                    startWith(null),
                    map((role: string | null) => role ? this._filter(role) : this.rolesList.slice()));

                if (this.configureDetails?.toRoleIds) {
                    this.bindRoleNames(this.configureDetails.toRoleIds);
                }
            }
        });
    }

    patchDocForm() {

        if (this.configureDetails?.toUsers) {
            this.selectedToUsers = this.configureDetails.toUsers.split(",");
        }
        if (this.configureDetails?.toRoleIds) {
            this.selectedRoleIds = this.configureDetails.toRoleIds.split(",");
        }
        this.docForm = new FormGroup({
            roleIds: new FormControl(this.selectedRoleIds, Validators.compose([Validators.required
            ])),
            rolesInput: new FormControl('', this.validateRoles),
            toUsers: new FormControl(this.selectedUserIds, Validators.compose([Validators.required])),
            toInput: new FormControl('', this.validateToUsers),
            subject: new FormControl(this.subject, Validators.compose([Validators.required])),
            message: new FormControl(this.message, Validators.compose([]))
        })
        this.filteredRoles$ = this.docForm.get('rolesInput').valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.rolesList.slice()));

        this.filteredToUsers$ = this.docForm.get('toInput').valueChanges.pipe(
            startWith(null),
            map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

        this.docForm.get('roleIds').statusChanges.subscribe(
            status => this.rolesChipList.errorState = status === 'INVALID'
        );
        this.docForm.get('toUsers').statusChanges.subscribe(
            status => this.toChipList.errorState = status === 'INVALID'
        );
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
            this.filteredToUsers$ = this.docForm.get('toInput').valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));
            if (this.configureDetails?.toEmails) {
                this.bindToUserNames(this.configureDetails.toEmails);
            }
        })
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            let filteredList = this.rolesList.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
            let filteredSelectedRoles = this.selectedRoles.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
            if (filteredSelectedRoles.length == 0) {
                this.selectedRoles.push(filteredList[0]);
            }
            requestAnimationFrame(() => {
                this.openAuto(this.matACTrigger);
            })
            let roleIds = this.selectedRoles.map(x => x.roleId);
            this.selectedRoleIds = roleIds;
            this.docForm.get('roleIds').setValue(roleIds);
            this.docForm.get('rolesInput').setValue('');
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
        let rolesDropdown = this.rolesList;
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
            this.docForm.get('roleIds').setValue(roleIds);
            this.docForm.get('rolesInput').setValue('');
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
            this.docForm.get('toUsers').setValue(userIds);
            this.docForm.get('toInput').setValue('');
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
            this.docForm.get('toUsers').setValue(userIds);
            this.docForm.get('toInput').setValue('');

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
        this.selectedUserIds = this.selectedToUsers.map(x => x.userId);
        this.docForm.get('toUsers').setValue(userIds);
        this.docForm.get('toInput').setValue('');

        this.cdRef.detectChanges();
    }

    bindRoleNames(roles) {
        let rolesDropdown = this.rolesList;
        let rolesArray = roles.split(",");
        let filteredList = [];
        rolesArray.forEach((role) => {
            let filteredList = _.filter(rolesDropdown, function (role1) {
                return role == role1.roleId
            })
            if (filteredList.length > 0) {
                let index = this.selectedRoles.indexOf(filteredList[0]);
                if (index == -1) {
                    this.selectedRoles.push(filteredList[0]);
                }
            }
        })
    }

    removeSelectedRole(role) {
        let index = this.selectedRoles.indexOf(role);
        this.selectedRoles.splice(index, 1);
        let roleIds = this.selectedRoles.map(x => x.roleId);
        this.selectedRoleIds = roleIds;
        this.docForm.get('roleIds').setValue(roleIds);
        this.docForm.get('rolesInput').setValue('');
    }

    removeSelectedUser(user) {
        let index = this.selectedToUsers.indexOf(user);
        this.selectedToUsers.splice(index, 1);
        let userIds = this.selectedToUsers.map(x => x.email);
        this.docForm.get('toUsers').setValue(userIds);
        this.docForm.get('toInput').setValue('');
    }

    onNoClickShareEmail() {
        this.currentDialog.close();
        // this.configureEmailPopUps.forEach((p) => p.closePopover());
    }

    configureEmail() {
        let mailConfigureDetails = this.docForm.value;
        let configureDetails: any = {};
        configureDetails.subject = mailConfigureDetails.subject;
        configureDetails.message = mailConfigureDetails.message;
        if (this.selectedRoleIds) {
            configureDetails.toRoleIds = this.selectedRoleIds.toString();
        }
        if (this.selectedToUsers) {
            configureDetails.toEmails = mailConfigureDetails.toUsers.toString();
        }
        if (this.isPdf) {
            this.pdfDetails = configureDetails;
            this.currentDialog.close({ data: this.pdfDetails });
        } else {
            this.configureDetails = configureDetails;
            this.currentDialog.close({ data: this.configureDetails });
        }
    }
}