import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr'


import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ClientExcelService } from '../../services/client-excel.service';
import * as _ from 'underscore';
import { Actions, ofType } from '@ngrx/effects';
import { AppBaseComponent } from '../componentbase';
import { ProductivityDashboardService } from '../../services/productivity-dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons'
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contract-side-list',
  templateUrl: './contract-side-list.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ContractSideListComponent extends AppBaseComponent implements OnInit {
  isHomeview: any;
  @Input("isHomeview")
  set _isHomeview(data: any) {
    if (data) {
      this.isHomeview = data;
    }
  }
  url: string;
  constructor(private router: Router, private BillingDashboardService: BillingDashboardService, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
    private TranslateService: TranslateService, private clientExcelService: ClientExcelService, private cdRef: ChangeDetectorRef, public dialog: MatDialog
    , private productivityService: ProductivityDashboardService, private actionUpdates$: Actions, private softLabelPipe: SoftLabelPipe) {
    super();
    if (this.router.url.includes('register-program') || this.router.url.includes('program')) {
      this.url = 'register-program'
    }
    else if (this.router.url.includes('validators')) {
      this.url = 'validators'
    }
    else if (this.router.url.includes('client')) {
      this.url = 'clients'
    }
    else if (this.router.url.includes('collaborations')) {
      this.url = 'collaborations'
    }
    else if (this.router.url.includes('summary')) {
      this.url = 'summary'
    }
    else if (this.router.url.includes('progress')) {
      this.url = 'progress'
    }
  }

  ngOnInit() {
  }
  gotoContractsPage(page) {
    this.router.navigate(['lives/' + page]);
  }
}
