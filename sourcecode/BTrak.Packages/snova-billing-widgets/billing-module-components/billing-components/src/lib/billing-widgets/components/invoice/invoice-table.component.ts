import { Component, ViewChild, Input } from "@angular/core";
import { Router } from "@angular/router";
import { MatCheckbox } from "@angular/material/checkbox";
import { InvoiceOutputModel } from '../../models/invoice-output-model';
import { InvoiceInputModel } from '../../models/invoice-input-model';
import { InvoiceFilterModel } from '../../models/invoice-filter-model';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
  selector: "app-billing-component-invoice-invoicetable",
  templateUrl: "invoice-table.component.html"
})

export class InvoiceTableComponent {

  @Input('projectTypeId')
  set projectTypeId(data: string) {
    this.projectId = data;
    this.getInvoices();
  }

  @ViewChild("allSelected") private allSelected: MatCheckbox;
  loadingIndicator: boolean;
  invoiceList: InvoiceOutputModel[];
  allRowsSelected: boolean;
  RowSelect: boolean
  error: boolean;
  validationMessage: String[];
  isArchived: boolean = false;
  projectId: string;

  constructor(private router: Router, ) { }

  ngOnInit() {
    this.getInvoices();
  }
  
  selectAllInvoices() {
    // this.error=false;
    if (this.allSelected.checked) {
      this.allRowsSelected = true;
      this.RowSelect = true;;
      // this.selectedTeamMembers = JSON.parse(JSON.stringify(this.teamMembers));
    }
    else {
      this.allRowsSelected = false;
      this.RowSelect = false;
      // this.selectedTeamMembers = [];
    }
  }
  singleSelect() {
    if (this.allSelected.checked) {
      this.allRowsSelected = false;
    }
  }
  onSelect(selected) {

    this.router.navigate(['invoicemanagement/DraftInvoice']);
  }
  getInvoices() {
    const invoiceInput = new InvoiceInputModel();
    let invoiceFilter = new InvoiceFilterModel()
    invoiceInput.isArchived = this.isArchived;
    invoiceFilter.projectId = this.projectId;
    invoiceInput.invoiceFilter = [];
    invoiceInput.invoiceFilter.push(invoiceFilter);
    // this.invoiceService.getInvoice(invoiceInput).subscribe(response=>{

    //   if(response.success == true)
    //   {
    //     this.invoiceList = response.data;
    //   }
    //   else
    //   {
    //     this.error=true;
    //     this.validationMessage=response.apiResponseMessage;
    //   }
    // })
  }



}