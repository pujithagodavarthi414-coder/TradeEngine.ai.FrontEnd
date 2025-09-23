import { DatePipe, DecimalPipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormioCustomComponent, FormioEvent } from "angular-formio";
import _ from 'lodash';
import { FormFieldValue } from "src/app/models/formFieldValue";
import { FormRelatedFieldValue } from "src/app/models/formRelatedFieldValues";
import { FormService } from "src/app/services/formService";

@Component({
    selector: 'rq-component',
    templateUrl: './rq-component.html'
})

export class RqComponent implements FormioCustomComponent<any> {
    isLookupValuesGetInprogress: boolean = false;
    userCompanyIds: any;
    @Input() value: any;

    disableds: boolean;
    customApplicationNames: any;
    selectedCustomApplicationIds: any;
    selectedCustomApplicationNames: any;
    formNames: any;
    selectedFormNames: any;
    selectedFormIds: any;
    selectedForms: any;
    fieldNames: any;
    isLookuPdata: any = false;
    lookupDropDownData: any = [];
    operators: any;
    calculateFieldNames: any;
    lookupData: any;
    relatedFieldsfinalDatas: any;
    num: any;
    label: any;
    keyValue: any;
    @Input() set key(data: any) {
        if (data) {
            this.keyValue = data;
        }
    }
    @Input() set disabled(data: any) {
        if (data != undefined && data != false && data != null) {
            this.disableds = data == 'disabled' || data == true ? true : false;
        } else if (data != false) {
            this.disableds = true;
        }
    }
    @Input() set formName(data: any) {
        if (data) {
            this.formNames = data;
        }
    }
    @Input() set selectedFormName(data: any) {
        if (data) {
            this.selectedFormNames = data;
        }
    }
    @Input() set selectedFormId(data: any) {
        if (data) {
            this.selectedFormIds = data;
        }
    }
    @Input() set selectedForm(data: any) {
        if (data) {
            this.selectedForms = data;
        }
    }
    @Input() set fieldName(data: any) {
        if (data) {
            this.fieldNames = data;
            this.getFieldValues();
        }
    }
    @Input() set operator(data: any) {
        if (data) {
            this.operators = data;
        }
    }
    @Input() set calculateFieldName(data: any) {
        if (data) {
            this.calculateFieldNames = data;
        }
    }
    @Input() set relatedFieldsfinalData(data: any) {
        if (data) {
            this.relatedFieldsfinalDatas = data;
            this.label = Array.isArray(this.relatedFieldsfinalDatas) && this.relatedFieldsfinalDatas?.length > 0 ? this.relatedFieldsfinalDatas[0].label : this.relatedFieldsfinalDatas?.label;
            this.getCalculatedData(this.value);
        }
    }
    @Output() valueChange = new EventEmitter<any>();
    @Output() formioEvent = new EventEmitter<FormioEvent>();
    constructor(private cdRef: ChangeDetectorRef, private formService: FormService
        , public dialog: MatDialog, private datePipe: DatePipe,
        private decimalPipe: DecimalPipe) {
        this.userCompanyIds = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.map(x => x?.companyId).toString();
    }

    ngOnInit() {
    }

