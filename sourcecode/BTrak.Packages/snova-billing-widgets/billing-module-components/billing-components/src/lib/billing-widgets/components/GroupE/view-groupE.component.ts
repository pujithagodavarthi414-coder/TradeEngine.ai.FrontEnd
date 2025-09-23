import { validateVerticalPosition } from "@angular/cdk/overlay";
import { DecimalPipe } from "@angular/common";
import { VariableAst, VariableBinding } from "@angular/compiler";
import { ChangeDetectorRef, Component, Inject, Input, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GRDMOdel } from "../../models/GRD-Model";
import { GroupE } from "../../models/groupE.model";
import { SiteModel } from "../../models/site-model";
import { SiteService } from "../../services/site.service";

@Component({
  selector: "view-groupe",
  templateUrl: "view-groupe.component.html"
})

export class ViewGroupEComponent {
  currentDialogId: any;
  selectedSite: any;
  selectedGrd: any;
  currentDialog: any;
  grEDetails: any;
  messageTypes: any;
  updatedMessageTypes: any;
  praFields: any[] = [];
  dFEntryFields: any[] = [];
  tvaValue: number=0;
  grdIdSelected: string;
  month: Date;
  year: Date;
  pRATotal: any;
  hbTotal: number;
  isRemainder: boolean = false;

  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      let matData = data[0];
      this.currentDialogId = matData.fromPhysicalId;
      this.grEDetails = matData.grEDetails;
      this.grds = matData.grds;
      this.sites = matData.sites;
      this.messageTypes = matData.messageTypes;
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
      
      if(this.grEDetails.praFields) {
        this.praFields = JSON.parse(this.grEDetails.praFields);
      }
      if(this.grEDetails.pRAFields) {
        this.praFields = JSON.parse(this.grEDetails.pRAFields);
      }
      if(this.grEDetails.dfFields) {
       this.dFEntryFields = JSON.parse(this.grEDetails.dfFields);
      }
      if(this.grEDetails.dFFields) {
        this.dFEntryFields = JSON.parse(this.grEDetails.dFFields);
      }
      if(this.grEDetails.messageType) {
        this.updatedMessageTypes = JSON.parse(this.grEDetails.messageType);

        let messages = this.messageTypes;
        messages.forEach(mt => {
          this.updatedMessageTypes.forEach(umt => {
            if(umt.messageId == mt.messageId && umt.isSendInMail == true){
              let formData = mt;
              let updatedData: any = {};
              updatedData = formData;
              updatedData.isSendInMail = true;
              mt = updatedData;
            }
          });
        });
        
        this.messageTypes = messages;  
      }
      this.displayOutstanding();

