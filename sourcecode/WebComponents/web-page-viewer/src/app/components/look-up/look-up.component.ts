import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormioCustomComponent, FormioEvent } from 'angular-formio';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import _ from 'lodash';
import { BehaviorSubject, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { FormService } from 'src/app/services/formService';
import { FormFieldValue } from 'src/app/models/formFieldValue';
import { FormRelatedFieldValue } from 'src/app/models/formRelatedFieldValues';

@Component({
    selector: 'app-look-up-component',
    templateUrl: './look-up.component.html',
    styleUrls: ['look-up.component.scss']
})
export class LookUpComponent implements FormioCustomComponent<any> {
    lookupDropDownData$: any;
    lookupDropDownDataSubject = new BehaviorSubject([]);
    userCompanyIds: any;
    disableds: boolean = false;
    lookupDropDownData: any = [];
    lookupData: any = [];
    RelatedFieldsLabels: any;
    Relatedfields: any;
    relatedFieldsfinalDatas: any;
    valueType: any;
    fieldNames: any;
    selectedFormNames: any;
    selectedFormIds: any;
    importDataType: any;
    keyValue: any;
    isLookuPdata: any = false;
    selectionLimit: any;
    table: string;
    formNames: any;
    isLookupValuesGetInprogress: boolean = false;
    lookUpChildData: any[] = [];
    @Input() filterFieldsBasedOnForm: any
    @Input() filterFormName: any;
    pageNumber: any;
    searchValue: any;
    searching: any = false;
    @Input() set disabled(data: any) {
        if (data != undefined && data != false && data != null) {
            this.disableds = data == 'disabled' || data == true ? true : false;
        } else if (data != false) {
            this.disableds = true;
        }
        console.log('disabled', this.disabled);
    }
    @Input() value: any;
    @Input() set valueSelection(data: any) {
        if (data) {
            this.valueType = data;
        }
    }
    @Input() set key(data: any) {
        if (data) {
            this.keyValue = data;
        }
    }
    @Input() set selectedFormId(data: any) {
        if (data) {
            this.selectedFormIds = data;
            // if (this.fieldNames)
            this.getFieldValues();
        }
    }
    @Input() set selectedFormName(data: any) {
        if (data) {
            this.selectedFormNames = data;
        }
    }
    @Input() set valueSelectionLimit(data: any) {
        if (data) {
            if (!this.selectionLimit || (this.selectionLimit && this.selectionLimit != data)) {
                this.selectionLimit = data;
                // if(this.selectionLimit > 0){
                // if(this.value && this.fieldNames && this.relatedFieldsfinalDatas)
                this.GetFormRecordValues(this.value);
                // }
            }
        }
    }
    @Input() set fieldName(data: any) {
        if (data) {
            this.fieldNames = data;
            this.getFieldValues();
        }
    }
    @Input() set formName(data: any) {
        if (data) {
            if (!this.formNames || (this.formNames && this.formNames != data)) {
                this.formNames = data;
                // if (this.selectedFormIds)
                this.getFieldValues();
                // if(this.value && this.fieldNames && this.relatedFieldsfinalDatas)
                this.GetFormRecordValues(this.value);
            }
        }
    }
    @Input() set relatedFieldsfinalData(data: any) {
        if (data) {
            if (!this.relatedFieldsfinalDatas || (this.relatedFieldsfinalDatas && this.relatedFieldsfinalDatas != data)) {
                this.relatedFieldsfinalDatas = data;
                // if(this.value && this.fieldNames && this.relatedFieldsfinalDatas)
                this.GetFormRecordValues(this.value);
            }
        }
    }
    @Output() valueChange = new EventEmitter<any>();

    @Output() formioEvent = new EventEmitter<FormioEvent>();
    offset: any = 0;
    limit: any = 30;
    total = 148;
    canLoadValues: boolean = true;
    ngSelectSearch = new FormControl();
    constructor(private cdRef: ChangeDetectorRef, private formService: FormService
        , public dialog: MatDialog,  private datePipe: DatePipe,
        private decimalPipe: DecimalPipe) {
            this.userCompanyIds = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.map(x => x?.companyId).toString();
    }

    ngOnInit() {
        this.lookupDropDownData$ = of(this.lookupDropDownDataSubject);
        // this.ngSelectSearch.valueChanges.subscribe((val) => { 
        //     this.searchValue = val;
        //     this.getFieldValues(true);
        // });
        this.searchItem = _.debounce(this.searchItem, 1000);
    }
    searchItem(event: any) {
        this.searchValue = true;
        this.canLoadValues = true;
        this.searchValue = event;
        this.getFieldValues(true);
    }
    clearFormFieldValue() {
        // this.value = undefined;
        if(this.value)
            this.formioEvent.emit({ eventName: 'customEvent', data: { data: this.lookUpChildData, type: 'mylookup', key: this.keyValue, selectionType: this.valueType, value: this.value, isDelete: true } });
            this.lookupData = [];
            this.lookUpChildData = [];
            this.value = undefined;//remove this line if refreshForm event is emitted from here
    }
    getFieldValues(onLoad: boolean = true) {
        const el = document.getElementById('lookup-formio-class');
        const r1 = el && el.closest("#form-builder");
        console.log(Boolean(r1));
        if(r1) {
            return;
        }
        if ((this.selectedFormIds != null && this.fieldNames != null && this.selectedFormIds != undefined && this.fieldNames != undefined) || (this.formNames != null && this.fieldNames != null && this.formNames != undefined && this.fieldNames != undefined)
        && this.canLoadValues == true) {
            onLoad ? this.pageNumber = 1 : this.pageNumber = this.pageNumber  + 1;
            const formField = new FormFieldValue();
            this.selectedFormIds = this.formNames;
            formField.FormId = this.selectedFormIds;
            formField.Key = this.fieldNames;
            formField.companyIds = this.userCompanyIds;
            formField.filterFieldsBasedOnForm = this.filterFieldsBasedOnForm;
            formField.filterFormName = this.filterFormName;
            formField.isPagingRequired = true;
            formField.pageNumber = this.pageNumber;
            formField.pageSize = this.limit;
            formField.filterValue = this.searchValue;
            formField.value = this.pageNumber == 1 ? this.value : '';
            this.searching = true;
            this.formService
                .GetFormFieldValues(formField)
                .subscribe((response: any) => {
                    console.log(response);
                    if (response.success == true) {
                        let selectData = [];
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
                        if((!selectData || (selectData && selectData.length < 1))) {
                            this.canLoadValues = false;
                        }
                        if(response.data && response.data.fieldValues && response.data.fieldValues?.length && response.data.fieldValues?.length > 0 && this.value) {
                            var ind = response.data.fieldValues.find(x => x.toLowerCase() == this.value.toLowerCase());
                            if(ind) {

                            } else {
                                selectData.push({ label: this.value, value: this.value });
                            }
                        }
                        selectData = Array.from([...new Set(selectData.map(x => x.value))]).map(value => {
                            return { value: value, label: selectData.find(y => y.value == value).label}
                          } );
                        if(this.pageNumber == 1) {
                            selectData && selectData.length > 0 ? (this.lookupDropDownData = selectData, this.lookupDropDownDataSubject.next(this.lookupDropDownData)) : (this.lookupDropDownData = [], this.lookupDropDownDataSubject.next(this.lookupDropDownData));
                        }
                        else if (!_.isEqual(this.lookupDropDownData, selectData) && selectData && selectData.length > 0) {
                            onLoad ? this.lookupDropDownData = selectData :  this.lookupDropDownData.push(...selectData);
                            this.lookupDropDownDataSubject.next(this.lookupDropDownData);
                        } 
                        // else if(!_.isEqual(this.lookupDropDownData, selectData) && this.searchValue && selectData && selectData.length > 0) {
                        //     onLoad ? this.lookupDropDownData = selectData :  this.lookupDropDownData.push(...selectData);
                        //     this.lookupDropDownDataSubject.next(this.lookupDropDownData);
                        // } else if(!_.isEqual(this.lookupDropDownData, selectData) && this.searchValue){
                        //     this.lookupDropDownData = selectData;
                        //     this.lookupDropDownDataSubject.next(this.lookupDropDownData);
                        // }
                        this.isLookuPdata = true;
                    }
                    if (response.success == false) {

                    }
                    this.searching = false;
                    this.cdRef.detectChanges();
                });
        }
    }
    GetFormRecordValues(event) {
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
            formRelatedFieldValue.FormsModel = this.relatedFieldsfinalDatas;
            formRelatedFieldValue.KeyValue = this.value;
            formRelatedFieldValue.KeyName = this.fieldNames;
            formRelatedFieldValue.PageSize = this.selectionLimit;
            formRelatedFieldValue.companyIds = this.userCompanyIds;
            // if(this.valueType == 'latest') {
            //         this.lookUpChildData = [{"textField": "this is the text"}];
            // }
            // this.formioEvent.emit({ eventName: 'customEvent', data: { data: this.lookUpChildData, type: 'mylookup', key: this.keyValue } });
            this.formService
                .GetFormRelatedFieldValues(formRelatedFieldValue)
                .subscribe((response: any) => {
                    console.log(response);
                    if (response.success == true && response.data) {
                        this.lookupData = response.data;
                        if (this.valueType == 'latest') {
                            this.lookUpChildData = [];
                            for (let j = 0; j < this.relatedFieldsfinalDatas.length; j++) {
                                this.lookUpChildData = this.lookupData[0][this.selectedFormNames][0];
                            }
                            if (this.lookUpChildData) {
                                var keys = Object.keys(this.lookUpChildData).filter((x: any) => (!x.includes("-Type") && x != "RowNo" && !x.includes("-Format")));
                                keys.forEach((item, index) => {
                                    if (this.lookUpChildData[item + '-Type'] == 'number') {
                                        this.lookUpChildData[item] = +this.lookUpChildData[item];
                                    }
                                });
                                this.formioEvent.emit({ eventName: 'customEvent', data: { data: this.lookUpChildData, type: 'mylookup', key: this.keyValue, selectionType: 'latest', value: this.value } });
                            }
                        }
                        if (this.valueType == 'more') {
                            var lookUpChildData = this.lookupData[0][this.selectedFormNames];
                            if (lookUpChildData) {
                                lookUpChildData.forEach(lookUpChildData => {
                                    var keys = Object.keys(lookUpChildData).filter((x: any) => (!x.includes("-Type") && x != "RowNo" && !x.includes("-Format")));
                                    keys.forEach((item, index) => {
                                        if (lookUpChildData[item + '-Type'] == 'number') {
                                            lookUpChildData[item] = +lookUpChildData[item];
                                        }
                                    })
                                });
                                this.formioEvent.emit({ eventName: 'customEvent', data: { data: lookUpChildData, type: 'mylookup', key: this.keyValue, selectionType: 'more', value: this.value} });
                            }
                            var keysList: any = [];
                            var formAndKeys: any = [];
                            this.table = '<table class="table table-bordered"><tbody><tr>';
                            formAndKeys = this.relatedFieldsfinalDatas.map(e => ({ FormName: e.FormName }));
                            formAndKeys = [...new Set(formAndKeys.map(x => x.FormName))].map(y => ({ FormName: y }));
                            formAndKeys.forEach(element => {
                                var keys = this.relatedFieldsfinalDatas.filter(e => e.FormName == element.FormName).map(k => (k.KeyName));
                                element.keys = keys;
                            });
                            for (let j = 0; j < this.relatedFieldsfinalDatas.length; j++) {
                                const label = this.relatedFieldsfinalDatas[j]['label'];
                                keysList.push(this.relatedFieldsfinalDatas[j]['KeyName']);
                                this.table = this.table + '<td style="font-weight:bold;"> <span><b>' + label + '</b></span> </td>';
                            }
                            this.table = this.table + '</tr>';
                            for (let j = 0; j < formAndKeys.length; j++) {
                                const formname = formAndKeys[j]['FormName'];
                                const formdata = this.lookupData[0][formname];
                                for (let k = 0; k < formdata.length; k++) {
                                    this.table = this.table + '<tr>';
                                    var keyList = formAndKeys[j].keys;
                                    for (let a = 0; a < keyList.length; a++) {
                                        const KeyName = keyList[a];
                                        if (formdata[k][KeyName] == undefined) {
                                            this.table = this.table + '<td> <span> </span> </td>';
                                        } else {
                                            this.table = this.table + '<td> <span>' + formdata[k][KeyName] + '</span> </td>';
                                        }
                                    }
                                    this.table = this.table + '</tr>';
                                }
                            }
                            this.table = this.table + '</tbody></table>';
                        }
                    }
                    if (response.success == false) {

                    }
                    this.isLookupValuesGetInprogress = false;
                });
        }
    }
    getdata(data) {
        // return 'this is the text';
        if (this.lookupData != null && this.lookupData.length > 0 && this.lookupData != undefined && data != null && data != undefined) {
            if (this.lookupData[0][this.selectedFormNames][0][data.KeyName]) {
                var type = this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-Type'];
                if (type == 'datetime' || type == 'mydatetime' || type == 'mylinkdatetime') {
                    if (this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-Format']) {
                        return this.datePipe.transform(this.lookupData[0][this.selectedFormNames][0][data.KeyName], this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-Format']);
                    } else {
                        return this.datePipe.transform(this.lookupData[0][this.selectedFormNames][0][data.KeyName], 'yyyy-MM-dd hh:mm a');
                    }
                } else if (type == 'number') {
                    var num = this.lookupData[0][this.selectedFormNames][0][data.KeyName];
                    var a;
                    if (this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-Delimiter'] == "true" && this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-RequireDecimal'] == "true" && this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-DecimalLimit'] > 0) {
                        a = this.decimalPipe.transform(num, `.${this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-DecimalLimit']}-${this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-DecimalLimit']}`);
                        return a;
                    } else if (this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-Delimiter'] != "true" && this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-RequireDecimal'] == "true" && this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-DecimalLimit'] > 0) {
                        var regEx = /,/gi;
                        a = this.decimalPipe.transform(num, `.${this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-DecimalLimit']}-${this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-DecimalLimit']}`).replace(regEx, '');
                        return a;
                    } else if (this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-Delimiter'] != "true" && this.lookupData[0][this.selectedFormNames][0][data.KeyName + '-RequireDecimal'] != "true") {
                        a = this.decimalPipe.transform(num, '');
                        return a;
                    } else {
                        return num;
                    }
                } else {
                    return this.lookupData[0][this.selectedFormNames][0][data.KeyName];
                }
            }
            else return '';
        }
        else return '';
    }
    ngOnChanges(changes: SimpleChanges) {
        // changes.prop contains the old and the new value...
        if (changes.value != undefined) {
            this.GetFormRecordValues(changes.value.currentValue);
            if(changes.value.currentValue != changes.value.previousValue) {
                this.getFieldValues();
            }
        }
    }
}