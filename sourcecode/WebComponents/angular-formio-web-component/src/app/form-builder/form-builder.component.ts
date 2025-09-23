import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Guid } from "guid-typescript";
import { FormBuilderService } from "../services/formBuilderService";
import {
    drawDOM,
    exportPDF,
    DrawOptions,
    Group,
} from "@progress/kendo-drawing";
import { FormService } from "../services/formService";
import { LocalStorageProperties } from "../globaldependencies/constants/localstorage-properties";
import { CookieService } from "ngx-cookie-service";

@Component({
    selector: 'app-form-builder-component',
    template: `<div id="style-1" class="form-builder-height full-height" [ngStyle]="{'background-color': formBgColor}" style="overflow-x: hidden; padding-bottom: 8% !important;">
                    <formio [form]="formJson" [readOnly]="true" *ngIf="formJson && isPreview && !isEdit"></formio>
                    <formio [form]="formJson" [submission]="formData" [readOnly]="isPreview" (change)="submissionChanges($event)" (onSubmit)="submissionChanges($event)" *ngIf="isEdit"></formio>
                    <formio [form]="formJson" [submission]="formData" [readOnly]="true" *ngIf="isformPreview"></formio>
                    <form-builder [form]="formJson" [options]="options" (change)="onChange($event)" *ngIf="formJson && !isPreview && !isEdit && !isformPreview"></form-builder>
                </div>
                <div style="left: -50000px !important; top:0px !important; position: absolute !important;">
                <div id="pdf" #pdf>
                    <formio [form]="formJsonPdf" [submission]="formData" class="formio-class"></formio>
                </div>
                </div> 
                `,
    styles: [
        `
        kendo-pdf-export {
            font-family: "DejaVu Sans", "Arial", sans-serif;
            font-size: 12px;
        }
        `,
    ],
    styleUrls: ["formio-export.component.scss"]
})
export class CustomFormBuilderComponent implements OnInit {
    @ViewChild("pdf") pdf: any;
    formPdfOutput: any;
    isApplyPermission: any;
    formBgColor: any;
    userId: any;
    @Input() set form(data: any) {
        console.log(data);
        this.updateData(data);
    }
    @Input() set formPdf(data: any) {
        this.updatePdfData(data);
    }
    @Input() set preview(data: boolean) {
        this.isPreview = data;
    }

    @Input() set generatePdfForForm(data: boolean) {
        this.isGeneratePdf = data;
        if(this.isGeneratePdf == true) {
            console.log("this.pdf", this.pdf);
            this.generatePdf(this.pdf);
        }
    }

    @Input() set formSubmissionData(data: any) {
        console.log("formSubmissionData", data);
        this.formData = data;
        this.isEdit = true;
    }
    @Input() set submissionData(data: any) {
        console.log("submissionData", data);
        this.formData = data;
        this.isformPreview = true;
    } 
    @Input() set formWithApplyPermission(data: any) {
        console.log(data);
        this.isApplyPermission = data.applyPermission;
        this.updateData(data.data);
        this.isEdit = true;
    }

    @Output() emitFormEvent = new EventEmitter<any>();
    @Output() submissionEvent = new EventEmitter<any>();
    @Output() pdfUrlEvent = new EventEmitter<any>();
    formJson: any;
    formJsonPdf: any;
    formOutput: any;
    options: any;
    isPreview: boolean;
    isGeneratePdf: boolean;
    isformPreview: boolean;
    anyOperationInProgress: boolean;
    isEdit: boolean;
    formData: any;

    constructor(private formBuilderService: FormBuilderService, private formService: FormService, private cookieService : CookieService) {
        this.formOutput = { components: [] };
        this.options = this.formBuilderService.getOptions();
    }
    ngOnInit() {
    }

