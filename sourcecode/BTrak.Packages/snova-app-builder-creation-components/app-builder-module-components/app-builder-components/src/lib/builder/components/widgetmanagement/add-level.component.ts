import { Component, Inject, EventEmitter, Output, Input } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { CustomTagModel } from "../../models/custom-tags.model";
import { GenericFormService } from "../genericForm/services/generic-form.service";

@Component({
    selector: "add-level-dialog",
    templateUrl: "add-level.component.html"
})

export class AddLevelDialogComponet extends CustomAppBaseComponent {
    levelForm: FormGroup;
    isEdit: any;
    dataItem: any;
    customApplicationId: any;
    validationMessage: any;
    pdfTemplates: any=[];

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.clearForm();
            this.isEdit=this.matData.isEdit;
            this.pdfTemplates=this.matData.pdfTemplates;
            this.customApplicationId=this.matData.customApplicationId;
            this.dataItem=this.matData.dataItem;
            this.levelForm.patchValue(this.dataItem);
            this.levelForm.controls['pdfTemplate'].setValue(this.findPdfTemplatewithId(this.dataItem.pdfTemplate));
        }
    }
    isAnyOperationIsInprogress:boolean;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    @Output() isReloadRequired = new EventEmitter<boolean>();
    tempPdfParams: any = [];
    pdfParameters = null;

    constructor(
        public dialog: MatDialog,
        public CreateAppDialog: MatDialogRef<AddLevelDialogComponet>,private genericFormService: GenericFormService,
        public toastr:ToastrService,public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any,private toaster: ToastrService) {
        super();
    }

    ngOnInIt() {
        super.ngOnInit();
    }

    closeUpsertLevelPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.currentDialog.close();
        this.clearForm();
    }
    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.levelForm = new FormGroup({
            id: new FormControl(null),
            level: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.min(1)
                ])
            ),
            levelName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            pdfTemplate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            displayName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            path: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(500)
                ])
            ),
            apiKey: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(500)
                ])
            ),
            parameters: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(500)
                ])
            ),
        })
    }
    upsertLevel(form){
        if(!this.isAnyOperationIsInprogress)
        {
        this.isAnyOperationIsInprogress = true;
        const levelModel =this.levelForm.value;
        levelModel.pdfTemplate = levelModel.pdfTemplate._id;
        if(this.isEdit){
        levelModel.id = this.dataItem.id;
        }
        // levelModel.pdfTemplate=this.levelForm.value.pdfTemplate[0];
        levelModel.customApplicationId=this.customApplicationId;
                this.genericFormService.upsertLevel(levelModel).subscribe((result: any) => {
                    if (result.success === true) {
                        if(!this.isEdit){
                            this.toaster.success("Level Added successfully");
                        } else{
                            this.toaster.success("Level Updated successfully");
                        }
                        this.currentDialog.close();
                    } else {
                        var validationMessage = result.apiResponseMessages[0].message;
                        this.toaster.error(validationMessage);
                    }
                    this.isAnyOperationIsInprogress = false;
                });
            }
    }
    pdfSelected(template){
        var selectedPdfTemplateId = template.value._id;
        if(selectedPdfTemplateId!=null)
        this.getPdfParameters (selectedPdfTemplateId);

    }

    getPdfParameters(templateId) {
          this.genericFormService.getTreeData(templateId).subscribe((result: any) => {
            let response = result.data;
            this.tempPdfParams = [];
            // if (response) {
            //   response.map((parent: any) => {
            //      parent.mongoResult = JSON.parse(parent.mongoResult);
            //      this.pushChildElementsToMenu(parent.mongoResult);
            //   })
            // }
            if(response!=null && response[0]!=null && response[0].mongoParamsType!=null)
            {
                response[0].mongoParamsType.forEach((param) => {
                    this.tempPdfParams.push(param.name) 
                });  
            }
            this.pdfParameters = this.tempPdfParams.length>0 ? this.tempPdfParams.join(",") : "";
            this.levelForm.controls['parameters'].setValue(this.pdfParameters);
          })
      }
    
    pushChildElementsToMenu(parent) {
        for (var prop in parent) {
          if (Object.prototype.hasOwnProperty.call(parent, prop) && prop != "_id") {
            if (parent[prop] && parent[prop] != null && parent[prop] !="null" ) {
              if(parent[prop].constructor && parent[prop].constructor.name === "Object")
              this.pushChildElementsToMenu(parent[prop]);
            }
            else {
              this.tempPdfParams.push(prop);
            }
          }
        }
      }

      findPdfTemplatewithId(pdfTemplate){
        let pdf = this.pdfTemplates.find(x=> x._id === pdfTemplate);
        if(pdf){
            return pdf;
        } else{
            return "";
        }
    }
    omit_special_char(event) {
        var inp = String.fromCharCode(event.keyCode);
        // Allow only alpahbets
        if (/[a-zA-Z]/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }
      numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
      }
}
