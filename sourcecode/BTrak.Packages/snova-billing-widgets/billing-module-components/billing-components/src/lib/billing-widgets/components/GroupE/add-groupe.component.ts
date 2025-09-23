import { validateVerticalPosition } from "@angular/cdk/overlay";
import { DatePipe, DecimalPipe } from "@angular/common";
import { VariableAst, VariableBinding } from "@angular/compiler";
import { ChangeDetectorRef, Component, Inject, Input, ViewChildren } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { GRDMOdel } from "../../models/GRD-Model";
import { GroupE } from "../../models/groupE.model";
import { SiteModel } from "../../models/site-model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { SiteService } from "../../services/site.service";
import * as _ from "underscore";

@Component({
  selector: "app-add-groupe",
  templateUrl: "add-groupe.component.html"
})

export class AddGroupEComponent {
  @ViewChildren("convertInvoicePopup") convertInvoicePopover;
  @ViewChildren("addFieldPopUp") addFieldPopUps;
  entryFormFields: any[];
  praEntryFields: any[];
  dfFields: any[];
  selectedEvent: any;
  praFields: any[] = [];
  dFentryFields: any[] = [];
  updatedPRAFields: any[] = [];
  updateddFentryFields: any[] = [];
  entryForm: FormGroup;
  praFormFields: FormArray;
  dFFormFields: FormArray;
  currentDialogId: any;
  selectedPraField: string;
  selectedFieldName: string;
  selectedSite: any = null;
  selectedGrd: any = null;
  placeHolderName: string;
  currentDialog: any;
  grEDetails: GroupE;
  tVA: number = 0;
  grdIdSelected: string;
  month: Date;
  year: Date;
  banks: any;
  messageTypes: any;
  updatedMessageTypes: any;
  isPra: boolean;
  pRATotal: any;
  isEdit: boolean;
  wholeTotalValue: any;
  totalValue: any;
  invoiceUrl: string;

  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      let matData = data[0];
      this.currentDialogId = matData.fromPhysicalId;
      this.grEDetails = matData.grEDetails;
      this.grds = matData.grds;
      this.sites = matData.sites;
      this.banks = matData.banks;
      this.messageTypes = matData.messageTypes;
      this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      if (this.grEDetails != null && this.grEDetails != undefined) {
        this.initializeEditForm(this.grEDetails);
        this.isEdit = true;
        this.production = this.grEDetails.production;
        this.reprise = this.grEDetails.reprise;
        this.facturation = this.grEDetails.facturation;
        this.distribution = this.grEDetails.distribution;
        this.greFacturation = this.grEDetails.greFacturation;
        this.administrationRomandeE = this.grEDetails.administrationRomandeE;
        this.basTariff = this.grEDetails.basTariff;
        this.hauteTariff = this.grEDetails.hauteTariff;
        this.grdIdSelected = this.grEDetails.grdId;
        this.month = this.grEDetails.month;
        this.year = this.grEDetails.year;
        this.autoCTariff = this.grEDetails.autoCTariff;
        this.invoiceUrl = this.grEDetails.invoiceUrl;
        this.grdSelected(this.grdIdSelected);
        this.getSiteSelected(this.grEDetails.siteId);
        this.bindMessagetypes();

      } else {
        this.initializeForm();
      }
      this.getAutoConsumption();
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
  administrationRomandeE: any;
  hauteTariff: number = 0;
  basTariff: number = 0;
  subTotal: number = 0;
  total: number = 0;
  tVAForSubTotal: number = 0;
  greId: string;
  siteId: string;
  grdId: string;
  isAnyOperationIsInprogress: boolean;
  aroundi: any;
  gridInvoiceNo: string;
  isRemainder: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private decimalPipe: DecimalPipe, private toastr: ToastrService, private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddGroupEComponent>, private dateAdapter: DateAdapter<any>, public siteService: SiteService, public cdRef: ChangeDetectorRef,
    private billingsErvice: BillingDashboardService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.dateAdapter.setLocale('fr');
    this.initializeForm();
    this.clearForm();
    this.terms = [
      { name: "T1" },
      { name: "T2" },
      { name: "T3" },
      { name: "T4" }
    ];
    this.getEntryFormFields();

  }

  ngOnInit() {
  }
  initializeForm() {
    this.form = new FormGroup({
      id: new FormControl(null, []),
      siteId: new FormControl(null, Validators.compose([Validators.required])),
      GRDId: new FormControl(null, Validators.compose([Validators.required])),
      bankId: new FormControl(null, Validators.compose([Validators.required])),
      month: new FormControl(null, Validators.compose([Validators.required])),
      term: new FormControl(null, Validators.compose([Validators.required])),
      year: new FormControl(null, Validators.compose([Validators.required])),
      startDate: new FormControl(null, Validators.compose([Validators.required])),
      endDate: new FormControl(null, Validators.compose([Validators.required])),
      production: new FormControl(null, Validators.compose([Validators.required])),
      reprise: new FormControl(null, Validators.compose([Validators.required])),
      // facturation: new FormControl(null, Validators.compose([Validators.required])),
      gridInvoice: new FormControl(null, Validators.compose([Validators.required])),
      gridInvoiceName: new FormControl(null, Validators.compose([Validators.required])),
      hauteTariff: new FormControl(null, Validators.compose([Validators.required])),
      basTariff: new FormControl(null, Validators.compose([Validators.required])),
      gridInvoiceDate: new FormControl(null, Validators.compose([Validators.required])),
      //  distribution: new FormControl(null, Validators.compose([Validators.required])),
      // greFacturation: new FormControl(null, Validators.compose([Validators.required])),
      confirmDetailsfromGrid: new FormControl(false, Validators.compose([Validators.required])),
      autocTariff: new FormControl(null, Validators.compose([])),
      autoConsumption: new FormControl(null, Validators.compose([])),
      hbTotal: new FormControl(null, Validators.compose([])),
      dfTotal: new FormControl(null, Validators.compose([])),
      totalValue: new FormControl(null, Validators.compose([Validators.required])),
      // administrationRomandeE: new FormControl(null, Validators.compose([])),
      timeStamp: new FormControl(null, Validators.compose([])),
      pRAFormArray: this.formBuilder.array([]),
      dFFormArray: this.formBuilder.array([]),
      outStandingAmount: new FormControl(null, Validators.compose([])),
      // isThankYou: new FormControl(null, Validators.compose([])),
      // isGeneral: new FormControl(null, Validators.compose([])),
      // isRemainder: new FormControl(null, Validators.compose([]))
      messageType: this.formBuilder.array([]),
    });
  }
  initializeEditForm(grEDetails: any) {
    if (grEDetails.praFields) {
      this.updatedPRAFields = JSON.parse(grEDetails.praFields);
    }
    if (grEDetails.dfFields) {
      this.updateddFentryFields = JSON.parse(grEDetails.dfFields);
    }
    if (grEDetails.messageType) {
      this.updatedMessageTypes = JSON.parse(grEDetails.messageType);
    }

    this.form = new FormGroup({
      id: new FormControl(grEDetails.id, []),
      siteId: new FormControl(grEDetails.siteId, Validators.compose([Validators.required])),
      GRDId: new FormControl(grEDetails.grdId, Validators.compose([Validators.required])),
      bankId: new FormControl(grEDetails.bankId, Validators.compose([Validators.required])),
      month: new FormControl(grEDetails.month, Validators.compose([Validators.required])),
      term: new FormControl(grEDetails.term, Validators.compose([Validators.required])),
      year: new FormControl(grEDetails.year, Validators.compose([Validators.required])),
      startDate: new FormControl(grEDetails.startDate, Validators.compose([Validators.required])),
      endDate: new FormControl(grEDetails.endDate, Validators.compose([Validators.required])),
      production: new FormControl(grEDetails.production, Validators.compose([Validators.required])),
      reprise: new FormControl(grEDetails.reprise, Validators.compose([Validators.required])),
      // facturation: new FormControl(grEDetails.facturation, Validators.compose([Validators.required])),
      gridInvoice: new FormControl(grEDetails.gridInvoice, Validators.compose([Validators.required])),
      gridInvoiceName: new FormControl(grEDetails.gridInvoiceName, Validators.compose([Validators.required])),
      hauteTariff: new FormControl(grEDetails.hauteTariff, Validators.compose([Validators.required])),
      basTariff: new FormControl(grEDetails.basTariff, Validators.compose([Validators.required])),
      gridInvoiceDate: new FormControl(grEDetails.gridInvoiceDate, Validators.compose([Validators.required])),
      // distribution: new FormControl(grEDetails.distribution, Validators.compose([Validators.required])),
      // greFacturation: new FormControl(grEDetails.greFacturation, Validators.compose([Validators.required])),
      confirmDetailsfromGrid: new FormControl(grEDetails.confirmDetailsfromGrid, Validators.compose([Validators.required])),
      autocTariff: new FormControl(grEDetails.autoCTariff, Validators.compose([])),
      autoConsumption: new FormControl(grEDetails.autoCTariff, Validators.compose([])),
      hbTotal: new FormControl(grEDetails.autoCTariff),
      dfTotal: new FormControl(grEDetails.autoCTariff),
      totalValue: new FormControl(grEDetails.distribution, Validators.compose([Validators.required])),
      //administrationRomandeE: new FormControl(grEDetails.administrationRomandeE, Validators.compose([Validators.required])),
      timestamp: new FormControl(grEDetails.timeStamp),
      pRAFormArray: this.formBuilder.array([]),
      dFFormArray: this.formBuilder.array([]),
      outStandingAmount: new FormControl(grEDetails.outStandingAmount, Validators.compose([])),
      // isThankYou: new FormControl(grEDetails.isThankYou, Validators.compose([])),
      // isGeneral: new FormControl(grEDetails.isGeneral, Validators.compose([])),
      // isRemainder: new FormControl(grEDetails.isRemainder, Validators.compose([]))
      messageType: new FormControl(grEDetails.messageType, Validators.compose([])),
    });
    this.totalValue = grEDetails.distribution;
    this.gridInvoiceNo = this.form.get("gridInvoiceName").value;

  }

  getEntryFormFields() {
    let entryFormmodel: any = {};
    entryFormmodel.isArchived = false;
    this.billingsErvice.getEntryFormFields(entryFormmodel).subscribe((response: any) => {
      if (response.success) {
        this.entryFormFields = response.data;
        if (this.isEdit) {
          this.bindFormArray();
        }

      } else {
        this.toastr.error('', response.apiResponseMessages[0].message);
      }
    })
  }

  bindMessagetypes() {
    let messages = this.messageTypes;
    messages.forEach(mt => {
      this.updatedMessageTypes.forEach(umt => {
        if (umt.messageId == mt.messageId && umt.isSendInMail == true) {
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

  bindFormArray() {
    let entryFormFields = this.entryFormFields;
    let praFields = this.updatedPRAFields;
    let dFUpFields = this.updateddFentryFields;
    let grdIdSelected = this.grdIdSelected;
    let praFilteredList = _.filter(entryFormFields, function (filter) {
      let selectedGrdIds = [];
      if (filter.selectedGrdIds && filter.selectedGrdIds.length > 0) {
        let filterIds = filter.selectedGrdIds;
        selectedGrdIds = filterIds.split(",");
        selectedGrdIds = selectedGrdIds.map(x => x.toLowerCase())
      }

      return (filter.fieldTypeName == 'PRA' && filter.isDisplay == true && selectedGrdIds.toString().includes(grdIdSelected))
    })
    this.praEntryFields = praFilteredList;
    let praEntryFields = this.praEntryFields;
    if (praFields.length > 0) {
      praEntryFields.forEach((element) => {
        praFields.forEach((edited) => {
          if (edited.entryFormId == element.entryFormId) {
            this.selectedEvent = element;
            this.selectedEvent.enteredResult = edited.enteredResult;
            this.isPra = true;
            this.addToFormField();
            this.getAutoConsumption();
          }
        })

      })
    } else {
      praEntryFields.forEach((element) => {
        this.selectedEvent = element;
        this.isPra = true;
        this.addToFormField();
        this.getAutoConsumption();
      })
    }


    let dFFilteredList = _.filter(entryFormFields, function (filter) {
      let selectedGrdIds = [];
      if (filter.selectedGrdIds && filter.selectedGrdIds.length > 0) {
        let filterIds = filter.selectedGrdIds;
        selectedGrdIds = filterIds.split(",");
        selectedGrdIds = selectedGrdIds.map(x => x.toLowerCase())
      }
      selectedGrdIds = selectedGrdIds.map(x => x.toLowerCase())
      return (filter.fieldTypeName == 'DF' && filter.isDisplay == true && selectedGrdIds.toString().includes(grdIdSelected))
    })
    this.dfFields = dFFilteredList;
    let dfEntryFields = this.dfFields;
    if (dFUpFields.length > 0) {
      dfEntryFields.forEach((element) => {
        dFUpFields.forEach((edited) => {
          if (edited.entryFormId == element.entryFormId) {
            this.selectedEvent = element;
            this.selectedEvent.enteredResult = edited.enteredResult;
            this.isPra = false;
            this.addToFormField();
            this.getAutoConsumption();
          }
        })

      })
    } else {
      dfEntryFields.forEach((element) => {
        this.selectedEvent = element;
        this.isPra = false;
        this.addToFormField();
        this.getAutoConsumption();
      })
    }

    this.cdRef.detectChanges();
  }

  yearEmitHandled(value) {
    this.form.get('year').patchValue(value);
    this.getGridInvoice();
  }

  monthEmitHandled(value) {
    this.form.get('month').patchValue(value);
    this.getGridInvoice();
  }
  upsertGrE(isConvertInvoice) {
    this.anyOperationIsInprogress = true;
    var upsertGre = new GroupE();
    upsertGre = this.form.value;
    upsertGre.autocTariff = Number(this.decimalPipe.transform(Number(this.autoCTariff), "1.1-2").replace(/,/g, ""));
    upsertGre.autoConsumptionSum = Number(this.decimalPipe.transform(Number(this.autoConsuptionFactor), "1.1-2").replace(/,/g, ""));
    upsertGre.autoConsumption = Number(this.decimalPipe.transform(Number(this.autoConsumption), "1.1-2").replace(/,/g, ""));
    upsertGre.tariffTotal = Number(this.decimalPipe.transform(Number(this.basTariff) + Number(this.hauteTariff), "1.1-2").replace(/,/g, ""));
    upsertGre.greTotal = Number(this.decimalPipe.transform(Number(this.greTotal), "1.1-2").replace(/,/g, ""));
    upsertGre.subTotal = Number(this.decimalPipe.transform(Number(this.subTotal), "1.1-2").replace(/,/g, ""));
    upsertGre.facturationSum = Number(this.decimalPipe.transform(Number(this.autoConsumptionTotal), "1.1-2").replace(/,/g, ""));
    upsertGre.tva = Number(this.decimalPipe.transform(Number(this.tVA), "1.1-2").replace(/,/g, ""));
    upsertGre.tvaForSubTotal = Number(this.decimalPipe.transform(Number(this.tVAForSubTotal), "1.1-2").replace(/,/g, ""));
    upsertGre.total = Number(this.decimalPipe.transform(Number(this.total), "1.1-2").replace(/,/g, ""));
    upsertGre.pRATotal = Number(this.decimalPipe.transform(Number(this.pRATotal), "1.1-2").replace(/,/g, ""));
    upsertGre.pRAFields = JSON.stringify(this.praFields);
    upsertGre.dFFields = JSON.stringify(this.dFentryFields);
    upsertGre.messageType = JSON.stringify(this.messageTypes);
    upsertGre.distribution = Number(this.decimalPipe.transform(Number(this.totalValue), "1.1-2").replace(/,/g, ""));
    upsertGre.generateInvoice = isConvertInvoice;
    upsertGre.invoiceUrl = this.invoiceUrl;
    this.siteService.upsertGrE(upsertGre).subscribe((result: any) => {
      if (result.success) {
        if (upsertGre.id) {
          this.toastr.success("Entry form updated successfully");
        } else {
          this.toastr.success("Entry form added successfully");
        }
        this.isAnyOperationIsInprogress = false;
        this.cancelDialog();
      }
      else {
        this.toastr.error(' ', result.apiResponseMessages[0].message);
        this.isAnyOperationIsInprogress = false;
      }
    });
  }
  getAutoConsumption() {
    // this.autoConsumption = Number(this.production.includes(",") ? this.production.replace(",", "") : this.production) - 
    //                        Number(this.reprise.includes(",") ? this.reprise.replace(",", "") : this.reprise);
    // this.form.get('production').patchValue(this.decimalPipe.transform(Number(this.production.includes(",") ? this.production.replace(",", "") : this.production),"1.0"));
    // this.form.get('reprise').patchValue(this.decimalPipe.transform(Number(this.reprise.includes(",") ? this.reprise.replace(",", "") : this.reprise),"1.0"));
    this.autoConsumption = Number(this.production) - Number(this.reprise);
    this.form.get('autoConsumption').patchValue(this.decimalPipe.transform(Number(this.autoConsumption), "1.0"));
    this.autoConsuptionFactor = (this.autoConsumption * this.autoCTariff) / 100;
    this.autoConsumptionTotal = Number(this.autoConsuptionFactor);

    if (this.isGre) {
      if (this.totalValue) {
        this.totalValue = Number(this.decimalPipe.transform(Number(this.totalValue), "1.1-2").replace(/,/g, ""));
        this.greTotal = this.totalValue;
      }

      let praFields = this.praFields;
      let totalSum;
      if (praFields.length > 0) {
        totalSum = praFields.map(a => a.enteredResult).reduce(function (a, b) {
          return a + b;
        });
      } else {
        totalSum = 0;
      }

      let pRATotal = Number(totalSum);
      let alltotal = pRATotal + Number(this.autoConsumptionTotal)
      this.pRATotal = Number(this.decimalPipe.transform(Number(alltotal), "1.1-2").replace(/,/g, ""));

    } else {
      if (this.totalValue) {
        this.totalValue = Number(this.decimalPipe.transform(Number(this.totalValue), "1.1-2").replace(/,/g, ""));
        this.greTotal = this.totalValue;
      }
      let praFields = this.praFields;
      let totalSum;
      if (praFields.length > 0) {
        totalSum = praFields.map(a => a.enteredResult).reduce(function (a, b) {
          return a + b;
        });
      } else {
        totalSum = 0;
      }
      let pRATotal = Number(totalSum);
      let alltotal = pRATotal + Number(this.autoConsumptionTotal)
      this.pRATotal = Number(this.decimalPipe.transform(Number(alltotal), "1.1-2").replace(/,/g, ""));
    }


    this.form.get('dfTotal').patchValue(this.decimalPipe.transform(this.greTotal, "1.1-2"));
    this.form.get('hbTotal').patchValue(this.decimalPipe.transform(Number(this.basTariff) + Number(this.hauteTariff), "1.0"));
    this.subTotal = Number(this.greTotal) + Number(this.pRATotal);
    this.tVAForSubTotal = (Number(this.subTotal) * Number(this.tVA)) / 100;
    this.total = Number(this.subTotal) + Number(this.tVAForSubTotal);
    let mRound = this.total / 0.05;
    let result = (mRound - Math.floor(mRound)) * 10;
    let roundedResult = Math.floor(result);
    if (roundedResult < 5) {
      mRound = Math.floor(mRound);
      let wholeTotalValue = mRound * 0.05;
      if (wholeTotalValue) {
        this.wholeTotalValue = Number(this.decimalPipe.transform(Number(wholeTotalValue), "1.1-2").replace(/,/g, ""));
      }

    }
    else {
      mRound = Math.round(mRound)
      let wholeTotalValue = mRound * 0.05;
      if (wholeTotalValue) {
        this.wholeTotalValue = Number(this.decimalPipe.transform(Number(wholeTotalValue), "1.1-2").replace(/,/g, ""));
      }
    }
    this.aroundi = this.wholeTotalValue - this.total;
  }

  openConvertPopup(convertInvoicePopup) {
    convertInvoicePopup.openPopover();
  }
  cancelDialog() {
    this.currentDialog.close({ success: false, redirection: true });
  }
  closeConvertInvoicePopup() {
    this.upsertGrE(false);
    this.convertInvoicePopover.forEach((p) => p.closePopover());
  }
  convertToInvoice() {
    this.isAnyOperationIsInprogress = true;
    this.upsertGrE(true);
    this.convertInvoicePopover.forEach((p) => p.closePopover());
  }

  grdSelected(event) {
    const grd = this.grds.find(element => element.id === event);
    this.selectedGrd = grd;
    this.tVA = this.selectedGrd.tvaValue;
    let entryFormFields = this.entryFormFields;
    let praFormFields = this.form.get('pRAFormArray') as FormArray;
    for (let i = praFormFields.length - 1; i >= 0; i--) {
      this.isPra = true;
      this.removeDocument(i);
    }
    let dFFormFields = this.form.get('dFFormArray') as FormArray;
    for (let j = dFFormFields.length - 1; j >= 0; j--) {
      this.isPra = false;
      this.removeDocument(j);
    }
    if (this.selectedGrd.name == "GroupeE") {
      this.isGre = true;
      //this.form.controls["administrationRomandeE"].clearValidators();
      this.form.controls["hauteTariff"].setValidators([Validators.required]);
      this.form.controls["basTariff"].setValidators([Validators.required]);
      //this.form.controls["distribution"].setValidators([Validators.required]);
      //this.form.controls["greFacturation"].setValidators([Validators.required]);


    } else if (this.selectedGrd.name == "RomandeE") {
      this.isGre = false;
      // this.form.controls["administrationRomandeE"].setValidators([Validators.required]);
      this.form.controls["hauteTariff"].clearValidators();
      this.form.controls["basTariff"].clearValidators();
      //  this.form.controls["distribution"].clearValidators();
      //  this.form.controls["greFacturation"].clearValidators();

    }
    // this.praFormFields = this.form.get('pRAFormArray') as FormArray;
    // this.praFormFields.controls = [];
    // this.dFFormFields = this.form.get('dFFormArray') as FormArray;
    // this.dFFormFields.controls = [];
    let praFilteredList = _.filter(entryFormFields, function (filter) {
      let selectedGrds = [];
      if (filter.selectedGrdIds && filter.selectedGrdIds.length > 0) {
        let filterIds = filter.selectedGrdIds;
        selectedGrds = filterIds.split(",");
        selectedGrds = selectedGrds.map(x => x.toLowerCase())
      }

      return (filter.isDisplay == true && selectedGrds.toString().includes(event) && filter.fieldTypeName == 'PRA')
    })
    this.praEntryFields = praFilteredList;
    let praEntryFields = this.praEntryFields;
    praEntryFields.forEach((element) => {
      this.isPra = true;
      this.selectedEvent = element;
      this.addToFormField();
    })
    let dfFilteredList = _.filter(entryFormFields, function (filter) {
      let selectedTGrds = [];
      if (filter.selectedGrdIds && filter.selectedGrdIds.length > 0) {
        let filterIds = filter.selectedGrdIds;
        selectedTGrds = filterIds.split(",");
        selectedTGrds = selectedTGrds.map(x => x.toLowerCase())
      }
      return (filter.fieldTypeName == 'DF' && filter.isDisplay == true && selectedTGrds.toString().includes(event))
    })
    this.dfFields = dfFilteredList;
    let dfEntryFields = this.dfFields;
    dfEntryFields.forEach((element) => {
      this.isPra = false;
      this.selectedEvent = element;
      this.addToFormField();
    })
    //this.form.controls["administrationRomandeE"].updateValueAndValidity();
    this.form.controls["hauteTariff"].updateValueAndValidity();
    this.form.controls["basTariff"].updateValueAndValidity();
    // this.form.controls["distribution"].updateValueAndValidity();
    // this.form.controls["greFacturation"].updateValueAndValidity();
    this.getAutoConsumption();
    this.getGridInvoice();
    this.displayOutstanding();
  }

  getGridInvoice() {
    if (this.isGre == true) {
      if (this.selectedSite != null && this.form.get("month").value != null && this.form.get("year").value != null) {
        this.gridInvoiceNo = this.selectedSite.name + " " + this.datePipe.transform(this.form.get("month").value, "MMM") + " " +
          this.datePipe.transform(this.form.get("year").value, "y") + " ";
        this.form.get("gridInvoiceName").patchValue(this.gridInvoiceNo);
        this.cdRef.detectChanges();
      }
    } else {
      if (this.selectedSite != null && this.form.get("term").value != null && this.form.get("year").value != null) {
        this.gridInvoiceNo = this.selectedSite.name + " " + this.form.get("term").value + " " + this.datePipe.transform(this.form.get("year").value, "y") + " ";
        this.form.get("gridInvoiceName").patchValue(this.gridInvoiceNo);
        this.cdRef.detectChanges();
      }
    }
  }

  displayOutstanding() {
    this.messageTypes.forEach(x => {
      if (x.isDisplay == true && x.selectedGrdIds.includes(this.selectedGrd.id)) {
        if (x.messageType == "Reminder" || x.messageType.toLowerCase() == "reminder" || x.messageType == "Remainder" || x.messageType.toLowerCase() == "remainder") {
          this.isRemainder = true;
        }
      }
    });
  }

  isNotRemainder(formField) {
    if (formField.messageType != "Reminder" && formField.messageType != "Remainder" && formField.messageType.toLowerCase() != "reminder"
      && formField.messageType.toLowerCase() != "remainder") {
      return true;
    }
    return false;
  }

  getSiteSelected(event) {
    const site = this.sites.find(element => element.id === event);
    this.selectedSite = site;
    this.autoCTariff = this.selectedSite.autoCTariff;
  }

  numberOnlyWithVal(event, value) {

    const charCode = (event.which || event.dot) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if (charCode == 46 && value.toString().includes(".") == false) {
        return true;
      }
      return false;
    }

    return true;

  }

  numberOnly(event, value) {

    const charCode = (event.which || event.dot) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;

  }

  checkDecimal(event, value, i) {
    let units = this.getDFunitName(i);
    if (units == "CHF") {
      let result = this.numberOnlyWithVal(event, value);
      return result;
    } else {
      let numberResult = this.numberOnly(event, value);
      return numberResult;
    }
  }

  checkNumber(event, value, i) {
    let units = this.getunitName(i);
    if (units == "CHF") {
      let result = this.numberOnlyWithVal(event, value);
      return result;
    } else {
      let numberResult = this.numberOnly(event, value);
      return numberResult;
    }
  }

  CommaFormatted(value) {
    if (value != null && value != undefined) {
      var str = value.toString().split(".");
      str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return str.join(".");
    }
  }

  clearForm() {
    this.entryForm = new FormGroup({
      selectedField: new FormControl('', [])
    })
  }



  selectField(selectedEvent) {
    let filteredList = this.praEntryFields.find(x => x.entryFormId == selectedEvent);
    this.selectedEvent = filteredList;
    this.selectedPraField = selectedEvent.entryFieldId;
    this.selectedFieldName = selectedEvent.displayName;
    this.cdRef.detectChanges();
  }

  addToFormField() {
    if (this.isPra) {
      this.praFormFields = this.form.get('pRAFormArray') as FormArray;
      let length = this.praFormFields.length;
      let selectedEvent = this.selectedEvent;


      if (!selectedEvent.enteredResult) {
        selectedEvent.enteredResult = 0.0;
      }

      this.selectedEvent = selectedEvent;
      this.praFormFields.insert(length, this.insertDocument());
      this.praFields.push(this.selectedEvent);


    } else {
      this.dFFormFields = this.form.get('dFFormArray') as FormArray;
      let length = this.dFFormFields.length;
      let selectedEvent = this.selectedEvent;
      if (!selectedEvent.enteredResult) {
        selectedEvent.enteredResult = 0;
      }
      this.selectedEvent = selectedEvent;
      this.dFFormFields.insert(length, this.insertDocument());
      this.dFentryFields.push(this.selectedEvent);

    }

  }

  getChangeEvent(i, event) {

    let formData = this.praFields[i];
    let updatedData: any = {};
    updatedData = formData;
    event = event.replace(/,/g, "");
    updatedData.enteredResult = Number(event);
    this.praFields[i] = updatedData;
    this.getAutoConsumption();
  }

  getDFCHangeEvent(i, event) {
    let formData = this.dFentryFields[i];
    let updatedData: any = {};
    updatedData = formData;
    event = event.replace(/,/g, "");
    updatedData.enteredResult = Number(event);
    this.dFentryFields[i] = updatedData;
    this.getAutoConsumption();
  }

  onMessageTypeChange(i, event) {
    let formData = this.messageTypes[i];
    if (this.messageTypes[i].isSendInMail != null && this.messageTypes[i].isSendInMail != undefined && this.messageTypes[i].isSendInMail == false) {
      this.messageTypes[i].isSendInMail = true;
    } else if (this.messageTypes[i].isSendInMail != null && this.messageTypes[i].isSendInMail != undefined && this.messageTypes[i].isSendInMail == true) {
      this.messageTypes[i].isSendInMail = false;
    } else {
      let updatedData: any = {};
      updatedData = formData;
      updatedData.isSendInMail = true;
      this.messageTypes[i] = updatedData;
    }
  }

  removeDocument(i) {
    if (this.isPra) {
      this.praFormFields = this.form.get('pRAFormArray') as FormArray;
      this.praFormFields.removeAt(i);
      let praField = this.praFields;
      let removedData = praField[i]
      const index = praField.indexOf(removedData, 0);
      if (index > -1) {
        praField.splice(index, 1);
      }
      this.praFields = praField;
    }
    else {
      this.dFFormFields = this.form.get('dFFormArray') as FormArray;
      this.dFFormFields.removeAt(i);
      let dFField = this.dFentryFields;
      let removedDFData = dFField[i]
      const idx = dFField.indexOf(removedDFData, 0);
      if (idx > -1) {
        dFField.splice(idx, 1);
      }
      this.dFentryFields = dFField;
    }
  }

  getformcontrolName(i) {
    let praEntryFields = this.praFields;
    let selectedEvent = praEntryFields[i];
    console.log(selectedEvent);
    return selectedEvent.fieldName;
  }

  getunitName(i) {
    let praEntryFields = this.praFields;
    let selectedEvent = praEntryFields[i];
    console.log(selectedEvent);
    return selectedEvent.unit;

  }

  getplaceHolderName(i) {
    let praEntryFields = this.praFields;
    let selectedEvent = praEntryFields[i];
    console.log(selectedEvent);
    return selectedEvent.displayName;

  }

  getDFformcontrolName(i) {

    let praEntryFields = this.dFentryFields;
    let selectedEvent = praEntryFields[i];
    console.log(selectedEvent);
    return selectedEvent.fieldName;

  }

  getDFunitName(i) {

    let praEntryFields = this.dFentryFields;
    let selectedEvent = praEntryFields[i];
    console.log(selectedEvent);
    return selectedEvent.unit;

  }

  getDFplaceHolderName(i) {

    let praEntryFields = this.dFentryFields;
    let selectedEvent = praEntryFields[i];
    console.log(selectedEvent);
    return selectedEvent.displayName;

  }

  getDisplayCondition(formField) {
    if (formField.selectedGrdIds != null && formField.selectedGrdIds != undefined && formField.selectedGrdIds.includes(this.form.value.GRDId)) {
      return true;
    }
    return false;
  }

  insertDocument() {
    let group: any = {};
    let selectEvent = this.selectedEvent;
    group[selectEvent.fieldName] = new FormControl(selectEvent.enteredResult, []);
    // group[selectEvent.displayName] = new FormControl('',[])
    return this.formBuilder.group(group);
  }

  pRAArray() {
    return this.form.get("pRAFormArray") as FormArray;
  }

  DFArray() {
    return this.form.get("dFFormArray") as FormArray;
  }

  getPlaceHolder(i, field) {
    console.log(i, field);
    //this.praFormFields = this.form.get('pRAFormArray') as FormArray;

  }

  closePopup() {
    this.addFieldPopUps.forEach((p) => p.closePopover());
  }

  getGRDPlaceholder() {
    let grd = this.selectedGrd;
    if (grd) {
      return grd.name;
    }
    else {
      return "Total"
    }
  }
}
