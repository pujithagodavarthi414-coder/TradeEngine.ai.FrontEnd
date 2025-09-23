import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";
import { CronOptions } from "cron-editor";
import { CronExpressionModel } from "../models/cron-expression.model";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { WorkflowService } from "../services/workflow.service";
import { DatePipe } from "@angular/common";
import { TimerEventType } from "../models/enum";

@Component({
    selector: "timer-event-task",
    templateUrl: "./timer-event.component.html"
})
export class TimerEventComponent extends CustomAppBaseComponent {

    actions: any[] = [];
    timerEventForm: FormGroup;
    form: any;
    formname: string;
    inputparamSteps: FormArray;
    inputparamsStepsShow: boolean = false;
    isEdit: any;
    selectedTimerDefType: string;
    showCron: boolean = false;
    showDate: boolean = false;
    showDuration: boolean = false;
    def:any;
    public cronExpression = "0 10 1/1 * ?";
    public isCronDisabled = false;
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

    TimerDefinitionType = [
        { id: '0', name: 'Date' },
        { id: '1', name: 'Duration' },
        { id: '2', name: 'Cycle' }
    ]
    selectedTimerDefinitionType = this.TimerDefinitionType[1];


    TimerEventType = [
        { id: '0', name: 'Timer Start Event' },
        { id: '1', name: 'Timer Intermediate Catching Event' },
        { id: '2', name: 'Timer Interrupted Boundary Event' },
        { id: '3', name: 'Timer Non Interrupted Boundary Event' },

    ]
    selectedTimerEventType = this.TimerEventType[1];

    TimerHours = [
        { id: '0', name: '0' },
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
        { id: '4', name: '4' },
        { id: '5', name: '5' },
        { id: '6', name: '6' },
        { id: '7', name: '7' },
        { id: '8', name: '8' },
        { id: '9', name: '9' },
        { id: '10', name: '10' },
        { id: '11', name: '11' },
        { id: '12', name: '12' },
        { id: '13', name: '13' },
        { id: '14', name: '14' },
        { id: '15', name: '15' },
        { id: '16', name: '16' },
        { id: '17', name: '17' },
        { id: '18', name: '18' },
        { id: '19', name: '19' },
        { id: '20', name: '20' },
        { id: '21', name: '21' },
        { id: '22', name: '22' },
        { id: '23', name: '23' },
        { id: '24', name: '24' },
    ]
    selectedTimerHours = this.TimerHours[1];

    TimerMin = [
        { id: '0', name: '0' },
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
        { id: '4', name: '4' },
        { id: '5', name: '5' },
        { id: '6', name: '6' },
        { id: '7', name: '7' },
        { id: '8', name: '8' },
        { id: '9', name: '9' },
        { id: '10', name: '10' },
        { id: '11', name: '11' },
        { id: '12', name: '12' },
        { id: '13', name: '13' },
        { id: '14', name: '14' },
        { id: '15', name: '15' },
        { id: '16', name: '16' },
        { id: '17', name: '17' },
        { id: '18', name: '18' },
        { id: '19', name: '19' },
        { id: '20', name: '20' },
        { id: '21', name: '21' },
        { id: '22', name: '22' },
        { id: '23', name: '23' },
        { id: '24', name: '24' },

        { id: '25', name: '25' },
        { id: '26', name: '26' },
        { id: '27', name: '27' },
        { id: '28', name: '28' },
        { id: '29', name: '29' },
        { id: '30', name: '30' },
        { id: '31', name: '31' },
        { id: '32', name: '32' },
        { id: '33', name: '33' },
        { id: '34', name: '34' },
        { id: '35', name: '35' },
        { id: '36', name: '36' },
        { id: '37', name: '37' },
        { id: '38', name: '38' },
        { id: '39', name: '39' },
        { id: '40', name: '40' },
        { id: '41', name: '41' },
        { id: '42', name: '42' },
        { id: '43', name: '43' },
        { id: '44', name: '44' },
        { id: '45', name: '45' },

        { id: '46', name: '46' },
        { id: '47', name: '47' },
        { id: '48', name: '48' },
        { id: '49', name: '49' },
        { id: '50', name: '50' },
        { id: '51', name: '51' },
        { id: '52', name: '52' },
        { id: '53', name: '53' },
        { id: '54', name: '54' },
        { id: '55', name: '55' },
        { id: '56', name: '56' },
        { id: '57', name: '57' },
        { id: '58', name: '58' },
        { id: '59', name: '59' },
        { id: '60', name: '60' },
    ]
    selectedTimerMin = this.TimerMin[1];