    getFieldValues() {
        const el = document.getElementById('rq-formio-class');
        const r1 = el && el.closest("#form-builder");
        console.log(Boolean(r1));
        if(r1) {
            return;
        }
        if ((this.selectedFormIds != null && this.fieldNames != null && this.selectedFormIds != undefined && this.fieldNames != undefined) || (this.formNames != null && this.fieldNames != null && this.formNames != undefined && this.fieldNames != undefined)) {
            const formField = new FormFieldValue();
            this.selectedFormIds = this.formNames;
            formField.FormId = this.selectedFormIds;
            formField.Key = this.fieldNames;
            formField.companyIds = this.userCompanyIds;
            this.formService
                .GetFormFieldValues(formField)
                .subscribe((response: any) => {
                    console.log(response);
                    if (response.success == true) {
                        const selectData = [];
                        response.data && response.data.fieldValues && response.data.fieldValues?.length > 0 && response.data.fieldValues.forEach(element => {
                            var el;
                            if (response.data.type == 'datetime' || response.data.type == 'mydatetime' || response.data.type == 'mylinkdatetime') {
                                if (response.data.format) {
                                    el = this.datePipe.transform(element, response.data.format);
                                } else {
                                    el = this.datePipe.transform(element, 'yyyy-MM-dd hh:mm a');
                                }
                            } else if (response.data.type == 'number') {
                                var num = element;
                                if (response.data.delimiter == true && response.data.requireDecimal == true && response.data.decimalLimit > 0) {
                                    el = this.decimalPipe.transform(num, `.${response.data.decimalLimit}-${response.data.decimalLimit}`);
                                } else if (response.data.delimiter != true && response.data.requireDecimal == true && response.data.decimalLimit > 0) {
                                    var regEx = /,/gi;
                                    el = this.decimalPipe.transform(num, `.${response.data.decimalLimit}-${response.data.decimalLimit}`).replace(regEx, '');
                                } else if (response.data.delimiter != true && response.data.requireDecimal != true) {
                                    el = this.decimalPipe.transform(num, '');
                                } else {
                                    el = num;
                                }
                            } else {
                                el = element;
                            }
                            selectData.push({ label: el, value: element });
                        });
                        if (!_.isEqual(this.lookupDropDownData, selectData)) {
                            this.lookupDropDownData = selectData;
                        }
                        this.isLookuPdata = true;
                    }
                    if (response.success == false) {

                    }
                    this.cdRef.detectChanges();
                });
        }
    }

    getCalculatedData(event: any) {
        if (event != null && this.fieldNames != null) {
            this.isLookupValuesGetInprogress = true;
            this.value = event;
            this.valueChange.emit(event);
            const formRelatedFieldValue = new FormRelatedFieldValue();
            if (this.selectedFormNames != null && this.selectedFormNames != undefined && this.selectedFormNames != "" && this.relatedFieldsfinalDatas != null
                && this.relatedFieldsfinalDatas != undefined && this.relatedFieldsfinalDatas.length > 0) {
                this.relatedFieldsfinalDatas.forEach(x => {
                    x["FormName"] = this.selectedFormNames;
                    x["FormId"] = this.selectedFormIds;
                });
            }
            formRelatedFieldValue.FormsModel = Array.isArray(this.relatedFieldsfinalDatas) ? this.relatedFieldsfinalDatas : [this.relatedFieldsfinalDatas];
            formRelatedFieldValue.KeyValue = this.value;
            formRelatedFieldValue.KeyName = this.fieldNames;
            formRelatedFieldValue.companyIds = this.userCompanyIds;
            formRelatedFieldValue.isForRq = true;
            this.formService
                .GetFormRelatedFieldValues(formRelatedFieldValue)
                .subscribe((response: any) => {
                    console.log(response);
                    if (response.success == true && response.data) {
                        this.lookupData = response.data;
                        var lookUpChildData = this.lookupData[0][this.selectedFormNames];
                        if (lookUpChildData && lookUpChildData.length > 0 && Array.isArray(this.relatedFieldsfinalDatas)) {
                            if (this.operators) {
                                var it = 0;
                                this.num = 0;
                                switch (this.operators) {
                                    case '+':
                                        this.relatedFieldsfinalDatas.forEach(x => {
                                            this.num += lookUpChildData.reduce(
                                                (accumulator, currentValue) => +accumulator + (currentValue[x.KeyName] ? +currentValue[x.KeyName] : 0), it
                                            );
                                        });
                                        break;
                                    case '-':
                                        this.relatedFieldsfinalDatas.forEach(x => {
                                            this.num -= lookUpChildData.reduce(
                                                (accumulator, currentValue) => +accumulator - (currentValue[x.KeyName] ? +currentValue[x.KeyName] : 0), it
                                            );
                                        });
                                        break;
                                    case '*':
                                        this.relatedFieldsfinalDatas.forEach(x => {
                                            this.num *= lookUpChildData.reduce(
                                                (accumulator, currentValue) => +accumulator * (currentValue[x.KeyName] ? +currentValue[x.KeyName] : 0), it
                                            );
                                        });
                                        break;
                                    case '/':
                                        this.relatedFieldsfinalDatas.forEach(x => {
                                            this.num /= lookUpChildData.reduce(
                                                (accumulator, currentValue) => +accumulator / (currentValue[x.KeyName] ? +currentValue[x.KeyName] : 0), it
                                            );
                                        });
                                        break;
                                    case '%':
                                        this.relatedFieldsfinalDatas.forEach(x => {
                                            this.num %= lookUpChildData.reduce(
                                                (accumulator, currentValue) => +accumulator + (currentValue[x.KeyName] ? +currentValue[x.KeyName] : 0), it
                                            );
                                        });
                                        break;
                                    default:
                                        console.log("No matching operator");
                                        break;
                                }
                                this.num = +this.num;
                                this.formioEvent.emit({ eventName: 'customEvent', data: { data: this.num, type: 'myrq', key: this.keyValue } });
                            }
                        }
                        else if(lookUpChildData && lookUpChildData.length > 0) {
                            if (this.operators) {
                                var it = 0;
                                switch (this.operators) {
                                    case '+':
                                        this.num = lookUpChildData.reduce(
                                            (accumulator, currentValue) => +accumulator + +currentValue[this.relatedFieldsfinalDatas.KeyName], it
                                        );
                                        break;
                                    case '-':
                                        this.num = lookUpChildData.reduce(
                                            (accumulator, currentValue) => +accumulator - +currentValue[this.relatedFieldsfinalDatas.KeyName], it
                                        );
                                        break;
                                    case '*':
                                        this.num = lookUpChildData.reduce(
                                            (accumulator, currentValue) => +accumulator * +currentValue[this.relatedFieldsfinalDatas.KeyName], it
                                        );
                                        break;
                                    case '/':
                                        this.num = lookUpChildData.reduce(
                                            (accumulator, currentValue) => +accumulator / +currentValue[this.relatedFieldsfinalDatas.KeyName], it
                                        );
                                        break;
                                    case '%':
                                        this.num = lookUpChildData.reduce(
                                            (accumulator, currentValue) => +accumulator % +currentValue[this.relatedFieldsfinalDatas.KeyName], it
                                        );
                                        break;
                                    default:
                                        console.log("No matching operator");
                                        break;
                                }
                                this.num = +this.num;
                                this.formioEvent.emit({ eventName: 'customEvent', data: { data: this.num, type: 'myrq', key: this.keyValue } });
                            }   
                        }
                    }
                    if (response.success == false) {

                    }
                    this.isLookupValuesGetInprogress = false;
                });
        }
    }