    updatePdfData(data) {
        this.formPdfOutput = { components: [] };
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
            this.formPdfOutput.components = updatedNewComponents;
            this.formJsonPdf = this.formPdfOutput;
            this.formBuilderService.setDataSourceComponentInEdit(this.formJsonPdf);
        }
        else if (data.components) {
            this.formJsonPdf = data;
        }
    }
    getcaseObj(obj) {
        var objects = [];
        for (var i in obj) {
          if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == 'object') {
            objects = objects.concat(this.getcaseObj(obj[i]));
          } else if (i) {
            var updatedNewComponents = [], components;
            components = obj.components;
            if(components && components.length >=1){
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
            obj.components = updatedNewComponents;
          }
        }
        return obj;
      }
    updateData(data) {
        this.formOutput = { components: [] };
        let updatedNewComponents = [];
        if (data.Components) {
            let components = data.Components;
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
            this.formOutput = this.getcaseObj( this.formOutput)
            // var inputFormJson = this.formJson;
            // inputFormJson = this.getObjects(inputFormJson, 'key', '', false, ['']);
            // this.formJsonPdf = inputFormJson;
            // this.getFormJsonForPdf(this.formOutput);
            if (this.isApplyPermission == true) {
                this.formJson = this.disableTexbox(this.formOutput);
                console.log('Check if',this.isApplyPermission)
            }
            else {
                // this.formJson = this.disableTexbox(this.formOutput);

                this.formJson = this.formOutput;
            }
            this.emitFormEvent.emit(this.formOutput);
            this.formBuilderService.setDataSourceComponentInEdit(this.formJson);
        }
        else if (data.components) {
            
            console.log(' data if',this.isApplyPermission)
            if (this.isApplyPermission == true) {
                this.formJson = this.disableTexbox(data);
            }
            else {
                this.formJson = data;
            }
            this.emitFormEvent.emit(this.formJson);
            // var inputFormJson = this.formJson;
            // inputFormJson = this.getObjects(inputFormJson, 'key', '', false, ['']);
            // this.formJsonPdf = inputFormJson;
            // this.getFormJsonForPdf(data);
        }
    }

    getFormJsonForPdf(data) {
        var inputFormJson = data;
        inputFormJson = this.getObjects(inputFormJson, 'key', '', false, ['']);
        this.formJsonPdf = inputFormJson;
    }

    getObjects(obj, key, val, newVal, list) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjects(obj[i], key, val, newValue, list));
            } else if (i == key && obj[key] == val) {
                obj['disabled'] = newVal;
            }
            else if (i != key && !list.includes(obj[key])) {
                obj['disabled'] = false;
            }
        }
        return obj;
    }

    onChange(event) {
        if (event.form != undefined) {
            if (event.component.type == 'datasource') {
                event = this.formBuilderService.getDataSourceComponent(event);
            }
            if (event.component.type == 'mylookup' && event.type == 'addComponent') {
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
            if (event.component.type == 'myfileuploads' ) {
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
            if (event.component.type == 'livesimageupload') {
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
        if(event.data != undefined){
            this.submissionEvent.emit(event);
        }
    }

    public generatePdf(element) {
        console.log("generatePdf - element", element);
        console.log("generatePdf - element.nativeElement", element.nativeElement);
        drawDOM(element.nativeElement , {
            paperSize: "A4",
            scale: 0.5,
            margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" }
        })
        .then((group: Group) => {
            return exportPDF(group);
        })
        .then((dataUri) => {
            let fileModel = {};
            fileModel["base64"] = dataUri;
            fileModel["fileName"] = this.formData.data.invoiceId;
            fileModel["contentType"] = 'pdf';
            console.log("base64", dataUri);
            this.formService.upsertFileDetailsBase64(fileModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.pdfUrlEvent.emit(response.data.fileUrl);
                }
                else {
                }
            });
        });
    }

    downloadFile(url) {
        let filePath = url;
        const parts = filePath.split(".");
        const fileExtension = parts.pop();
        if (fileExtension == 'pdf') {
            this.downloadPdf(filePath, fileExtension);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = filePath;
            downloadLink.download = filePath.split(".").pop() + '-File' + fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf, fileExtension) {
        const parts = pdf.split("/");
        const loc = parts.pop();
        this.formService.downloadFile(pdf).subscribe((responseData: any) => {
            const fileType = fileExtension == "pdf" ? 'data:application/pdf;base64,' : 'data:text/plain;base64,';
            const linkSource = fileType + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = loc.split(".")[0] + '-' + '-File.pdf';
            downloadLink.click();
        })
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
    getObjectsForperm(obj, key, val, newVal, list) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getObjectsForperm(obj[i], key, val, newValue, list));
            }
            else if (i == key && list.includes(obj[key])) {
                if (obj['userView'] && obj['userEdit']) {
                    var isTrue = obj['userEdit'].includes(this.userId) == true ? 'write' : (obj['userView'].includes(this.userId) == true ? 'read' : 'none');
                    if (isTrue == 'none') {
                        obj['hidden'] = true;
                    } else {
                        obj['disabled'] = isTrue == 'write' ? false : true;
                    }
                } else if (obj['userView']) {
                    obj['disabled'] = obj['userView'].includes(this.userId);
                }
                else if (obj['userEdit']) {
                    obj['disabled'] = obj['userEdit'].includes(this.userId) == true ? false : true;
                }
                else {
                    obj['hidden'] = true;
                }
            }
            else if (i != key && !list.includes(obj[key])) {
                obj['disabled'] = false;
            }
        }
        return obj;
    }

    disableTexbox(inputFormJson) {
        this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId)
        var permissionComponents = ['textfield', 'textarea', 'number', 'select', 'button', 'phonenumber', 'currency', 'signature', 'myfileuploads' ,'myCustomSelect' , 'table' , 'well'];
        inputFormJson = inputFormJson;
        console.log(inputFormJson,'beforeper')
        inputFormJson = this.getObjectsForperm(inputFormJson, 'type', this.userId, false, ['textfield', 'textarea', 'number', 'select', 'button', 'phonenumber', 'currency', 'signature', 'myfileuploads' ,'myCustomSelect' , 'table' , 'well']);
        // for (var i = 0; i < inputFormJson.components.length; i++) {
        //     var data = {
        //         isEdit: null,
        //         isView: null
        //     }
        //     if ((permissionComponents.includes(inputFormJson.components[i].type) == true) && inputFormJson.components[i].userEdit && inputFormJson.components[i].userView) {

        //         for (var j1 = 0; j1 < inputFormJson.components[i].userView.length; j1++) {
        //             if (inputFormJson.components[i].userView[j1].toLowerCase() == this.userId.toLowerCase()) {
        //                 inputFormJson.components[i].disabled = true;
        //                 data.isEdit = true;
        //             }
        //         }
        //         for (var j = 0; j < inputFormJson.components[i].userEdit.length; j++) {
        //             if (inputFormJson.components[i].userEdit[j].toLowerCase() == this.userId.toLowerCase()) {
        //                 inputFormJson.components[i].disabled = false;
        //                 data.isView = true;
        //             }
        //         }
        //         if ((permissionComponents.includes(inputFormJson.components[i].type) == true) && (data.isEdit != true && data.isView != true)) {
        //             inputFormJson.components[i].hidden = true;
        //         }
        //     }
        //     else if (inputFormJson.components[i].userEdit && (permissionComponents.includes(inputFormJson.components[i].type) == true)) {
        //         for (var j = 0; j < inputFormJson.components[i].userEdit.length; j++) {
        //             if (inputFormJson.components[i].userEdit[j].toLowerCase() == this.userId.toLowerCase()) {
        //                 inputFormJson.components[i].disabled = false;
        //             } else if (inputFormJson.components[i].disabled == false) {
        //                 inputFormJson.components[i].hidden = true;
        //             }
        //         }

        //     }
        //     else if (inputFormJson.components[i].userView && (permissionComponents.includes(inputFormJson.components[i].type) == true)) {
        //         for (var j = 0; j < inputFormJson.components[i].userView.length; j++) {
        //             if (inputFormJson.components[i].userView[j].toLowerCase() == this.userId.toLowerCase()) {
        //                 inputFormJson.components[i].disabled = true;
        //             }
        //             else if (inputFormJson.components[i].disabled == true) {
        //                 inputFormJson.components[i].hidden = false;
        //             }
        //         }
        //     }
        //     else if ((permissionComponents.includes(inputFormJson.components[i].type) == true) && !inputFormJson.components[i].userEdit && !inputFormJson.components[i].userView) {
        //         inputFormJson.components[i].hidden = true;
        //     }
        //     else if (inputFormJson.components[i].type == 'table' || (inputFormJson.components[i].type == 'layout')) {
        //         if (inputFormJson.components[i].userView || inputFormJson.components[i].userEdit) {
        //             if (inputFormJson.components[i].userView) {
        //                 if (inputFormJson.components[i].userView.includes(this.userId)) {
        //                     for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
        //                         for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
        //                             for (var k in inputFormJson.components[i].rows[n][s].components) {
        //                                 if (inputFormJson.components[i].rows[n][s].components[k].userView) {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
        //                                 } else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
        //                                 }
        //                                 else {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = true;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 } else {
        //                     for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
        //                         for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
        //                             for (var k in inputFormJson.components[i].rows[n][s].components) {
        //                                 if (inputFormJson.components[i].rows[n][s].components[k].userView) {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
        //                                 } else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
        //                                 }
        //                                 else {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = true;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //             else if (inputFormJson.components[i].userEdit) {
        //                 if (inputFormJson.components[i].userEdit.includes(this.userId)) {
        //                     for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
        //                         for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
        //                             for (var k in inputFormJson.components[i].rows[n][s].components) {

        //                                 if (inputFormJson.components[i].rows[n][s].components[k].userView) {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
        //                                 } else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
        //                                 }
        //                                 else {
        //                                     inputFormJson.components[i].rows[n][s].components[k].disabled = false;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //                 else {
        //                     for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
        //                         for (var k in inputFormJson.components[i].rows[n][s].components) {
        //                             if (inputFormJson.components[i].rows[n][s].components[k].userView) {
        //                                 inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
        //                             } else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
        //                                 inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
        //                             }
        //                             else {
        //                                 inputFormJson.components[i].rows[n][s].components[k].disabled = false;
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //         else if (inputFormJson.components[i].rows) {
        //             for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
        //                 for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
        //                     for (var k in inputFormJson.components[i].rows[n][s].components) {
        //                         if (permissionComponents.includes(inputFormJson.components[i].rows[n][s].components[k].type)) {
        //                             if (inputFormJson.components[i].rows[n][s].components[k].userView) {
        //                                 inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
        //                             }
        //                             else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
        //                                 inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
        //                             }
        //                             else {
        //                                 inputFormJson.components[i].rows[n][s].components[k].hidden = true;
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //         else if (inputFormJson.components[i].columns) {
        //             for (var n = 0; n < inputFormJson.components[i].columns.length; n++) {
        //                 for (var s = 0; s < inputFormJson.components[i].columns[n].length; s++) {
        //                     for (var k in inputFormJson.components[i].columns[n][s].components) {
        //                         if (permissionComponents.includes(inputFormJson.components[i].columns[n][s].components[k].type)) {
        //                             if (inputFormJson.components[i].columns[n][s].components[k].userView) {
        //                                 inputFormJson.components[i].columns[n][s].components[k].disabled = inputFormJson.components[i].columns[n][s].components[k].userView.includes(this.userId) ? true : false;
        //                             }
        //                             else if (inputFormJson.components[i].columns[n][s].components[k].userEdit.includes(this.userId)) {
        //                                 inputFormJson.components[i].columns[n][s].components[k].disabled = inputFormJson.components[i].columns[n][s].components[k].userEdit.includes(this.userId) ? false : true;
        //                             }
        //                             else {
        //                                 inputFormJson.components[i].columns[n][s].components[k].hidden = true;
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     else if (inputFormJson.components[i].type == 'rows' || inputFormJson.components[i].type == 'columns') {
        //         if (inputFormJson.components[i].columns) {
        //             for (var n = 0; n < inputFormJson.components[i].columns.length; n++) {
        //                 for (var s = 0; s < inputFormJson.components[i].columns[n].components.length; s++) {
        //                     if (inputFormJson.components[i].columns[n].components[s].columns) {
        //                         for (var k in inputFormJson.components[i].columns[n].components[s].columns) {
        //                             for (var t in inputFormJson.components[i].columns[n].components[s].columns[k].components) {
        //                                 if (permissionComponents.includes(inputFormJson.components[i].columns[n].components[s].columns[k].components[t].type)) {
        //                                     if (inputFormJson.components[i].columns[n].components[s].columns[k].components[t].userView) {
        //                                         inputFormJson.components[i].columns[n].components[s].columns[k].components[t].disabled = inputFormJson.components[i].columns[n].components[s].columns[k].components[t].userView.includes(this.userId) ? true : false;
        //                                     }
        //                                     else if (inputFormJson.components[i].columns[n].components[s].columns[k].components[t].userEdit) {
        //                                         inputFormJson.components[i].columns[n].components[s].columns[k].components[t].disabled = inputFormJson.components[i].columns[n].components[s].columns[k].components[t].userEdit.includes(this.userId) ? false : true;
        //                                     }
        //                                     else {
        //                                         inputFormJson.components[i].columns[n].components[s].columns[k].components[t].hidden = true;
        //                                     }
        //                                 }
        //                             }

        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     else {
        //         if (inputFormJson.components[i].rows) {
        //             for (var n = 0; n < inputFormJson.components[i].rows.length; n++) {
        //                 for (var s = 0; s < inputFormJson.components[i].rows[n].length; s++) {
        //                     for (var k in inputFormJson.components[i].rows[n][s].components) {
        //                         if (permissionComponents.includes(inputFormJson.components[i].rows[n][s].components[k].type)) {
        //                             if (inputFormJson.components[i].rows[n][s].components[k].userView) {
        //                                 inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userView.includes(this.userId) ? true : false;
        //                             }
        //                             else if (inputFormJson.components[i].rows[n][s].components[k].userEdit) {
        //                                 inputFormJson.components[i].rows[n][s].components[k].disabled = inputFormJson.components[i].rows[n][s].components[k].userEdit.includes(this.userId) ? false : true;
        //                             }
        //                             else {
        //                                 inputFormJson.components[i].rows[n][s].components[k].hidden = true;
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //         else if (inputFormJson.components[i].columns) {
        //             for (var n = 0; n < inputFormJson.components[i].columns.length; n++) {
        //                 for (var s = 0; s < inputFormJson.components[i].columns[n].length; s++) {
        //                     for (var k in inputFormJson.components[i].columns[n][s].components) {
        //                         if (permissionComponents.includes(inputFormJson.components[i].columns[n][s].components[k].type)) {
        //                             if (inputFormJson.components[i].columns[n][s].components[k].userView) {
        //                                 inputFormJson.components[i].columns[n][s].components[k].disabled = inputFormJson.components[i].columns[n][s].components[k].userView.includes(this.userId) ? true : false;
        //                             }
        //                             else if (inputFormJson.components[i].columns[n][s].components[k].userEdit.includes(this.userId)) {
        //                                 inputFormJson.components[i].columns[n][s].components[k].disabled = inputFormJson.components[i].columns[n][s].components[k].userEdit.includes(this.userId) ? false : true;
        //                             }
        //                             else {
        //                                 inputFormJson.components[i].columns[n][s].components[k].hidden = true;
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }

        // }
        // var formJson = { components: inputFormJson.components }
        console.log(inputFormJson,'with per')

        return inputFormJson;
    }
}