    TimerYears = [
        { id: '0', name: '0' },
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
        { id: '4', name: '4' },
        { id: '5', name: '5' },
        { id: '6', name: '6' },
        { id: '7', name: '7' },
        { id: '8', name: '8' },
        { id: '9', name: '9' },
        { id: '10', name: '10' },
    ]

    TimerMonths = [
        { id: '0', name: '0' },
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
        { id: '4', name: '4' },
        { id: '5', name: '5' },
        { id: '6', name: '6' },
        { id: '7', name: '7' },
        { id: '8', name: '8' },
        { id: '9', name: '9' },
        { id: '10', name: '10' },
        { id: '11', name: '11' },
        { id: '12', name: '12' },]

    TimerDays = [
        { id: '0', name: '0' },
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
        { id: '4', name: '4' },
        { id: '5', name: '5' },
        { id: '6', name: '6' },
        { id: '7', name: '7' },
        { id: '8', name: '8' },
        { id: '9', name: '9' },
        { id: '10', name: '10' },
        { id: '11', name: '11' },
        { id: '12', name: '12' },
        { id: '13', name: '13' },
        { id: '14', name: '14' },
        { id: '15', name: '15' },
        { id: '16', name: '16' },
        { id: '17', name: '17' },
        { id: '18', name: '18' },
        { id: '19', name: '19' },
        { id: '20', name: '20' },
        { id: '21', name: '21' },
        { id: '22', name: '22' },
        { id: '23', name: '23' },
        { id: '24', name: '24' },

        { id: '25', name: '25' },
        { id: '26', name: '26' },
        { id: '27', name: '27' },
        { id: '28', name: '28' },
        { id: '29', name: '29' },
        { id: '30', name: '30' },
        { id: '31', name: '31' },]

