import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Guid } from "guid-typescript";
import { FormBuilderService } from "../services/formBuilderService";

@Component({
    selector: 'app-form-component',
    template: `<div id="style-1" class="form-builder-height full-height" style="overflow-x: hidden;">
    <formio [form]="formJson" [readOnly]="true" *ngIf="formJson && isPreview && !isEdit"></formio>
    <formio [form]="formJson" [submission]="formData" [readOnly]="isPreview" (change)="submissionChanges($event)" (onSubmit)="submissionChanges($event)" *ngIf="isEdit"></formio>
    <form-builder [form]="formJson" [options]="options" (change)="onChange($event)" *ngIf="formJson && !isPreview && !isEdit"></form-builder>
        </div>`
})
export class CustomFormBuilderComponent implements OnInit {
    @Input() set form(data: any) {
        console.log(data);
        this.updateData(data);
    }
    @Input() set preview(data: boolean) {
        this.isPreview = data;
    }

    @Input() set formSubmissionData(data: any) {
        console.log("formSubmissionData", data);
        this.formData = data;
        this.isEdit = true;
    }

    @Output() emitFormEvent = new EventEmitter<any>();
    @Output() submissionEvent = new EventEmitter<any>();
    formJson: any;
    formOutput: any;
    options: any;
    isPreview: boolean;
    isEdit: boolean;
    formData: any;

    constructor(private formBuilderService: FormBuilderService) {
        this.formOutput = { components: [] };
        this.options = this.formBuilderService.getOptions();
    }
    ngOnInit() {

    }

    updateData(data) {
        this.formOutput = { components: [] };
        let updatedNewComponents = [];
        if (data.Components) {
            let components = data.Components;
            console.log(components);
            if (components && components.length > 0) {
                components.forEach((comp) => {
                    let values = [];
                    let keys = Object.keys(comp);
                    keys.forEach((key) => {
                        values.push(comp[key]);
                        let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                        let idx = keys.indexOf(key);
                        if (idx > -1) {
                            keys[idx] = updatedKeyName;
                        }
                    })
                    var updatedModel = {};
                    for (let i = 0; i < keys.length; i++) {
                        updatedModel[keys[i]] = values[i];
                    }
                    updatedNewComponents.push(updatedModel);
                })
            }
            this.formOutput.components = updatedNewComponents;
            this.formJson = this.formOutput;
            this.emitFormEvent.emit(this.formOutput);
            this.formBuilderService.setDataSourceComponentInEdit(this.formJson);
        }
        else if (data.components) {
            this.formJson = data;
        }
    }

    onChange(event) {
        if (event.form != undefined) {
            if (event.component.type == 'datasource') {
                event = this.formBuilderService.getDataSourceComponent(event);
            }
            if (event.component.type == 'lookup' && event.type == 'addComponent') {
                let lastIndex = 0;
                if (event.component.relatedfield.length > 0) {
                    for (let i = 0; i < event.component.relatedfield.length; i++) {
                        const comp = {
                            input: true,
                            key: event.component.key + "_related_" + event.component.relatedfield[i],
                            label: event.component.relatedFieldsLabel[i],
                            tableView: true,
                            type: "textfield",
                            disabled: true,
                        }
                        event.form.components.splice(event.index + 1, 0, comp);
                        lastIndex = event.index + 1;
                    }
                }

                if (event.component.relatedFormsFields.length > 0) {
                    for (let i = 0; i < event.component.relatedFormsFields.length; i++) {
                        const comp = {
                            input: true,
                            key: event.component.key + "_related_" + event.component.relatedFormsFields[i],
                            label: event.component.relatedFormFieldsLabel[i],
                            tableView: true,
                            type: "textfield",
                            disabled: true,
                        }
                        event.form.components.splice(lastIndex + 1, 0, comp);
                    }
                }
            }
            if (event.component.type == 'myfileuploads') {
                if (Object.keys(event.component.properties).length >= 0) {
                    if (event.component.properties.referenceTypeId != undefined) {
                        if (!Guid.isGuid(event.component.properties.referenceTypeId)) {
                            let guid = Guid.create();
                            event.component.properties.referenceTypeId = guid['value'];
                        }
                    } else {
                        event.component.properties['referenceTypeId'] = Guid.create()['value'];
                    }
                }
            }
            this.formOutput = event.form;
        }
        this.emitFormEvent.emit(this.formOutput);
    }


    submissionChanges(event) {
        this.submissionEvent.emit(event);
    }

    // onChangeColor(colorPicker) {
    //     this.yourColor = colorPicker.value;
    //     const formbuilderElements = Array.from(
    //       document.getElementsByClassName('formarea')
    //     );
    
    //     console.log(formbuilderElements);
    
    //     formbuilderElements.forEach((x) => {
    //       x.id = 'colorId'
    //     })
    //     let myElement = document.getElementById("colorId");
    //     myElement.style.backgroundColor = this.yourColor;
    
    //   }
}