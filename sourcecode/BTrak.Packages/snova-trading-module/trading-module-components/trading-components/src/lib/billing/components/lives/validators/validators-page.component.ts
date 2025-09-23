import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
// import '../../../globaldependencies/helpers/fontawesome-icons'
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-validators-page-component',
  templateUrl: './validators-page.component.html'
})

export class ValidatorsPageComponent extends AppBaseComponent implements OnInit {
    
    constructor(private router: Router, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
        private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, public dialog: MatDialog) {
        super();
    }

    ngOnInit() {

    }
    
}