    constructor(private cdRef: ChangeDetectorRef, public AppDialog: MatDialogRef<TimerEventComponent>, private datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any, private workflowService: WorkflowService, private formBuilder: FormBuilder) {
        super();
        this.form = data;
        this.formname = data.name;
        this.isEdit = data.isEdit;
        this.actions = data.items;
    }
    ngOnInit(): void {
        this.clearForm();
        this.onChangeTimerEventType();
        this.inputparamsStepsShow = true;
        this.timerEventForm.controls['durMin'].setValue('0');
        this.timerEventForm.controls['durSec'].setValue('0');
        this.timerEventForm.controls['durHours'].setValue('0');
        this.timerEventForm.controls['durYears'].setValue('0');
        this.timerEventForm.controls['durMonths'].setValue('0');
        this.timerEventForm.controls['durDays'].setValue('0');

        this.timerEventForm.controls['cycleMin'].setValue('0');
        this.timerEventForm.controls['cycleSec'].setValue('0');
        this.timerEventForm.controls['cycleHours'].setValue('0');
        this.timerEventForm.controls['cycleYears'].setValue('0');
        this.timerEventForm.controls['cycleMonths'].setValue('0');
        this.timerEventForm.controls['cycleDays'].setValue('0');
        this.timerEventForm.controls['cycleRep'].setValue('0');

        if (this.isEdit) {
            this.timerEventForm.patchValue(this.form.formValue);
            console.log(this.form.formValue);
            this.timerEventForm.get('timerName').setValue(this.form.formValue.timerName);

            this.def = this.form.formValue.timerDefinitionType;

            if (this.def == "1") {
                this.timerEventForm.get('durYears').setValue(this.form.formValue.durYears);
                this.timerEventForm.get('durMonths').setValue(this.form.formValue.durMonths);
                this.timerEventForm.get('durDays').setValue(this.form.formValue.durDays);
                this.timerEventForm.get('durMin').setValue(this.form.formValue.durMin);
                this.timerEventForm.get('durHours').setValue(this.form.formValue.durHours);
                this.timerEventForm.get('durSec').setValue(this.form.formValue.durSec);
                this.showDuration = true;
            }

            if (this.def == "2") {
                this.showCron = true;
                this.timerEventForm.get('cycleYears').setValue(this.form.formValue.cycleYears);
                this.timerEventForm.get('cycleMonths').setValue(this.form.formValue.cycleMonths);
                this.timerEventForm.get('cycleDays').setValue(this.form.formValue.cycleDays);
                this.timerEventForm.get('cycleHours').setValue(this.form.formValue.cycleHours);
                this.timerEventForm.get('cycleMin').setValue(this.form.formValue.cycleMin);
                this.timerEventForm.get('cycleSec').setValue(this.form.formValue.cycleSec);
            }

            if (this.def == "0") {
                this.showDate = true;
            }

            if (this.form.formValue.taskName) {
                this.addTaskName(this.form.formValue.taskName);
            }
            if (this.form.formValue.inputparamSteps && this.form.formValue.inputparamSteps.length > 0) {
                this.form.formValue.inputparamSteps.forEach((value, index) => {
                    this.inputparamSteps = this.timerEventForm.get('inputparamSteps') as FormArray;
                    this.inputparamSteps.insert(index, this.bindcriteriaItem(value));
                });
            }
        }
    }
    addTaskName(taskName) {
        this.timerEventForm.addControl('taskName', new FormControl(taskName, Validators.required));
    }
    onChangeTimerEventType() {
        this.timerEventForm.get('timerEventType').valueChanges.subscribe((value: any) => {

            if (value == TimerEventType.TimerInterruptedBoundaryEvent || value == TimerEventType.TimerNonInterruptedBoundaryEvent) {
                this.timerEventForm.addControl('taskName', new FormControl('', Validators.required));
            } else {
                this.timerEventForm.removeControl('taskName');
            }
            this.timerEventForm.get('taskName')?.updateValueAndValidity();
        });
    }
    clearForm() {
        this.timerEventForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            timerName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            inputparamSteps: this.formBuilder.array([]),
            timerEventType: new FormControl(null,
                Validators.compose([
                  Validators.required
                ])
              ),
            timerDefinitionType: new FormControl(null,
                Validators.compose([
                  Validators.required
                ])
              ),
            dateTimer: new FormControl(null),
            durationTimer: new FormControl(null),
            cycleDateTimer: new FormControl(null),
            cycleMin: new FormControl(null),
            cycleSec: new FormControl(null),
            cycleHours: new FormControl(null),
            cycleYears: new FormControl(null),
            cycleMonths: new FormControl(null),
            cycleDays: new FormControl(null),
            cycleRep: new FormControl(null),
            durMin: new FormControl(null),
            durSec: new FormControl(null),
            durHours: new FormControl(null),
            durYears: new FormControl(null),
            durMonths: new FormControl(null),
            durDays: new FormControl(null),
        })
    }

    getTimerDefinitionType(event: MatSelectChange) {
        this.selectedTimerDefType = event.source.triggerValue
        console.log(this.selectedTimerDefType);

        if (this.selectedTimerDefType == 'Date') {
            this.showCron = false;
            this.showDate = true;
            this.showDuration = false;
        }
        else if (this.selectedTimerDefType == 'Duration') {
            this.showCron = false;
            this.showDate = false;
            this.showDuration = true;

        }
        else if (this.selectedTimerDefType == 'Cycle') {

            this.showCron = true;
            this.showDate = false;
            this.showDuration = false;
        }
        else {
            this.showCron = false;
            this.showDate = false;
            this.showDuration = false;
        }
    }

    upsertTimerEvent() {

        var timeexp;
        if (this.selectedTimerDefType == 'Date' || this.def == '0') {
            var da = this.datePipe.transform(this.timerEventForm.get("dateTimer").value, 'yyyy-MM-dd')
            var dp = this.datePipe.transform(this.timerEventForm.get("dateTimer").value, 'HH:mm:ss')
            timeexp = da + "T" + dp + "Z";
        }
        if (this.selectedTimerDefType == 'Duration' || this.def == '1') {
            var durYears = this.timerEventForm.get("durYears").value;
            var durMonths = this.timerEventForm.get("durMonths").value;
            var durDays = this.timerEventForm.get("durDays").value;
            var durHours = this.timerEventForm.get("durHours").value;
            var durMin = this.timerEventForm.get("durMin").value;
            var durSec = this.timerEventForm.get("durSec").value;
            timeexp = "P" + durYears + "Y" + durMonths + "M" + durDays + "DT" + durHours + "H" + durMin + "M" + durSec + "S"
        }

        if (this.selectedTimerDefType == 'Cycle' || this.def == '2') {

            var cycleYears = this.timerEventForm.get("cycleYears").value;
            var cycleMonths = this.timerEventForm.get("cycleMonths").value;
            var cycleDays = this.timerEventForm.get("cycleDays").value;
            var cycleHours = this.timerEventForm.get("cycleHours").value;
            var cycleMin = this.timerEventForm.get("cycleMin").value;
            var cycleSec = this.timerEventForm.get("cycleSec").value;
            var cycleRep = this.timerEventForm.get("cycleRep").value;
            var da = this.datePipe.transform(this.timerEventForm.get("cycleDateTimer").value, 'yyyy-MM-dd')
            var dp = this.datePipe.transform(this.timerEventForm.get("cycleDateTimer").value, 'HH:mm:ss')
            if(da!=null){
            var timeexp1 = da + "T" + dp + "Z";
            /// var cycleDateTimer = this.timerEventForm.get("cycleDateTimer").value;
            timeexp = "R" + cycleRep + "/" + timeexp1 + "/" + "P" + cycleYears + "Y" + cycleMonths + "M" + cycleDays + "DT" + cycleHours + "H" + cycleMin + "M" + cycleSec + "S"
            }  
            else
            timeexp = "R" + cycleRep + "/" + "P" + cycleYears + "Y" + cycleMonths + "M" + cycleDays + "DT" + cycleHours + "H" + cycleMin + "M" + cycleSec + "S"
        }
         console.log(timeexp);
        this.AppDialog.close({ ...this.timerEventForm.value, formId: this.form.formId, timeExp: timeexp });
    }
    cancelTimerEvent() { this.AppDialog.close(); }
    addItem(index): void {
        // if (this.addTestCaseForm.value.title == '' || this.addTestCaseForm.value.title == null) {
        //    // this.toastr.warning(this.translateService.instant(ConstantVariables.PleaseFillTestCaseTitle));
        // }
        // else if (this.addTestCaseForm.value.title.length > 500) {
        //     //this.toastr.warning(this.translateService.instant(ConstantVariables.TestCaseTitleShouldNotExceed500Characters));
        // }
        // else if (!this.disabledTestCase) {
        //     this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
        //     this.testCaseSteps.insert(index + 1, this.createItem());
        //     this.addNewTestCaseStep();
        // }

        this.inputparamSteps = this.timerEventForm.get('inputparamSteps') as FormArray;
        this.inputparamSteps.insert(index + 1, this.createcriteriaItem());
        this.addNewTestCaseStep();
    }
    addNewTestCaseStep() { }
    createcriteriaItem(): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl('', Validators.compose([Validators.required])),
            inputValue: new FormControl('', Validators.compose([]))
        });
    }
    bindcriteriaItem(data): FormGroup {
        return this.formBuilder.group({
            inputName: new FormControl(data.inputName, Validators.compose([Validators.required])),
            inputValue: new FormControl(data.inputValue, Validators.compose([]))
        });
    }
    getCriteriaControls() {
        return (this.timerEventForm.get('inputparamSteps') as FormArray).controls;
    }
    getControlsLength() {
        this.addItem((this.timerEventForm.get('inputparamSteps') as FormArray).length - 1);
    }
    validateStepsLength() {
        let length = (this.timerEventForm.get('inputparamSteps') as FormArray).length;
        if (length == 0)
            return true;
        else
            return false;
    }
    removeItem(index) {
        this.inputparamSteps.removeAt(index);
        this.addNewTestCaseStep();
    }
    onNoClick(): void {
        this.AppDialog.close();
    }
}