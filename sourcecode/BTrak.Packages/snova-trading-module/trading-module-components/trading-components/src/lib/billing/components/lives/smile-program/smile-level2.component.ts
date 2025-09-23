import { EventEmitter } from '@angular/core';
import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';
import { ProgramDetails } from '../../../models/programs-details.model';
import { LivesManagementService } from '../../../services/lives-management.service';

@Component({
    selector: 'app-smile-level2',
    templateUrl: './smile-level2.component.html',
    styleUrls: ['./smile-level2.component.scss']
})

export class SmileLevelTwoComponent extends AppBaseComponent implements OnInit {
    @Output() displayLevel3Emit = new EventEmitter<any>();
    programId: string;
    tableOneData: any = [];

    displayLevel3: boolean = false;
    isLoadingInProgress: boolean = true;
    tableDataNotFound: boolean = true;

    constructor(private router: Router, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
        private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, public dialog: MatDialog, public liveServices: LivesManagementService) {
        super();
        this.isLoadingInProgress = true;
        this.route.params.subscribe((routeParams => {
            if (routeParams.programId) {
                this.programId = routeParams.programId;
                this.getESGIndicatorsDetails();
            }
        }))
    }

    ngOnInit() {
    }

    getESGIndicatorsDetails() {
        this.isLoadingInProgress = true;
        var searchModel: any = {};
        searchModel.programId = this.programId;
        searchModel.isArchived = false;
        this.liveServices.getESGIndicators(searchModel).subscribe((response: any) => {
            if (response.success) {
                if (response.data.length > 0) {
                    this.tableOneData = response.data[0];
                    this.tableDataNotFound = false;
                    this.isLoadingInProgress = false;
                } else {
                    this.tableDataNotFound = true;
                    this.tableOneData = [];
                    this.isLoadingInProgress = false;
                }
            }
        })
    }

    knowMoreClick() {
        this.displayLevel3 = true;
        //this.displayLevel3Emit.emit(true);
        this.router.navigate(['lives/smile-budget-breakdown', this.programId]);
    }
}