      this.getAutoConsumption(this.grdIdSelected);
    }
  }
  form: FormGroup;
  isGre: boolean = true;
  sites: any;
  grds: any;
  terms: [
    { name: "T1" },
    { name: "T2" },
    { name: "T3" },
    { name: "T4" }
  ];
  anyOperationIsInprogress: boolean;
  autoConsumption: number = 0;
  production: number = 0;
  reprise: number = 0;
  facturation: number = 0;
  distribution: number = 0;
  greFacturation: number = 0;
  autoCTariff: number = 0;
  greTotal: number = 0;
  autoConsumptionTotal: number = 0;
  autoConsuptionFactor: number = 0;
  administrationRomandeE:any;
  hauteTariff: number = 0;
  basTariff: number = 0;
  subTotal: number = 0;
  total: number = 0;
  tva: number = 0;
  greId: string;
  siteId: string;
  grdId: string;
  isAnyOperationIsInprogress: boolean;
  aroundi: any;
  totalValue: any;
  wholeTotalValue: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private decimalPipe: DecimalPipe, private dialog: MatDialog, private dialogRef: MatDialogRef<ViewGroupEComponent>, private dateAdapter: DateAdapter<any>, public siteService: SiteService, public cdRef: ChangeDetectorRef) {
    this.dateAdapter.setLocale('fr');
  }

  ngOnInit() {
  }
  
  getAutoConsumption(grdIdSelected) {
    const grd = this.grds.find(element => element.id === grdIdSelected);
    this.selectedGrd=grd;
    // if(this.selectedGrd.name=="GroupeE"){
    //     this.isGre=true;
    //     this.autoCTariff=this.selectedGrd.autoCTariff;
    //   } else if(this.selectedGrd.name=="RomandeE"){
    //     this.isGre=false;
    //     this.autoCTariff=this.selectedGrd.autoCTariff;
    //   }
    this.autoCTariff=this.grEDetails.autoCTariff;
    this.isGre=this.grEDetails.isGre;
    this.tvaValue = this.grEDetails.tva;
    this.totalValue = this.grEDetails.distribution;
    this.autoConsumption = Number(this.production) - Number(this.reprise);
    this.autoConsuptionFactor = (this.autoConsumption * this.autoCTariff) / 100;
    this.autoConsumptionTotal = Number(this.autoConsuptionFactor);
    this.administrationRomandeE = this.grEDetails.administrationRomandeE;
    if(this.isGre) {
      this.greTotal = Number(this.decimalPipe.transform(Number(this.totalValue),"1.1-2").replace(",",""));
      let praFields = this.praFields;
      let totalSum;
      if(praFields.length > 0) {
         totalSum =  praFields.map(a => a.enteredResult).reduce(function(a, b)
        {
          return a +b;
        });
      } else {
        totalSum = 0;
      }
     
      let pRATotal = Number(totalSum);
      let alltotal = pRATotal + Number(this.autoConsumptionTotal)
      this.pRATotal = Number(this.decimalPipe.transform(Number(alltotal), "1.1-2").replace(/,/g, ""))
    } else {
      this.greTotal = Number(this.totalValue);
      let praFields = this.praFields;
      let totalSum;
      if(praFields.length > 0) {
        totalSum =  praFields.map(a => a.enteredResult).reduce(function(a, b)
       {
         return a +b;
       });
     } else {
       totalSum = 0;
     }
      let pRATotal = Number(totalSum);
      let alltotal = pRATotal + Number(this.autoConsumptionTotal)
      this.pRATotal = Number(this.decimalPipe.transform(Number(alltotal), "1.1-2").replace(/,/g, ""))
    }
    this.subTotal = Number(this.greTotal) + Number(this.pRATotal);
    
    this.hbTotal= Number(this.decimalPipe.transform(Number(this.basTariff) + Number(this.hauteTariff),"1.1-2").replace(",",""));
    this.tva = (Number(this.subTotal) * Number(this.tvaValue)) / 100;
    this.total = Number(this.subTotal) + Number(this.tva);
    let mRound = this.total/0.05;
    let result = (mRound - Math.floor(mRound)) * 10;
    let roundedResult = Math.floor(result);
    if(roundedResult < 5) {
      mRound = Math.floor(mRound);
      let wholeTotalValue = mRound * 0.05;
      this.wholeTotalValue = Number(this.decimalPipe.transform(Number(wholeTotalValue), "1.1-2").replace(/,/g, ""));
    }
    else {
      mRound = Math.round(mRound);
      let wholeTotalValue = mRound * 0.05;
      this.wholeTotalValue = Number(this.decimalPipe.transform(Number(wholeTotalValue), "1.1-2").replace(/,/g, ""));
    
    }
    this.aroundi = this.wholeTotalValue - this.total;
    this.cdRef.detectChanges();
  }
  cancelDialog() {
    this.currentDialog.close({ success: false, redirection: true });
  }

  CommaFormatted(value) {
    if (value !=  null && value != undefined) {
      var str = value.toString().split(".");
      str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return str.join(".");
    }
  }

  displayOutstanding(){
    this.messageTypes.forEach(x => {
      if(x.isDisplay == true && x.selectedGrdIds.includes(this.grdIdSelected)){
        if(x.messageType == "Reminder" || x.messageType.toLowerCase() == "reminder" || x.messageType == "Remainder" || x.messageType.toLowerCase() == "remainder") {
          this.isRemainder = true;
        }
      }
    });
  }

  isNotRemainder(formField){
    if(formField.messageType != "Reminder" && formField.messageType != "Remainder" && formField.messageType.toLowerCase() != "reminder" 
      && formField.messageType.toLowerCase() != "remainder"){
      return true;
    }
    return false;
  }
}
