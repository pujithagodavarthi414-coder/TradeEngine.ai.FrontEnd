import { Component, ChangeDetectorRef, ViewChild, Input, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { GenericFormType } from '../../models/generic-form-type-model';
import { WorkflowModel } from '../../models/workflow-model';
import { WorkflowService } from '../../services/workflow.service';
import { mailCreatorComponent } from '../mail-creator.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { fieldUpdateCreatorComponent } from '../field-update.component';
import { MatSelectChange } from '@angular/material/select';
import { addChecklistComponent } from '../add-checklist.component';
import { addWebhooksComponent } from '../add-webhooks.component';
import { CronOptions } from "cron-editor/lib/CronOptions";
import { userTaskComponent } from '../user-task.component';
import { addCustomFunctionsComponent } from '../add-customfunctions.component';
import { TimeZone, User } from '../../models/timezone-model';
import { BpmMainModel } from '../../models/BpmMainModel';
import { BpmElements } from '../../models/BpmElement';
import { WorkFlowTriggerModel } from '../../models/workFlowTriggerModel';
import * as convert from 'xml-js';
import { Guid } from 'guid-typescript';
import { ScriptTaskComponent } from '../script-task.component';
import { SendTaskComponent } from '../workflow-list/send-task.component';
import { ReceiveTaskComponent } from '../workflow-list/receive-task.component';
import { CronExpressionModel } from '../../models/cron-expression.model';
import { XorGateWayComponent } from '../xor-gateway.component';
import { AndGateWayComponent } from '../and-gateway.component';
import { MessageEventComponent } from '../message-event.component';
import { TimerEventComponent } from '../timer-event.component';
import { DropAction, TreeItemLookup } from '@progress/kendo-angular-treeview';
import { MessageEventType, TaskType, ErrorEventType, EscalationEventType, TimerEventType, TimerDefinitionType, SignalEventType } from '../../models/enum';
import { EventGateWayComponent } from '../event-gateway.component';
import { EscalationEventComponent } from '../escalation-event.component';
import { SignalEventComponent } from '../signal-event.component';
import * as _ from "underscore";

@Component({
  selector: 'app-add-workflow',
  templateUrl: './add-workflow.component.html',
  styleUrls: ['./add-workflow.component.sass']
})
export class AddWorkflowComponent implements OnInit {
  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      this.matData = data[0];
      this.isEdit = this.matData.isEdit;
      this.GetAllTimeZones();
      var editWorkflowDetails = this.matData.editWorkflowDetails;
      if (editWorkflowDetails && editWorkflowDetails.formTypeId) {
        this.getAllFormFieldsById(editWorkflowDetails.formTypeId, editWorkflowDetails.formName);
      }
      this.currentDialogId = this.matData.formPhysicalId;
      this.companyModuleId = this.matData.companyModuleId;
      this.customFormsIds = this.matData.customFormsIds;
      this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    }
  }
  @ViewChild('addServiceTaskDialog') addServiceTaskDialog: TemplateRef<any>;
  @ViewChild('addErrorEventDialog') addErrorEventDialog: TemplateRef<any>;
  @ViewChild('addnewRecordDialog') addNewRecordDialog: TemplateRef<any>;
  @ViewChild('addnewNotificationDialog') addNewNotificationDialog: TemplateRef<any>;
  public items: any[] = [
    {
      formId: "f1cd16ef-3e27-4683-a704-402878023285",
      formtypeName: null,
      inputparamSteps: [],
      name: "u1",
      type: 5,
    },
    {
      formId: "f1cd16ef-3e27-4683-a704-402878023285",
      formtypeName: null,
      inputparamSteps: [],
      name: "u2",
      type: 5,
    }
  ];
  selectedAction: string = "None";
  tempItems: any[] = [];
  customFormsIds: any;
  workflowForm: FormGroup;
  formsList: any = [];
  forms: any[] = [];
  formsDropDown: any[];
  timezoneDropDown: any[];
  formFieldsDropDown: any[];
  formFieldsDateDropDown: any[];
  genericFormType: GenericFormType;
  timeZone: TimeZone;
  action: string;
  isRemoveTask: boolean;
  activityTaskId: string;
  companyModuleId: string;
  cronRadio: string;
  stepsShow: boolean = false;
  showTriggerDate: boolean = false;
  showRadioCron: boolean = false;
  showTriggerUntil: boolean = false;
  showTriggeruntilEndDate: boolean = false;
  showTriggeruntilStartDate: boolean = false;
  workFlowXml: any;
  isEditTask: boolean;
  fieldUpdates: any[] = [];
  usertask: any[] = [];
  taskType: TaskType;
  isEditEndEvent: boolean;
  endEventIndex: any;
  isEditTerminationEvent: boolean;
  terminationEventIndex: any;
  startEventValue: any;
  isEditStartEvent: boolean;
  startEventIndex: any;
  startStepId: string;
  endStepId: string;
  startEventName: any;
  currentDialogId: any;
  currentDialog: any;
  matData: any;
  isEdit: boolean;
  editWorkflowDetails: any;
  workflowItems: any;
  wfItems: any = [];
  workflowItemsByOrder: any;
  tempFormValue: any;
  isEdited: boolean;
  startDialogRef: MatDialogRef<unknown, any>;
  endDialogRef: any;
  messageDialogRef: any;
  timerDialogRef: any;
  escalationDialogRef: any;
  errorDialogRef: any;
  signalDialogRef: any;
  terminationDialogRef: any;
  orderActionsDialog: any;
  isAnyOperationIsInprogress: boolean;
  loadingEditedWorkflow: boolean;
  taskEvents: any[] = []
  criteriaSteps: FormArray;
  selectedForm: string;
  selectedtriggerDate: string;
  selectedtriggeruntilStartDate: string;
  selectedtriggeruntilEndDate: string;
  //@ViewChild('mailDialogComponent') mailCreatorComponentDialog: TemplateRef<any>;
  title = 'xml-js';
  bpmModel: BpmMainModel;
  mailInputs: any[] = [];
  taskList: any[] = [];
  checkListInputs: any[] = [];
  processIdName: any;
  formName: any = 'Employee';
  workFlowName: any = this.formName;
  startEvent: any;
  selectedTab: number;
  startEventId;
  startEventSeqFlowId;
  mailServiceTaskId;
  endEvent: any;
  endEventId;
  workflowXmlId: string;
  endEventSeqFlowId;
  terminationEvent: any;
  terminationEventId;
  terminationEventSeqFlowId;
  serviceTask: any;
  usersList: User[];
  recordCreationSteps: FormArray;
  public cronExpression = "0 10 1/1 * ?";
  public isCronDisabled = false;
  public isaction = true;
  public cronExpressionModel: CronExpressionModel;
  public cronOptions: CronOptions = {
    formInputClass: "form-control cron-editor-input",
    formSelectClass: "form-control cron-editor-select",
    formRadioClass: "cron-editor-radio",
    formCheckboxClass: "cron-editor-checkbox",
    defaultTime: "10:00:00",
    use24HourTime: true,
    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    hideSeconds: true,
    removeSeconds: true,
    removeYears: true
  };
  endEventName;
  terminationEventName;
  dates = [
    { id: '1', name: 'On' },
    { id: '2', name: 'Before' },
    { id: '3', name: 'After' },
    { id: '4', name: 'Until' }
  ];
  selectedDate = this.dates[1];

  triggerdates = [
    { id: '1', name: 'On' },
    { id: '2', name: 'Before' },
    { id: '3', name: 'After' },
    { id: '4', name: 'Today' }
  ];
  selectedTriggerDate = this.triggerdates[1];

  execution = [
    { id: '1', name: 'Occurring Every Month' },
    { id: '2', name: 'Occurring Every Year' },
    { id: '3', name: 'one Time' }
  ]
  selectedExecution = this.execution[1];

  condition = [
    { id: '1', name: 'Is' },
    { id: '2', name: 'Is Not' },
    { id: '3', name: 'Is Empty' },
    { id: '4', name: 'Is Not Empty' },
    { id: '5', name: 'Starts with' },
    { id: '6', name: 'Ends with' },
    { id: '7', name: 'Contains' },
    { id: '8', name: 'Not Conatins' }
  ]
  selectedCondition = this.condition[1];
  timeZoneOffset: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private workflowService: WorkflowService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public thisDialog: MatDialogRef<AddWorkflowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
  }

  ngOnInit(): void {
    this.clearForm();
    this.GetAllForms();
    this.getAllFormsIncluded();
    this.stepsShow = true;
    this.selectedAction = "None";
    if (this.isEdit) {
      this.workflowForm.valueChanges.subscribe(x => {
        this.isEdited = JSON.stringify(x) !== JSON.stringify(this.tempFormValue);
      });
    } else {
      this.isEdited = true;
    }
    this.cdRef.detectChanges();
  }

  getWorkflowById(dataSourceId, id) {
    this.loadingEditedWorkflow = true;
    this.workflowService.getWorkflowById(dataSourceId, id)
      .subscribe((res: any) => {
        if (res.data && res.data.length > 0) {
          this.editWorkflowDetails = res.data[0];
          this.workflowForm.patchValue(this.editWorkflowDetails.workflowObject);
          var cs = JSON.parse(this.editWorkflowDetails.workflowObject.criterialSteps);
          var csteps = this.workflowForm.get("criteriaSteps") as FormArray;
          cs.forEach(element => {
            csteps.push(this.newCriteria(element));
          });

          if (this.editWorkflowDetails.workflowObject.selectedTab) {
            this.selectedTab = this.editWorkflowDetails.workflowObject.selectedTab;
          } else {
            this.selectedTab = 0;
          }
          if (this.editWorkflowDetails.workflowObject.action) {
            this.action = this.editWorkflowDetails.workflowObject.action;
          }
          else {
            this.workflowForm.get('action').setValue('None');
            this.action = "None";
          }

          this.cronExpression = this.editWorkflowDetails.workflowObject.cronExpression;
          this.cronRadio = this.editWorkflowDetails.workflowObject.cronRadio;
          this.selectedForm = this.editWorkflowDetails.workflowObject.formName;
          this.workflowItems = JSON.parse(this.editWorkflowDetails.workflowObject.workflowItems);
          this.wfItems = JSON.parse(JSON.stringify(this.workflowItems));
          this.workFlowXml = this.editWorkflowDetails.workflowObject.xml;
          this.workflowItemsByOrder = JSON.parse(this.editWorkflowDetails.workflowObject.workflowItemsByOrder);
          this.bindWorkflowItems();
          this.getTimeZoneValue(this.editWorkflowDetails.workflowObject.timezone);
        }
        this.loadingEditedWorkflow = false;
      });
  }
  newCriteria(mi): FormGroup {
    var form = this.formBuilder.group({
      criteriaName: mi.criteriaName,
      criteriaCondition: mi.criteriaCondition,
      criteriaValue: mi.criteriaValue
    })
    return form;
  }
  //edit
  bindWorkflowItems() {
    if (this.workflowItems && this.workflowItems.length > 0) {
      this.workflowItems.forEach(el => {
        switch (el.type) {
          case TaskType.StartEvent:
            this.startSteps.push(this.formBuilder.group({
              name: el.name,
              type: TaskType.StartEvent
            }));
            break;
          case TaskType.MailTask:
            this.addNewMail(el);
            break;
          case TaskType.FieldUpdateTask:
            this.addNewFieldUpdate(el);
            this.taskEvents.push(el);
            break;
          case TaskType.CheckListTask:
            this.addcheckListSteps(el);
            break;
          case TaskType.UserTask:
            this.addNewUserTask(el);
            break;
          case TaskType.ServiceTask:
            this.addNewServiceTask(el);
            this.taskEvents.push(el);
            break;
          case TaskType.ScriptTask:
            this.addNewScriptTask(el);
            break;
          case TaskType.SendTask:
            this.addNewSendTask(el);
            break;
          case TaskType.ReceiveTask:
            this.addNewReceiveTask(el);
            break;
          case TaskType.XorGateWay:
            this.addNewXorGateWayTask(el);
            break;
          case TaskType.AndGateWay:
            this.addNewAndGateWayTask(el);
            break;
          case TaskType.messageEvent:
            this.addNewMessageEvent(el);
            break;
          case TaskType.TimerEvent:
            this.addNewTimerEvent(el);
            break;
          case TaskType.EscalationEvent:
            this.addNewEscalationEvent(el);
            break;
          case TaskType.ErrorEvent:
            this.addNewErrorEvent(el);
            break;
          case TaskType.SignalEvent:
            this.addNewSignalEvent(el);
            break;
          case TaskType.EventGateWay:
            this.addNewEventGateWayTask(el);
            break;
          case TaskType.TerminationEvent:
            this.terminationEventSteps.push(this.formBuilder.group({
              name: el.name,
              type: TaskType.TerminationEvent
            }));
            break;
          case TaskType.EndEvent:
            this.endSteps.push(this.formBuilder.group({
              name: el.name,
              type: TaskType.EndEvent
            }));
            break;
          case TaskType.RecordInsertion:
            this.addNewRecordCreationTask(el);
            break;
          case TaskType.NotificationAlert:
            this.addNewNotificationAlertTask(el);
            break;
        }
      });
    }
    this.tempFormValue = this.workflowForm.value;
    if (this.isEdit) {
      this.workflowForm.valueChanges.subscribe(x => {
        this.isEdited = JSON.stringify(x) !== JSON.stringify(this.tempFormValue);
      });
    }

  }

  clearForm() {
    this.workflowForm = new FormGroup({
      formtypeName: new FormControl(null),
      workflowName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])
      ),
      description: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(1000)
        ])
      ),
      fieldNames: new FormControl(null),
      fieldUniqueId: new FormControl(null),
      //dateFieldName: new FormControl(null),
      isStatus: new FormControl(null),
      action: new FormControl("None",
        Validators.compose([
          Validators.required])
      ),
      //cronRadio: new FormControl(null),
      timezone: new FormControl(null),
      criteriaSteps: this.formBuilder.array([]),
      mailAlertSteps: this.formBuilder.array([]),
      fieldUpdateSteps: this.formBuilder.array([]),
      checkListSteps: this.formBuilder.array([]),
      userTaskSteps: this.formBuilder.array([]),
      serviceTaskSteps: this.formBuilder.array([]),
      scriptTaskSteps: this.formBuilder.array([]),
      sendTaskSteps: this.formBuilder.array([]),
      receiveTaskSteps: this.formBuilder.array([]),
      xorGateWaySteps: this.formBuilder.array([]),
      andGateWaySteps: this.formBuilder.array([]),
      eventGateWaySteps: this.formBuilder.array([]),
      endSteps: this.formBuilder.array([]),
      startSteps: this.formBuilder.array([]),
      terminationEventSteps: this.formBuilder.array([]),
      messageEventSteps: this.formBuilder.array([]),
      timerEventSteps: this.formBuilder.array([]),
      escalationEventSteps: this.formBuilder.array([]),
      errorEventSteps: this.formBuilder.array([]),
      signalEventSteps: this.formBuilder.array([]),
      insertionSteps: this.formBuilder.array([]),
      notificationSteps: this.formBuilder.array([])
    })
  }

  //mail form array
  get mailAlertSteps(): FormArray {
    return this.workflowForm.get("mailAlertSteps") as FormArray
  }
  removeMail(i) {
    let record = this.mailAlertSteps[i];
    this.mailAlertSteps.removeAt(i);
    let tasksList = this.taskEvents;
    let index = tasksList.indexOf(record);
    tasksList.splice(index, 1);
    this.isEditTask = true;
    this.isRemoveTask = true;
    this.taskEvents = tasksList;

  }
  addNewMail(mi) {
    this.mailAlertSteps.push(this.newMail(mi));
  }
  newMail(mi): FormGroup {
    return this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      subject: mi.subject,
      message: mi.message,
      type: TaskType.MailTask,
      id: mi.id,
      toRoleIdsString: mi.toRoleIdsString,
      toUsersString: mi.toUsersString,
      ccRoleIdsString: mi.ccRoleIdsString,
      ccUsersString: mi.ccUsersString,
      bccRoleIdsString: mi.bccRoleIdsString,
      bccUsersString: mi.bccUsersString,
      isRedirectToEmails: mi.isRedirectToEmails
    })
  }
  editMail(i) {
    const dialogRef = this.dialog.open(mailCreatorComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.mailAlertSteps.controls[i].value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        let taskEvents = this.taskEvents;
        let filteredList = _.filter(taskEvents, function (event) {
          return event.id && event.id == res.id
        })
        if (filteredList.length > 0) {
          let index = taskEvents.indexOf(filteredList[0]);
          if (index > -1) {
            taskEvents[index] = res;
          }
          let filteredRoleIdString = filteredList[0].toRoleIdsString;
          let filteredTousersString = filteredList[0].toUsersString;
          let roleIdString = res.toRoleIdsString;
          let toUsersString = res.toUsersString;

          if (filteredList[0].name != res.name || filteredList[0].cc != res.cc
            || filteredList[0].bcc != res.bcc || filteredList[0].subject != res.subject || filteredList[0].message != res.message
            || roleIdString != filteredRoleIdString || toUsersString != filteredTousersString || filteredList[0].ccRoleIdsString != res.ccRoleIdsString
            || filteredList[0].ccUsersString != res.ccUsersString || filteredList[0].bccRoleIdsString != res.bccRoleIdsString
            || filteredList[0].bccUsersString != res.bccUsersString || filteredList[0].isRedirectToEmails != res.isRedirectToEmails) {
            if (!this.isEdit) {
              this.isEditTask = false;
            } else {
              this.isEditTask = true;
            }
          } else if (this.isRemoveTask == true) {
            this.isEditTask = true;
          }
          else {
            this.isEditTask = false;
          }
          this.taskEvents = taskEvents;
        } else {
          this.isEditTask = true;
          this.taskEvents.push(res);
        }
        this.mailAlertSteps.controls[i].patchValue(res);
      }
    });
  }
  addMail() {
    const dialogRef = this.dialog.open(mailCreatorComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log(res);
      if (res) {
        if (this.isEdit) {
          this.isEditTask = true;
        }
        this.taskEvents.push(res);
        this.addNewMail(res);
      } else {

      }
    });
  }

  //field update form array
  get fieldUpdateSteps(): FormArray {
    return this.workflowForm.get("fieldUpdateSteps") as FormArray
  }

  removeFieldUpdate(i) {
    let record = this.fieldUpdateSteps[i];
    this.fieldUpdateSteps.removeAt(i);
    let tasksList = this.taskEvents;
    let index = tasksList.indexOf(record);
    tasksList.splice(index, 1);
    this.isEditTask = true;
    this.isRemoveTask = true;
    this.taskEvents = tasksList;
  }

  addNewFieldUpdate(mi) {
    this.fieldUpdateSteps.push(this.newFieldUpdate(mi));
  }

  newFieldUpdate(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      description: mi.description,
      formId: mi.formId,
      type: TaskType.FieldUpdateTask,
      id: mi.id,
      syncForm: mi.syncForm,
      inputParamSteps: this.formBuilder.array([]),
    })
    if (mi.inputParamSteps && mi.inputParamSteps.length > 0) {
      var steps = form.get('inputParamSteps') as FormArray;
      mi.inputParamSteps.forEach((value, index) => {
        steps.insert(index, this.bindcriteriaItemForFieldUpdate(value));
      });
    }
    return form;
  }

  editFieldUpdate(i) {
    console.log(this.fieldUpdateSteps.controls[i]);
    const dialogRef = this.dialog.open(fieldUpdateCreatorComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.fieldUpdateSteps.controls[i].value, formsList: this.formsDropDown }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        var steps: FormArray = this.fieldUpdateSteps.controls[i].get('inputParamSteps') as FormArray;
        steps.clear();
        if (res.inputParamSteps && res.inputParamSteps.length > 0) {
          res.inputParamSteps.forEach((value, index) => {
            steps.insert(index, this.bindcriteriaItemForFieldUpdate(value));
          });
        }

        let taskEvents = this.taskEvents;
        let filteredList = _.filter(taskEvents, function (event) {
          return event.id && event.id == res.id
        })
        if (filteredList.length > 0) {
          let index = taskEvents.indexOf(filteredList[0]);
          if (index > -1) {
            taskEvents[index] = res;
          }
          if (filteredList[0].name != res.name || filteredList[0].description != res.description
            || filteredList[0].syncForm != res.syncForm) {
            if (!this.isEdit) {
              this.isEditTask = false;
            } else {
              this.isEditTask = true;
            }

          } else if (this.isRemoveTask = true) {
            this.isEditTask = true;
          }
          else {
            this.isEditTask = false;
          }
          let inputParamSteps = filteredList[0].inputParamSteps;

          if (res.inputParamSteps != null && res.inputParamSteps.length > 0) {
            var inputSteps = res.inputParamSteps;
            inputSteps.forEach((step) => {
              let filteredInputList = _.filter(inputParamSteps, function (param) {
                return param.id == step.id
              })
              if (filteredInputList.length > 0) {
                if (filteredInputList[0].fieldName != step.fieldName || filteredInputList[0].fieldValue != step.fieldValue) {
                  this.isEditTask = true
                }
              } else {
                this.isEditTask = true;
              }
            })
          }
          this.taskEvents = taskEvents;
        } else {
          this.isEditTask = true;
          this.taskEvents.push(res);
        }
        this.fieldUpdateSteps.controls[i].patchValue(res);
      }
    });
  }

  addFieldUpdates() {
    const dialogRef = this.dialog.open(fieldUpdateCreatorComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, formsList: this.formsDropDown }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (this.isEdit) {
          this.isEditTask = true;
        }
        this.taskEvents.push(res);
        this.addNewFieldUpdate(res);
      } else {
      }
    });
  }

  //Record insertion steps
  addRecord() {
    const dialogRef = this.dialog.open(this.addNewRecordDialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      id: "add-new-record-dialog",
      data: { name: this.selectedForm, formPhysicalId: "add-new-record-dialog", formId: this.workflowForm.get("formtypeName").value, formsList: this.forms, formKeys: this.formFieldsDropDown, isEdit: false }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (this.isEdit) {
          this.isEditTask = true;
        }
        this.taskEvents.push(res);
        this.addNewRecordCreationTask(res);
      }
    });
  }

  get insertionSteps(): FormArray {
    return this.workflowForm.get("insertionSteps") as FormArray
  }

  addNewRecordCreationTask(res) {
    this.insertionSteps.push(this.newRecordCreationTask(res));
  }

  newRecordCreationTask(event) {
    var form = this.formBuilder.group({
      formName: event.formName,
      dataSourceId: event.dataSourceId,
      customApplicationId: event.customApplicationId,
      inputParamSteps: this.formBuilder.array([]),
      type: TaskType.RecordInsertion,
      id: event.id,
      dataJsonKeys: event.dataJsonKeys,
      name: event.name,
      isFileUpload: event.isFileUpload,
      fileUploadKey: event.fileUploadKey
    })
    if (event.inputParamSteps && event.inputParamSteps.length > 0) {
      var steps = form.get('inputParamSteps') as FormArray;
      event.inputParamSteps.forEach((value, index) => {
        steps.insert(index, this.bindcriteriaItem(value));
      });
    }
    return form;
  }

  editCreationStep(i) {
    console.log(this.insertionSteps.controls[i]);
    const dialogRef = this.dialog.open(this.addNewRecordDialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      id: "add-new-record-dialog",
      data: { name: this.selectedForm, formPhysicalId: "add-new-record-dialog", formId: this.workflowForm.get("formtypeName").value, formsList: this.formsDropDown, formKeys: this.formFieldsDropDown, formValue: this.insertionSteps.controls[i].value, isEdit: true }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {

        var steps: FormArray = this.insertionSteps.controls[i].get('inputParamSteps') as FormArray;
        steps.clear();
        if (res.inputParamSteps && res.inputParamSteps.length > 0) {
          res.inputParamSteps.forEach((value, index) => {
            steps.insert(index, this.bindcriteriaItem(value));
          });
        }
        let taskEvents = this.taskEvents;
        let filteredList = _.filter(taskEvents, function (event) {
          return event.id && event.id == res.id
        })
        if (filteredList.length > 0) {
          let index = taskEvents.indexOf(filteredList[0]);
          if (index > -1) {
            taskEvents[index] = res;
          }
          if (filteredList[0].name != res.name || filteredList[0].dataSourceId != res.dataSourceId || filteredList[0].customApplicationId != res.customApplicationId
            || filteredList[0].isFileUpload != res.isFileUpload) {
            if (!this.isEdit) {
              this.isEditTask = false;
            } else {
              this.isEditTask = true;
            }
          } else if (this.isRemoveTask == true) {
            this.isEditTask = true;
          }
          else {
            this.isEditTask = false;
          }
          let inputParamSteps = filteredList[0].inputParamSteps;

          if (res.inputParamSteps != null && res.inputParamSteps.length > 0) {
            var inputSteps = res.inputParamSteps;
            inputSteps.forEach((step) => {
              let filteredInputList = _.filter(inputParamSteps, function (param) {
                return param.id == step.id
              })
              if (filteredInputList.length > 0) {
                if (filteredInputList[0].fieldName != step.fieldName || filteredInputList[0].fieldValue != step.fieldValue) {
                  this.isEditTask = true
                }
              } else {
                this.isEditTask = true;
              }
            })
          }
          this.taskEvents = taskEvents;
        } else {
          this.isEditTask = true;
          this.taskEvents.push(res);
        }
        this.insertionSteps.controls[i].patchValue(res);
      }
    });
  }

  removeInsertionStep(i) {
    let record = this.insertionSteps[i];
    this.insertionSteps.removeAt(i);
    let tasksList = this.taskEvents;
    let index = tasksList.indexOf(record);
    tasksList.splice(index, 1);
    this.isRemoveTask = true;
    this.isEditTask = true;
    this.taskEvents = tasksList;
  }

  // Notification alert steps

  addNotification() {
    const dialogRef = this.dialog.open(this.addNewNotificationDialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      id: "add-new-notification-dialog",
      data: { name: this.selectedForm, formPhysicalId: "add-new-notification-dialog", formId: this.workflowForm.get("formtypeName").value, isEdit: false, notificationType: this.workflowForm.get("action").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (this.isEdit) {
          this.isEditTask = true;
        }
        this.taskEvents.push(res);
        this.addNewNotificationAlertTask(res);
      }
    });
  }

  get notificationSteps(): FormArray {
    return this.workflowForm.get("notificationSteps") as FormArray
  }

  addNewNotificationAlertTask(res) {
    this.notificationSteps.push(this.newNotificationAlertTask(res));
  }

  newNotificationAlertTask(event) {
    var form = this.formBuilder.group({
      formName: event.formName,
      type: TaskType.NotificationAlert,
      id: event.id,
      name: event.name,
      title: event.title,
      notificationText: event.notificationText,
      notificationType: event.notificationType,
      navigationUrl: event.navigationUrl,
      toRoleIdsString: event.toRoleIdsString,
      toUsersString: event.toUsersString,
      notifyToUsersJson: event.selectedUsers
    })
    return form;
  }

  editNotificationStep(i) {
    const dialogRef = this.dialog.open(this.addNewNotificationDialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      id: "add-new-notification-dialog",
      data: { name: this.selectedForm, formPhysicalId: "add-new-notification-dialog", formId: this.workflowForm.get("formtypeName").value, formValue: this.notificationSteps.controls[i].value, isEdit: true, notificationType: this.workflowForm.get("action").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        let taskEvents = this.taskEvents;
        let filteredList = _.filter(taskEvents, function (event) {
          return event.id && event.id == res.id
        })
        if (filteredList.length > 0) {
          let index = taskEvents.indexOf(filteredList[0]);
          if (index > -1) {
            taskEvents[index] = res;
          }
          if (filteredList[0].name != res.name || filteredList[0].notificationText != res.notificationText ||
            filteredList[0].toRoleIdsString != res.toRoleIdsString || filteredList[0].toUsersString != res.toUsersString ||
            filteredList[0].notifyToUsersJson != res.notifyToUsersJson || filteredList[0].notificationType != res.notificationType || filteredList[0].navigationUrl != res.navigationUrl) {
            if (!this.isEdit) {
              this.isEditTask = false;
            } else {
              this.isEditTask = true;
            }
          } else if (this.isRemoveTask == true) {
            this.isEditTask = true;
          }
          else {
            this.isEditTask = false;
          }
          this.taskEvents = taskEvents;
        } else {
          this.isEditTask = true;
          this.taskEvents.push(res);
        }
        this.notificationSteps.controls[i].patchValue(res);
      }
    });
  }

  removeNotificationStep(i) {
    let record = this.notificationSteps[i];
    this.notificationSteps.removeAt(i);
    let tasksList = this.taskEvents;
    let index = tasksList.indexOf(record);
    tasksList.splice(index, 1);
    this.isRemoveTask = true;
    this.isEditTask = true;
    this.taskEvents = tasksList;
  }

  //checklist form array
  get checkListSteps(): FormArray {
    return this.workflowForm.get("checkListSteps") as FormArray
  }
  removecheckListSteps(i) {
    let record = this.checkListSteps[i];
    this.checkListSteps.removeAt(i);
    let tasksList = this.taskEvents;
    let index = tasksList.indexOf(record);
    tasksList.splice(index, 1);
    this.isEditTask = true;
    this.isRemoveTask = true;
    this.taskEvents = tasksList;
  }

  addcheckListSteps(mi) {
    this.checkListSteps.push(this.newcheckListSteps(mi));
  }

  newcheckListSteps(mi): FormGroup {
    return this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      description: mi.description,
      taskOwner: mi.taskOwner,
      displayName: mi.displayName,
      taskName: mi.taskName,
      dueDate: mi.dueDate,
      priority: mi.priority,
      type: TaskType.CheckListTask,
      id: mi.id
    })
  }

  editcheckListSteps(i) {
    const dialogrf = this.dialog.open(addChecklistComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.checkListSteps.controls[i].value }
    });
    dialogrf.afterClosed().subscribe((res: any) => {
      if (res) {
        let taskEvents = this.taskEvents;
        let filteredList = _.filter(taskEvents, function (event) {
          return event.id && event.id == res.id
        })
        if (filteredList.length > 0) {
          let index = taskEvents.indexOf(filteredList[0]);
          if (index > -1) {
            taskEvents[index] = res;
          }
          if (filteredList[0].name != res.name || filteredList[0].description != res.description || filteredList[0].taskOwner != res.taskOwner
            || filteredList[0].displayName != res.displayName || filteredList[0].taskName != res.taskName
            || filteredList[0].dueDate != res.dueDate || filteredList[0].priority != res.priority) {
            if (!this.isEdit) {
              this.isEditTask = false;
            } else {
              this.isEditTask = true;
            }
          } else if (this.isRemoveTask == true) {
            this.isEditTask = true;
          }
          else {
            this.isEditTask = false;
          }
          this.taskEvents = taskEvents;
        } else {
          this.isEditTask = true;
          this.taskEvents.push(res);
        }
        this.checkListSteps.controls[i].patchValue(res);
      }
    });
  }

  addChecklists() {
    const dialogRef = this.dialog.open(addChecklistComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (this.isEdit) {
          this.isEditTask = true;
        }
        this.taskEvents.push(res);
        this.addcheckListSteps(res);
      }
    });
  }

  //webhook steps
  addWebhooks() {
    const dialogRef = this.dialog.open(addWebhooksComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
  }

  //user task form array
  get userTaskSteps(): FormArray {
    return this.workflowForm.get("userTaskSteps") as FormArray
  }

  removeUserTask(i) {
    this.userTaskSteps.removeAt(i);
  }

  addNewUserTask(mi) {
    this.userTaskSteps.push(this.newUserTask(mi));
  }

  newUserTask(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      inputparamSteps: this.formBuilder.array([]),
      type: TaskType.UserTask
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindcriteriaItem(value));
      });
    }
    return form;
  }

  addUserTask() {
    const dialogRef = this.dialog.open(userTaskComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (this.isEdit) {
          this.isEditTask = true;
        }
        this.taskEvents.push(res);
        this.addNewUserTask(res);
      }
    });
  }

  editUserTask(i) {
    console.log(this.userTaskSteps.controls[i]);
    const dialogRef = this.dialog.open(userTaskComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.userTaskSteps.controls[i].value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.userTaskSteps.controls[i].get("name").setValue(res.name);
        var steps: FormArray = this.userTaskSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindcriteriaItemForUserTask(value));
          });
        }
        let taskEvents = this.taskEvents;
        let filteredList = _.filter(taskEvents, function (event) {
          return event.id && event.id == res.id
        })
        if (filteredList.length > 0) {
          let index = taskEvents.indexOf(filteredList[0]);
          if (index > -1) {
            taskEvents[index] = res;
          }
          if (filteredList[0].name != res.name) {
            if (!this.isEdit) {
              this.isEditTask = false;
            } else {
              this.isEditTask = true;
            }
          } else if (this.isRemoveTask == true) {
            this.isEditTask = true;
          }
          else {
            this.isEditTask = false;
          }
          let inputParamSteps = filteredList[0].inputParamSteps;

          if (res.inputparamSteps != null && res.inputparamSteps.length > 0) {
            var inputSteps = res.inputparamSteps;
            inputSteps.forEach((step) => {
              let filteredInputList = _.filter(inputParamSteps, function (param) {
                return param.inputId == step.inputId
              })
              if (filteredInputList.length > 0) {
                if (filteredInputList[0].inputName != step.inputName || filteredInputList[0].inputValue != step.inputValue) {
                  this.isEditTask = true
                }
              }
            })
          }

          this.taskEvents = taskEvents;
        } else {
          this.isEditTask = true;
          this.taskEvents.push(res);
        }
        this.userTaskSteps.controls[i].patchValue(res);
      }
    });
  }

  //service task
  get serviceTaskSteps(): FormArray {
    return this.workflowForm.get("serviceTaskSteps") as FormArray
  }

  removeServiceTask(i) {
    let record = this.serviceTaskSteps[i];
    this.serviceTaskSteps.removeAt(i);
    let tasksList = this.taskEvents;
    let index = tasksList.indexOf(record);
    tasksList.splice(index, 1);
    this.isEditTask = true;
    this.isRemoveTask = true;
    this.taskEvents = tasksList;
  }

  addNewServiceTask(mi) {
    this.serviceTaskSteps.push(this.newServiceTask(mi));
  }

  newServiceTask(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      inputparamSteps: this.formBuilder.array([]),
      topic: mi.topic,
      type: TaskType.ServiceTask,
      id: mi.id
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindcriteriaItem(value));
      });
    }
    return form;
  }

  openServiceTask() {
    const dialogRef = this.dialog.open(this.addServiceTaskDialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      id: "add-servicetask-dialog",
      data: { name: this.selectedForm, formPhysicalId: "add-servicetask-dialog", formId: this.workflowForm.get("formtypeName").value, formsList: this.formsDropDown }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        if (this.isEdit) {
          this.isEditTask = true;
        }
        this.taskEvents.push(res);
        this.addNewServiceTask(res);
      }
    });
  }

  editServiceTask(i) {
    console.log(this.serviceTaskSteps.controls[i]);
    const dialogRef = this.dialog.open(this.addServiceTaskDialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      id: "add-servicetask-dialog",
      data: { name: this.selectedForm, formPhysicalId: "add-servicetask-dialog", formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.serviceTaskSteps.controls[i].value, formsList: this.formsDropDown }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.serviceTaskSteps.controls[i].get("name").setValue(res.name);
        var steps: FormArray = this.serviceTaskSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindcriteriaItem(value));
          });
        }
        let taskEvents = this.taskEvents;
        let filteredList = _.filter(taskEvents, function (event) {
          return event.id && event.id == res.id
        })
        if (filteredList.length > 0) {
          let index = taskEvents.indexOf(filteredList[0]);
          if (index > -1) {
            taskEvents[index] = res;
          }
          if (filteredList[0].name != res.name || filteredList[0].topic != res.topic) {
            if (!this.isEdit) {
              this.isEditTask = false;
            } else {
              this.isEditTask = true;
            }
          } else if (this.isRemoveTask == true) {
            this.isEditTask = true;
          }
          else {
            this.isEditTask = false;
          }
          let inputParamSteps = filteredList[0].inputparamSteps;

          if (res.inputparamSteps != null && res.inputparamSteps.length > 0) {
            var inputSteps = res.inputparamSteps;
            inputSteps.forEach((step) => {
              let filteredInputList = _.filter(inputParamSteps, function (param) {
                return param.id == step.id
              })
              if (filteredInputList.length > 0) {
                if (filteredInputList[0].inputName != step.inputName || filteredInputList[0].inputValue != step.inputValue) {
                  this.isEditTask = true
                }
              } else {
                this.isEditTask = true;
              }
            })
          }
          this.taskEvents = taskEvents;
        } else {
          this.isEditTask = true;
          this.taskEvents.push(res);
        }
        this.serviceTaskSteps.controls[i].patchValue(res);
      }
    });
  }

  //script task
  get scriptTaskSteps(): FormArray {
    return this.workflowForm.get("scriptTaskSteps") as FormArray
  }
  removeScriptTask(i) {
    this.scriptTaskSteps.removeAt(i);
  }
  addNewScriptTask(mi) {
    this.scriptTaskSteps.push(this.newScriptTask(mi));
  }
  newScriptTask(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      resultVariable: mi.resultVariable,
      inputparamSteps: this.formBuilder.array([]),
      script: mi.script,
      type: TaskType.ScriptTask
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindcriteriaItem(value));
      });
    }
    return form;
  }
  editScriptTask(i) {
    console.log(this.scriptTaskSteps.controls[i]);
    const dialogRef = this.dialog.open(ScriptTaskComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.scriptTaskSteps.controls[i].value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.scriptTaskSteps.controls[i].get("name").setValue(res.name);
        this.scriptTaskSteps.controls[i].get("script").setValue(res.script);
        var steps: FormArray = this.scriptTaskSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindcriteriaItem(value));
          });
        }
      }
    });
  }

  openScriptTask() {
    const dialogRef = this.dialog.open(ScriptTaskComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewScriptTask(res);
      }
    });
  }

  //receive task
  get receiveTaskSteps(): FormArray {
    return this.workflowForm.get("receiveTaskSteps") as FormArray
  }
  removeReceiveTask(i) {
    this.receiveTaskSteps.removeAt(i);
  }
  addNewReceiveTask(mi) {
    this.receiveTaskSteps.push(this.newReceiveTask(mi));
  }
  newReceiveTask(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      inputparamSteps: this.formBuilder.array([]),
      messageName: mi.messageName,
      type: TaskType.ReceiveTask
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindcriteriaItem(value));
      });
    }
    return form;
  }
  editReceiveTask(i) {
    console.log(this.receiveTaskSteps.controls[i]);
    const dialogRef = this.dialog.open(ReceiveTaskComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.receiveTaskSteps.controls[i].value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.receiveTaskSteps.controls[i].get("name").setValue(res.name);
        var steps: FormArray = this.receiveTaskSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindcriteriaItem(value));
          });
        }
        this.receiveTaskSteps.controls[i].patchValue(res);
      }
    });
  }

  openReceiveTask() {
    const dialogRef = this.dialog.open(ReceiveTaskComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewReceiveTask(res);
      }
    });
  }

  //Gateways code starts

  //xor gateway
  //xor gateway
  get xorGateWaySteps(): FormArray {
    return this.workflowForm.get("xorGateWaySteps") as FormArray
  }
  removeXorGateWay(i) {
    this.xorGateWaySteps.removeAt(i);
  }
  addNewXorGateWayTask(mi) {
    this.xorGateWaySteps.push(this.newXorGateWayTask(mi));
  }
  newXorGateWayTask(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      elseCond: mi.elseCond,
      conditionSteps: this.formBuilder.array([]),
      orGateWayType: mi.orGateWayType,
      type: TaskType.XorGateWay
    })
    if (mi.conditionSteps && mi.conditionSteps.length > 0) {
      var steps = form.get('conditionSteps') as FormArray;
      mi.conditionSteps.forEach((value, index) => {
        steps.insert(index, this.bindXorGatewayFields(value, mi.orGateWayType));
      });
    }
    return form;
  }
  bindXorGatewayFields(data, gatewayType): FormGroup {
    if (gatewayType == 'Fork') {
      return this.formBuilder.group({
        fieldName1: new FormControl(data.fieldName1, Validators.compose([Validators.required])),
        fieldType: new FormControl(data.fieldType, Validators.compose([Validators.required])),
        functionName: new FormControl(data.functionName, Validators.compose([Validators.required])),
        taskName: new FormControl(data.taskName, Validators.compose([Validators.required])),
        fieldValue: new FormControl(data.fieldValue, Validators.compose([Validators.required]))
      });
    } else {
      return this.formBuilder.group({
        taskName: new FormControl(data.taskName, Validators.compose([Validators.required])),
      });
    }

  }
  editXorGateWay(i) {
    const dialogRef = this.dialog.open(XorGateWayComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.xorGateWaySteps.controls[i].value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.xorGateWaySteps.controls[i].get("name").setValue(res.name);
        this.xorGateWaySteps.controls[i].get("orGateWayType").setValue(res.orGateWayType);
        this.xorGateWaySteps.controls[i].get("elseCond").setValue(res.elseCond);
        var steps: FormArray = this.xorGateWaySteps.controls[i].get('conditionSteps') as FormArray;
        steps.clear();
        if (res.conditionSteps && res.conditionSteps.length > 0) {
          res.conditionSteps.forEach((value, index) => {
            steps.insert(index, this.bindXorGatewayFields(value, res.orGateWayType));
          });
        }
      }
    });
  }
  openXORGateWay() {
    const dialogRef = this.dialog.open(XorGateWayComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewXorGateWayTask(res);
      }
    });
  }


  //and gateway
  get andGateWaySteps(): FormArray {
    return this.workflowForm.get("andGateWaySteps") as FormArray
  }
  removeAndGateWay(i) {
    this.andGateWaySteps.removeAt(i);
  }
  addNewAndGateWayTask(mi) {
    this.andGateWaySteps.push(this.newAndGateWayTask(mi));
  }
  newAndGateWayTask(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      conditionSteps: this.formBuilder.array([]),
      type: TaskType.AndGateWay,
      andGateWayType: mi.andGateWayType
    })
    if (mi.conditionSteps && mi.conditionSteps.length > 0) {
      var steps = form.get('conditionSteps') as FormArray;
      mi.conditionSteps.forEach((value, index) => {
        steps.insert(index, this.bindAndGatewayFields(value));
      });
    }
    return form;
  }
  bindAndGatewayFields(data): FormGroup {
    return this.formBuilder.group({
      taskName: new FormControl(data.taskName, Validators.compose([Validators.required]))
    });
  }
  editAndGateWay(i) {
    const dialogRef = this.dialog.open(AndGateWayComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.andGateWaySteps.controls[i].value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.andGateWaySteps.controls[i].get("name").setValue(res.name);
        var steps: FormArray = this.andGateWaySteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindAndGatewayFields(value));
          });
        }
        this.andGateWaySteps.controls[i].patchValue(res);
      }
    });
  }
  openAndGateWay() {
    const dialogRef = this.dialog.open(AndGateWayComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewAndGateWayTask(res);
      }
    });
  }

  //event gateway
  get eventGateWaySteps(): FormArray {
    return this.workflowForm.get("eventGateWaySteps") as FormArray
  }
  removeEventGateWay(i) {
    this.eventGateWaySteps.removeAt(i);
  }
  addNewEventGateWayTask(mi) {
    this.eventGateWaySteps.push(this.newEventGateWayTask(mi));
  }
  newEventGateWayTask(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      conditionSteps: this.formBuilder.array([]),
      type: TaskType.EventGateWay
    })
    if (mi.conditionSteps && mi.conditionSteps.length > 0) {
      var steps = form.get('conditionSteps') as FormArray;
      mi.conditionSteps.forEach((value, index) => {
        steps.insert(index, this.bindEventGatewayFields(value));
      });
    }
    return form;
  }
  bindEventGatewayFields(data): FormGroup {
    return this.formBuilder.group({
      //taskName: new FormControl(data.taskName, Validators.compose([Validators.required])),
      eventName: new FormControl(data.eventName, Validators.compose([Validators.required]))
    });
  }
  editEventGateWay(i) {
    const dialogRef = this.dialog.open(EventGateWayComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.eventGateWaySteps.controls[i].value, items: this.getActionsForGateWay(), events: this.getEventsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.eventGateWaySteps.controls[i].get("name").setValue(res.name);
        var steps: FormArray = this.eventGateWaySteps.controls[i].get('conditionSteps') as FormArray;
        steps.clear();
        if (res.conditionSteps && res.conditionSteps.length > 0) {
          res.conditionSteps.forEach((value, index) => {
            steps.insert(index, this.bindEventGatewayFields(value));
          });
        }
        this.eventGateWaySteps.controls[i].patchValue(res);
      }
    });
  }
  openEventGateWay() {
    const dialogRef = this.dialog.open(EventGateWayComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, items: this.getActionsForGateWay(), events: this.getEventsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewEventGateWayTask(res);
      }
    });
  }

  //Events code starts
  //end steps
  get endSteps(): FormArray {
    return this.workflowForm.get("endSteps") as FormArray
  }
  editEndSteps(i, dialog) {
    this.isEditEndEvent = true;
    this.endEventIndex = i;
    this.endEventName = this.endSteps.controls[i].value.name;
    this.endStepId = this.endSteps.controls[i].value.id;
    this.endDialogRef = this.dialog.open(dialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.endSteps.controls[i].value }
    });
  }

  editEndEvent() {
    this.endSteps.controls[this.endEventIndex].get('name').patchValue(this.endEventName);
    this.endSteps.controls[this.endEventIndex].get('id').patchValue(this.endStepId);
    this.closeEndDialog();
    this.isEditEndEvent = false;
    this.endEventName = null;
    this.endEventIndex = null;
    this.endStepId = null;
    let taskEvents = this.taskEvents;
    let res = this.endSteps.controls[this.endEventIndex].value;
    let filteredList = _.filter(taskEvents, function (event) {
      return event.id && event.id == res.id
    })
    if (filteredList.length > 0) {
      let index = taskEvents.indexOf(filteredList[0]);
      if (index > -1) {
        taskEvents[index] = res;
      }
      if (filteredList[0].name != res.name) {
        if (!this.isEdit) {
          this.isEditTask = false;
        } else {
          this.isEditTask = true;
        }
      }
      else {
        this.isEditTask = false;
      }
      this.taskEvents = taskEvents;
    } else {
      this.isEditTask = true;
      this.taskEvents.push(res);
    }
  }
  removeEndSteps(i) {
    let record = this.endSteps[i];
    let tasksList = this.taskEvents;
    let index = tasksList.indexOf(record);
    tasksList.splice(index, 1);
    this.isEditTask = true;
    this.isRemoveTask = true;
    this.taskEvents = tasksList;
    this.endSteps.removeAt(i);
  }
  addNewEndStep() {
    this.endSteps.push(this.newEndStep());
    this.taskEvents.push(this.newEndStep().value);
    this.closeEndDialog();
    this.isEditEndEvent = false;
    this.endEventName = null;
    this.endEventIndex = null;
    this.endStepId = null;
    if (this.isEdit) {
      this.isEditTask = true;
    }
  }
  newEndStep(): FormGroup {
    return this.formBuilder.group({
      name: this.endEventName,
      type: TaskType.EndEvent,
      id: this.endStepId
    })
  }
  addEndEvent(dialog) {
    this.endEventName = null;
    this.endStepId = Guid.create().toString();
    this.isEditEndEvent = false;
    this.endDialogRef = this.dialog.open(dialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true
    });
  }

  //start steps
  get startSteps(): FormArray {
    return this.workflowForm.get("startSteps") as FormArray
  }
  editStartSteps(i, dialog) {
    this.isEditStartEvent = true;
    this.startEventIndex = i;
    this.startEventName = this.startSteps.controls[i].value.name;
    this.startStepId = this.startSteps.controls[i].value.id;
    this.startDialogRef = this.dialog.open(dialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.startSteps.controls[i].value }
    });
  }

  editStartEvent() {
    this.startSteps.controls[this.startEventIndex].get('name').patchValue(this.startEventName);
    this.startSteps.controls[this.startEventIndex].get('id').patchValue(this.startStepId);
    this.closeStartDialog();
    this.isEditStartEvent = false;
    this.startEventName = null;
    this.startEventIndex = null;
    this.startStepId = null;
    let taskEvents = this.taskEvents;
    let res = this.startSteps.controls[this.startEventIndex].value;
    let filteredList = _.filter(taskEvents, function (event) {
      return event.id && event.id == res.id
    })
    if (filteredList.length > 0) {
      let index = taskEvents.indexOf(filteredList[0]);
      if (index > -1) {
        taskEvents[index] = res;
      }
      if (filteredList[0].name != res.name) {
        if (!this.isEdit) {
          this.isEditTask = false;
        } else {
          this.isEditTask = true;
        }
      } else if (this.isRemoveTask == true) {
        this.isEditTask = true;
      }
      else {
        this.isEditTask = false;
      }
      this.taskEvents = taskEvents;
    } else {
      this.isEditTask = true;
      this.taskEvents.push(res);
    }
  }
  removeStartSteps(i) {
    let record = this.startSteps[i];
    let tasksList = this.taskEvents;
    let index = tasksList.indexOf(record);
    tasksList.splice(index, 1);
    this.isEditTask = true;
    this.isRemoveTask = true;
    this.taskEvents = tasksList;
    this.startSteps.removeAt(i);
  }
  addNewStartStep() {
    this.startSteps.push(this.newStartStep());
    this.taskEvents.push(this.newStartStep().value);
    this.closeStartDialog();
    this.isEditStartEvent = false;
    this.startEventName = null;
    this.startEventIndex = null;
    this.startStepId = null;
    if (this.isEdit) {
      this.isEditTask = true;
    }
  }
  newStartStep(): FormGroup {
    return this.formBuilder.group({
      name: this.startEventName,
      type: TaskType.StartEvent,
      id: this.startStepId

    })
  }
  addStartEvent(dialog) {
    this.startEventName = null;
    this.startStepId = Guid.create().toString();
    this.isEditStartEvent = false;
    this.startDialogRef = this.dialog.open(dialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true
    });
  }

  ///message event
  get messageEventSteps(): FormArray {
    return this.workflowForm.get("messageEventSteps") as FormArray
  }
  removeMessageEvent(i) {
    this.messageEventSteps.removeAt(i);
  }
  addNewMessageEvent(mi) {
    this.messageEventSteps.push(this.newMessageEvent(mi));
  }
  newMessageEvent(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      messageName: mi.messageName,
      messageEventType: mi.messageEventType,
      topic: mi.topic,
      taskName: mi.taskName,
      inputparamSteps: this.formBuilder.array([]),
      type: TaskType.messageEvent
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindMessageEventFields(value));
      });
    }
    return form;
  }
  bindMessageEventFields(data): FormGroup {
    return this.formBuilder.group({
      inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
      inputValue: new FormControl(data.inputValue, Validators.compose([]))
    });
  }
  editMessageEvent(i) {
    const dialogRef = this.dialog.open(MessageEventComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.messageEventSteps.controls[i].value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.messageEventSteps.controls[i].get("name").setValue(res.name);
        this.messageEventSteps.controls[i].get("messageName").setValue(res.messageName);
        this.messageEventSteps.controls[i].get("messageEventType").setValue(res.messageEventType);
        this.messageEventSteps.controls[i].get("topic").setValue(res.topic);
        this.messageEventSteps.controls[i].get("taskName").setValue(res.taskName);
        var steps: FormArray = this.messageEventSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindMessageEventFields(value));
          });
        }
      }
    });
  }

  openMessageEvent() {
    const dialogRef = this.dialog.open(MessageEventComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewMessageEvent(res);
      }
    });
  }

  //Timer event
  get timerEventSteps(): FormArray {
    return this.workflowForm.get("timerEventSteps") as FormArray
  }
  removeTimerEvent(i) {
    this.timerEventSteps.removeAt(i);
  }
  addNewTimerEvent(mi) {
    this.timerEventSteps.push(this.newTimerEvent(mi));
  }
  newTimerEvent(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      timerName: mi.timerName,
      timeExp: mi.timeExp,
      timerEventType: mi.timerEventType,
      timerDefinitionType: mi.timerDefinitionType,
      topic: mi.topic,
      taskName: mi.taskName,
      durYears: mi.durYears,
      durMonths: mi.durMonths,
      durDays: mi.durDays,
      durHours: mi.durHours,
      durMin: mi.durMin,
      durSec: mi.durSec,
      cycleYears: mi.cycleYears,
      cycleMonths: mi.cycleMonths,
      cycleDays: mi.cycleDays,
      cycleHours: mi.cycleHours,
      cycleMin: mi.cycleMin,
      cycleSec: mi.cycleSec,
      cycleDateTimer: mi.cycleDateTimer,
      cycleRep: mi.cycleRep,
      dateTimer: mi.dateTimer,
      inputparamSteps: this.formBuilder.array([]),
      type: TaskType.TimerEvent
    })
    if (mi.conditionSteps && mi.conditionSteps.length > 0) {
      var steps = form.get('conditionSteps') as FormArray;
      mi.conditionSteps.forEach((value, index) => {
        steps.insert(index, this.bindTimerEventFields(value));
      });
    }
    return form;
  }
  bindTimerEventFields(data): FormGroup {
    return this.formBuilder.group({
      inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
      inputValue: new FormControl(data.inputValue, Validators.compose([]))
    });
  }
  editTimerEvent(i) {
    const dialogRef = this.dialog.open(TimerEventComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.timerEventSteps.controls[i].value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.timerEventSteps.controls[i].get("name").setValue(res.name);
        this.timerEventSteps.controls[i].get("timerName").setValue(res.timerName);
        this.timerEventSteps.controls[i].get("timerEventType").setValue(res.timerEventType);
        this.timerEventSteps.controls[i].get("timerDefinitionType").setValue(res.timerDefinitionType);
        this.timerEventSteps.controls[i].get("timeExp").setValue(res.timeExp);
        this.timerEventSteps.controls[i].get("topic").setValue(res.topic);
        this.timerEventSteps.controls[i].get("taskName").setValue(res.taskName);
        this.timerEventSteps.controls[i].get("durYears").setValue(res.durYears);
        this.timerEventSteps.controls[i].get("durMonths").setValue(res.durMonths);
        this.timerEventSteps.controls[i].get("durHours").setValue(res.durHours);
        this.timerEventSteps.controls[i].get("durMin").setValue(res.durMin);
        this.timerEventSteps.controls[i].get("durSec").setValue(res.durSec);
        this.timerEventSteps.controls[i].get("cycleYears").setValue(res.cycleYears);
        this.timerEventSteps.controls[i].get("cycleMonths").setValue(res.cycleMonths);
        this.timerEventSteps.controls[i].get("cycleDays").setValue(res.cycleDays);
        this.timerEventSteps.controls[i].get("cycleHours").setValue(res.cycleHours);
        this.timerEventSteps.controls[i].get("cycleMin").setValue(res.cycleMin);
        this.timerEventSteps.controls[i].get("cycleSec").setValue(res.cycleSec);
        this.timerEventSteps.controls[i].get("cycleDateTimer").setValue(res.cycleDateTimer);
        this.timerEventSteps.controls[i].get("cycleRep").setValue(res.cycleRep);
        this.timerEventSteps.controls[i].get("dateTimer").setValue(res.dateTimer);

        var steps: FormArray = this.timerEventSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindTimerEventFields(value));
          });
        }
      }
    });
  }

  openTimerEvent() {
    const dialogRef = this.dialog.open(TimerEventComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewTimerEvent(res);
      }
    });
  }

  //send task
  get sendTaskSteps(): FormArray {
    return this.workflowForm.get("sendTaskSteps") as FormArray
  }
  removeSendTask(i) {
    this.sendTaskSteps.removeAt(i);
  }
  addNewSendTask(mi) {
    this.sendTaskSteps.push(this.newSendTask(mi));
  }
  newSendTask(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      inputparamSteps: this.formBuilder.array([]),
      topic: mi.topic,
      type: TaskType.SendTask
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindcriteriaItem(value));
      });
    }
    return form;
  }
  editSendTask(i) {
    const dialogRef = this.dialog.open(SendTaskComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.sendTaskSteps.controls[i].value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.sendTaskSteps.controls[i].get("name").setValue(res.name);
        var steps: FormArray = this.sendTaskSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindcriteriaItem(value));
          });
        }
        this.sendTaskSteps.controls[i].patchValue(res);
      }
    });
  }

  openSendTask() {
    const dialogRef = this.dialog.open(SendTaskComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewSendTask(res);
      }
    });
  }

  //Escalation event
  get escalationEventSteps(): FormArray {
    return this.workflowForm.get("escalationEventSteps") as FormArray
  }
  removeEscalationEvent(i) {
    this.timerEventSteps.removeAt(i);
  }
  addNewEscalationEvent(mi) {
    this.escalationEventSteps.push(this.newEscalationEvent(mi));
  }
  newEscalationEvent(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      escalationEventType: mi.escalationEventType,
      escalationCode: mi.escalationCode,
      taskName: mi.taskName,
      topic: mi.topic,
      escalationName: mi.escalationName,
      inputparamSteps: this.formBuilder.array([]),
      type: TaskType.EscalationEvent
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindEscalationEventFields(value));
      });
    }
    return form;
  }
  bindEscalationEventFields(data): FormGroup {
    return this.formBuilder.group({
      inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
      inputValue: new FormControl(data.inputValue, Validators.compose([]))
    });
  }
  editEscalationEvent(i) {
    const dialogRef = this.dialog.open(EscalationEventComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.escalationEventSteps.controls[i].value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.escalationEventSteps.controls[i].get("name").setValue(res.name);
        this.escalationEventSteps.controls[i].get("taskName").setValue(res.taskName);
        this.escalationEventSteps.controls[i].get("topic").setValue(res.topic);
        this.escalationEventSteps.controls[i].get("escalationName").setValue(res.escalationName);
        this.escalationEventSteps.controls[i].get("escalationCode").setValue(res.escalationCode);
        this.escalationEventSteps.controls[i].get("escalationEventType").setValue(res.escalationEventType);
        var steps: FormArray = this.escalationEventSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindEscalationEventFields(value));
          });
        }
      }
    });
  }

  openEscalationEvent() {
    const dialogRef = this.dialog.open(EscalationEventComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewEscalationEvent(res);
      }
    });
  }

  //Signal event
  get signalEventSteps(): FormArray {
    return this.workflowForm.get("signalEventSteps") as FormArray
  }
  removeSignalEvent(i) {
    this.signalEventSteps.removeAt(i);
  }
  addNewSignalEvent(mi) {
    this.signalEventSteps.push(this.newSignalEvent(mi));
  }
  newSignalEvent(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      signalName: mi.signalName,
      signalEventType: mi.signalEventType,
      topic: mi.topic,
      taskName: mi.taskName,
      inputparamSteps: this.formBuilder.array([]),
      type: TaskType.SignalEvent
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindSignalEventFields(value));
      });
    }
    return form;
  }
  bindSignalEventFields(data): FormGroup {
    return this.formBuilder.group({
      inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
      inputValue: new FormControl(data.inputValue, Validators.compose([]))
    });
  }
  editSignalEvent(i) {
    const dialogRef = this.dialog.open(SignalEventComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.signalEventSteps.controls[i].value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.signalEventSteps.controls[i].get("name").setValue(res.name);
        this.signalEventSteps.controls[i].get("signalName").setValue(res.signalName);
        this.signalEventSteps.controls[i].get("signalEventType").setValue(res.signalEventType);
        this.signalEventSteps.controls[i].get("topic").setValue(res.topic);
        this.signalEventSteps.controls[i].get("taskName").setValue(res.taskName);
        var steps: FormArray = this.signalEventSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindSignalEventFields(value));
          });
        }
      }
    });
  }
  openSignalEvent() {
    const dialogRef = this.dialog.open(SignalEventComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, items: this.getActionsForGateWay() }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewSignalEvent(res);
      }
    });
  }


  //Error event
  get errorEventSteps(): FormArray {
    return this.workflowForm.get("errorEventSteps") as FormArray
  }
  removeErrorEvent(i) {
    this.errorEventSteps.removeAt(i);
  }
  addNewErrorEvent(mi) {
    this.errorEventSteps.push(this.newErrorEvent(mi));
  }
  newErrorEvent(mi): FormGroup {
    var form = this.formBuilder.group({
      formtypeName: mi.formtypeName,
      name: mi.name,
      formId: mi.formId,
      errorEventType: mi.errorEventType,
      errorCode: mi.errorCode,
      taskName: mi.taskName,
      errorMessage: mi.errorMessage,
      inputparamSteps: this.formBuilder.array([]),
      type: TaskType.ErrorEvent
    })
    if (mi.inputparamSteps && mi.inputparamSteps.length > 0) {
      var steps = form.get('inputparamSteps') as FormArray;
      mi.inputparamSteps.forEach((value, index) => {
        steps.insert(index, this.bindErrorEventFields(value));
      });
    }
    return form;
  }
  bindErrorEventFields(data): FormGroup {
    return this.formBuilder.group({
      inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
      inputValue: new FormControl(data.inputValue, Validators.compose([]))
    });
  }
  editErrorEvent(i) {
    const dialogRef = this.dialog.open(this.addErrorEventDialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      id: 'edit-error-event-dialog',
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.errorEventSteps.controls[i].value, items: this.getActionsForGateWay(), formPhysicalId: 'edit-error-event-dialog' }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.errorEventSteps.controls[i].get("errorMessage").setValue(res.errorMessage);
        this.errorEventSteps.controls[i].get("errorCode").setValue(res.errorCode);
        this.errorEventSteps.controls[i].get("taskName").setValue(res.taskName);
        this.errorEventSteps.controls[i].get("name").setValue(res.name);
        this.errorEventSteps.controls[i].get("errorEventType").setValue(res.errorEventType);
        var steps: FormArray = this.errorEventSteps.controls[i].get('inputparamSteps') as FormArray;
        steps.clear();
        if (res.inputparamSteps && res.inputparamSteps.length > 0) {
          res.inputparamSteps.forEach((value, index) => {
            steps.insert(index, this.bindErrorEventFields(value));
          });
        }
      }
    });
  }

  openErrorEvent() {
    const dialogRef = this.dialog.open(this.addErrorEventDialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      id: "add-error-event-dialog",
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, items: this.getActionsForGateWay(), formPhysicalId: 'add-error-event-dialog' }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.addNewErrorEvent(res);
      }
    });
  }

  //termination steps

  get terminationEventSteps(): FormArray {
    return this.workflowForm.get("terminationEventSteps") as FormArray
  }
  editTerminationSteps(i, dialog) {
    this.isEditTerminationEvent = true;
    this.terminationEventIndex = i;
    this.terminationEventName = this.terminationEventSteps.controls[i].value.name;
    this.terminationDialogRef = this.dialog.open(dialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value, isEdit: true, formValue: this.terminationEventSteps.controls[i].value }
    });
  }
  editTerminationEvent() {
    this.terminationEventSteps.controls[this.terminationEventIndex].get('name').patchValue(this.terminationEventName);
    this.closeTerminationDialog();
    this.isEditTerminationEvent = false;
    this.terminationEventName = null;
    this.terminationEventIndex = null;
  }
  removeTerminationSteps(i) {
    this.terminationEventSteps.removeAt(i);
  }
  addNewTerminationStep() {
    this.terminationEventSteps.push(this.newTerminationStep());
    this.closeTerminationDialog();
    this.isEditTerminationEvent = false;
    this.terminationEventName = null;
    this.terminationEventIndex = null;
  }
  newTerminationStep(): FormGroup {
    return this.formBuilder.group({
      name: this.terminationEventName,
      type: TaskType.TerminationEvent
    })
  }
  addTerminationEvent(dialog) {
    this.terminationEventName = null;
    this.isEditTerminationEvent = false;
    this.terminationDialogRef = this.dialog.open(dialog, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true
    });
  }

  bindcriteriaItem(data): FormGroup {
    return this.formBuilder.group({
      inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
      inputValue: new FormControl(data.inputValue, Validators.compose([])),
      id: new FormControl(data.id, Validators.compose([])),
    });
  }

  bindFormKeyCriteriaItem(data): FormGroup {
    return this.formBuilder.group({
      parentFormKey: new FormControl(data.inputName, Validators.compose([Validators.required])),
      childFormKey: new FormControl(data.inputValue, Validators.compose([]))
    });
  }

  bindcriteriaItemForFieldUpdate(data): FormGroup {
    return this.formBuilder.group({
      fieldName: new FormControl(data.fieldName, Validators.compose([Validators.required])),
      fieldValue: new FormControl(data.fieldValue, Validators.compose([])),
      id: new FormControl(data.id, Validators.compose([])),
    });
  }

  bindcriteriaItemForUserTask(data): FormGroup {
    return this.formBuilder.group({
      inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
      inputValue: new FormControl(data.inputValue, Validators.compose([])),
      inputId: new FormControl(data.inputId, Validators.compose([])),
    });
  }

  onChange(mrChange: MatRadioChange) {
    this.action = mrChange.value;
    this.workflowForm.controls["fieldNames"].setValue(null);
    this.workflowForm.controls["fieldUniqueId"].setValue(null);
  }


  onChangedateRadio(mrChange: MatRadioChange) {
    this.cronRadio = mrChange.value;
    if (mrChange.value == "Yes") {
      this.showRadioCron = true;
    }
    else {
      this.showRadioCron = false;
    }
  }


  submitForm() { }

  upsertworkflow() {
    this.createBpmModel();
  }
  getAllUsers() {
    var searchModel: any = {};
    searchModel.isArchived = false
    this.workflowService.GetAllUsers(searchModel).subscribe((x: any) => {
      if (x.success) {
        this.usersList = x.data;
      }
    })
  }
  addMailServiceTask() {
    var el = new BpmElements();
    el.attributes = { id: this.mailServiceTaskId, name: 'mail', 'camunda:type': 'external', 'camunda:topic': 'mailtemplate-activity' };
    el.type = "element";
    el.name = "bpmn:serviceTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    ce.elements = this.addInputElements(this.mailInputs);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    var incoming = new BpmElements();
    incoming.type = 'element';
    incoming.name = 'bpmn:incoming';
    incoming.elements = [];
    var flow = { type: 'text', text: this.startEventSeqFlowId };
    incoming.elements.push(flow);

    var outgoing = new BpmElements();
    outgoing.type = 'element';
    outgoing.name = 'bpmn:outgoing';
    outgoing.elements = [];
    this.endEventSeqFlowId = 'Flow_' + Guid.create().toString();
    var flow = { type: 'text', text: this.endEventSeqFlowId };
    outgoing.elements.push(flow);

    el.elements.push(incoming);
    el.elements.push(outgoing);
    this.bpmModel.elements[0].elements[0].elements.push(el);
  }

  addFieldUpdateServiceTask() {
    var el = new BpmElements();
    el.attributes = { id: this.mailServiceTaskId, name: 'mail', 'camunda:type': 'external', 'camunda:topic': 'fieldupdate_activity' };
    el.type = "element";
    el.name = "bpmn:serviceTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    //var i = [{ name: 'message', value: 'Created' }, { name: 'responsibleUser', value: 'arunamoss8@gmail.com' }];
    ce.elements = this.addInputElements(this.fieldUpdates);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    var incoming = new BpmElements();
    incoming.type = 'element';
    incoming.name = 'bpmn:incoming';
    incoming.elements = [];
    var flow = { type: 'text', text: this.startEventSeqFlowId };
    incoming.elements.push(flow);

    var outgoing = new BpmElements();
    outgoing.type = 'element';
    outgoing.name = 'bpmn:outgoing';
    outgoing.elements = [];
    this.endEventSeqFlowId = 'Flow_' + Guid.create().toString();
    var flow = { type: 'text', text: this.endEventSeqFlowId };
    outgoing.elements.push(flow);

    el.elements.push(incoming);
    el.elements.push(outgoing);
    this.bpmModel.elements[0].elements[0].elements.push(el);
  }

  addCheckListServiceTask() {
    var el = new BpmElements();
    el.attributes = { id: this.mailServiceTaskId, name: 'mail', 'camunda:type': 'external', 'camunda:topic': 'checklist_activity' };
    el.type = "element";
    el.name = "bpmn:serviceTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    //var i = [{ name: 'message', value: 'Created' }, { name: 'responsibleUser', value: 'arunamoss8@gmail.com' }];
    ce.elements = this.addInputElements(this.checkListInputs);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    var incoming = new BpmElements();
    incoming.type = 'element';
    incoming.name = 'bpmn:incoming';
    incoming.elements = [];
    var flow = { type: 'text', text: this.startEventSeqFlowId };
    incoming.elements.push(flow);

    var outgoing = new BpmElements();
    outgoing.type = 'element';
    outgoing.name = 'bpmn:outgoing';
    outgoing.elements = [];
    this.endEventSeqFlowId = 'Flow_' + Guid.create().toString();
    var flow = { type: 'text', text: this.endEventSeqFlowId };
    outgoing.elements.push(flow);

    el.elements.push(incoming);
    el.elements.push(outgoing);
    this.bpmModel.elements[0].elements[0].elements.push(el);
  }

  addBpmDiagramForStartEvent() {
    var bpmFlow1: any = {};
    bpmFlow1.attributes = { id: 'BPMNPlane_1', bpmnElement: this.workflowXmlId };
    bpmFlow1.type = "element";
    bpmFlow1.name = "bpmndi:BPMNPlane";
    bpmFlow1.elements = [];
    var subTask1: any = {};
    subTask1.attributes = { id: '_BPMNShape_' + this.startEventId, bpmnElement: this.startEventId };
    subTask1.type = "element";
    subTask1.name = "bpmndi:BPMNShape";
    subTask1.elements = [];
    //bound start events
    var startEvent1: any = {};
    startEvent1.attributes = { x: "179", y: "99", width: "36", height: "36" };
    startEvent1.type = "element";
    startEvent1.name = "dc:Bounds";
    startEvent1.elements = [];
    subTask1.elements.push(startEvent1);
    var bountLabel: any = {};
    bountLabel.attributes = { id: '_BPMNShape_' };
    bountLabel.type = "element";
    bountLabel.name = "bpmndi:BPMNLabel";
    bountLabel.elements = [];
    var bountLabel: any = {};
    bountLabel.attributes = { id: '_BPMNLabel_' };
    bountLabel.type = "element";
    bountLabel.name = "bpmndi:BPMNLabel";
    bountLabel.elements = [];
    var dcbountLabel: any = {};
    dcbountLabel.attributes = { x: "185", y: "142", width: "25", height: "14" };
    dcbountLabel.type = "element";
    dcbountLabel.name = "dc:Bounds";
    dcbountLabel.elements = [];
    bountLabel.elements.push(dcbountLabel);
    subTask1.elements.push(bountLabel);
    bpmFlow1.elements.push(subTask1);
    this.bpmModel.elements[0].elements[1].elements.push(bpmFlow1);
  }

  addBpmDiagramForMailEvent() {
    var bpmFlow1 = this.bpmModel.elements[0].elements[1].elements[0];
    var activityTask1: any = {};
    activityTask1.attributes = { id: '_BPMNShape_' + Guid.create(), bpmnElement: this.activityTaskId };
    activityTask1.type = "element";
    activityTask1.name = "bpmndi:BPMNShape";
    activityTask1.elements = [];
    var dcbountLabel: any = {};
    dcbountLabel.attributes = { x: "270", y: "77", width: "100", height: "80" };
    dcbountLabel.type = "element";
    dcbountLabel.name = "dc:Bounds";
    dcbountLabel.elements = [];
    activityTask1.elements.push(dcbountLabel);
    bpmFlow1.elements.push(activityTask1);
    this.bpmModel.elements[0].elements[1].elements[0] = bpmFlow1;
  }

  addBpmDiagramForIncomingAndOutgoingFlows() {
    var bpmFlow1 = this.bpmModel.elements[0].elements[1].elements[0];

    //For incoming event
    var incomingTask1: any = {};
    incomingTask1.attributes = { id: '_BPMNEdge_' + this.startEventSeqFlowId, bpmnElement: this.startEventSeqFlowId };
    incomingTask1.type = "element";
    incomingTask1.name = "bpmndi:BPMNEdge";
    incomingTask1.elements = [];

    var dcbountLabel: any = {};
    dcbountLabel.attributes = { x: "215", y: "117" };
    dcbountLabel.type = "element";
    dcbountLabel.name = "di:waypoint";
    dcbountLabel.elements = [];

    var dcbountLabel1: any = {};
    dcbountLabel1.attributes = { x: "270", y: "117" };
    dcbountLabel1.type = "element";
    dcbountLabel1.name = "di:waypoint";
    dcbountLabel1.elements = [];

    incomingTask1.elements.push(dcbountLabel);
    incomingTask1.elements.push(dcbountLabel1);
    bpmFlow1.elements.push(incomingTask1);

    //For outgoing event
    var outgoingTask1: any = {};
    outgoingTask1.attributes = { id: '_BPMNEdge' + this.endEventSeqFlowId, bpmnElement: this.endEventSeqFlowId };
    outgoingTask1.type = "element";
    outgoingTask1.name = "bpmndi:BPMNEdge";
    outgoingTask1.elements = [];

    var dcbountLabel: any = {};
    dcbountLabel.attributes = { x: "370", y: "117" };
    dcbountLabel.type = "element";
    dcbountLabel.name = "di:waypoint";
    dcbountLabel.elements = [];

    var dcbountLabel1: any = {};
    dcbountLabel1.attributes = { x: "432", y: "117" };
    dcbountLabel1.type = "element";
    dcbountLabel1.name = "di:waypoint";
    dcbountLabel1.elements = [];

    outgoingTask1.elements.push(dcbountLabel);
    outgoingTask1.elements.push(dcbountLabel1);
    bpmFlow1.elements.push(outgoingTask1);

    this.bpmModel.elements[0].elements[1].elements[0] = bpmFlow1;
  }

  async createBpmModel() {
    this.createOutlineModel();
    this.bpmModel.elements[0].elements = [];
    var el = new BpmElements();
    // this.processIdName = Guid.create().toString();
    // this.processIdName = this.workFlowName + Guid.create().toString();
    var name = this.workflowForm.get("workflowName").value;
    var id = name.replace(/\s+/g, '');
    this.workflowXmlId = id;
    el.attributes = { id: id, name: name, isExecutable: true, 'camunda:historyTimeToLive': "180" }
    el.type = "element";
    el.name = "bpmn:process";
    this.bpmModel.elements[0].elements.push(el);
    this.bpmModel.elements[0].elements[0].elements = [];
    this.recursiveTaskList(this.items);
    this.traverseXml();
    console.log('bpmModel', this.bpmModel);
    this.workFlowXml = `<?xml version="1.0" encoding="UTF-8"?>` + convert.js2xml(this.bpmModel, { compact: false, spaces: 4 });
    console.log('xml', this.workFlowXml);
    //this.upsertWorkFlowTrigger();
  }


  addBpmDiagramForEndEvent() {
    var bpmFlow1 = this.bpmModel.elements[0].elements[1].elements[0];

    //For End Event

    var subTask2: any = {};
    subTask2.attributes = { id: '_BPMNShape_' + this.endEventId, bpmnElement: this.endEventId };
    subTask2.type = "element";
    subTask2.name = "bpmndi:BPMNShape";
    subTask2.elements = [];

    var endEvent: any = {};
    endEvent.attributes = { x: "432", y: "99", width: "36", height: "36" };
    endEvent.type = "element";
    endEvent.name = "dc:Bounds";
    endEvent.elements = [];
    subTask2.elements.push(endEvent);
    var bountLabel: any = {};
    bountLabel.attributes = { id: '_BPMNShape' };
    bountLabel.type = "element";
    bountLabel.name = "bpmndi:BPMNLabel";
    bountLabel.elements = [];
    var bountLabel: any = {};
    bountLabel.attributes = { id: '_BPMNLabel' };
    bountLabel.type = "element";
    bountLabel.name = "bpmndi:BPMNLabel";
    bountLabel.elements = [];
    var dcbountLabel: any = {};
    dcbountLabel.attributes = { x: "441", y: "142", width: "20", height: "14" };
    dcbountLabel.type = "element";
    dcbountLabel.name = "dc:Bounds";
    dcbountLabel.elements = [];
    bountLabel.elements.push(dcbountLabel);
    subTask2.elements.push(bountLabel);
    bpmFlow1.elements.push(subTask2);
    this.bpmModel.elements[0].elements[1].elements[0] = bpmFlow1;
  }


  recursiveTaskList(items) {
    for (var i in items) {
      switch (items[i].type) {
        case TaskType.StartEvent:
          this.addStartStep(items[i]);
          //this.addBpmDiagramForStartEvent();
          break;
        case TaskType.MailTask:
          this.addMailStep(items[i]);
          //this.addBpmDiagramForMailEvent();
          break;
        case TaskType.FieldUpdateTask:
          this.addFieldUpdateStep(items[i]);
          break;
        case TaskType.CheckListTask:
          this.addCheckListStep(items[i]);
          break;
        case TaskType.UserTask:
          this.addUserTaskForApproval(items[i]);
          break;
        case TaskType.ServiceTask:
          this.addServiceTask(items[i]);
          break;
        case TaskType.ScriptTask:
          this.addScriptTask(items[i]);
          break;
        case TaskType.SendTask:
          this.addSendTask(items[i]);
          break;
        case TaskType.ReceiveTask:
          this.addReceiveTask(items[i]);
          break;
        case TaskType.XorGateWay:
          this.addXorGateWay(items[i]);
          break;
        case TaskType.AndGateWay:
          this.addAndGateWay(items[i]);
          break;
        case TaskType.messageEvent:
          // if(items[i].messageEventType == MessageEventType.MessageIntermediateCatchingEvent || items[i].messageEventType == MessageEventType.MessageEndEvent) {
          //   
          // }
          this.addMessageEvent(items[i]);
          break;
        case TaskType.SignalEvent:
          this.addSignalEvent(items[i]);
          break;
        case TaskType.TimerEvent:
          this.addTimerEvent(items[i]);
          break;
        case TaskType.EscalationEvent:
          this.addEscalationEvent(items[i]);
          break;
        case TaskType.ErrorEvent:
          this.addErrorEvent(items[i]);
          break;
        case TaskType.EventGateWay:
          this.addEventGateWay(items[i]);
          break;
        case TaskType.TerminationEvent:
          this.addTerminationStep(items[i]);
          break;
        case TaskType.EndEvent:
          this.addEndStep(items[i]);
          //this.addBpmDiagramForEndEvent();
          //this.addBpmDiagramForIncomingAndOutgoingFlows();
          break;
        case TaskType.RecordInsertion:
          this.addNewRecordInsertion(items[i]);
          break;
        case TaskType.NotificationAlert:
          this.addNotificationAlert(items[i]);
          break;
      }
      if (items[i].children && items[i].children.length > 0) {
        this.recursiveTaskList(items[i].children);
      }
    };
  }
  createOutlineModel() {
    this.bpmModel = new BpmMainModel();
    this.bpmModel.declarations = { attributes: { version: '1.0', encoding: 'UTF-8' } };
    this.bpmModel.elements = [];
    var el = new BpmElements();
    el.type = 'element';
    el.name = 'bpmn:definitions';
    el.attributes = {
      'xmlns:bpmn': "http://www.omg.org/spec/BPMN/20100524/MODEL",
      'xmlns:bpmndi': "http://www.omg.org/spec/BPMN/20100524/DI",
      'xmlns:dc': "http://www.omg.org/spec/DD/20100524/DC",
      'xmlns:di': "http://www.omg.org/spec/DD/20100524/DI",
      'xmlns:camunda': "http://camunda.org/schema/1.0/bpmn",
      'xmlns:modeler': "http://camunda.org/schema/modeler/1.0",
      'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
      id: "Definitions_1",
      targetNamespace: "http://bpmn.io/schema/bpmn",
      exporter: "Camunda Modeler",
      exporterVersion: "5.16.0",
      'modeler:executionPlatform': "Camunda Platform",
      'modeler:executionPlatformVersion': "7.20.0"
    }
    this.bpmModel.elements.push(el);
  }
  triggerEmail() {
  }
  cancelworkflow() {
    this.currentDialog.close();
  }
  GetAllTimeZones() {
    this.workflowService
      .getAllTimezone(this.timeZone)
      .subscribe((responseData: any) => {
        this.timezoneDropDown = responseData.data;
        var editWorkflowDetails = this.matData.editWorkflowDetails;
        if (this.isEdit && editWorkflowDetails && editWorkflowDetails.dataSourceId) {
          this.getWorkflowById(editWorkflowDetails.dataSourceId, editWorkflowDetails.id);
        }
      });

  }
  GetAllForms() {
    // if (this.companyModuleId) {
    var searchModel: any = {};
    searchModel.companyModuleId = this.companyModuleId;
    this.workflowService.getDataServiceGenericForms(searchModel).subscribe((response: any) => {
      this.formsDropDown = response.data;
      this.cdRef.detectChanges();
    })
  }

  getAllFormsIncluded() {
    var searchModel: any = {};
    searchModel.companyModuleId = this.companyModuleId;
    searchModel.isIncludedAllForms = true;
    this.workflowService.getDataServiceGenericForms(searchModel).subscribe((response: any) => {
      this.forms = response.data;
      this.cdRef.detectChanges();
    })

  }
  addItem(index): void {
    this.criteriaSteps = this.workflowForm.get('criteriaSteps') as FormArray;
    this.criteriaSteps.insert(index + 1, this.createcriteriaItem());
    this.addNewTestCaseStep();
  }
  addNewTestCaseStep() { }

  createcriteriaItem(): FormGroup {
    return this.formBuilder.group({
      criteriaName: new FormControl('', Validators.compose([Validators.required])),
      criteriaCondition: new FormControl('', Validators.compose([Validators.required])),
      criteriaValue: new FormControl('', Validators.compose([]))
    });
  }
  getCriteriaControls() {
    return (this.workflowForm.get('criteriaSteps') as FormArray).controls;
  }
  getControlsLength() {
    this.addItem((this.workflowForm.get('criteriaSteps') as FormArray).length - 1);
  }
  validateStepsLength() {
    let length = (this.workflowForm.get('criteriaSteps') as FormArray).length;
    if (length == 0)
      return true;
    else
      return false;
  }
  removeItem(index) {
    (this.workflowForm.get("criteriaSteps") as FormArray).removeAt(index);
    this.addNewTestCaseStep();
  }

  getSelectedFields(event: MatSelectChange) {
    this.selectedForm = event.source.triggerValue
    console.log(this.selectedForm);

    this.cdRef.detectChanges();
    let workflowModel = new WorkflowModel();
    workflowModel = this.workflowForm.value;
    workflowModel.id = this.workflowForm.get("formtypeName").value;

    this.workflowService
      .getAllFormFields(workflowModel)
      .subscribe((responseData: any) => {
        this.formFieldsDropDown = responseData.data;
        this.formFieldsDateDropDown = responseData.data.filter(d => d.dataType == "datetime");
      });
  }
  getAllFormFieldsById(formTypeId, formName) {
    let workflowModel: any = {};
    workflowModel.id = formTypeId;
    workflowModel.formName = formName;
    workflowModel.isPagingRequired = false;
    this.workflowService
      .getAllFormFields(workflowModel)
      .subscribe((responseData: any) => {
        this.formFieldsDropDown = responseData.data;
        this.formFieldsDateDropDown = responseData.data.filter(d => d.dataType == "datetime");
      });
  }

  addCustomFunctions() {
    const dialogRef = this.dialog.open(addCustomFunctionsComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: { name: this.selectedForm, formId: this.workflowForm.get("formtypeName").value }
    });
  }

  upsertWorkFlowTrigger() {
    var model = new WorkFlowTriggerModel();
    model.isArchived = false;
    model.workFlowTypeId = 'ab71a18f-4a69-4bc5-88ae-7598bf3ab695';
    model.workflowXml = this.workFlowXml;
    model.workflowName = this.processIdName;
    this.workflowService
      .upsertWorkflowTrigger(model)
      .subscribe((responseData: any) => {
      });
  }
  traverseXml() {
    this.createRecursiveXml(this.items);
  }
  createRecursiveXml(items) {
    for (var i in items) {
      switch (items[i].type) {
        case TaskType.StartEvent:
          this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
          break;
        case TaskType.EscalationEvent:
          switch (parseInt(items[i].escalationEventType)) {
            case EscalationEventType.EscalationEndEvent:
              if (items[+i - 1].type == TaskType.ScriptTask) {
                this.createSequenceStep(items[+i - 1].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
              }
              else if (items[+i - 1].type != TaskType.EndEvent) {
                this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
                this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, items[+i - 1].task.value.attributes.id, items[i].task.value.attributes.id);
              }
              break;
          }
          break;
        case TaskType.messageEvent:
          switch (parseInt(items[i].messageEventType)) {
            case MessageEventType.MessageStartEvent:
              this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
              break;
          }
          break;
        case TaskType.SignalEvent:
          switch (parseInt(items[i].signalEventType)) {
            case SignalEventType.SignalStartEvent:
              this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
              break;
          }
          break;
        case TaskType.TimerEvent:
          switch (parseInt(items[i].timerEventType)) {
            case TimerEventType.TimerStartEvent:
              this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
              break;
          }

          break;
        case TaskType.UserTask:
        case TaskType.ServiceTask:
        case TaskType.MailTask:
        case TaskType.FieldUpdateTask:
        case TaskType.RecordInsertion:
        case TaskType.NotificationAlert:
        case TaskType.CheckListTask:
        case TaskType.ScriptTask:
        case TaskType.SendTask:
        case TaskType.ReceiveTask:
          if (items[+i - 1].type == TaskType.StartEvent) {
            this.createSequenceStep(items[+i - 1].task.value.elements[0].elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
          } else if ((items[+i - 1].type == TaskType.EscalationEvent || items[+i - 1].type == TaskType.ErrorEvent || items[+i - 1].type == TaskType.SignalEvent || items[+i - 1].type == TaskType.messageEvent || items[+i - 1].type == TaskType.ReceiveTask || items[+i - 1].type == TaskType.SendTask || items[+i - 1].type == TaskType.ScriptTask || items[+i - 1].type == TaskType.MailTask || items[+i - 1].type == TaskType.CheckListTask || items[+i - 1].type == TaskType.FieldUpdateTask || items[+i - 1].type == TaskType.ServiceTask || items[+i - 1].type == TaskType.UserTask || items[+i - 1].type == TaskType.RecordInsertion || items[+i - 1].type == TaskType.NotificationAlert) && items[+i - 2].type != TaskType.XorGateWay) {
            this.createSequenceStep(items[+i - 1].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
          }
          var val = this.addInOutStepsForServiceTask(items[i], i, items, 0, false);
          if (items[i].type == TaskType.ReceiveTask) {
            var messageRef = 'Message_' + Guid.create().toString();
            items[i].task.value.attributes['messageRef'] = messageRef;
            var el: any = {};
            el.attributes = { id: messageRef, name: items[i].messageName };
            el.type = "element";
            el.name = "bpmn:message";
            this.bpmModel.elements[0].elements.push(el);
          }
          this.bpmModel.elements[0].elements[0].elements.push(val);
          break;
        case TaskType.EventGateWay:
          if (items[+i - 1].type == TaskType.StartEvent) {
            this.createSequenceStep(items[+i - 1].task.value.elements[0].elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
          } else if (items[+i - 1].type == TaskType.EscalationEvent || items[+i - 1].type == TaskType.SignalEvent || items[+i - 1].type == TaskType.ErrorEvent || items[+i - 1].type == TaskType.messageEvent || items[+i - 1].type == TaskType.ReceiveTask || items[+i - 1].type == TaskType.SendTask || items[+i - 1].type == TaskType.ScriptTask || items[+i - 1].type == TaskType.MailTask || items[+i - 1].type == TaskType.FieldUpdateTask || items[+i - 1].type == TaskType.CheckListTask || items[+i - 1].type == TaskType.ServiceTask || items[+i - 1].type == TaskType.UserTask || items[+i - 1].type == TaskType.RecordInsertion || items[+i - 1].type == TaskType.NotificationAlert) {
            this.createSequenceStep(items[+i - 1].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
          }
          val = this.addInAndOutFlowsForEventGateWay(items[+i].task.value, i, items, 0, false);
          this.bpmModel.elements[0].elements[0].elements.push(val);
          break;
        case TaskType.XorGateWay:
          if (items[i].orGateWayType == 'Fork') {
            if (items[+i - 1].type == TaskType.StartEvent) {
              this.createSequenceStep(items[+i - 1].task.value.elements[0].elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
            } else if (items[+i - 1].type == TaskType.ReceiveTask || items[+i - 1].type == TaskType.SendTask || items[+i - 1].type == TaskType.ScriptTask || items[+i - 1].type == TaskType.MailTask || items[+i - 1].type == TaskType.FieldUpdateTask || items[+i - 1].type == TaskType.CheckListTask || items[+i - 1].type == TaskType.ServiceTask || items[+i - 1].type == TaskType.UserTask || items[+i - 1].type == TaskType.RecordInsertion || items[+i - 1].type == TaskType.NotificationAlert) {
              this.createSequenceStep(items[+i - 1].task.value.elements[items[+i - 1].task.value.elements.length - 1].elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
            }
            val = this.addInAndOutFlowsForGateWay(items[+i].task.value, i, items, 0, false);
            this.bpmModel.elements[0].elements[0].elements.push(val);
          }
          else {
            val = this.createSequenceStepForParallelJoinGateWay(items, i);
            this.bpmModel.elements[0].elements[0].elements.push(val);
          }
          break;
        case TaskType.AndGateWay:
          if (items[+i - 1].type == TaskType.StartEvent) {
            this.createSequenceStep(items[+i - 1].task.value.elements[0].elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
          } else if (items[+i - 1].type == TaskType.ReceiveTask || items[+i - 1].type == TaskType.SendTask || items[+i - 1].type == TaskType.ScriptTask || items[+i - 1].type == TaskType.MailTask || items[+i - 1].type == TaskType.FieldUpdateTask || items[+i - 1].type == TaskType.CheckListTask || items[+i - 1].type == TaskType.ServiceTask || items[+i - 1].type == TaskType.UserTask || items[+i - 1].type == TaskType.RecordInsertion || items[+i - 1].type == TaskType.NotificationAlert) {
            this.createSequenceStep(items[+i - 1].task.value.elements[items[+i - 1].task.value.elements.length - 1].elements[0].text, items[+i - 1].task.value.attributes.id, items[+i].task.value.attributes.id);
          }
          val = this.addInAndOutFlowsForAndGateWay(items[+i].task.value, i, items, 0, false);
          this.bpmModel.elements[0].elements[0].elements.push(val);
          break;
        case TaskType.EndEvent:
          if (items[+i - 1].type != TaskType.EndEvent) {
            this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
            this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, items[+i - 1].task.value.attributes.id, items[i].task.value.attributes.id);
          } else {
            this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
            this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, items[+i - 2].task.value.attributes.id, items[i].task.value.attributes.id);
          }
          break;
      }
      if (items[i].children && items[i].children.length > 0) {
        this.childRecursiveXml(items, i, items[i].children);
      }
    };
  }
  childRecursiveXml(pis, pix, items) {
    for (var i in items) {
      switch (items[i].type) {
        case TaskType.StartEvent:
          this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
          break;
        case TaskType.messageEvent:
          switch (parseInt(items[i].messageEventType)) {
            case MessageEventType.MessageStartEvent:
              this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
              break;
            case MessageEventType.MessageIntermediateCatchingEvent:
            case MessageEventType.MessageIntermediateThrowingEvent:
              if (pis[+pix].type != TaskType.EventGateWay) {
                ///
                var hu = this.addEventHelperUserTask(items[i], i);
                if (pis[+pix].type == TaskType.StartEvent) {
                  this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                }
                else if (pis[+pix].type != TaskType.EventGateWay) {
                  if (((pis[+pix].type == TaskType.EscalationEvent) ||
                    pis[+pix].type == TaskType.TimerEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) && items[+i - 2]?.type != TaskType.XorGateWay) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                  }
                  else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, hu.task.value.attributes.id);
                  } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, hu.task.value.attributes.id);
                  } else if (pis[+pix].type == TaskType.ScriptTask) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                  }
                }
                var val = this.addInOutStepsForServiceTask(hu, i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(val);
                ///
                // if (pis[+pix].type == TaskType.StartEvent) {
                //   this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                // }
                // else if (pis[+pix].type != TaskType.EventGateWay) {
                // if ((pis[+pix].type == TaskType.EscalationEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.SignalEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask) && items[+i - 2]?.type != TaskType.XorGateWay) {
                this.createSequenceStep(hu.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, hu.task.value.attributes.id, items[+i].task.value.attributes.id);
                //}
                // else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
                //   var el = this.getLastElementForJoin(pis[+pix]);
                //   this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                // } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
                //   var el = this.getLastElementForJoin(pis[+pix]);
                //   this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                // } else if (pis[+pix].type == TaskType.ScriptTask) {
                //   this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                // }
                // }
                var hus = [];
                hus.push(hu);
                var vall = this.addInOutStepsForServiceTask(items[i], i, hus, 0, true);
                this.bpmModel.elements[0].elements[0].elements.push(vall);
              }
              else {
                if (pis[+pix].type == TaskType.StartEvent) {
                  this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                }
                else if (pis[+pix].type != TaskType.EventGateWay) {
                  if ((pis[+pix].type == TaskType.EscalationEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.SignalEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) && items[+i - 2]?.type != TaskType.XorGateWay) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                  }
                  else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                  } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                  } else if (pis[+pix].type == TaskType.ScriptTask) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                  }
                }
                var val = this.addInOutStepsForServiceTask(items[i], i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(val);
              }
              break;
            case MessageEventType.MessageInterruptedBoundaryEvent:
            case MessageEventType.MessageNonInterruptedBoundaryEvent:
              var cs = this.tempItems.find(x => x.name == items[i].taskName);
              if (cs.type == TaskType.ScriptTask || cs.type == TaskType.ReceiveTask || cs.type == TaskType.SendTask || cs.type == TaskType.MailTask || cs.type == TaskType.FieldUpdateTask || cs.type == TaskType.CheckListTask || cs.type == TaskType.ServiceTask || cs.type == TaskType.UserTask || cs.type == TaskType.RecordInsertion || cs.type == TaskType.NotificationAlert) {
                items[i].task.value.attributes.attachedToRef = pis[+pix].task.value.attributes.id;
                var ms = this.addOutStepsMessageBoundaryEvent(items[i], i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(ms);
              }
              break;
            case MessageEventType.MessageEndEvent:
              if (pis[+pix].type != TaskType.EventGateWay) {
                var hu = this.addEventHelperUserTask(items[i], i);
                if (pis[+pix].type == TaskType.StartEvent) {
                  this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                }
                else if (pis[+pix].type != TaskType.EventGateWay) {
                  if (((pis[+pix].type == TaskType.EscalationEvent) ||
                    pis[+pix].type == TaskType.TimerEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) && items[+i - 2]?.type != TaskType.XorGateWay) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                  }
                  else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, hu.task.value.attributes.id);
                  } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, hu.task.value.attributes.id);
                  } else if (pis[+pix].type == TaskType.ScriptTask) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                  }
                }
                var val = this.addInOutStepsForServiceTask(hu, i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(val);
                items[+i].task.value.elements[0].elements[0].text = hu.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text;
                if (pis[+pix].type == TaskType.ScriptTask) {
                  this.createSequenceStep(hu.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, hu.task.value.attributes.id, items[+i].task.value.attributes.id);
                  //this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                }
                else if (pis[+pix].type != TaskType.EndEvent) {
                  this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
                  //this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[i].task.value.attributes.id);
                  this.createSequenceStep(hu.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, hu.task.value.attributes.id, items[+i].task.value.attributes.id);
                }
              } else {
                if (pis[+pix].type == TaskType.ScriptTask) {
                  this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                }
                else if (pis[+pix].type != TaskType.EndEvent) {
                  this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
                  this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[i].task.value.attributes.id);
                }
              }
              break;
          }
          break;
        case TaskType.SignalEvent:
          switch (parseInt(items[i].signalEventType)) {
            case SignalEventType.SignalStartEvent:
              this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
              break;
            case SignalEventType.SignalIntermediateCatchingEvent:
            case SignalEventType.SignalIntermediateThrowingEvent:
              if (pis[+pix].type != TaskType.EventGateWay) {
                ///
                var hu = this.addEventHelperUserTask(items[i], i);
                if (pis[+pix].type == TaskType.StartEvent) {
                  this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                }
                else if (pis[+pix].type != TaskType.EventGateWay) {
                  if (((pis[+pix].type == TaskType.EscalationEvent) ||
                    pis[+pix].type == TaskType.TimerEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) && items[+i - 2]?.type != TaskType.XorGateWay) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                  }
                  else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, hu.task.value.attributes.id);
                  } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, hu.task.value.attributes.id);
                  } else if (pis[+pix].type == TaskType.ScriptTask) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, hu.task.value.attributes.id);
                  }
                }
                var val = this.addInOutStepsForServiceTask(hu, i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(val);
                this.createSequenceStep(hu.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, hu.task.value.attributes.id, items[+i].task.value.attributes.id);
                var hus = [];
                hus.push(hu);
                var vall = this.addInOutStepsForServiceTask(items[i], i, hus, 0, true);
                this.bpmModel.elements[0].elements[0].elements.push(vall);
              } else {
                if (pis[+pix].type == TaskType.StartEvent) {
                  this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                }
                else if (pis[+pix].type != TaskType.EventGateWay) {
                  if ((pis[+pix].type == TaskType.EscalationEvent || pis[+pix].type == TaskType.SignalEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) && items[+i - 2]?.type != TaskType.XorGateWay) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                  }
                  else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                  } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
                    var el = this.getLastElementForJoin(pis[+pix]);
                    this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                  } else if (pis[+pix].type == TaskType.ScriptTask) {
                    this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                  }
                }
                var val = this.addInOutStepsForServiceTask(items[i], i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(val);
              }
              break;
            case SignalEventType.SignalInterruptedBoundaryEvent:
            case SignalEventType.SignalNonInterruptedBoundaryEvent:
              var cs = this.tempItems.find(x => x.name == items[i].taskName);
              if (cs.type == TaskType.ScriptTask || cs.type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SignalEvent || pis[+pix].type == TaskType.ErrorEvent || cs.type == TaskType.MailTask || cs.type == TaskType.FieldUpdateTask || cs.type == TaskType.CheckListTask || cs.type == TaskType.ServiceTask || cs.type == TaskType.UserTask) {
                items[i].task.value.attributes.attachedToRef = pis[+pix].task.value.attributes.id;
                var ms = this.addOutStepsSignalBoundaryEvent(items[i], i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(ms);
              }
              break;
            case SignalEventType.SignalEndEvent:
              if (pis[+pix].type == TaskType.ScriptTask) {
                this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
              }
              else if (pis[+pix].type != TaskType.EndEvent) {
                this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
                this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[i].task.value.attributes.id);
              }
              break;
          }
          break;
        case TaskType.TimerEvent:
          switch (parseInt(items[i].timerEventType)) {
            case TimerEventType.TimerStartEvent:
              this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
              break;
            case TimerEventType.TimerIntermediateCatchingEvent:
              if (pis[+pix].type == TaskType.StartEvent) {
                this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
              }
              else if (pis[+pix].type != TaskType.EventGateWay) {
                if ((pis[+pix].type == TaskType.EscalationEvent || pis[+pix].type == TaskType.SignalEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.TimerEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) && items[+i - 2]?.type != TaskType.XorGateWay) {
                  this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                }
                else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
                  var el = this.getLastElementForJoin(pis[+pix]);
                  this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
                  var el = this.getLastElementForJoin(pis[+pix]);
                  this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                } else if (pis[+pix].type == TaskType.ScriptTask) {
                  this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                }
              }
              var val = this.addInOutStepsForServiceTask(items[i], i, pis, pix, true);
              this.bpmModel.elements[0].elements[0].elements.push(val);
              break;
            case TimerEventType.TimerInterruptedBoundaryEvent:
            case TimerEventType.TimerNonInterruptedBoundaryEvent:
              var cs = this.tempItems.find(x => x.name == items[i].taskName);
              if (cs.type == TaskType.ScriptTask || cs.type == TaskType.ReceiveTask || cs.type == TaskType.SendTask || cs.type == TaskType.MailTask || cs.type == TaskType.FieldUpdateTask || cs.type == TaskType.CheckListTask || cs.type == TaskType.ServiceTask || cs.type == TaskType.UserTask) {
                items[i].task.value.attributes.attachedToRef = pis[+pix].task.value.attributes.id;
                var ms = this.addOutStepsMessageBoundaryEvent(items[i], i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(ms);
              }
              break;
          }
          break;
        case TaskType.ErrorEvent:
          switch (parseInt(items[i].errorEventType)) {
            case ErrorEventType.ErrorEndEvent:
              if (pis[+pix].type == TaskType.ScriptTask) {
                this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
              }
              else if (pis[+pix].type != TaskType.EndEvent) {
                this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
                this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[i].task.value.attributes.id);
              }
              break;
            case ErrorEventType.ErrorBoundaryEvent:
              var cs = this.tempItems.find(x => x.name == items[i].taskName);
              if (cs.type == TaskType.ScriptTask || cs.type == TaskType.ReceiveTask || cs.type == TaskType.SendTask || cs.type == TaskType.MailTask || cs.type == TaskType.FieldUpdateTask || cs.type == TaskType.CheckListTask || cs.type == TaskType.ServiceTask || cs.type == TaskType.UserTask) {
                items[i].task.value.attributes.attachedToRef = pis[+pix].task.value.attributes.id;
                var ms = this.addOutStepsMessageBoundaryEvent(items[i], i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(ms);
              }
              break;
          }
          break;
        case TaskType.EscalationEvent:
          switch (parseInt(items[i].escalationEventType)) {
            case EscalationEventType.EscalationEndEvent:
              if (pis[+pix].type == TaskType.ScriptTask) {
                this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
              }
              else if (pis[+pix].type != TaskType.EndEvent) {
                this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
                this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[i].task.value.attributes.id);
              }
              break;
            case EscalationEventType.EscalationInterruptedBoundaryEvent:
            case EscalationEventType.EscalationNonInterruptedBoundaryEvent:
              var cs = this.tempItems.find(x => x.name == items[i].taskName);
              if (cs.type == TaskType.ScriptTask || cs.type == TaskType.ReceiveTask || cs.type == TaskType.SendTask || cs.type == TaskType.MailTask || cs.type == TaskType.FieldUpdateTask || cs.type == TaskType.CheckListTask || cs.type == TaskType.ServiceTask || cs.type == TaskType.UserTask || cs.type == TaskType.RecordInsertion || cs.type == TaskType.NotificationAlert) {
                items[i].task.value.attributes.attachedToRef = pis[+pix].task.value.attributes.id;
                //var ms = this.addOutStepsMessageBoundaryEvent(items[i], i, pis, pix, true);
                this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
              }
              break;
            case EscalationEventType.EscalationIntermediateThrowingEvent:
              if (pis[+pix].type == TaskType.StartEvent) {
                this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
              }
              else if (pis[+pix].type != TaskType.EventGateWay) {
                if ((pis[+pix].type == TaskType.EscalationEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) && items[+i - 2]?.type != TaskType.XorGateWay) {
                  this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                }
                else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
                  var el = this.getLastElementForJoin(pis[+pix]);
                  this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
                  var el = this.getLastElementForJoin(pis[+pix]);
                  this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
                } else if (pis[+pix].type == TaskType.ScriptTask) {
                  this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
                }
              }
              this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
              break;
          }
          break;
        case TaskType.TerminationEvent:
          if (pis[+pix].type == TaskType.ScriptTask) {
            this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
          }
          else if (pis[+pix].type != TaskType.EndEvent) {
            this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
            this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[i].task.value.attributes.id);
          }
          break;
        case TaskType.UserTask:
        case TaskType.ServiceTask:
        case TaskType.MailTask:
        case TaskType.RecordInsertion:
        case TaskType.NotificationAlert:
        case TaskType.FieldUpdateTask:
        case TaskType.CheckListTask:
        case TaskType.ScriptTask:
        case TaskType.SendTask:
        case TaskType.ReceiveTask:
        case TaskType.EventHelperUserTask:
          if (pis[+pix].type == TaskType.StartEvent) {
            this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
          }
          else if (pis[+pix].type != TaskType.EventGateWay) {
            if (((pis[+pix].type == TaskType.EscalationEvent) || (pis[+pix].type == TaskType.SignalEvent) ||
              pis[+pix].type == TaskType.TimerEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.NotificationAlert) && items[+i - 2]?.type != TaskType.XorGateWay) {
              this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
            }
            else if ((pis[+pix].type == TaskType.AndGateWay && pis[+pix].andGateWayType == 'Join')) {
              var el = this.getLastElementForJoin(pis[+pix]);
              this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
            } else if ((pis[+pix].type == TaskType.XorGateWay && pis[+pix].orGateWayType == 'Join')) {
              var el = this.getLastElementForJoin(pis[+pix]);
              this.createSequenceStep(el.task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, el.task.value.attributes.id, items[+i].task.value.attributes.id);
            } else if (pis[+pix].type == TaskType.ScriptTask) {
              this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
            }
          }
          var val = this.addInOutStepsForServiceTask(items[i], i, pis, pix, true);
          if (items[i].type == TaskType.ReceiveTask) {
            var messageRef = 'Message_' + Guid.create().toString();
            items[i].task.value.attributes['messageRef'] = messageRef;
            var el: any = {};
            el.attributes = { id: messageRef, name: items[i].messageName };
            el.type = "element";
            el.name = "bpmn:message";
            this.bpmModel.elements[0].elements.push(el);
          }
          this.bpmModel.elements[0].elements[0].elements.push(val);
          break;
        case TaskType.EventGateWay:
          if (pis[+pix].type == TaskType.StartEvent) {
            this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
          } else if (pis[+pix].type == TaskType.EscalationEvent || pis[+pix].type == TaskType.ErrorEvent || pis[+pix].type == TaskType.messageEvent || pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) {
            this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
          } else if (pis[+pix].type == TaskType.ScriptTask) {
            this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
          }
          val = this.addInAndOutFlowsForEventGateWay(items[+i].task.value, i, pis, pix, true);
          this.bpmModel.elements[0].elements[0].elements.push(val);
          break;
        case TaskType.XorGateWay:
          if (items[i].orGateWayType == 'Fork') {
            if (pis[+pix].type == TaskType.StartEvent) {
              this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
            } else if (pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) {
              this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
            } else if (pis[+pix].type == TaskType.ScriptTask) {
              this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
            }
            val = this.addInAndOutFlowsForGateWay(items[+i].task.value, i, pis, pix, true);
            this.bpmModel.elements[0].elements[0].elements.push(val);
          } else {
            val = this.createSequenceStepForParallelJoinGateWay(items, i);
            this.bpmModel.elements[0].elements[0].elements.push(val);
          }
          break;
        case TaskType.AndGateWay:
          if (items[i].andGateWayType == 'Fork') {
            if (pis[+pix].type == TaskType.StartEvent) {
              this.createSequenceStep(pis[+pix].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
            } else if (pis[+pix].type == TaskType.ReceiveTask || pis[+pix].type == TaskType.SendTask || pis[+pix].type == TaskType.MailTask || pis[+pix].type == TaskType.FieldUpdateTask || pis[+pix].type == TaskType.CheckListTask || pis[+pix].type == TaskType.ServiceTask || pis[+pix].type == TaskType.UserTask || pis[+pix].type == TaskType.RecordInsertion || pis[+pix].type == TaskType.NotificationAlert) {
              this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
            } else if (pis[+pix].type == TaskType.ScriptTask) {
              this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
            }
            val = this.addInAndOutFlowsForAndGateWay(items[+i].task.value, i, pis, pix, true);
            this.bpmModel.elements[0].elements[0].elements.push(val);
          } else {
            val = this.createSequenceStepForParallelJoinGateWay(items, i);
            this.bpmModel.elements[0].elements[0].elements.push(val);
          }
          break;
        case TaskType.EndEvent:
          if (pis[+pix].type == TaskType.ScriptTask) {
            this.createSequenceStep(pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text, pis[+pix].task.value.attributes.id, items[+i].task.value.attributes.id);
          }
          else if (pis[+pix].type != TaskType.EndEvent) {
            this.bpmModel.elements[0].elements[0].elements.push(items[i].task.value);
            this.createSequenceStep(items[i].task.value.elements[0].elements[0].text, pis[+pix].task.value.attributes.id, items[i].task.value.attributes.id);
          }
          break;
      }
      if (items[i].children && items[i].children.length > 0) {
        this.childRecursiveXml(items, i, items[i].children);
      }
    };
  }
  getLastElementForJoin(item) {
    if (item.children && item.children.length > 0) {
      this.getLastElementForJoin(item.children);
    }
    return item;
  }
  createSequenceStepForParallelJoinGateWay(items, i) {
    var flows = [];
    var val = items[+i].task.value;
    var cs = this.tempItems.find(x => x.name == val.attributes.name);
    let bpmnModel = this.bpmModel;
    cs.conditionSteps.forEach((el, idx) => {
      var seqFlow: any = {};
      var task = bpmnModel.elements[0].elements[0].elements.find(x => x.attributes?.name == el.taskName);
      if (task) {
        var id = task.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text;
        //var id = 'Flow_' + Guid.create().toString();
        seqFlow.attributes = { id: id, sourceRef: task.attributes.id, targetRef: val.attributes.id };
        seqFlow.type = "element";
        seqFlow.name = "bpmn:sequenceFlow";
        seqFlow.elements = [];
        bpmnModel.elements[0].elements[0].elements.push(seqFlow);
        var incoming = new BpmElements();
        incoming.type = 'element';
        incoming.name = 'bpmn:incoming';
        incoming.elements = [];
        var flow = { type: 'text', text: id };
        incoming.elements.push(flow);
        flows.push(incoming);
      }

    });
    var outgoing = new BpmElements();
    outgoing.type = 'element';
    outgoing.name = 'bpmn:outgoing';
    outgoing.elements = [];
    var flow = { type: 'text', text: items[+i].children[0].type == TaskType.EscalationEvent || items[+i].children[0].type == TaskType.ErrorEvent || items[+i].children[0].type == TaskType.EndEvent || items[+i].children[0].type == TaskType.TerminationEvent ? items[+i].children[0].task.value.elements[0].elements[0].text : 'Flow_' + Guid.create().toString() };
    outgoing.elements.push(flow);
    flows.push(outgoing);
    val.elements.push(...flows);
    this.bpmModel = bpmnModel;
    return val;
  }
  createSequenceStep(id, sourceRef, targetRef) {
    var seqFlow: any = {};
    //this.mailServiceTaskId = 'Task_' + Guid.create().toString();
    seqFlow.attributes = { id: id, sourceRef: sourceRef, targetRef: targetRef };
    seqFlow.type = "element";
    seqFlow.name = "bpmn:sequenceFlow";
    this.bpmModel.elements[0].elements[0].elements.push(seqFlow);
  }
  addInAndOutFlowsForEventGateWay(val, i, pis, pix, fromChild) {
    var flows = [];
    var incoming = new BpmElements();
    incoming.type = 'element';
    incoming.name = 'bpmn:incoming';
    incoming.elements = [];
    var flow = { type: 'text', text: pis[+pix].type == TaskType.StartEvent ? pis[+pix].task.value.elements[0].elements[0].text : pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text };
    incoming.elements.push(flow);
    flows.push(incoming);
    var cs = this.tempItems.find(x => x.name == val.attributes.name);
    cs.conditionSteps.forEach((el, idx) => {
      var seqFlow: any = {};
      var id = 'Flow_' + Guid.create().toString();
      var targetRef = this.taskList.find(x => x.value.attributes.name == el.eventName).value.attributes.id;
      seqFlow.attributes = { id: id, sourceRef: val.attributes.id, targetRef: targetRef };
      seqFlow.type = "element";
      seqFlow.name = "bpmn:sequenceFlow";
      seqFlow.elements = [];
      this.bpmModel.elements[0].elements[0].elements.push(seqFlow);
      var outgoing = new BpmElements();
      outgoing.type = 'element';
      outgoing.name = 'bpmn:outgoing';
      outgoing.elements = [];
      var flow = { type: 'text', text: id };
      outgoing.elements.push(flow);
      flows.push(outgoing);
    });
    val.elements.push(...flows);
    return val;
  }
  addInAndOutFlowsForGateWay(val, i, pis, pix, fromChild) {
    const flows: any[] = [];

    // --- 1. Incoming flow (from previous task or StartEvent) ---
    const incoming = new BpmElements();
    incoming.type = 'element';
    incoming.name = 'bpmn:incoming';
    incoming.elements = [];

    const prevElement = pis[+pix].task.value;
    const prevFlows = prevElement.elements.filter(el => el.name === 'bpmn:outgoing');

    let prevFlowId: string;
    if (prevFlows.length) {
      prevFlowId = prevFlows[prevFlows.length - 1].elements[0].text;
    } else {
      // Create a sequence flow from StartEvent to Gateway
      prevFlowId = 'Flow_' + Guid.create().toString();
      const startSeq: any = {
        type: 'element',
        name: 'bpmn:sequenceFlow',
        attributes: { id: prevFlowId, sourceRef: prevElement.attributes.id, targetRef: val.attributes.id },
        elements: []
      };
      this.bpmModel.elements[0].elements[0].elements.push(startSeq);
    }

    incoming.elements.push({ type: 'text', text: prevFlowId });
    flows.push(incoming);

    // --- 2. Outgoing flows ---
    const cs = this.tempItems.find(x => x.name === val.attributes.name);
    let defaultFlowId = null;

    if (cs?.conditionSteps?.length) {
      cs.conditionSteps.forEach(el => {
        const targetTask = this.taskList.find(x => x.value.attributes.name === el.taskName);
        if (!targetTask) return; // skip if task not found

        const seqFlowId = 'Flow_' + Guid.create().toString();
        const seqFlow: any = {
          type: "element",
          name: "bpmn:sequenceFlow",
          attributes: {
            id: seqFlowId,
            sourceRef: val.attributes.id,
            targetRef: targetTask.value.attributes.id
          },
          elements: [{
            type: "element",
            name: "bpmn:conditionExpression",
            attributes: { "xsi:type": "bpmn:tFormalExpression" },
            elements: [{ type: "text", text: this.getGateWayCondition(el) }]
          }]
        };

        this.bpmModel.elements[0].elements[0].elements.push(seqFlow);

        flows.push({
          type: "element",
          name: "bpmn:outgoing",
          elements: [{ type: "text", text: seqFlowId }]
        });
      });
    }

    // --- 3. Default/else flow ---
    if (cs?.elseCond) {
      const targetTask = this.taskList.find(x => x.value.attributes.name === cs.elseCond);
      if (targetTask) {
        defaultFlowId = 'Flow_' + Guid.create().toString();
        const seqFlow: any = {
          type: "element",
          name: "bpmn:sequenceFlow",
          attributes: {
            id: defaultFlowId,
            sourceRef: val.attributes.id,
            targetRef: targetTask.value.attributes.id
          },
          elements: []
        };
        this.bpmModel.elements[0].elements[0].elements.push(seqFlow);

        flows.push({
          type: "element",
          name: "bpmn:outgoing",
          elements: [{ type: "text", text: defaultFlowId }]
        });

        // mark gateway default
        val.attributes.default = defaultFlowId;
      }
    }

    // --- 4. Attach flows to gateway ---
    // Remove old incoming/outgoing elements first (to avoid duplicates)
    val.elements = val.elements.filter(el => el.name !== 'bpmn:incoming' && el.name !== 'bpmn:outgoing');
    val.elements.push(...flows);

    return val;
  }


  addInAndOutFlowsForAndGateWay(val, i, pis, pix, fromChild) {
    var flows = [];
    var incoming = new BpmElements();
    incoming.type = 'element';
    incoming.name = 'bpmn:incoming';
    incoming.elements = [];
    var flow = { type: 'text', text: pis[+pix].type == TaskType.StartEvent ? pis[+pix].task.value.elements[0].elements[0].text : pis[+pix].task.value.elements[pis[+pix].task.value.elements.length - 1].elements[0].text };
    incoming.elements.push(flow);
    flows.push(incoming);
    var cs = this.tempItems.find(x => x.name == val.attributes.name);
    cs.conditionSteps.forEach((el, idx) => {
      var seqFlow: any = {};
      var id = 'Flow_' + Guid.create().toString();
      var targetRef = this.taskList.find(x => x.value.attributes.name == el.taskName).value.attributes.id;
      seqFlow.attributes = { id: id, sourceRef: val.attributes.id, targetRef: targetRef };
      seqFlow.type = "element";
      seqFlow.name = "bpmn:sequenceFlow";
      seqFlow.elements = [];
      this.bpmModel.elements[0].elements[0].elements.push(seqFlow);
      var outgoing = new BpmElements();
      outgoing.type = 'element';
      outgoing.name = 'bpmn:outgoing';
      outgoing.elements = [];
      var flow = { type: 'text', text: id };
      outgoing.elements.push(flow);
      flows.push(outgoing);
    });
    val.elements.push(...flows);
    return val;
  }
  getGateWayCondition(el) {
    if (el.fieldType == 'textfield') {
      if (el.functionName == 'equals') {
        return '${__' + el.fieldName1 + '__ ="' + el.fieldValue + '"}';
      }
      if (el.functionName == 'notmatches') {
        return '${' + '!' + '__' + el.fieldName1 + '__' + '.equals' + '("' + el.fieldValue + '")' + '}';
      }

      return '${__' + el.fieldName1 + '__.' + el.functionName + '("' + el.fieldValue + '")' + '}';
    } else if (el.fieldType == 'number') {
      return '${__' + el.fieldName1 + '__' + el.functionName + el.fieldValue + '}';
    } else if (el.fieldType == 'datetime') {
      return '${' + 'date:' + el.functionName + '(__' + el.fieldName1 + '__' + ',' + el.fieldValue + ')' + '}';
    }
  }
  addOutStepsMessageBoundaryEvent(val, i, pis, pix, fromChild) {
    var flows = [];
    if (val.children && val.children.length > 0) {
      var outgoing = new BpmElements();
      outgoing.type = 'element';
      outgoing.name = 'bpmn:outgoing';
      outgoing.elements = [];
      var flow = { type: 'text', text: val.children[0].type == TaskType.EscalationEvent || val.children[0].type == TaskType.SignalEvent || val.children[0].type == TaskType.ErrorEvent || val.children[0].type == TaskType.EndEvent || val.children[0].type == TaskType.TerminationEvent ? val.children[0].task.value.elements[0].elements[0].text : 'Flow_' + Guid.create().toString() };
      outgoing.elements.push(flow);
    }
    flows.push(outgoing);
    val.task.value.elements.unshift(...flows);
    return val.task.value;
  }

  addOutStepsSignalBoundaryEvent(val, i, pis, pix, fromChild) {
    var flows = [];
    if (val.children && val.children.length > 0) {
      var outgoing = new BpmElements();
      outgoing.type = 'element';
      outgoing.name = 'bpmn:outgoing';
      outgoing.elements = [];
      var flow = { type: 'text', text: val.children[0].type == TaskType.EscalationEvent || val.children[0].type == TaskType.SignalEvent || val.children[0].type == TaskType.ErrorEvent || val.children[0].type == TaskType.EndEvent || val.children[0].type == TaskType.TerminationEvent ? val.children[0].task.value.elements[0].elements[0].text : 'Flow_' + Guid.create().toString() };
      outgoing.elements.push(flow);
    }
    flows.push(outgoing);
    val.task.value.elements.unshift(...flows);
    return val.task.value;
  }

  addInOutStepsForServiceTask(val, i, pis, pix, fromChild) {
    var flows = [];
    var incoming = new BpmElements();
    incoming.type = 'element';
    incoming.name = 'bpmn:incoming';
    incoming.elements = [];
    if (pis[+pix].type == TaskType.XorGateWay || pis[+pix].type == TaskType.AndGateWay || pis[+pix].type == TaskType.EventGateWay) {
      var id = val.task.value.attributes.id;
      var seqFlow = this.bpmModel.elements[0].elements[0].elements.find(x => x.attributes.targetRef == id);
      var flow = { type: 'text', text: pis[+pix].type == TaskType.StartEvent ? pis[+pix].task.value.elements[0].elements[0].text : seqFlow.attributes.id };
    } else {
      var flow = { type: 'text', text: pis[+pix].type == TaskType.StartEvent ? pis[+pix].task.value.elements[0].elements[0].text : pis[+pix].task.value.elements.find(x => x?.name == 'bpmn:outgoing').elements[0].text };
    }
    incoming.elements.push(flow);
    if (val.children && val.children.length > 0 && val.type != TaskType.EventHelperUserTask) {
      var outgoing = new BpmElements();
      outgoing.type = 'element';
      outgoing.name = 'bpmn:outgoing';
      outgoing.elements = [];
      var flow = { type: 'text', text: (val.children[0].type == TaskType.EscalationEvent && parseInt(val.children[0].escalationEventType) != EscalationEventType.EscalationInterruptedBoundaryEvent && parseInt(val.children[0].escalationEventType) != EscalationEventType.EscalationNonInterruptedBoundaryEvent) || (val.children[0].type == TaskType.SignalEvent && parseInt(val.children[0].signalEventType) != MessageEventType.MessageEndEvent) || (val.children[0].type == TaskType.messageEvent && parseInt(val.children[0].messageEventType) != MessageEventType.MessageEndEvent) || val.children[0].type == TaskType.ErrorEvent || val.children[0].type == TaskType.EndEvent || val.children[0].type == TaskType.TerminationEvent ? val.children[0].task.value.elements[0].elements[0].text : 'Flow_' + Guid.create().toString() };
      outgoing.elements.push(flow);
    } else {
      var outgoing = new BpmElements();
      outgoing.type = 'element';
      outgoing.name = 'bpmn:outgoing';
      outgoing.elements = [];
      var oflow: any = { type: 'text', text: 'Flow_' + Guid.create().toString() };
      outgoing.elements.push(oflow);
    }
    flows.push(incoming);
    flows.push(outgoing);
    if (val.type == TaskType.ScriptTask || val.type == TaskType.EscalationEvent || val.type == TaskType.SignalEvent || val.type == TaskType.messageEvent || val.type == TaskType.ErrorEvent || val.type == TaskType.TimerEvent) {
      val.task.value.elements.unshift(...flows);
    } else {
      val.task.value.elements.push(...flows);
    }
    return val.task.value;
  }
  testWorkflow() {
  }
  addStartStep(item) {
    var el = new BpmElements();
    this.startEventId = 'Start_Event';
    el.attributes = { id: this.startEventId, name: item.name };
    el.type = "element";
    el.name = "bpmn:startEvent";
    el.elements = [];
    var subEl = new BpmElements();
    subEl.name = "bpmn:outgoing";
    subEl.type = "element";
    subEl.elements = [];
    this.startEventSeqFlowId = 'Flow_Start_Sequence';
    var outgoingFlow = { type: 'text', text: this.startEventSeqFlowId }
    subEl.elements.push(outgoingFlow);
    el.elements.push(subEl);
    this.taskList.push({ type: TaskType.StartEvent, value: el });
    item['task'] = { type: TaskType.StartEvent, value: el };
    // this.startEventValue = {};
    // this.startEventValue['type'] = TaskType.StartEvent;
    // this.startEventValue['task'] = { type: TaskType.StartEvent, value: el };
  }
  addTerminationStep(item) {
    var eel = new BpmElements();
    var eId = 'End_Event_' + Guid.create().toString();
    eel.attributes = { id: eId, name: item.name };
    eel.type = "element";
    eel.name = "bpmn:endEvent";
    eel.elements = [];
    var subEl = new BpmElements();
    subEl.name = "bpmn:incoming";
    subEl.type = "element";
    subEl.elements = [];
    var endEventSeqFlowId = 'Flow_EndEvent';
    var inComingFlow = { type: 'text', text: endEventSeqFlowId };
    subEl.elements.push(inComingFlow);
    var me = new BpmElements();
    me.name = 'bpmn:terminateEventDefinition';
    me.type = 'element';
    me.elements = [];
    var meId = 'TerminateEventDefinition' + Guid.create().toString();
    me.attributes = { id: meId };
    eel.elements.push(subEl);
    eel.elements.push(me);
    this.taskList.push({ type: TaskType.TerminationEvent, value: eel });
    item['task'] = { type: TaskType.TerminationEvent, value: eel };
  }
  addErrorEvent(item) {
    switch (parseInt(item.errorEventType)) {
      case ErrorEventType.ErrorEndEvent:
        var eel = new BpmElements();
        var eId = 'End_Event_' + Guid.create().toString();
        eel.attributes = { id: eId, name: item.name };
        eel.type = "element";
        eel.name = "bpmn:endEvent";
        eel.elements = [];
        var subEl = new BpmElements();
        subEl.name = "bpmn:incoming";
        subEl.type = "element";
        subEl.elements = [];
        var endEventSeqFlowId = 'Flow_' + Guid.create().toString();
        var inComingFlow = { type: 'text', text: endEventSeqFlowId };
        subEl.elements.push(inComingFlow);
        var me = new BpmElements();
        me.name = 'bpmn:errorEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'ErrorEventDefinition_' + Guid.create().toString();
        var errorRef = 'Error_' + Guid.create().toString();
        me.attributes = { id: meId, errorRef: errorRef };
        var ell: any = {};
        ell.attributes = { id: errorRef, name: item.errorName, errorCode: item.errorCode };
        ell.type = "element";
        ell.name = "bpmn:error";
        this.bpmModel.elements[0].elements.push(ell);
        eel.elements.push(subEl);
        eel.elements.push(me);
        this.taskList.push({ type: TaskType.ErrorEvent, value: eel });
        item['task'] = { type: TaskType.ErrorEvent, value: eel };
        break;
      case ErrorEventType.ErrorBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:errorEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'ErrorEventDefinition_' + Guid.create().toString();
        var errorRef = 'Error_' + Guid.create().toString();
        me.attributes = { id: meId, errorRef: errorRef };
        var ell: any = {};
        ell.attributes = { id: errorRef, name: item.errorName, errorCode: item.errorCode };
        ell.type = "element";
        ell.name = "bpmn:error";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.ErrorEvent, value: el });
        item['task'] = { type: TaskType.ErrorEvent, value: el };
        break;
    }
  }
  addEscalationEvent(item) {
    switch (parseInt(item.escalationEventType)) {
      case EscalationEventType.EscalationEndEvent:
        var eel = new BpmElements();
        var eId = 'End_Event_' + Guid.create().toString();
        eel.attributes = { id: eId, name: item.name };
        eel.type = "element";
        eel.name = "bpmn:endEvent";
        eel.elements = [];
        var subEl = new BpmElements();
        subEl.name = "bpmn:incoming";
        subEl.type = "element";
        subEl.elements = [];
        var endEventSeqFlowId = 'Flow_' + Guid.create().toString();
        var inComingFlow = { type: 'text', text: endEventSeqFlowId };
        subEl.elements.push(inComingFlow);
        var me = new BpmElements();
        me.name = 'bpmn:escalationEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'EscalationEventDefinition' + Guid.create().toString();
        var escalationRef = 'Escalation_' + Guid.create().toString();
        me.attributes = { id: meId, escalationRef: escalationRef };
        var ell: any = {};
        ell.attributes = { id: escalationRef, name: item.escalationName, escalationCode: item.escalationCode };
        ell.type = "element";
        ell.name = "bpmn:escalation";
        this.bpmModel.elements[0].elements.push(ell);
        eel.elements.push(subEl);
        eel.elements.push(me);
        this.taskList.push({ type: TaskType.EscalationEvent, value: eel });
        item['task'] = { type: TaskType.EscalationEvent, value: eel };
        break;
      case EscalationEventType.EscalationInterruptedBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var outgoing = new BpmElements();
        outgoing.type = 'element';
        outgoing.name = 'bpmn:outgoing';
        outgoing.elements = [];
        var flow = { type: 'text', text: 'Flow_' + Guid.create().toString() };
        outgoing.elements.push(flow);
        el.elements.push(outgoing);
        var me = new BpmElements();
        me.name = 'bpmn:escalationEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'EscalationEventDefinition' + Guid.create().toString();
        var escalationRef = 'Escalation_' + Guid.create().toString();
        me.attributes = { id: meId, escalationRef: escalationRef };
        var ell: any = {};
        ell.attributes = { id: escalationRef, name: item.escalationName, escalationCode: item.escalationCode };
        ell.type = "element";
        ell.name = "bpmn:escalation";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.EscalationEvent, value: el });
        item['task'] = { type: TaskType.EscalationEvent, value: el };
        break;
      case EscalationEventType.EscalationNonInterruptedBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, cancelActivity: "false", attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var outgoing = new BpmElements();
        outgoing.type = 'element';
        outgoing.name = 'bpmn:outgoing';
        outgoing.elements = [];
        var flow = { type: 'text', text: 'Flow_' + Guid.create().toString() };
        outgoing.elements.push(flow);
        el.elements.push(outgoing);
        var me = new BpmElements();
        me.name = 'bpmn:escalationEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'EscalationEventDefinition' + Guid.create().toString();
        var escalationRef = 'Escalation_' + Guid.create().toString();
        me.attributes = { id: meId, escalationRef: escalationRef };
        var ell: any = {};
        ell.attributes = { id: escalationRef, name: item.escalationName, escalationCode: item.escalationCode };
        ell.type = "element";
        ell.name = "bpmn:escalation";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.EscalationEvent, value: el });
        item['task'] = { type: TaskType.EscalationEvent, value: el };
        break;
      case EscalationEventType.EscalationIntermediateThrowingEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:intermediateThrowEvent";
        el.elements = [];
        var incoming = new BpmElements();
        incoming.type = 'element';
        incoming.name = 'bpmn:incoming';
        incoming.elements = [];
        var flow = { type: 'text', text: 'Flow_' + Guid.create().toString() };
        incoming.elements.push(flow);
        el.elements.push(incoming);
        var outgoing = new BpmElements();
        outgoing.type = 'element';
        outgoing.name = 'bpmn:outgoing';
        outgoing.elements = [];
        var flow = { type: 'text', text: 'Flow_' + Guid.create().toString() };
        outgoing.elements.push(flow);
        el.elements.push(outgoing);
        var me = new BpmElements();
        me.name = 'bpmn:escalationEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'EscalationEventDefinition' + Guid.create().toString();
        var eRef = 'Escalation_' + Guid.create().toString();
        me.attributes = { id: meId, escalationRef: eRef };
        var ell: any = {};
        ell.attributes = { id: eRef, name: item.escalationName, escalationCode: item.escalationCode };
        ell.type = "element";
        ell.name = "bpmn:escalation";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.EscalationEvent, value: el });
        item['task'] = { type: TaskType.EscalationEvent, value: el };
        break;
    }
  }
  addTimerEvent(item) {
    switch (parseInt(item.timerEventType)) {
      case TimerEventType.TimerStartEvent:
        var el = new BpmElements();
        this.startEventId = 'Start_Event_' + Guid.create().toString();
        el.attributes = { id: this.startEventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:startEvent";
        el.elements = [];
        var subEl = new BpmElements();
        subEl.name = "bpmn:outgoing";
        subEl.type = "element";
        subEl.elements = [];
        var startEventSeqFlowId = 'Flow_' + Guid.create().toString();
        var outgoingFlow = { type: 'text', text: startEventSeqFlowId }
        subEl.elements.push(outgoingFlow);
        var me = new BpmElements();
        me.name = 'bpmn:timerEventDefinition';
        me.type = 'element';
        me.elements = [];

        var td = new BpmElements();
        if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Date)
          td.name = 'bpmn:timeDate';
        else if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Cycle)
          td.name = 'bpmn:timeCycle';
        else if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Duration)
          td.name = 'bpmn:timeDuration'
        td.attributes = { "xsi:type": "bpmn:tFormalExpression" };
        td.type = 'element';
        td.elements = [];
        var timeDef = { type: 'text', text: item.timeExp }
        td.elements.push(timeDef);
        me.elements.push(td);

        var meId = 'TimerEventDefinition_' + Guid.create().toString();


        el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.TimerEvent, value: el });
        item['task'] = { type: TaskType.TimerEvent, value: el };
        break;
      case TimerEventType.TimerIntermediateCatchingEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:intermediateCatchEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:timerEventDefinition';
        me.attributes = { id: 'TimerEventDefinition_' + Guid.create().toString() };
        me.type = 'element';
        me.elements = [];

        var td = new BpmElements();
        if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Date)
          td.name = 'bpmn:timeDate';
        else if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Cycle)
          td.name = 'bpmn:timeCycle';
        else if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Duration)
          td.name = 'bpmn:timeDuration'
        td.type = 'element';
        td.attributes = { "xsi:type": "bpmn:tFormalExpression" };
        td.elements = [];
        var timeDef = { type: 'text', text: item.timeExp }
        td.elements.push(timeDef);
        me.elements.push(td);
        var meId = 'TimerEventDefinition_' + Guid.create().toString();


        // el.elements.push(subEl);
        el.elements.push(me);
        console.log(me);
        this.taskList.push({ type: TaskType.TimerEvent, value: el });
        item['task'] = { type: TaskType.TimerEvent, value: el };
        break;
      case TimerEventType.TimerInterruptedBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:timerEventDefinition';
        me.type = 'element';
        me.elements = [];

        var td = new BpmElements();
        if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Date)
          td.name = 'bpmn:timeDate';
        else if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Cycle)
          td.name = 'bpmn:timeCycle';
        else if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Duration)
          td.name = 'bpmn:timeDuration'
        td.type = 'element';
        td.attributes = { "xsi:type": "bpmn:tFormalExpression" };
        td.elements = [];
        var timeDef = { type: 'text', text: item.timeExp }
        td.elements.push(timeDef);
        me.elements.push(td);
        var meId = 'TimerEventDefinition_' + Guid.create().toString();

        me.attributes = { id: meId };


        el.elements.push(me);
        this.taskList.push({ type: TaskType.TimerEvent, value: el });
        item['task'] = { type: TaskType.TimerEvent, value: el };
        break;
      case TimerEventType.TimerNonInterruptedBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, cancelActivity: "false", attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:timerEventDefinition';
        me.type = 'element';
        me.elements = [];

        var td = new BpmElements();
        if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Date)
          td.name = 'bpmn:timeDate';
        else if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Cycle)
          td.name = 'bpmn:timeCycle';
        else if (parseInt(item.timerDefinitionType) == TimerDefinitionType.Duration)
          td.name = 'bpmn:timeDuration'
        td.type = 'element';
        td.attributes = { "xsi:type": "bpmn:tFormalExpression" };
        td.elements = [];
        var timeDef = { type: 'text', text: item.timeExp }
        td.elements.push(timeDef);
        me.elements.push(td);

        var meId = 'TimerEventDefinition_' + Guid.create().toString();

        me.attributes = { id: meId };

        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.TimerEvent, value: el });
        item['task'] = { type: TaskType.TimerEvent, value: el };
        break;


    }
  }

  addSignalEvent(item) {
    switch (parseInt(item.signalEventType)) {
      case SignalEventType.SignalStartEvent:
        var el = new BpmElements();
        this.startEventId = 'Start_Event_' + Guid.create().toString();
        el.attributes = { id: this.startEventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:startEvent";
        el.elements = [];
        var subEl = new BpmElements();
        subEl.name = "bpmn:outgoing";
        subEl.type = "element";
        subEl.elements = [];
        var startEventSeqFlowId = 'Flow_' + Guid.create().toString();
        var outgoingFlow = { type: 'text', text: startEventSeqFlowId }
        subEl.elements.push(outgoingFlow);
        var me = new BpmElements();
        me.name = 'bpmn:signalEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'SignalEventDefinition_' + Guid.create().toString();
        var signalRef = 'Signal_' + Guid.create().toString();
        me.attributes = { id: meId, signalRef: signalRef };
        var ell: any = {};
        ell.attributes = { id: signalRef, name: item.signalName };
        ell.type = "element";
        ell.name = "bpmn:signal";
        this.bpmModel.elements[0].elements.push(ell);
        el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.SignalEvent, value: el });
        item['task'] = { type: TaskType.SignalEvent, value: el };
        break;
      case SignalEventType.SignalIntermediateCatchingEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:intermediateCatchEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:signalEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'SignalEventDefinition_' + Guid.create().toString();
        var signalRef = 'Signal_' + Guid.create().toString();
        me.attributes = { id: meId, signalRef: signalRef };
        var ell: any = {};
        ell.attributes = { id: signalRef, name: item.signalName };
        ell.type = "element";
        ell.name = "bpmn:signal";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.SignalEvent, value: el });
        item['task'] = { type: TaskType.SignalEvent, value: el };
        break;
      case SignalEventType.SignalInterruptedBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:signalEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'SignalEventDefinition_' + Guid.create().toString();
        var signalRef = 'Signal_' + Guid.create().toString();
        me.attributes = { id: meId, signalRef: signalRef };
        var ell: any = {};
        ell.attributes = { id: signalRef, name: item.signalName };
        ell.type = "element";
        ell.name = "bpmn:signal";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.SignalEvent, value: el });
        item['task'] = { type: TaskType.SignalEvent, value: el };
        break;
      case SignalEventType.SignalNonInterruptedBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, cancelActivity: "false", attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:signalEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'SignalEventDefinition_' + Guid.create().toString();
        var signalRef = 'Signal_' + Guid.create().toString();
        me.attributes = { id: meId, signalRef: signalRef };
        var ell: any = {};
        ell.attributes = { id: signalRef, name: item.signalName };
        ell.type = "element";
        ell.name = "bpmn:signal";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.SignalEvent, value: el });
        item['task'] = { type: TaskType.SignalEvent, value: el };
        break;
      case SignalEventType.SignalIntermediateThrowingEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:intermediateThrowEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:signalEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'SignalEventDefinition_' + Guid.create().toString();
        var signalRef = 'Signal_' + Guid.create().toString();
        me.attributes = { id: meId, signalRef: signalRef, "camunda:type": "external", "camunda:topic": item.topic };
        var ell: any = {};
        ell.attributes = { id: signalRef, name: item.signalName };
        ell.type = "element";
        ell.name = "bpmn:signal";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.SignalEvent, value: el });
        item['task'] = { type: TaskType.SignalEvent, value: el };
        break;
      case SignalEventType.SignalEndEvent:
        var eel = new BpmElements();
        var eId = 'End_Event_' + Guid.create().toString();
        eel.attributes = { id: eId, name: item.name };
        eel.type = "element";
        eel.name = "bpmn:endEvent";
        eel.elements = [];
        var subEl = new BpmElements();
        subEl.name = "bpmn:incoming";
        subEl.type = "element";
        subEl.elements = [];
        var endEventSeqFlowId = 'Flow_' + Guid.create().toString();
        var inComingFlow = { type: 'text', text: endEventSeqFlowId };
        subEl.elements.push(inComingFlow);
        var me = new BpmElements();
        me.name = 'bpmn:signalEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'SignalEventDefinition_' + Guid.create().toString();
        var signalRef = 'Signal_' + Guid.create().toString();
        me.attributes = { id: meId, signalRef: signalRef, "camunda:type": "external", "camunda:topic": item.topic };
        var ell: any = {};
        ell.attributes = { id: signalRef, name: item.signalName };
        ell.type = "element";
        ell.name = "bpmn:signal";
        this.bpmModel.elements[0].elements.push(ell);
        eel.elements.push(subEl);
        eel.elements.push(me);
        this.taskList.push({ type: TaskType.SignalEvent, value: eel });
        item['task'] = { type: TaskType.SignalEvent, value: eel };
        break;
    }

  }
  addMessageEvent(item) {
    switch (parseInt(item.messageEventType)) {
      case MessageEventType.MessageStartEvent:
        var el = new BpmElements();
        this.startEventId = 'Start_Event_' + Guid.create().toString();
        el.attributes = { id: this.startEventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:startEvent";
        el.elements = [];
        var subEl = new BpmElements();
        subEl.name = "bpmn:outgoing";
        subEl.type = "element";
        subEl.elements = [];
        var startEventSeqFlowId = 'Flow_' + Guid.create().toString();
        var outgoingFlow = { type: 'text', text: startEventSeqFlowId }
        subEl.elements.push(outgoingFlow);
        var me = new BpmElements();
        me.name = 'bpmn:messageEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'MessageEventDefinition_' + Guid.create().toString();
        var messageRef = 'Message_' + Guid.create().toString();
        me.attributes = { id: meId, messageRef: messageRef };
        var ell: any = {};
        ell.attributes = { id: messageRef, name: item.messageName };
        ell.type = "element";
        ell.name = "bpmn:message";
        this.bpmModel.elements[0].elements.push(ell);
        el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.messageEvent, value: el });
        item['task'] = { type: TaskType.messageEvent, value: el };
        break;
      case MessageEventType.MessageIntermediateCatchingEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:intermediateCatchEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:messageEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'MessageEventDefinition_' + Guid.create().toString();
        var messageRef = 'Message_' + Guid.create().toString();
        me.attributes = { id: meId, messageRef: messageRef };
        var ell: any = {};
        ell.attributes = { id: messageRef, name: item.messageName };
        ell.type = "element";
        ell.name = "bpmn:message";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.messageEvent, value: el });
        item['task'] = { type: TaskType.messageEvent, value: el };
        break;
      case MessageEventType.MessageInterruptedBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:messageEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'MessageEventDefinition_' + Guid.create().toString();
        var messageRef = 'Message_' + Guid.create().toString();
        me.attributes = { id: meId, messageRef: messageRef };
        var ell: any = {};
        ell.attributes = { id: messageRef, name: item.messageName };
        ell.type = "element";
        ell.name = "bpmn:message";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.messageEvent, value: el });
        item['task'] = { type: TaskType.messageEvent, value: el };
        break;
      case MessageEventType.MessageNonInterruptedBoundaryEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name, cancelActivity: "false", attachedToRef: '' };
        el.type = "element";
        el.name = "bpmn:boundaryEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:messageEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'MessageEventDefinition_' + Guid.create().toString();
        var messageRef = 'Message_' + Guid.create().toString();
        me.attributes = { id: meId, messageRef: messageRef };
        var ell: any = {};
        ell.attributes = { id: messageRef, name: item.messageName };
        ell.type = "element";
        ell.name = "bpmn:message";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.messageEvent, value: el });
        item['task'] = { type: TaskType.messageEvent, value: el };
        break;
      case MessageEventType.MessageIntermediateThrowingEvent:
        var el = new BpmElements();
        var eventId = 'Event_' + Guid.create().toString();
        el.attributes = { id: eventId, name: item.name };
        el.type = "element";
        el.name = "bpmn:intermediateThrowEvent";
        el.elements = [];
        var me = new BpmElements();
        me.name = 'bpmn:messageEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'MessageEventDefinition_' + Guid.create().toString();
        var messageRef = 'Message_' + Guid.create().toString();
        me.attributes = { id: meId, messageRef: messageRef, "camunda:type": "external", "camunda:topic": item.topic };
        var ell: any = {};
        ell.attributes = { id: messageRef, name: item.messageName };
        ell.type = "element";
        ell.name = "bpmn:message";
        this.bpmModel.elements[0].elements.push(ell);
        // el.elements.push(subEl);
        el.elements.push(me);
        this.taskList.push({ type: TaskType.messageEvent, value: el });
        item['task'] = { type: TaskType.messageEvent, value: el };
        break;
      case MessageEventType.MessageEndEvent:
        var eel = new BpmElements();
        var eId = 'End_Event_' + Guid.create().toString();
        eel.attributes = { id: eId, name: item.name };
        eel.type = "element";
        eel.name = "bpmn:endEvent";
        eel.elements = [];
        var subEl = new BpmElements();
        subEl.name = "bpmn:incoming";
        subEl.type = "element";
        subEl.elements = [];
        var endEventSeqFlowId = 'Flow_' + Guid.create().toString();
        var inComingFlow = { type: 'text', text: endEventSeqFlowId };
        subEl.elements.push(inComingFlow);
        var me = new BpmElements();
        me.name = 'bpmn:messageEventDefinition';
        me.type = 'element';
        me.elements = [];
        var meId = 'MessageEventDefinition_' + Guid.create().toString();
        var messageRef = 'Message_' + Guid.create().toString();
        me.attributes = { id: meId, messageRef: messageRef, "camunda:type": "external", "camunda:topic": item.topic };
        var ell: any = {};
        ell.attributes = { id: messageRef, name: item.messageName };
        ell.type = "element";
        ell.name = "bpmn:message";
        this.bpmModel.elements[0].elements.push(ell);
        eel.elements.push(subEl);
        eel.elements.push(me);
        this.taskList.push({ type: TaskType.messageEvent, value: eel });
        item['task'] = { type: TaskType.messageEvent, value: eel };
        break;
    }
  }
  addEndStep(item) {
    var eel = new BpmElements();
    this.endEventId = 'End_Event';
    eel.attributes = { id: this.endEventId, name: item.name };
    eel.type = "element";
    eel.name = "bpmn:endEvent";
    eel.elements = [];
    var subEl = new BpmElements();
    subEl.name = "bpmn:incoming";
    subEl.type = "element";
    subEl.elements = [];
    this.endEventSeqFlowId = 'Flow_End_Event';
    var inComingFlow = { type: 'text', text: this.endEventSeqFlowId };
    subEl.elements.push(inComingFlow);
    eel.elements.push(subEl);
    this.taskList.push({ type: TaskType.EndEvent, value: eel });
    item['task'] = { type: TaskType.EndEvent, value: eel };
  }
  addDynamicEndStep(item) {

  }
  addFieldUpdateStep(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name, 'camunda:type': 'external', 'camunda:topic': 'fieldupdate_activity' };
    el.type = "element";
    el.name = "bpmn:serviceTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.ServiceTask, value: el });
    item['task'] = { type: TaskType.ServiceTask, value: el };
  }
  addCheckListStep(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name, 'camunda:type': 'external', 'camunda:topic': 'checklist_activity' };
    el.type = "element";
    el.name = "bpmn:serviceTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.ServiceTask, value: el });
    item['task'] = { type: TaskType.ServiceTask, value: el };
  }
  addMailStep(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name, 'camunda:type': 'external', 'camunda:topic': 'mailtemplate-activity' };
    el.type = "element";
    el.name = "bpmn:serviceTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.ServiceTask, value: el });
    item['task'] = { type: TaskType.ServiceTask, value: el };
  }
  addUserTaskForApproval(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name };
    el.type = "element";
    el.name = "bpmn:userTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    //item =
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.UserTask, value: el });
    item['task'] = { type: TaskType.UserTask, value: el };
  }
  addServiceTask(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name, 'camunda:type': 'external', 'camunda:topic': item.topic };
    el.type = "element";
    el.name = "bpmn:serviceTask ";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    //item =
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.ServiceTask, value: el });
    item['task'] = { type: TaskType.ServiceTask, value: el };
  }
  addSendTask(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name, 'camunda:type': 'external', 'camunda:topic': item.topic };
    el.type = "element";
    el.name = "bpmn:sendTask ";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    //item =
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.ServiceTask, value: el });
    item['task'] = { type: TaskType.ServiceTask, value: el };
  }
  addScriptTask(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name, scriptFormat: "javascript" };
    item.resultVariable ? el.attributes['camunda:resultVariable'] = item.resultVariable : null
    var sc = new BpmElements();
    sc.type = 'element';
    sc.name = 'bpmn:script';
    sc.elements = [];
    var flow = { type: 'text', text: item.script };
    sc.elements.push(flow);
    delete item['resultVariable'];
    delete item['script'];
    el.type = "element";
    el.name = "bpmn:scriptTask ";
    el.elements = [];
    // var bpmnExstensionElements: any = {};
    // bpmnExstensionElements.type = "element";
    // bpmnExstensionElements.name = "bpmn:extensionElements";
    // bpmnExstensionElements.elements = [];
    // var ce: any = {};
    // ce.name = "camunda:inputOutput";
    // ce.type = "element";
    // var ip = [];
    // //item =
    // Object.keys(item).forEach((key, idx) => {
    //   console.log(key + ": " + item[key]);
    //   ip.push({ name: key, value: item[key] });
    // });
    // ce.elements = this.addInputElements(ip);
    // bpmnExstensionElements.elements.push(ce);
    // el.elements.push(bpmnExstensionElements);
    el.elements.push(sc);
    this.taskList.push({ type: TaskType.ScriptTask, value: el });
    item['task'] = { type: TaskType.ScriptTask, value: el };
  }
  addReceiveTask(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name };
    el.type = "element";
    el.name = "bpmn:receiveTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    //item =
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.ReceiveTask, value: el });
    item['task'] = { type: TaskType.ReceiveTask, value: el };
  }
  addEventGateWay(item) {
    var el = new BpmElements();
    el.attributes = { id: `Gateway` + Guid.create().toString(), name: item.name };
    el.type = "element";
    el.name = "bpmn:eventBasedGateway";
    el.elements = [];
    this.taskList.push({ type: TaskType.EventGateWay, value: el });
    item['task'] = { type: TaskType.EventGateWay, value: el };
  }
  addXorGateWay(item) {
    var el = new BpmElements();
    el.attributes = { id: `Gateway` + Guid.create().toString(), name: item.name };
    el.type = "element";
    el.name = "bpmn:exclusiveGateway";
    el.elements = [];
    // var incoming = new BpmElements();
    // incoming.type = 'element';
    // incoming.name = 'bpmn:incoming';
    // incoming.elements = [];
    // var flow = { type: 'text', text: this.startEventSeqFlowId };
    // incoming.elements.push(flow);
    // var bpmnExstensionElements: any = {};
    // bpmnExstensionElements.type = "element";
    // bpmnExstensionElements.name = "bpmn:extensionElements";
    // bpmnExstensionElements.elements = [];
    // var ce: any = {};
    // ce.name = "camunda:inputOutput";
    // ce.type = "element";
    // var ip = [];
    // //item =
    // Object.keys(item).forEach((key, idx) => {
    //   console.log(key + ": " + item[key]);
    //   ip.push({ name: key, value: item[key] });
    // });
    // ce.elements = this.addInputElements(ip);
    // bpmnExstensionElements.elements.push(ce);
    // el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.XorGateWay, value: el });
    item['task'] = { type: TaskType.XorGateWay, value: el };
  }
  addAndGateWay(item) {
    var el = new BpmElements();
    el.attributes = { id: `Gateway` + Guid.create().toString(), name: item.name };
    el.type = "element";
    el.name = "bpmn:parallelGateway";
    el.elements = [];
    this.taskList.push({ type: TaskType.AndGateWay, value: el });
    item['task'] = { type: TaskType.AndGateWay, value: el };
  }

  addNewRecordInsertion(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name, 'camunda:type': 'external', 'camunda:topic': 'createdataset_activity' };
    el.type = "element";
    el.name = "bpmn:serviceTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.RecordInsertion, value: el });
    item['task'] = { type: TaskType.RecordInsertion, value: el };
  }

  addNotificationAlert(item) {
    var el = new BpmElements();
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: item.name, 'camunda:type': 'external', 'camunda:topic': 'notificationalert_activity' };
    el.type = "element";
    el.name = "bpmn:serviceTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.NotificationAlert, value: el });
    item['task'] = { type: TaskType.NotificationAlert, value: el };
  }

  getActionsForGateWay() {
    var items = [];
    items = [...this.workflowForm.value.mailAlertSteps,
    ...this.workflowForm.value.fieldUpdateSteps,
    ...this.workflowForm.value.checkListSteps,
    ...this.workflowForm.value.userTaskSteps,
    ...this.workflowForm.value.serviceTaskSteps,
    ...this.workflowForm.value.sendTaskSteps,
    ...this.workflowForm.value.scriptTaskSteps,
    ...this.workflowForm.value.receiveTaskSteps,
    ...this.workflowForm.value.insertionSteps,
    ...this.workflowForm.value.notificationSteps
    ];
    return items;
  }

  getEventsForGateWay() {
    var items = [];
    items = [...this.workflowForm.value.messageEventSteps,
    ...this.workflowForm.value.timerEventSteps,
    ...this.workflowForm.value.signalEventSteps,
    ...this.workflowForm.value.escalationEventSteps,
    ...this.workflowForm.value.errorEventSteps,
    ...this.workflowForm.value.terminationEventSteps
    ];
    return items;
  }

  openArrangeActionsDialog(templateRef) {
    if (this.isEdit && (this.isEditTask == false || this.isEditTask == null)) {
      this.wfItems = JSON.parse(JSON.stringify(this.workflowItems));
      this.items = this.workflowItemsByOrder;
      console.log(this.wfItems);
    } else {
      this.items = [];
      this.wfItems = [];
      let startSteps = this.workflowForm.value.startSteps;
      if (startSteps.length > 0) {
        startSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.startSteps = startSteps;
      }
      let mailAlertSteps = this.workflowForm.value.mailAlertSteps;
      if (mailAlertSteps.length > 0) {
        mailAlertSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.mailAlertSteps = mailAlertSteps;
      }
      let fieldUpdateSteps = this.workflowForm.value.fieldUpdateSteps;
      if (fieldUpdateSteps.length > 0) {
        fieldUpdateSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.fieldUpdateSteps = fieldUpdateSteps;
      }
      let checkListSteps = this.workflowForm.value.checkListSteps;
      if (checkListSteps.length > 0) {
        checkListSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.checkListSteps = checkListSteps;
      }
      let userTaskSteps = this.workflowForm.value.userTaskSteps;
      if (userTaskSteps.length > 0) {
        userTaskSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.userTaskSteps = userTaskSteps;
      }
      let serviceTaskSteps = this.workflowForm.value.serviceTaskSteps;
      if (serviceTaskSteps.length > 0) {
        serviceTaskSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.serviceTaskSteps = serviceTaskSteps;
      }
      let sendTaskSteps = this.workflowForm.value.sendTaskSteps;
      if (sendTaskSteps.length > 0) {
        sendTaskSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.sendTaskSteps = sendTaskSteps;
      }
      let scriptTaskSteps = this.workflowForm.value.scriptTaskSteps;
      if (scriptTaskSteps.length > 0) {
        scriptTaskSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.scriptTaskSteps = scriptTaskSteps;
      }
      let receiveTaskSteps = this.workflowForm.value.scriptTaskSteps;
      if (receiveTaskSteps.length > 0) {
        receiveTaskSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.receiveTaskSteps = receiveTaskSteps;
      }
      let xorGateWaySteps = this.workflowForm.value.xorGateWaySteps;
      if (xorGateWaySteps.length > 0) {
        xorGateWaySteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.xorGateWaySteps = xorGateWaySteps;
      }
      let andGateWaySteps = this.workflowForm.value.andGateWaySteps;
      if (andGateWaySteps.length > 0) {
        andGateWaySteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.andGateWaySteps = andGateWaySteps;
      }
      let eventGateWaySteps = this.workflowForm.value.eventGateWaySteps;
      if (eventGateWaySteps.length > 0) {
        eventGateWaySteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.eventGateWaySteps = eventGateWaySteps;
      }
      let endSteps = this.workflowForm.value.endSteps;
      if (endSteps.length > 0) {
        endSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.endSteps = endSteps;
      }
      let terminationEventSteps = this.workflowForm.value.terminationEventSteps;
      if (terminationEventSteps.length > 0) {
        terminationEventSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.terminationEventSteps = terminationEventSteps;
      }
      let messageEventSteps = this.workflowForm.value.messageEventSteps;
      if (messageEventSteps.length > 0) {
        messageEventSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.messageEventSteps = messageEventSteps;
      }
      let signalEventSteps = this.workflowForm.value.signalEventSteps;
      if (signalEventSteps.length > 0) {
        signalEventSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.signalEventSteps = signalEventSteps;
      }
      let timerEventSteps = this.workflowForm.value.timerEventSteps;
      if (timerEventSteps.length > 0) {
        timerEventSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.timerEventSteps = timerEventSteps;
      }
      let escalationEventSteps = this.workflowForm.value.escalationEventSteps;
      if (escalationEventSteps.length > 0) {
        escalationEventSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.escalationEventSteps = escalationEventSteps;
      }
      let errorEventSteps = this.workflowForm.value.errorEventSteps;
      if (errorEventSteps.length > 0) {
        errorEventSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.errorEventSteps = errorEventSteps;
      }
      let recordInsertionSteps = this.workflowForm.value.insertionSteps;
      if (recordInsertionSteps.length > 0) {
        recordInsertionSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.insertionSteps = recordInsertionSteps;
      }
      let notificationAlertSteps = this.workflowForm.value.notificationSteps;
      if (notificationAlertSteps.length > 0) {
        notificationAlertSteps.forEach((step) => {
          if (step.children && step.children.length > 0) {
            step.children = [];
          }
        })
        this.workflowForm.value.notificationSteps = notificationAlertSteps;
      }
      this.workflowForm.value.startSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.startSteps), this.items.push(...this.workflowForm.value.startSteps)) : null;
      this.workflowForm.value.mailAlertSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.mailAlertSteps), this.items.push(...this.workflowForm.value.mailAlertSteps)) : null;
      this.workflowForm.value.fieldUpdateSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.fieldUpdateSteps), this.items.push(...this.workflowForm.value.fieldUpdateSteps)) : null;
      this.workflowForm.value.checkListSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.checkListSteps), this.items.push(...this.workflowForm.value.checkListSteps)) : null;
      this.workflowForm.value.insertionSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.insertionSteps), this.items.push(...this.workflowForm.value.insertionSteps)) : null;
      this.workflowForm.value.notificationSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.notificationSteps), this.items.push(...this.workflowForm.value.notificationSteps)) : null;
      if (this.workflowForm.value.userTaskSteps.length > 0) {
        this.wfItems.push(...this.workflowForm.value.userTaskSteps)
        this.workflowForm.value.userTaskSteps.forEach((e, i) => {
          if (e.inputparamSteps && e.inputparamSteps.length > 0) {
            var ips = {};
            ips = {};
            ips['name'] = e.name;
            ips['type'] = e.type;
            // e.inputparamSteps.forEach((e: any) => {
            //   var key = e.inputName;
            //   var value = e.inputValue;
            //   var obj = {key: value};
            //   ips.push(obj);
            // })
            // ips.push(...e.inputparamSteps.map(function(e) {
            //   var key = e.inputName;
            //   var value = e.inputValue;
            //   var obj = {name: key, value: value};
            //   this.items[i][key] = value;
            //   return  obj;
            // }));
            e.inputparamSteps.forEach(el => {
              var key = el.inputName;
              var value = el.inputValue;
              ips[key] = value;
            });
            // ips.push(...e.inputparamSteps);
            this.items.push(ips);
          } else {
            this.items.push(e);
          }
        });
      }
      if (this.workflowForm.value.serviceTaskSteps.length > 0) {
        this.wfItems.push(...this.workflowForm.value.serviceTaskSteps)
        this.workflowForm.value.serviceTaskSteps.forEach((e, i) => {
          if (e.inputparamSteps && e.inputparamSteps.length > 0) {
            var ips = {};
            ips['name'] = e.name;
            ips['type'] = e.type;
            ips['topic'] = e.topic;
            e.inputparamSteps.forEach(el => {
              var key = el.inputName;
              var value = el.inputValue;
              ips[key] = value;
            });
            this.items.push(ips);
          } else {
            this.items.push(e);
          }
        });
      }
      if (this.workflowForm.value.sendTaskSteps.length > 0) {
        this.wfItems.push(...this.workflowForm.value.sendTaskSteps)
        this.workflowForm.value.sendTaskSteps.forEach((e, i) => {
          if (e.inputparamSteps && e.inputparamSteps.length > 0) {
            var ips = {};
            ips['name'] = e.name;
            ips['type'] = e.type;
            ips['topic'] = e.topic;
            e.inputparamSteps.forEach(el => {
              var key = el.inputName;
              var value = el.inputValue;
              ips[key] = value;
            });
            this.items.push(ips);
          } else {
            this.items.push(e);
          }
        });
      }
      if (this.workflowForm.value.scriptTaskSteps.length > 0) {
        this.wfItems.push(...this.workflowForm.value.scriptTaskSteps)
        this.workflowForm.value.scriptTaskSteps.forEach((e, i) => {
          if (e.inputparamSteps && e.inputparamSteps.length > 0) {
            var ips = {};
            ips['name'] = e.name;
            ips['type'] = e.type;
            ips['resultVariable'] = e.resultVariable;
            ips['script'] = e.script;
            e.inputparamSteps.forEach(el => {
              var key = el.inputName;
              var value = el.inputValue;
              ips[key] = value;
            });
            this.items.push(ips);
          } else {
            this.items.push(e);
          }
        });
      }
      if (this.workflowForm.value.receiveTaskSteps.length > 0) {
        this.wfItems.push(...this.workflowForm.value.receiveTaskSteps)
        this.workflowForm.value.receiveTaskSteps.forEach((e, i) => {
          if (e.inputparamSteps && e.inputparamSteps.length > 0) {
            var ips = {};
            ips['name'] = e.name;
            ips['type'] = e.type;
            ips['messageName'] = e.messageName;
            e.inputparamSteps.forEach(el => {
              var key = el.inputName;
              var value = el.inputValue;
              ips[key] = value;
            });
            this.items.push(ips);
          } else {
            this.items.push(e);
          }
        });
      }
      this.workflowForm.value.xorGateWaySteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.xorGateWaySteps), this.items.push(...this.workflowForm.value.xorGateWaySteps)) : null;
      this.workflowForm.value.andGateWaySteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.andGateWaySteps), this.items.push(...this.workflowForm.value.andGateWaySteps)) : null;
      this.workflowForm.value.eventGateWaySteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.eventGateWaySteps), this.items.push(...this.workflowForm.value.eventGateWaySteps)) : null;
      this.workflowForm.value.endSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.endSteps), this.items.push(...this.workflowForm.value.endSteps)) : null;
      this.workflowForm.value.terminationEventSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.terminationEventSteps), this.items.push(...this.workflowForm.value.terminationEventSteps)) : null;
      this.workflowForm.value.messageEventSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.messageEventSteps), this.items.push(...this.workflowForm.value.messageEventSteps)) : null;
      this.workflowForm.value.signalEventSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.signalEventSteps), this.items.push(...this.workflowForm.value.signalEventSteps)) : null;
      this.workflowForm.value.timerEventSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.timerEventSteps), this.items.push(...this.workflowForm.value.timerEventSteps)) : null;
      this.workflowForm.value.escalationEventSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.escalationEventSteps), this.items.push(...this.workflowForm.value.escalationEventSteps)) : null;
      this.workflowForm.value.errorEventSteps.length > 0 ? (this.wfItems.push(...this.workflowForm.value.errorEventSteps), this.items.push(...this.workflowForm.value.errorEventSteps)) : null;
    }
    // this.tempItems = [...this.items];
    // this.tempItems = Object.assign({}, this.items);
    this.tempItems = JSON.parse(JSON.stringify(this.items));
    this.orderActionsDialog = this.dialog.open(templateRef, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true
    });
    this.orderActionsDialog.afterClosed().subscribe((res: any) => {
    });
  }
  flat(array) {
    var result = [];
    array.forEach(function (a) {
      result.push(a);
      if (Array.isArray(a.children)) {
        result = result.concat(this.flat(a.children));
      }
    });
    return result;
  }
  saveXML() {
    this.isAnyOperationIsInprogress = true;
    this.workflowItemsByOrder = JSON.parse(JSON.stringify(this.items));
    this.createBpmModel();
    this.cdRef.detectChanges();
    let workflowModel = new WorkflowModel();
    workflowModel = this.workflowForm.value;
    workflowModel.workFlowTypeId = "ab71a18f-4a69-4bc5-88ae-7598bf3ab695";
    workflowModel.workflowItems = JSON.stringify(this.wfItems);
    workflowModel.formtypeId = this.workflowForm.get("formtypeName").value;
    workflowModel.formName = this.selectedForm;
    workflowModel.workflowName = this.workflowForm.get("workflowName").value;
    workflowModel.action = this.action;
    workflowModel.fieldNames = this.workflowForm.get("fieldNames").value;
    workflowModel.fieldUniqueId = this.workflowForm.get("fieldUniqueId").value;
    workflowModel.cronRadio = "Yes";
    workflowModel.isStatus = this.workflowForm.get("isStatus").value;
    //workflowModel.dateFieldName = this.workflowForm.get("dateFieldName").value;
    workflowModel.cronExpression = this.cronExpression;
    workflowModel.companyModuleId = this.companyModuleId;
    workflowModel.criterialSteps = JSON.stringify((this.workflowForm.get('criteriaSteps') as FormArray).value);
    // workflowModel.dateofexecution = this.workflowForm.get("dateofexecution").value;
    // //workflowModel.triggerMonth = this.workflowForm.get("triggerMonth").value;
    // workflowModel.triggerDay = this.workflowForm.get("triggerDay").value;
    // workflowModel.triggerStartList = this.workflowForm.get("triggerStartList").value;
    // workflowModel.triggerStartDays = this.workflowForm.get("triggerStartDays").value;
    // workflowModel.triggerEndList = this.workflowForm.get("triggerEndList").value;
    // workflowModel.triggerEndDays = this.workflowForm.get("triggerEndDays").value;
    // workflowModel.timeofexecution = this.workflowForm.get("timeofexecution").value;
    // workflowModel.executionoccurrence = this.workflowForm.get("executionoccurrence").value;
    workflowModel.id = this.isEdit ? this.editWorkflowDetails.id : null;
    workflowModel.dataSourceId = this.isEdit ? this.editWorkflowDetails.dataSourceId : null;
    workflowModel.workflowItemsByOrder = JSON.stringify(this.workflowItemsByOrder);
    workflowModel.timezone = this.workflowForm.get("timezone").value;
    workflowModel.xml = this.workFlowXml;
    workflowModel.tasks = this.taskEvents;
    workflowModel.offsetMinutes = this.timeZoneOffset;
    workflowModel.selectedTab = this.selectedTab;
    this.workflowService.upsertWorkflow(workflowModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.clearForm();
        this.closeOrderActionsDialog();
        this.currentDialog.close({ id: responseData.data });
      }
      this.isAnyOperationIsInprogress = false;
    })
  }
  closeDialog() {
    this.items = [];
    this.tempItems = [];
    this.taskList = [];
    this.dialog.closeAll();
  }

  public getDragStatus(action: DropAction, destinationItem: TreeItemLookup): string {
    if (destinationItem && action === DropAction.Add) {
      return 'k-i-cancel';
    }
    switch (action) {
      case DropAction.Add: return 'k-i-plus';
      case DropAction.InsertTop: return 'k-i-insert-up';
      case DropAction.InsertBottom: return 'k-i-insert-down';
      case DropAction.InsertMiddle: return 'k-i-insert-middle';
      case DropAction.Invalid:
      default: return 'k-i-cancel';
    }
  }
  public handleDrop(event) {
    //console.log(this.items);
  }

  onNoClick() {
    this.dialog.closeAll();
    this.currentDialog.close();
  }
  ngOnDestroy() {


  }
  closeSelectedDialog(dialog) {
    dialog.close();
  }
  closeStartDialog() {
    this.startDialogRef.close();
  }
  closeEndDialog() {
    this.endDialogRef.close();
  }
  closeMessageDialog() {
    this.messageDialogRef.close();
  }
  closeTimerDialog() {
    this.timerDialogRef.close();
  }
  closeEscalationDialog() {
    this.escalationDialogRef.close();
  }
  closeErrorDialog() {
    this.errorDialogRef.close();
  }
  closeSignalDialog() {
    this.signalDialogRef.close();
  }
  closeTerminationDialog() {
    this.terminationDialogRef.close();
  }
  closeOrderActionsDialog() {
    this.items = [];
    this.wfItems = [];
    this.orderActionsDialog.close();
  }
  addEventHelperUserTask(item, i) {
    var el = new BpmElements();
    var name = `${item.type}`
    el.attributes = { id: `Activity_` + Guid.create().toString(), name: name };
    el.type = "element";
    el.name = "bpmn:userTask";
    el.elements = [];
    var bpmnExstensionElements: any = {};
    bpmnExstensionElements.type = "element";
    bpmnExstensionElements.name = "bpmn:extensionElements";
    bpmnExstensionElements.elements = [];
    var ce: any = {};
    ce.name = "camunda:inputOutput";
    ce.type = "element";
    var ip = [];
    //item =
    Object.keys(item).forEach((key, idx) => {
      console.log(key + ": " + item[key]);
      ip.push({ name: key, value: item[key] });
    });
    item.inputparamSteps.forEach((key, i) => {
      ip.push({ name: key.inputName, value: key.inputValue });
    });
    ce.elements = this.addInputElements(ip);
    bpmnExstensionElements.elements.push(ce);
    el.elements.push(bpmnExstensionElements);
    this.taskList.push({ type: TaskType.EventHelperUserTask, value: el });
    var it = Object.assign({}, item);
    it.type = TaskType.EventHelperUserTask;
    it['task'] = { type: TaskType.EventHelperUserTask, value: el };
    return it;
    //this.items.splice(i, 0, el);
  }

  addInputElements(i) {
    var inputs = [];
    i.forEach(el => {
      if (el.name != 'children') {
        var input: any = {};
        input.attributes = { name: el.name };
        input.type = "element";
        input.name = "camunda:inputParameter";
        if (el.value) {
          input.elements = [];
          input.elements.push({ type: 'text', text: el.value });
        }
        inputs.push(input);
      }
    });
    return inputs;
  }

  compareSelectedFormKeys(formKeys: any, selectedFormKeys: any) {
    if (formKeys === selectedFormKeys) {
      return true;
    } else {
      return false;
    }
  }

  getTimeZoneValue(event) {
    let timezonesList = this.timezoneDropDown;
    let filteredList = _.filter(timezonesList, function (timezone) {
      return timezone.timeZoneTitle == event;
    })

    if (filteredList.length > 0) {
      this.timeZoneOffset = filteredList[0].offsetMinutes;
    }
  }

  selectedTabEvent(event) {
    this.selectedTab = event.index;
    this.cdRef.detectChanges();
  }
}
