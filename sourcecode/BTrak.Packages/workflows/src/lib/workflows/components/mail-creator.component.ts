import { Component, Inject, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { Guid } from "guid-typescript";
import { WorkflowService } from "../services/workflow.service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import * as _ from "underscore";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SearchFilterPipe } from "../pipes/search-filter.pipe";

@Component({
    selector: "app-mail-creator",
    templateUrl: "./mail-creator.component.html"
})
export class mailCreatorComponent extends CustomAppBaseComponent {
    @ViewChild('rolesInput') rolesInput: ElementRef<HTMLInputElement>;
    @ViewChild('ccRolesInput') ccRolesInput: ElementRef<HTMLInputElement>;
    @ViewChild('bccRolesInput') bccRolesInput: ElementRef<HTMLInputElement>;
    @ViewChild('userToInput') toUserInput: ElementRef<HTMLInputElement>;
    @ViewChild('userCcInput') ccUserInput: ElementRef<HTMLInputElement>;
    @ViewChild('userbccInput') bccUserInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('ccAuto') ccRolesMatAutocomplete: MatAutocomplete;
    @ViewChild('bccAuto') bccRolesMatAutocomplete: MatAutocomplete;
    @ViewChild('toAuto') toMatAutocomplete: MatAutocomplete;
    @ViewChild('ccUserAuto') ccUsersMatAutocomplete: MatAutocomplete;
    @ViewChild('bccUserAuto') bccUsersMatAutocomplete: MatAutocomplete;
    @ViewChild('autocompleteTrigger') matACTrigger: MatAutocompleteTrigger;
    @ViewChild('ccAutocompleteTrigger') matCCACTrigger: MatAutocompleteTrigger;
    @ViewChild('bccAutocompleteTrigger') matbCCACTrigger: MatAutocompleteTrigger;
    @ViewChild('userAutocompleteTrigger') matUserACTrigger: MatAutocompleteTrigger;
    @ViewChild('ccUserAutocompleteTrigger') matUserCCACTrigger: MatAutocompleteTrigger;
    @ViewChild('bccUserAutocompleteTrigger') matUserbCCACTrigger: MatAutocompleteTrigger;
    @ViewChild('chipList') rolesList: MatChipList;
    @ViewChild('ccChipList') ccRolesList: MatChipList;
    @ViewChild('bccChipList') bccRolesList: MatChipList;
    @ViewChild('userChipList') toList: MatChipList;
    @ViewChild('ccUserChipList') ccUserList: MatChipList;
    @ViewChild('bccUserChipList') bccUserList: MatChipList;
    rolesDropdown: any[] = [];
    userDropdown: any[] = [];
    selectedRoleIds: any[] = [];
    selectedCcRoleids: any[] = [];
    selectedRoles: any[] = [];
    selectedCcRoles: any[] = [];
    selectedBccRoles: any[] = [];
    selectedBccRoleIds: any[] = [];
    selectedToUsers: any[] = [];
    selectedToUserIds: any[] = [];
    selectedCcUsers: any[] = [];
    selectedCcUserIds: any[] = [];
    selectedBccUsers: any[] = [];
    filteredRoles$: Observable<any[]>;
    filteredCcRoles$: Observable<any[]>;
    filteredBccRoles$: Observable<any[]>;
    filteredToUsers$: Observable<any[]>;
    filteredCcUsers$: Observable<any[]>;
    filteredBccUsers$: Observable<any[]>;
    mailForm: FormGroup;
    formname: string;
    form: any;
    isEdit: any;
    mailId: string;
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
    isValidate: boolean;
    isCcValidate: boolean;
    isBccValidate: boolean;
    selectable: boolean;
    removable: boolean;
    searchText: string;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    isDirect: boolean;

    constructor(private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: any, public AppDialog: MatDialogRef<mailCreatorComponent>,
        private workflowService: WorkflowService, private toastr: ToastrService,
        private searchFilterPipe: SearchFilterPipe) {
        super();
        this.getRolesDropdown();
        this.getAllUsers();
        this.form = data;
        this.selectable = true;
        this.removable = true;
        this.formname = data.name;
        this.isEdit = data.isEdit;
        if (this.isEdit == true) {
            this.mailId = this.form.formValue.id;
        } else {
            this.mailId = Guid.create().toString();
        }
        this.clearForm();

        this.filteredRoles$ = this.mailForm.get('rolesInput').valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));

        this.filteredCcRoles$ = this.mailForm.get('ccRolesInput').valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));

        this.filteredBccRoles$ = this.mailForm.get('bccRolesInput').valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));

        this.filteredToUsers$ = this.mailForm.get('toInput').valueChanges.pipe(
            startWith(null),
            map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

        this.filteredCcUsers$ = this.mailForm.get('ccInput').valueChanges.pipe(
            startWith(null),
            map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

        this.filteredBccUsers$ = this.mailForm.get('bccInput').valueChanges.pipe(
            startWith(null),
            map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

        this.mailForm.get('roleIds').statusChanges.subscribe(
            status => this.rolesList.errorState = status === 'INVALID'
        );

        this.mailForm.get('ccRoleIds').statusChanges.subscribe(
            status => this.ccRolesList.errorState = status === 'INVALID'
        );

        this.mailForm.get('bccRoleIds').statusChanges.subscribe(
            status => this.bccRolesList.errorState = status === 'INVALID'
        );

        this.mailForm.get('toUsers').statusChanges.subscribe(
            status => this.toList.errorState = status === 'INVALID'
        );

        this.mailForm.get('ccUsers').statusChanges.subscribe(
            status => this.ccUserList.errorState = status === 'INVALID'
        );

        this.mailForm.get('bccUsers').statusChanges.subscribe(
            status => this.bccUserList.errorState = status === 'INVALID'
        );

        if (this.isEdit) {
            this.mailForm.patchValue(this.form.formValue);
            this.isDirect = this.form.formValue.isRedirectToEmails;
        }

    }
    ngOnInit() {

    }


    clearForm() {
        this.mailForm = new FormGroup({
            formtypeName: new FormControl(null),
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            subject: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            message: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            id: new FormControl(this.mailId, []
            ),
            roleIds: new FormControl('', Validators.compose([Validators.required
            ])),
            rolesInput: new FormControl('', this.validateRoles),
            ccRoleIds: new FormControl('', Validators.compose([
            ])),
            ccRolesInput: new FormControl('', Validators.compose([
            ])),
            bccRoleIds: new FormControl('', Validators.compose([
            ])),
            bccRolesInput: new FormControl('', Validators.compose([
            ])),
            toUsers: new FormControl('', Validators.compose([Validators.required])),
            toInput: new FormControl('', this.validateToUsers),
            ccUsers: new FormControl('', Validators.compose([])),
            ccInput: new FormControl('', Validators.compose([])),
            bccUsers: new FormControl('', Validators.compose([])),
            bccInput: new FormControl('', Validators.compose([])),
            isDirectFromEmail: new FormControl('', [])
        })
        this.selectedRoleIds = [];
        this.selectedRoles = [];
        this.selectedToUsers = [];
        this.selectedCcRoleids = [];
        this.selectedCcRoles = [];
        this.selectedCcUsers = [];
        this.selectedBccRoleIds = [];
        this.selectedBccRoles = [];
        this.selectedBccUsers = [];
    }

    private validateRoles(roles: FormControl) {
        if ((roles.value && roles.value.length === 0)) {
            return {
                validateRolesArray: { valid: false }
            };
        }
        return null;
    }

    private validateCcRoles(roles: FormControl) {
        if ((roles.value && roles.value.length === 0)) {
            return {
                validateRolesArray: { valid: false }
            };
        }
        return null;
    }

    private validatebCcRoles(roles: FormControl) {
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

    private validateToCcUsers(users: FormControl) {
        if ((users.value && users.value.length === 0)) {
            return {
                validatUsersArray: { valid: false }
            };
        }

        return null;
    }

    private validateTobCcUsers(users: FormControl) {
        if ((users.value && users.value.length === 0)) {
            return {
                validatUsersArray: { valid: false }
            };
        }

        return null;
    }

    getRolesDropdown() {
        this.workflowService.getAllRoles().subscribe((response: any) => {
            if (response.success) {
                this.rolesDropdown = response.data;
                this.filteredRoles$ = this.mailForm.get('rolesInput').valueChanges.pipe(
                    startWith(null),
                    map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));
                this.filteredCcRoles$ = this.mailForm.get('ccRolesInput').valueChanges.pipe(
                    startWith(null),
                    map((role: string | null) => role ? this._filter(role) : this.rolesDropdown.slice()));
                this.filteredBccRoles$ = this.mailForm.get('bccRolesInput').valueChanges.pipe(
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
            this.filteredToUsers$ = this.mailForm.get('toInput').valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));
            this.filteredCcUsers$ = this.mailForm.get('ccInput').valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));
            this.filteredBccUsers$ = this.mailForm.get('bccInput').valueChanges.pipe(
                startWith(null),
                map((user: string | null) => user ? this._filterUser(user) : this.userDropdown.slice()));

            if (this.isEdit) {
                this.bindToUserNames(this.form.formValue.toUsersString, 'To');
                this.bindToUserNames(this.form.formValue.ccUsersString, 'Cc');
                this.bindToUserNames(this.form.formValue.bccUsersString, 'Bcc');
            }
        })

    }

    add(event: MatChipInputEvent, type): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            if (type == 'To') {
                let filteredList = this.rolesDropdown.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
                let filteredSelectedRoles = this.selectedRoles.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
                if (filteredSelectedRoles.length == 0) {
                    this.selectedRoles.push(filteredList[0]);
                }
                requestAnimationFrame(() => {
                    this.openAuto(this.matACTrigger, type);
                })
                let roleIds = this.selectedRoles.map(x => x.roleId);
                this.selectedRoleIds = roleIds;
                this.mailForm.get('roleIds').setValue(roleIds);
                this.mailForm.get('rolesInput').setValue('');
                let usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedRoleIds);
                if (usersList.length > 0) {
                    let userNames = usersList.map(x => x.email);
                    let userNamesArray = userNames.join(",");
                    this.bindToUserNames(userNamesArray, type);
                }
            } else if (type == 'Cc') {
                let filteredList = this.rolesDropdown.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
                let filteredSelectedRoles = this.selectedCcRoles.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
                if (filteredSelectedRoles.length == 0) {
                    this.selectedCcRoles.push(filteredList[0]);
                }
                requestAnimationFrame(() => {
                    this.openAuto(this.matCCACTrigger, type);
                })
                let roleIds = this.selectedCcRoles.map(x => x.roleId);
                this.selectedCcRoleids = roleIds;
                this.mailForm.get('ccRoleIds').setValue(roleIds);
                this.mailForm.get('ccRolesInput').setValue('');
                let usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedCcRoleids);
                if (usersList.length > 0) {
                    let userNames = usersList.map(x => x.email);
                    let userNamesArray = userNames.join(",");
                    this.bindToUserNames(userNamesArray, type);
                }
            }
            else if (type == 'Bcc') {
                let filteredList = this.rolesDropdown.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
                let filteredSelectedRoles = this.selectedBccRoles.filter(role => role.roleName.toLowerCase().indexOf(value) >= 0);
                if (filteredSelectedRoles.length == 0) {
                    this.selectedBccRoles.push(filteredList[0]);
                }
                requestAnimationFrame(() => {
                    this.openAuto(this.matbCCACTrigger, type);
                })
                let roleIds = this.selectedBccRoles.map(x => x.roleId);
                this.selectedBccRoleIds = roleIds;
                this.mailForm.get('bccRoleIds').setValue(roleIds);
                this.mailForm.get('bccRolesInput').setValue('');
                let usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedBccRoleIds);
                if (usersList.length > 0) {
                    let userNames = usersList.map(x => x.email);
                    let userNamesArray = userNames.join(",");
                    this.bindToUserNames(userNamesArray, type);
                }
            }
        }
        if (input) {
            input.value = '';
        }
    }

    selected(options, type) {
        let usersList = [];
        let rolesDropdown = this.rolesDropdown;
        let filteredList = _.filter(rolesDropdown, function (role) {
            return role.roleId == options
        })
        if (filteredList.length > 0) {
            if (type == 'To') {
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
                    this.openAuto(this.matACTrigger, type);
                })
                let roleIds = this.selectedRoles.map(x => x.roleId);
                this.selectedRoleIds = roleIds;
                this.mailForm.get('roleIds').setValue(roleIds);
                this.mailForm.get('rolesInput').setValue('');
                usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedRoleIds);
            } else if (type == 'Cc') {
                let selectedRoles = this.selectedCcRoles;
                let filteredRole = _.filter(selectedRoles, function (filter) {
                    return filter.roleId == options;
                })
                if (filteredRole.length > 0) {
                    let index = this.selectedCcRoles.indexOf(filteredRole[0]);
                    if (index > -1) {
                        this.selectedCcRoles.splice(index, 1);
                    }
                } else {
                    this.selectedCcRoles.push(filteredList[0])
                }
                this.ccRolesInput.nativeElement.value = '';
                requestAnimationFrame(() => {
                    this.openAuto(this.matCCACTrigger, type);
                })
                let roleIds = this.selectedCcRoles.map(x => x.roleId);
                this.selectedCcRoleids = roleIds;
                this.mailForm.get('ccRoleIds').setValue(roleIds);
                this.mailForm.get('ccRolesInput').setValue('');
                usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedCcRoleids);
            } else if (type == 'Bcc') {
                let selectedRoles = this.selectedBccRoles;
                let filteredRole = _.filter(selectedRoles, function (filter) {
                    return filter.roleId == options;
                })
                if (filteredRole.length > 0) {
                    let index = this.selectedBccRoles.indexOf(filteredRole[0]);
                    if (index > -1) {
                        this.selectedBccRoles.splice(index, 1);
                    }
                } else {
                    this.selectedBccRoles.push(filteredList[0])
                }
                this.bccRolesInput.nativeElement.value = '';
                requestAnimationFrame(() => {
                    this.openAuto(this.matbCCACTrigger, type);
                })
                let roleIds = this.selectedBccRoles.map(x => x.roleId);
                this.selectedBccRoleIds = roleIds;
                this.mailForm.get('bccRoleIds').setValue(roleIds);
                this.mailForm.get('bccRolesInput').setValue('');
                usersList = this.searchFilterPipe.transform(this.userDropdown, this.selectedBccRoleIds);
            }
        }
        if (usersList.length > 0) {
            let userNames = usersList.map(x => x.email);
            let userNamesArray = userNames.join(",");
            this.bindToUserNames(userNamesArray, type);
        }

    }

    addToUser(event: MatChipInputEvent, type): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            let filteredList = this.userDropdown.filter(user => user.email.toLowerCase().indexOf(value) >= 0);
            if (type == 'To') {
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
                this.mailForm.get('toUsers').setValue(userIds);
                this.mailForm.get('toInput').setValue('');
                requestAnimationFrame(() => {
                    this.openUserAuto(this.matUserACTrigger, type);
                })
            } else if (type == 'Cc') {
                if (filteredList.length > 0) {
                    let filteredSelectedUsers = this.selectedCcUsers.filter(user => user.email.toLowerCase().indexOf(value) >= 0);
                    if (filteredSelectedUsers.length == 0) {
                        this.selectedCcUsers.push(filteredList[0]);
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
                        this.selectedCcUsers.push(emailModel);
                        this.isCcValidate = false;
                        // Reset the input value
                        if (input) {
                            input.value = '';
                        }
                    } else {
                        this.isCcValidate = true;
                    }
                }
                let userIds = this.selectedCcUsers.map(x => x.email);
                this.mailForm.get('ccUsers').setValue(userIds);
                this.mailForm.get('ccInput').setValue('');
                requestAnimationFrame(() => {
                    this.openUserAuto(this.matUserCCACTrigger, type);
                })
            } else if (type == 'Bcc') {
                if (filteredList.length > 0) {
                    let filteredSelectedUsers = this.selectedBccUsers.filter(user => user.email.toLowerCase().indexOf(value) >= 0);
                    if (filteredSelectedUsers.length == 0) {
                        this.selectedBccUsers.push(filteredList[0]);
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
                        this.selectedBccUsers.push(emailModel);
                        this.isBccValidate = false;
                        // Reset the input value
                        if (input) {
                            input.value = '';
                        }
                    } else {
                        this.isBccValidate = true;
                    }
                }
                let userIds = this.selectedBccUsers.map(x => x.email);
                this.mailForm.get('bccUsers').setValue(userIds);
                this.mailForm.get('bccInput').setValue('');
                requestAnimationFrame(() => {
                    this.openUserAuto(this.matUserbCCACTrigger, type);
                })
            }
        } else {
            this.isValidate = false;
        }
    }

    selectedTo(options, type) {
        let userDropdown = this.userDropdown;
        let filteredList = _.filter(userDropdown, function (user) {
            return user.userId == options
        })
        if (filteredList.length > 0) {
            if (type == 'To') {
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
                this.mailForm.get('toUsers').setValue(userIds);
                this.mailForm.get('toInput').setValue('');
            } else if (type == 'Cc') {
                let selectedUsers = this.selectedCcUsers;
                let filteredSelectedUsers = _.filter(selectedUsers, function (user) {
                    return user.userId == options;
                })
                if (filteredSelectedUsers.length > 0) {
                    let index = this.selectedCcUsers.indexOf(filteredSelectedUsers[0]);
                    if (index > -1) {
                        this.selectedCcUsers.splice(index, 1);
                    }
                } else {
                    this.selectedCcUsers.push(filteredList[0]);
                }
                this.ccUserInput.nativeElement.value = '';
                let userIds = this.selectedCcUsers.map(x => x.email);
                this.mailForm.get('ccUsers').setValue(userIds);
                this.mailForm.get('ccInput').setValue('');
            } else if (type == 'Bcc') {
                let selectedUsers = this.selectedBccUsers;
                let filteredSelectedUsers = _.filter(selectedUsers, function (user) {
                    return user.userId == options;
                })
                if (filteredSelectedUsers.length > 0) {
                    let index = this.selectedBccUsers.indexOf(filteredSelectedUsers[0]);
                    if (index > -1) {
                        this.selectedBccUsers.splice(index, 1);
                    }
                } else {
                    this.selectedBccUsers.push(filteredList[0]);
                }
                this.bccUserInput.nativeElement.value = '';
                let userIds = this.selectedBccUsers.map(x => x.email);
                this.mailForm.get('bccUsers').setValue(userIds);
                this.mailForm.get('bccInput').setValue('');
            }
        }

        requestAnimationFrame(() => {
            this.openUserAuto(this.matUserACTrigger, type);
        })

    }

    bindRoleNames() {
        let roleIds = this.form.formValue.toRoleIdsString;
        let roleDropdown = this.rolesDropdown;
        let rolesArray = roleIds.split(",");
        rolesArray.forEach((role) => {
            let filteredList = _.filter(roleDropdown, function (role1) {
                return role1.roleId == role;
            })
            this.selectedRoles.push(filteredList[0]);
        })
        this.selectedRoleIds = rolesArray;
        this.mailForm.get('roleIds').setValue(rolesArray);
        this.mailForm.get('rolesInput').setValue('');

        //for cc roles
        let ccroleIds = this.form.formValue.ccRoleIdsString;
        let ccRolesArray = [];
        if (ccroleIds) {
            ccRolesArray = ccroleIds.split(",");
            ccRolesArray.forEach((role) => {
                let filteredList = _.filter(roleDropdown, function (role1) {
                    return role1.roleId == role;
                })
                this.selectedCcRoles.push(filteredList[0]);
            })
        }

        this.selectedCcRoleids = ccRolesArray;
        this.mailForm.get('ccRoleIds').setValue(ccRolesArray);
        this.mailForm.get('ccRolesInput').setValue('');

        //for bcc roles
        let bccroleIds = this.form.formValue.bccRoleIdsString;
        let bccRolesArray = [];
        if (bccroleIds) {
            bccRolesArray = bccroleIds.split(",");
            bccRolesArray.forEach((role) => {
                let filteredList = _.filter(roleDropdown, function (role1) {
                    return role1.roleId == role;
                })
                this.selectedBccRoles.push(filteredList[0]);
            })
        }
        this.selectedBccRoleIds = bccRolesArray;
        this.mailForm.get('bccRoleIds').setValue(bccRolesArray);
        this.mailForm.get('bccRolesInput').setValue('');
        this.cdRef.detectChanges();
    }

    bindToUserNames(users, type) {
        let userDropdown = this.userDropdown;
        let userArray = [];
        if (users) {
            userArray = users.split(",");
            let filteredList = [];
            userArray.forEach((user) => {
                let filteredList = _.filter(userDropdown, function (user1) {
                    return user == user1.email
                })
                if (type == 'To') {
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
                } else if (type == 'Cc') {
                    if (filteredList.length > 0) {
                        let index = this.selectedCcUsers.indexOf(filteredList[0]);
                        if (index == -1) {
                            this.selectedCcUsers.push(filteredList[0]);
                        }
                    } else {
                        var userModel: any = {};
                        userModel.email = user;
                        this.selectedCcUsers.push(userModel);
                    }
                } else if (type == 'Bcc') {
                    if (filteredList.length > 0) {
                        let index = this.selectedBccUsers.indexOf(filteredList[0]);
                        if (index == -1) {
                            this.selectedBccUsers.push(filteredList[0]);
                        }
                    } else {
                        var userModel: any = {};
                        userModel.email = user;
                        this.selectedBccUsers.push(userModel);
                    }
                }
            })
        }

        if (type == 'To') {
            let userIds = this.selectedToUsers.map(x => x.email);
            this.mailForm.get('toUsers').setValue(userIds);
            this.mailForm.get('toInput').setValue('');
        }
        else if (type == 'Cc') {
            let userIds = this.selectedCcUsers.map(x => x.email);
            this.mailForm.get('ccUsers').setValue(userIds);
            this.mailForm.get('ccInput').setValue('');
        } else if (type == 'Bcc') {
            let userIds = this.selectedBccUsers.map(x => x.email);
            this.mailForm.get('bccUsers').setValue(userIds);
            this.mailForm.get('bccInput').setValue('');
        }
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

    openAuto(trigger: MatAutocompleteTrigger, type) {
        if (type == 'To') {
            trigger.openPanel();
            this.rolesInput.nativeElement.focus();
        }
        else if (type == 'Cc') {
            trigger.openPanel();
            this.ccRolesInput.nativeElement.focus();
        } else if (type == 'Bcc') {
            trigger.openPanel();
            this.bccRolesInput.nativeElement.focus();
        }
    }
    openUserAuto(trigger: MatAutocompleteTrigger, type) {
        if (type == 'To') {
            trigger.openPanel();
            this.toUserInput.nativeElement.focus();
        }
        else if (type == 'Cc') {
            trigger.openPanel();
            this.ccUserInput.nativeElement.focus();
        } else if (type == 'Bcc') {
            trigger.openPanel();
            this.bccUserInput.nativeElement.focus();
        }
    }

    removeSelectedRole(role, type) {
        if (type == 'To') {
            let index = this.selectedRoles.indexOf(role);
            this.selectedRoles.splice(index, 1);
            let roleIds = this.selectedRoles.map(x => x.roleId);
            this.selectedRoleIds = roleIds;
            this.mailForm.get('roleIds').setValue(roleIds);
            this.mailForm.get('rolesInput').setValue('');
        } else if (type == 'Cc') {
            let index = this.selectedCcRoles.indexOf(role);
            this.selectedCcRoles.splice(index, 1);
            let roleIds = this.selectedCcRoles.map(x => x.roleId);
            this.selectedCcRoleids = roleIds;
            this.mailForm.get('ccRoleIds').setValue(roleIds);
            this.mailForm.get('ccRolesInput').setValue('');
        } else if (type == 'Bcc') {
            let index = this.selectedBccRoles.indexOf(role);
            this.selectedBccRoles.splice(index, 1);
            let roleIds = this.selectedBccRoles.map(x => x.roleId);
            this.selectedBccRoleIds = roleIds;
            this.mailForm.get('bccRoleIds').setValue(roleIds);
            this.mailForm.get('bccRolesInput').setValue('');
        }
    }

    removeSelectedUser(user, type) {
        if (type == 'To') {
            let index = this.selectedToUsers.indexOf(user);
            this.selectedToUsers.splice(index, 1);
            let userIds = this.selectedToUsers.map(x => x.email);
            this.mailForm.get('toUsers').setValue(userIds);
            this.mailForm.get('toInput').setValue('');
        } else if (type == 'Cc') {
            let index = this.selectedCcUsers.indexOf(user);
            this.selectedCcUsers.splice(index, 1);
            let userIds = this.selectedCcUsers.map(x => x.email);
            this.mailForm.get('ccUsers').setValue(userIds);
            this.mailForm.get('ccInput').setValue('');
        } else if (type == 'Bcc') {
            let index = this.selectedBccUsers.indexOf(user);
            this.selectedBccUsers.splice(index, 1);
            let userIds = this.selectedBccUsers.map(x => x.email);
            this.mailForm.get('bccUsers').setValue(userIds);
            this.mailForm.get('bccInput').setValue('');
        }

    }

    upsertMail() {
        var mailResult: any = {};
        mailResult.id = this.mailForm.value.id;
        mailResult.name = this.mailForm.value.name;
        mailResult.subject = this.mailForm.value.subject;
        mailResult.message = this.mailForm.value.message;
        var toRoleIds = this.mailForm.value.roleIds;
        var toUsers = this.mailForm.value.toUsers;
        var ccRoleIds = this.mailForm.value.ccRoleIds;
        var ccUsers = this.mailForm.value.ccUsers;
        var bccRoleIds = this.mailForm.value.bccRoleIds;
        var bccUsers = this.mailForm.value.bccUsers;
        mailResult.isRedirectToEmails = this.isDirect;
        if (toRoleIds.length > 0) {
            mailResult.toRoleIdsString = toRoleIds.join(",");
        }
        if (toUsers.length > 0) {
            mailResult.toUsersString = toUsers.join(",");
        }
        if (ccRoleIds.length > 0) {
            mailResult.ccRoleIdsString = ccRoleIds.join(",");
        }
        if (ccUsers.length > 0) {
            mailResult.ccUsersString = ccUsers.join(",");
        }
        if (bccRoleIds.length > 0) {
            mailResult.bccRoleIdsString = bccRoleIds.join(",");
        }
        if (bccUsers.length > 0) {
            mailResult.bccUsersString = bccUsers.join(",");
        }

        this.AppDialog.close(mailResult);
    }

    cancelMail() {
        this.AppDialog.close();
    }

    onNoClick(): void {
        this.AppDialog.close();
    }

}