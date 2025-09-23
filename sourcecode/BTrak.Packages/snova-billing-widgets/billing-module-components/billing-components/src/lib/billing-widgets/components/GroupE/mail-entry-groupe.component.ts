import { validateVerticalPosition } from "@angular/cdk/overlay";
import { DecimalPipe } from "@angular/common";
import { VariableAst, VariableBinding } from "@angular/compiler";
import { ChangeDetectorRef, Component, Inject, Input, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { GRDMOdel } from "../../models/GRD-Model";
import { GroupE } from "../../models/groupE.model";
import { SiteModel } from "../../models/site-model";
import { SiteService } from "../../services/site.service";

@Component({
  selector: "mail-entry-groupe",
  templateUrl: "mail-entry-groupe.component.html"
})

export class MailEntryGroupEComponent {
  currentDialogId: any;
  selectedSite: any;
  selectedGrd: any;
  currentDialog: any;
  grEDetails: GroupE;
  tvaValue: number=0;
  grdIdSelected: string;
  month: Date;
  year: Date;
  hbTotal: number;
  isThankyou: boolean;
  isGeneral: boolean;
  isRemainder: boolean;
  thankyouMessage: string;
  generalMessage: string;
  remainderMessage: string;
  messageTypes: any;
  updatedMessageTypes: any;
  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      let matData = data[0];
      this.currentDialogId = matData.fromPhysicalId;
      if(matData){
        this.currentDialogId = matData.fromPhysicalId;
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    }

      this.grEDetails = matData.grEDetails;
      this.grds = matData.grds;
      this.sites = matData.sites;
      this.messageTypes = matData.messageTypes;
      this.entryFromReferenceId = this.grEDetails.id;
      this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      this.production = this.grEDetails.production;
      this.reprise = this.grEDetails.reprise;
      this.facturation = this.grEDetails.facturation;
      this.distribution = this.grEDetails.distribution;
      this.greFacturation = this.grEDetails.greFacturation;
      this.basTariff = this.grEDetails.basTariff;
      this.hauteTariff = this.grEDetails.hauteTariff;
      this.grdIdSelected = this.grEDetails.grdId;
      this.month = this.grEDetails.month;
      this.year = this.grEDetails.year;
      this.administrationRomandeE = this.grEDetails.administrationRomandeE;
      this.solarLogValueKwh = this.grEDetails.solarLogValueKwh;
      this.plannedAutoC = this.grEDetails.plannedAutoC;
      this.plannedSystem = this.grEDetails.plannedSystem;
      this.getAutoConsumption(this.grdIdSelected);

      if(this.grEDetails.messageType) {
        this.updatedMessageTypes = JSON.parse(this.grEDetails.messageType);
        this.updatedMessageTypes.forEach(umt => {
          if(umt.isSendInMail == true && umt.selectedGrdIds.includes(this.grdIdSelected)){
            if(umt.messageType == "Thank you") {
              this.isThankyou = true;
              this.thankyouMessage = umt.displayText;
            } else if(umt.messageType == "General") {
              this.isGeneral = true;
              this.generalMessage = umt.displayText;
            }
          }
        });

        this.messageTypes.forEach(x => {
          if(x.isDisplay == true && x.selectedGrdIds.includes(this.grdIdSelected)){
            if(x.messageType == "Reminder" || x.messageType.toLowerCase() == "reminder" || x.messageType == "Remainder" || x.messageType.toLowerCase() == "remainder") {
              this.isRemainder = true;
              this.remainderMessage = x.displayText;
            }
          }
        });
      }
    }
  }
  form: FormGroup;
  isGre: boolean = false;
  sites: any;
  grds: any;
  terms: [
    { name: "T1" },
    { name: "T2" },
    { name: "T3" },
    { name: "T4" }
  ];
  anyOperationIsInprogress: boolean;
  administrationRomandeE: number = 0;
  solarLogValueKwh: number = 0;
  plannedAutoC: number = 0;
  plannedSystem: number = 0;
  autoConsumption: number = 0;
  budegtPercent: number = 0;
  soitPercent: number = 0;
  production: number = 0;
  reprise: number = 0;
  facturation: number = 0;
  distribution: number = 0;
  greFacturation: number = 0;
  autoCTariff: number = 0;
  greTotal: number = 0;
  autoConsumptionTotal: number = 0;
  autoConsuptionFactor: number = 0;
  hauteTariff: number = 0;
  basTariff: number = 0;
  subTotal: number = 0;
  total: any;
  K12Value: any;
  budgetValue: any;
  tva: number = 0;
  greId: string;
  siteId: string;
  grdId: string;
  id: any;
  moduleTypeId = 16;
  referenceTypeId = ConstantVariables.EntryFormInvoiceReferenceTypeId;
  isToUploadFiles = false;
  selectedStoreId: null;
  selectedParentFolderId: null;
  entryFromReferenceId: any = null;
  isFileExist: boolean;

  isAnyOperationIsInprogress: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private toastr: ToastrService,private dialogRef: MatDialogRef<MailEntryGroupEComponent>, private dateAdapter: DateAdapter<any>, public siteService: SiteService, public cdRef: ChangeDetectorRef,
  private decimalPipe: DecimalPipe) {
    this.dateAdapter.setLocale('fr');
    if (data.dialogId) {
      this.currentDialogId = this.data.dialogId;
      this.id = setTimeout(() => {
          this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      }, 1200)
    }
  }

  ngOnInit() {
  }
  
  getAutoConsumption(grdIdSelected) {
    const grd = this.grds.find(element => element.id === grdIdSelected);
    this.selectedGrd=grd;
    if(this.selectedGrd.name=="GroupeE"){
        this.isGre=true;
        this.autoCTariff=this.selectedGrd.autoCTariff;
      } else if(this.selectedGrd.name=="RomandeE"){
        this.isGre=false;
        this.autoCTariff=this.selectedGrd.autoCTariff;
      }
    this.autoCTariff = this.selectedGrd.autoCTariff;
    this.tvaValue = this.selectedGrd.tvaValue;
    this.autoConsumption = Number(this.production) - Number(this.reprise);
    this.autoConsuptionFactor = (this.autoConsumption * this.autoCTariff) / 100;
    this.autoConsumptionTotal = Number(this.autoConsuptionFactor) + Number(this.facturation);
    this.greTotal = Number(this.greFacturation) + Number(this.distribution);
    this.subTotal = Number(this.greTotal) + Number(this.autoConsumptionTotal);
    this.hbTotal=Number(this.basTariff) + Number(this.hauteTariff);

    
      
    //this.tva = this.autoConsumption+ this.hbTotal;

    if(this.isGre == true){
      this.tva = this.autoConsumption+ this.hbTotal;
        this.total = this.decimalPipe.transform(Number(this.tva), "1.0") + "kWh"+ "(" + this.decimalPipe.transform(Number(this.hbTotal),"1.0") + "GroupeE +" 
        + this.decimalPipe.transform(Number(this.autoConsumption),"1.0") + " PV)"
    }else {
        this.tva = this.autoConsumption;
        this.total = this.decimalPipe.transform(Number(this.tva), "1.0")+ "kWh"
    }
    
    this.K12Value = this.plannedSystem; //(this.production / this.solarLogValueKwh) * 100;

    this.budgetValue = this.plannedAutoC; //(this.plannedAutoC / this.plannedSystem ) *100 ;

    this.soitPercent = (this.production * 100) / this.K12Value ;

    this.budegtPercent = (this.autoConsumption * 100) / this.production ;

    this.cdRef.detectChanges();
  }
  cancelDialog() {
    this.currentDialog.close({ success: false, redirection: true });
  }
  sendMail() {
    var grdmodel = new GRDMOdel();
    grdmodel.id=this.grEDetails.id;
    this.isAnyOperationIsInprogress = true;
    this.siteService.SendInvoice(grdmodel).subscribe((result: any) => {
      if (result.success) {
        this.cancelDialog();
      }
      else {
        this.isAnyOperationIsInprogress = false;
        this.toastr.error('',"Error occured while sending mail");
      }
    });
  }

  filesExist(event) {
    this.isFileExist = event;
  }

  closeFilePopup() {
  }
}