    getdata() {
        if (!this.num) {
            return;
        }
        if(Array.isArray(this.relatedFieldsfinalDatas)) {
            var a;
            if (this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-Delimiter'] == "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-RequireDecimal'] == "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-DecimalLimit'] > 0) {
                a = this.decimalPipe.transform(this.num, `.${this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-DecimalLimit']}-${this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-DecimalLimit']}`);
                return a;
            } else if (this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-Delimiter'] != "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-RequireDecimal'] == "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-DecimalLimit'] > 0) {
                var regEx = /,/gi;
                a = this.decimalPipe.transform(this.num, `.${this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-DecimalLimit']}-${this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-DecimalLimit']}`).replace(regEx, '');
                return a;
            } else if (this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-Delimiter'] != "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas[0].KeyName + '-RequireDecimal'] != "true") {
                a = this.decimalPipe.transform(this.num, '');
                return a;
            } else {
                return this.num;
            }
        } else {
            var type = this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-Type'];
            var delimiter = this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-Delimiter'];
            var requireDecimal = this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-RequireDecimal'];
            var decimalLimit = this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-DecimalLimit'];
            var a;
            if (this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-Delimiter'] == "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-RequireDecimal'] == "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-DecimalLimit'] > 0) {
                a = this.decimalPipe.transform(this.num, `.${this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-DecimalLimit']}-${this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-DecimalLimit']}`);
                return a;
            } else if (this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-Delimiter'] != "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-RequireDecimal'] == "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-DecimalLimit'] > 0) {
                var regEx = /,/gi;
                a = this.decimalPipe.transform(this.num, `.${this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-DecimalLimit']}-${this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-DecimalLimit']}`).replace(regEx, '');
                return a;
            } else if (this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-Delimiter'] != "true" && this.lookupData[0][this.selectedFormNames][0][this.relatedFieldsfinalDatas.KeyName + '-RequireDecimal'] != "true") {
                a = this.decimalPipe.transform(this.num, '');
                return a;
            } else {
                return this.num;
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // changes.prop contains the old and the new value...
        if (changes.value != undefined) {
            this.getCalculatedData(changes.value.currentValue);
        }
    }

    ngOnDestroy() {
       // alert('destroy');
    }

}