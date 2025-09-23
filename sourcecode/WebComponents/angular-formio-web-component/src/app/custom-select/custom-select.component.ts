import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormService } from '../services/formService';
import { MatDialog } from '@angular/material/dialog';
import { FormioCustomComponent, FormioEvent } from 'angular-formio';
import _ from 'lodash';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ConstantVariables } from '../globaldependencies/constants/constant-variables';
import { FormFieldValue } from '../models/formFieldValue';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Guid } from 'guid-typescript';
import { CreateForm } from '../models/createForm';
import { FormCreationService } from '../services/form-creation.service';
import * as formUtils from 'formiojs/utils/formUtils.js';

@Component({
    selector: 'app-custom-select-component',
    templateUrl: './custom-select.component.html'
})
export class CustomSelectComponent implements FormioCustomComponent<any> {
    @ViewChild("updateDataSourceDialog") updateDataSourceDialog: TemplateRef<any>;
    disableds: boolean = false;
    importDataType: any;
    keyValue: any;
    options: any;
    dataSourceForm: FormGroup;
    isAnyOperationIsInprogress: boolean;
    dataSourceName: any;
    currentDialog: any;
    isAddOptionRequireds:boolean;
    title = "geeksforgeeks-multiSelect";
    id: number;
    upsertConfig:any;
    dataSource: any;
    multiples: boolean;
    selectedCustomAppName: any;
    selectedFormName: any;
    selectedFieldName: any;
    userCompanyIds: any;
    selectedFormData: any;
    selectedCompany: any;
    @Input() set disabled(data: any) {
        if (data != undefined && data != false && data != null) {
            this.disableds = (data == 'disabled' || data == true ? true : false);
        } else if (data != false) {
            this.disableds = true;
        }
    }
    @Input() set dataSrc(data: any) {
        if (data != undefined && data != null) {
            this.dataSource = data;
        } else{
            this.dataSource='values';
        }
    }
    @Input() isAddOptionRequired : any
    @Input() isMultiSelectOptionRequired: any;
    @Input() set selectedForm(data: any) {
        if (data) {
            this.selectedFormData = data;
        }
    }
    @Input() set upsertDataConfig(data: any) {
        if (data) {
            this.upsertConfig = data;
        }
    }
    @Input() set customAppName(data: any) {
        if (data) {
            this.selectedCustomAppName = data;
        }
    }
    @Input() set companyName(data: any) {
        if (data) {
            this.selectedCompany = data;
        }
    }
    @Input() set formName(data: any) {
        if (data) {
            this.selectedFormName = data;
        }
    }
    @Input() set fieldName(data: any) {
        if (data) {
            this.selectedFieldName = data;
            this.getFieldValues()
        }
    }
    @Input() placeholder:any;
    @Input() value: any;
    @Input() set data(data: any) {
        if (data && this.dataSource == 'values') {
            this.options = data.values;
            // if(this.options.length>0){
            //     if(this.options.toString() == [{label:'',value:''}].toString()){
            //         this.options = [];
            //     } else if(this.options[0].toString() == {label:'',value:''}.toString()){
            //         this.options.splice(0,1);
            //     } else if(this.options[this.options.length-1].toString() == {label:'',value:''}.toString()){
            //         this.options.splice(this.options.length-1,1);
            //     }
            // }
        } else if(data && this.dataSource == 'url'){
            this.getCustomSelectData(data.url);
        }
    }
    @Input() set key(data: any) {
        if (data) {
            this.keyValue = data;
        }
    }
    @Output() valueChange = new EventEmitter<any>();
    @Output() formioEvent = new EventEmitter<FormioEvent>();
    constructor(private cdRef: ChangeDetectorRef, public dialog: MatDialog, private formService:FormService, private datePipe: DatePipe, private decimalPipe: DecimalPipe) {
            this.clearForm();
            this.userCompanyIds = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.map(x => x?.companyId).toString();
    }

    ngOnInit() {
    }

    upsertDataSource(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var option = this.dataSourceForm.value.name.toString().trim();
        if(this.dataSource=="values"){
            this.formioEvent.emit({ eventName: 'customEvent', data: { data: option, type: 'myCustomSelect', key: this.keyValue } });
        }
        else if(this.dataSource=="url"){
            this.upsertDataIntoTables(option);
        }
        this.closeDataSource();
    }
    upsertDataIntoTables(option){
        let paramName = this.upsertConfig.paramName;
            this.formService
              .UpsertCustomSelectData(this.upsertConfig.url,{[paramName]:option})
              .subscribe((result: any) => {
                if (result.success) {
                    this.options.push({label:option, value:option});
                } else {
                }
                this.cdRef.detectChanges();
              });
    }
    clearForm() {
        this.dataSourceName = null;
        this.isAnyOperationIsInprogress = false;
        this.dataSourceForm = new FormGroup({
            name: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }
    openDataSourcePopup() { 
        let dialogId = "contract-template-dialog-"+this.selectedCustomAppName;
        this.id = setTimeout(() => {
            this.currentDialog = this.dialog.getDialogById(dialogId);
        }, 1200)
        let height= "90%";
        let width= "90%";
        if(this.dataSource == 'custom'){
            height= "90%";
            width= "90%";
        } else{
            height= "40%";
            width= "50%";
        }
        const dialogRef = this.dialog.open(this.updateDataSourceDialog, {            
            height: height,
            width: width,
            id: dialogId,
            data: {
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.cdRef.detectChanges();
        });
    }
    closeDataSource(){
        this.currentDialog.close();
    }
    GetFormRecordValues(event) {
            this.value = event;
            this.valueChange.emit(event);
    }
    
  getCustomSelectData(url) {
    this.formService
      .GetCustomSelectData(url)
      .subscribe((result: any) => {
        if (result.success) {
            this.options=result.data;
        } else {
        }
        this.cdRef.detectChanges();
      });
  }
  getFieldValues() {
    if ((this.selectedFormName != null && this.selectedFieldName != null && this.selectedCustomAppName != undefined && this.selectedCustomAppName != null && this.selectedFormName != undefined && this.selectedFieldName != undefined)) {
        const formField = new FormFieldValue();
        formField.FormId = this.selectedFormName;
        formField.Key = this.selectedFieldName;
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
                    if (!_.isEqual(this.options, selectData)) {
                        this.options = selectData;
                    }
                }
                if (response.success == false) {

                }
                this.cdRef.detectChanges();
            });
    }
}
refreshList(){
    this.getFieldValues();
    this.closeDataSource();
    this.formioEvent.emit({ eventName: 'customEvent', data: { type: 'refresh' } });
}
    valueChangeEvent(event) {
        if (this.isMultiSelectOptionRequired) {
            // let value=[];
            // event.forEach(element => {
            //     value.push(element.value);
            // });
            let value = this.value.toString();
            this.valueChange.emit(value);
        } else {
            this.valueChange.emit(this.value);
        }
    }
    getValue(){
        if(this.value !=undefined)
        return this.value;
    }

}