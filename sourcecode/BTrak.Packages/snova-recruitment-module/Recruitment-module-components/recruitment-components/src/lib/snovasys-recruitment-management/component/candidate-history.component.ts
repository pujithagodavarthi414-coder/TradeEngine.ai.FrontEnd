import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CandidateHistoryModel } from '../../snovasys-recruitment-management-apps/models/candidatehistory.model';
import { SoftLabelConfigurationModel } from '../../snovasys-recruitment-management-apps/models/softlabelconfiguration.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-candidate-history-detail',
  templateUrl: 'candidate-history.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateHistoryDetailComponent extends CustomAppBaseComponent implements OnInit {
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress: boolean;
  anyOperationInProgress$: Observable<boolean>;
  isLastSeenShow: boolean;
  candidateHistory: any;
  isAnyOperationIsInprogress: boolean;
  candidateData: any;
  currentLang: string = null;

  @Input('candidateData')
  set _candidateData(data: any) {
    if (data) {
      this.candidateData = data;
      this.getCandidateHistory();
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.currentLang = this.cookieService.get(LocalStorageProperties.CurrentCulture) ?
      this.cookieService.get(LocalStorageProperties.CurrentCulture)
      : this.cookieService.get(LocalStorageProperties.CurrentCulture);
  }
  constructor(
    private translateService: TranslateService,
    private recruitmentService: RecruitmentService,
    private cookieService: CookieService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  translatedHistory(value) {
    if (this.currentLang !== 'ar') {
      if (value.description === 'CandidateAdded') {
        return '<b>' + value.candidateName + '</b>' + this.translate('CANDIDATEHISTORY.CANDIDATEADDED') + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'FirstNameChanged') {
        return this.translate('CANDIDATEHISTORY.FIRSTNAMEEDITED') +
          this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'LastNameChanged') {
        return this.translate('CANDIDATEHISTORY.LASTNAMEEDITED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'FatherNameChanged') {
        return this.translate('CANDIDATEHISTORY.FATHERENAMEDITED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue
          + '</b>' + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'EmailChanged') {
        return this.translate('CANDIDATEHISTORY.EMAILCHANGED') + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'SecondaryEmailChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.SECONDARYEMAILCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        } else {
          return this.translate('CANDIDATEHISTORY.SECONDARYEMAILCHANGED')
            + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
            this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
            + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
        }
      } else if (value.description === 'MobileChanged') {
        return this.translate('CANDIDATEHISTORY.MOBILECHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'PhoneChanged') {
        return this.translate('CANDIDATEHISTORY.PHONECHANGED') + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'FaxChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.FAXCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.FAXCHANGED') + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'WebsiteChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.WEBSITECHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.WEBSITECHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'SkypeIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.SKYPEIDCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.SKYPEIDCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'TwitterIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.TWITTERIDCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.TWITTERIDCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'AddressJsonChanged') {
        return this.translate('CANDIDATEHISTORY.ADDRESSCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'ExperienceInYearsChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.EXPERIENCECHANGED') + ' <b>' + value.newValue + '</b>'
            + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.EXPERIENCECHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'CurrentDesignationChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.CURRENTDESIGNATIONCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.CURRENTDESIGNATIONCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'CurrentSalaryChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.CURRENTSALARYCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.CURRENTSALARYCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'ExpectedSalaryChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.EXPECTEDSALARYCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.EXPECTEDSALARYCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'SourceIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.SOURCEIDCHANGED') + ' <b>' + value.newValue + '</b>'
            + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.SOURCEIDCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'SourcePersonIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.SOURCEPERSONCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.SOURCEPERSONCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'HiringStatusChanged') {
        return this.translate('CANDIDATEHISTORY.HIRINGSTATUSCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'AssignedToManagerChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.ASSIGNEDTOMANAGERCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.ASSIGNEDTOMANAGERCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'ClosedByIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.CLOSEDBYCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.CLOSEDBYCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'DescriptionChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.DESCRIPTIONCHANGED') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.DESCRIPTIONCHANGED')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'CountryChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return this.translate('CANDIDATEHISTORY.COUNTRY') + ' <b>' + value.newValue + '</b>'
            + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
        }
        return this.translate('CANDIDATEHISTORY.COUNTRY') + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'ProfileImageChanged') {
        return this.translate('CANDIDATEHISTORY.PROFILECHANGED') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'Address1Added') {
        return this.translate('CANDIDATEHISTORY.ADDRESS1') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'Address2Added') {
        return this.translate('CANDIDATEHISTORY.ADDRESS2') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'StateAdded') {
        return this.translate('CANDIDATEHISTORY.STATE') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'ZipCodeAdded') {
        return this.translate('CANDIDATEHISTORY.ZIPCODE') + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'Address1Changed') {
        return this.translate('CANDIDATEHISTORY.ADDRESS1') + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'Address2Changed') {
        return this.translate('CANDIDATEHISTORY.ADDRESS2') + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'ZipCodeChanged') {
        return this.translate('CANDIDATEHISTORY.ZIPCODE') + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'StateChanged') {
        return this.translate('CANDIDATEHISTORY.STATE')
          + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + '<b>' + value.oldValue + '</b>' +
          this.translate('CANDIDATEHISTORY.TO') + '<b>' + value.newValue + '</b>'
          + this.translate('CANDIDATEHISTORY.BY') + '<b>' + value.createdUserName + '</b>';
      } else if (value.description === 'CandidateRegistered') {
        return this.translate('CANDIDATEHISTORY.CANDIDATEREGISTERED') + ' <b>' + value.candidateName + '</b>';
      }
    } else {
      if (value.description === 'CandidateAdded') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY') + this.translate('CANDIDATEHISTORY.CANDIDATEADDED') + '<b>' + value.candidateName + '</b>';
      } else if (value.description === 'FirstNameChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY') + '<b>'
          + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.FIRSTNAMEEDITED');
      } else if (value.description === 'LastNameChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.LASTNAMEEDITED');
      } else if (value.description === 'FatherNameChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.FATHERENAMEDITED');
      } else if (value.description === 'EmailChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.EMAILCHANGED');
      } else if (value.description === 'SecondaryEmailChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.SECONDARYEMAILCHANGED');
        } else {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
            + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
            + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.SECONDARYEMAILCHANGED');
        }
      } else if (value.description === 'MobileChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.MOBILECHANGED');
      } else if (value.description === 'PhoneChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.PHONECHANGED');
      } else if (value.description === 'FaxChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.FAXCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
         + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.FAXCHANGED');
      } else if (value.description === 'WebsiteChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.WEBSITECHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.WEBSITECHANGED');
      } else if (value.description === 'SkypeIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.SKYPEIDCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.SKYPEIDCHANGED');
      } else if (value.description === 'TwitterIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TWITTERIDCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.TWITTERIDCHANGED');
      } else if (value.description === 'AddressJsonChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.ADDRESSCHANGED');
      } else if (value.description === 'ExperienceInYearsChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.EXPERIENCECHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.EXPERIENCECHANGED');
      } else if (value.description === 'CurrentDesignationChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.CURRENTDESIGNATIONCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.CURRENTDESIGNATIONCHANGED');
      } else if (value.description === 'CurrentSalaryChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.CURRENTSALARYCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.CURRENTSALARYCHANGED');
      } else if (value.description === 'ExpectedSalaryChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.EXPECTEDSALARYCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.EXPECTEDSALARYCHANGED');
      } else if (value.description === 'SourceIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.SOURCEIDCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.SOURCEIDCHANGED');
      } else if (value.description === 'SourcePersonIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.SOURCEPERSONCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.SOURCEPERSONCHANGED');
      } else if (value.description === 'HiringStatusChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.HIRINGSTATUSCHANGED');
      } else if (value.description === 'AssignedToManagerChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ASSIGNEDTOMANAGERCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.ASSIGNEDTOMANAGERCHANGED');
      } else if (value.description === 'ClosedByIdChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.CLOSEDBYCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.CLOSEDBYCHANGED');
      } else if (value.description === 'DescriptionChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.DESCRIPTIONCHANGED');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.DESCRIPTIONCHANGED');
      } else if (value.description === 'CountryChanged') {
        if (value.oldValue === null || value.oldValue === '') {
          return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
            + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.COUNTRY');
        }
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.COUNTRY');
      } else if (value.description === 'ProfileImageChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.PROFILECHANGED');
      } else if (value.description === 'Address1Added') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
          + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ADDRESS1');
      } else if (value.description === 'Address2Added') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
          + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ADDRESS2');
      } else if (value.description === 'StateAdded') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
          + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.STATE');
      } else if (value.description === 'ZipCodeAdded') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.ISADDED')
          + ' <b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.ZIPCODE');
      } else if (value.description === 'Address1Changed') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM')
          + this.translate('CANDIDATEHISTORY.ADDRESS1');
      } else if (value.description === 'Address2Changed') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM')
          + this.translate('CANDIDATEHISTORY.ADDRESS2');
      } else if (value.description === 'ZipCodeChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.ZIPCODE');
      } else if (value.description === 'StateChanged') {
        return '<b>' + value.createdUserName + '</b>' + this.translate('CANDIDATEHISTORY.BY')
          + '<b>' + value.newValue + '</b>' + this.translate('CANDIDATEHISTORY.TO')
          + '<b>' + value.oldValue + '</b>' + this.translate('CANDIDATEHISTORY.ISCHANGEDFROM') + this.translate('CANDIDATEHISTORY.STATE');
      } else if (value.description === 'CandidateRegistered') {
        return '<b>' + value.candidateName + '</b>' + this.translate('CANDIDATEHISTORY.CANDIDATEREGISTERED');
      }
    }
  }

  translate(value) {
    return this.translateService.instant(value);
  }

  getCandidateHistory() {
    this.isAnyOperationIsInprogress = true;
    const candidateHistoryModel = new CandidateHistoryModel();
    candidateHistoryModel.candidateId = this.candidateData.candidateId;
    candidateHistoryModel.jobOpeningId = this.candidateData.jobOpeningId;
    this.recruitmentService.getCandidateHistory(candidateHistoryModel).subscribe((response: any) => {
      if (response.success) {
        this.candidateHistory = response.data;
        this.isAnyOperationIsInprogress = false;
      } else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

}


