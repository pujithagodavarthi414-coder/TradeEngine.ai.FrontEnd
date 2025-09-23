import { Component, Inject, Input } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";

@Component({
    selector: "genericform-import-dialog",
    templateUrl: "./genericform-imports-dialog.html"
})
export class GenericFormImportDialogComponent {
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            if (this.matData.data)
                this.checkOutputData(JSON.parse(this.matData.data));
        }
    }
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    customAppHeaders: any[];
    mappingName = null;
    mappingsList: any = [];
    mappingId: string;
    mappingJson: any;
    timeStamp: any;
    sheets: any = [];
    forms: any = [];
    public formGroups: FormGroup = new FormGroup({ items: new FormArray([]) });

    constructor(public dialog: MatDialog, public importDialog: MatDialogRef<GenericFormImportDialogComponent>, @Inject(MAT_DIALOG_DATA)
    public data: any) {


    }

    checkOutputData(outputdata) {

        if (outputdata != null && outputdata !== undefined) {
            if (outputdata.mappingName != null && outputdata.mappingName !== undefined) {
                this.mappingName = outputdata.mappingName;
                this.mappingId = outputdata.selectedMappingId;
            }
            if (outputdata.mappingsList != null && outputdata.mappingsList !== undefined) {
                this.mappingsList = outputdata.mappingsList;
            }
            this.sheets = outputdata.sheets;
            this.forms = outputdata.forms;
            if (this.mappingName == null) {
                this.sheets.forEach((sheet: any) => {
                    let formnotFound = true;
                    this.forms.forEach((form) => {
                        if (sheet.sheetName.trim().toLowerCase() === form.formName.trim().toLowerCase()) {
                            formnotFound = false;
                            this.checkSheetValidations(sheet, form.formId);
                        }
                    });
                    if (formnotFound) {
                        let index = 0;
                        sheet.excelHeaders.forEach((header) => {
                            const sample = sheet.sheetData[0];
                            const keyvalue = sample.formKeyValuePairs[index];
                            const validation = {
                                excelHeader: header,
                                isItGoodToImport: false,
                                sampleData: keyvalue.value
                            }
                            sheet.importValidations.push(validation);
                            index++;
                        });
                    }
                });
            } else {
                this.mappingJson = JSON.parse(outputdata.mappingJson);
                this.matchWithMapping(true);
            }
        }
    }
    checkSheetValidations(sheet: any, formId: any) {
        const index = this.forms.findIndex((p) => p.formId === formId);
        const form = this.forms[index];
        sheet.customAppHeaders = form.labelKeyPairs;
        sheet.selectedFormId = form.formId;
        sheet.importValidations = [];
        let keyIndex = 0;
        sheet.excelHeaders.forEach((header) => {
            let headerSplit = header.split("[");
            let headerName;
            if(headerSplit.length > 0) {
                headerName = headerSplit[0];
            }
            const sample = sheet.sheetData[0];
            const keyvalue = sample.formKeyValuePairs[keyIndex];
            let validation = {
                formHeader: null,
                excelHeader: header,
                isItGoodToImport: false,
                sampleData: keyvalue.value
            }
            form.labelKeyPairs.forEach((keyPairs) => {
                if (keyPairs.label && keyPairs.label.trim().toLowerCase() === headerName.trim().toLowerCase()) {
                    validation = {
                        formHeader: keyvalue.key,
                        excelHeader: header,
                        isItGoodToImport: true,
                        sampleData: keyvalue.value
                    }
                }
            });
            sheet.importValidations.push(validation);
            keyIndex++;
        });
    }

    MapUsingMappingJson(sheet: any, formId: any) {
        const index = this.forms.findIndex((p) => p.formId === formId);
        const form = this.forms[index];
        sheet.customAppHeaders = form.labelKeyPairs;
        sheet.selectedFormId = form.formId;
        sheet.importValidations = [];
        let keyIndex = 0;
        sheet.excelHeaders.forEach((header) => {
            let headerSplit = header.split("[");
            let headerName;
            if(headerSplit.length > 0) {
                headerName = headerSplit[0];
            }
            const sample = sheet.sheetData[0];
            const keyvalue = sample.formKeyValuePairs[keyIndex];
            let validation = {
                formHeader: null,
                excelHeader: header,
                isItGoodToImport: false,
                sampleData: keyvalue.value
            }
            form.labelKeyPairs.forEach((keyPairs) => {
                if (keyPairs.label && keyPairs.label.trim().toLowerCase() === headerName.trim().toLowerCase()) {
                    validation = {
                        formHeader: keyvalue.key,
                        excelHeader: header,
                        isItGoodToImport: true,
                        sampleData: keyvalue.value
                    }
                }
            });
            sheet.importValidations.push(validation);
            keyIndex++;
        });
    }

    MappingChanged() {
        this.sheets.forEach((sheet: any) => {
            sheet.importValidations = [];
            let formnotFound = true;
            this.mappingJson.forEach((form) => {
                if (form.sheetName.trim().toLowerCase() === sheet.sheetName.trim().toLowerCase()) {
                    sheet.selectedFormId = form.formId;
                    const originalForm = this.forms.findIndex((p) => p.formId == form.formId);
                    if (originalForm > -1) {
                        sheet.customAppHeaders = this.forms[originalForm].labelKeyPairs;
                    }
                    formnotFound = false;
                    let keyIndex = 0;
                    sheet.excelHeaders.forEach((header) => {
                        let headerSplit = header.split("[");
                        let headerName;
                        if(headerSplit.length > 0) {
                            headerName = headerSplit[0];
                        }
                        const sample = sheet.sheetData[0];
                        const keyvalue = sample.formKeyValuePairs[keyIndex];
                        let validation = {
                            formHeader: null,
                            excelHeader: header,
                            isItGoodToImport: false,
                            sampleData: keyvalue.value
                        }
                        form.formHeaders.forEach((keyPairs) => {
                            if (keyPairs.excelHeader.trim().toLowerCase() === headerName.trim().toLowerCase()) {
                                const formIndex = this.forms.findIndex((p) => p.formId == form.formId);
                                let keydata = "";
                                if (formIndex > -1) {
                                    const sample1 = sheet.sheetData[0];
                                    const keyval = sample1.formKeyValuePairs[keyIndex];
                                    keydata = keyval.value;
                                }
                                validation = {
                                    formHeader: keyPairs.formHeader,
                                    excelHeader: header,
                                    isItGoodToImport: keyPairs.isItGoodToImport,
                                    sampleData: keydata
                                }
                            }
                        });
                        sheet.importValidations.push(validation);
                        keyIndex++;
                    });
                }
            });
            if (formnotFound) {
                let index = 0;
                sheet.excelHeaders.forEach((header) => {
                    const sample = sheet.sheetData[0];
                    const keyvalue = sample.formKeyValuePairs[index];
                    const validation = {
                        excelHeader: header,
                        isItGoodToImport: false,
                        sampleData: keyvalue.value
                    }
                    sheet.importValidations.push(validation);
                    index++;
                });
            }
        });
    }

    onNoClick(submitData: boolean): void {
        if (submitData) {
            this.currentDialog.close({
                formImports: this.sheets,
                selectedMappingId: this.mappingId,
                customApplicationId: null,
                mappingName: this.mappingName,
                timeStamp: this.timeStamp
            });
        } else {
            this.currentDialog.close(null);
        }
    }

    formselected(value) {
        const index = this.mappingsList.findIndex((p) => p.mappingId == value);
        this.mappingName = this.mappingsList[index].mappingName;
        this.matchWithMapping(true);
    }

    matchWithMapping(applymapping: boolean) {
        if (this.mappingsList.length > 0) {
            const index = this.mappingsList.findIndex((p) => p.mappingName.toLowerCase() === this.mappingName.toLowerCase());
            if (index !== undefined && index != null && index > -1) {
                this.mappingId = this.mappingsList[index].mappingId;
                this.timeStamp = this.mappingsList[index].timeStamp;
                this.mappingJson = JSON.parse(this.mappingsList[index].mappingJson);
                if (applymapping) {
                    this.MappingChanged();
                }
            } else {
                this.mappingId = null;
                this.timeStamp = null;
            }
        } else {
            this.mappingId = null;
            this.timeStamp = null;
        }
    }

    isChecked(sheet, index, event) {
        sheet.importValidations[index].isItGoodToImport = event.checked;
    }

    selected(sheet, index, event) {
        sheet.importValidations[index].formHeader = event.value;
    }

    formSelected(index, event) {
        this.sheets[index].selectedFormId = event.value;
    }
}
