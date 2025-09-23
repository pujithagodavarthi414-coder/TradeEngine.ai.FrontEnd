import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { UserService } from '../auth/user.Service';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  isThereAnError: boolean = false;
  isSuccessMessageShow: boolean = false;
  isAnyOperationInProgress: boolean = false;
  forgotPasswordForm: FormGroup;
  companyMainLogo: string;
  validationMessage: string;
  id: any;
  applicationVersion = "";
  siteUrl: any;

  constructor(
    private SubmitPasswordServices: UserService,
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getTheme();
    this.clearform();
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    this.applicationVersion = (environment && environment.version) ? environment.version : "";
  }

  ngAfterViewInit() {
    this.id = setInterval(() => {
      this.setCompanyLogo();
    }, 1000);
  }

  setCompanyLogo() {
    this.companyMainLogo = this.cookieService.get("CompanyMainLogo");
    this.cdRef.markForCheck();
  }

  getTheme() {
    this.authenticationService.getThemes().subscribe((response: any) => {
      if (response.success) {
        this.siteUrl = response.data.registrerSiteAddress;
        this.companyMainLogo = response.data.companyMainLogo;
        this.cdRef.detectChanges();

      }
    });
  }

  submitEmail(formDirective: FormGroupDirective) {
    this.isAnyOperationInProgress = true;
    let userEmail = this.forgotPasswordForm.get('userEmail').value;

    this.SubmitPasswordServices.submitPassword(userEmail).subscribe((response: any) => {
      if (response.success == true) {
        this.isThereAnError = false;
        this.isSuccessMessageShow = true;
        this.toastr.success("Link to reset your password has been sent to your mail!");
        formDirective.resetForm();
        this.clearform();
      }
      else {
        this.isThereAnError = true;
        this.isSuccessMessageShow = false;
        this.isAnyOperationInProgress = false;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  clearform() {
    this.validationMessage = null;
    this.isThereAnError = false;
    this.isAnyOperationInProgress = false;
    this.forgotPasswordForm = new FormGroup({
      userEmail: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
        ])
      ),
    })
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
}
