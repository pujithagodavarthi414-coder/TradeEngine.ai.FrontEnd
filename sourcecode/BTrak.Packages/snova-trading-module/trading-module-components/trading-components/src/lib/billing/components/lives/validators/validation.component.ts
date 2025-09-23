import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
// import '../../../globaldependencies/helpers/fontawesome-icons'
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { orderBy, State } from '@progress/kendo-data-query';
import { Guid } from 'guid-typescript';
import { ValidationModel } from '../../../models/validation-model';
import { SampleValidationModel } from '../../../models/sample-validation-model';
import { MatMenuTrigger } from '@angular/material/menu';
import { LivesManagementService } from '../../../services/lives-management.service';
import { BillingDashboardService } from '../../../services/billing-dashboard.service';

@Component({
    selector: 'app-validation-component',
    templateUrl: './validation.component.html',
    styles:['.k-grid a{color:#337ab7 !important;}']
})

export class ValidationComponent extends AppBaseComponent implements OnInit {
    validationListData: GridDataResult = {
        data: [],
        total: 0
    };

    state: State = {
        skip: 0,
        take: 10,
    };
    validationList: any = [];
    isInprogress: boolean;
    constructor(private router: Router, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
        private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, public dialog: MatDialog, private liveService: LivesManagementService, private billingDashboardServic: BillingDashboardService) {
        super();
        this.getValidations();
    }

    ngOnInit() {

    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        let validationList = this.validationList;
        if (this.state.sort) {
            validationList = orderBy(this.validationList, this.state.sort);
        }
        this.validationListData = {
          data: validationList.slice(this.state.skip, this.state.take + this.state.skip),
          total: this.validationList.length
        }
      }
    getValidations() {
        this.isInprogress = true;
                    this.validationList = [
                        {
                            nameOfCertificationBody:'AgroVet GmBH',
                            contactInformation:'Klaus Guger <br> Königsbrunnerstrasse 8, 2202 Enzersfeld <br> Austria <br> Phone: +43 2262 / 672213-47 <br> Email: k.guger@abg.at <br> Website: <a style="color:#337ab7 !important;">agrovet.at</a>',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'BM Certification SIA',
                            contactInformation:'Rafal Andruszkiewicz <br> Jurkalnes street 15,Riga,LV-1046,Latvia <br> Latvia <br> Phone: 0044 07495748770 <br> Email: rafal.andruszkiewicz@bmcertification.com <br> Website: bmcertification.com',
                            accreditation:'RSPO SCCS Worldwide (except China)'
                        },
                        {
                            nameOfCertificationBody:'BMC Assurance S.L.',
                            contactInformation:'Álvaro Trevejo Hernández <br> Amós de Escalante nº2, 3 dcha. Santander, 39002, Spain <br> Spain <br> Phone: +34 942 075 197 <br> Email: acreditacion@bmcassurance.com <br> Website: bmcassurance.com',
                            accreditation:'RSPO SCCS Worldwide (excluding China)'
                        },
                        {
                            nameOfCertificationBody:'BSI Services Malaysia Sdn Bhd',
                            contactInformation:'Chaiyaporn Seekao <br> Suite 29.01, Level 29, The Gardens North Tower, Mid Valley City Lingkaran Syed Putra Kuala Lumpur 59200 <br> Malaysia <br> Phone: +603 9212 9638 <br> Email: Chaiyaporn.Seekao@bsigroup.com <br> Website: bsigroup.com.my',
                            accreditation:'RSPO P&C & SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'Bureau Veritas Certification (Malaysia) Sdn Bhd',
                            contactInformation:'Muhamad Iqbal Jailan <br> Bureau Veritas Certification (M) Sdn. Bhd. (670271-V), Lots 19.01 & 19.02, 19th Floor, Menara KH, Jalan Sultan Ismail, 50250 Kuala Lumpur <br> Malaysia <br> Phone: +6017-8077020 <br> Email: iqbal.jailan@bureauveritas.com <br> Website: bureauveritas.com',
                            accreditation:'RSPO P&C (Malaysia, Thailand and Indonesia)'
                        },
                        {
                            nameOfCertificationBody:'Bureau Veritas Certification Hong Kong Limited',
                            contactInformation:'Jamie Tang <br> 4/F, No.1288, WaiMa Road, Huangpu District, Shanghai <br> China <br> Phone: +86 18017501365 <br> Email: jamie.tang@bureauveritas.com <br> Website: bureauveritashk.com',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'Control Union Certifications (Malaysia) Sdn. Bhd.',
                            contactInformation:'Dayangku Mazrianah Pengiran Mahmuddin <br> OFFICE B-3-1, Block B, Pusat Perniagaan Prima Klang, Jalan Kota/KS 1, Klang,41100, Selangor <br> Malaysia <br> Email: dmazrianah@controlunion.com <br> Website: controlunion.com',
                            accreditation:'RSPO P&C and RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'Control Union Certifications B.V.',
                            contactInformation:'Hubert Jurczyszyn <br> P.O. Box 161 8000 Zwolle <br> Netherlands <br> Email: hjurczyszyn@controlunion.com <br> Website: controlunion.com',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'DNV Business Assurance Italy S.r.l.',
                            contactInformation:'Isabella d’Adda <br> Via Energy Park 14, 20871 Vimercate (MB) <br> Italy <br> Phone: +39 039 6899905 <br> Email: globalfbhub@dnv.com <br> Website: dnv.com/assurance',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'GFA Certification GmbH',
                            contactInformation:'Jörn Ackermann <br> Alter Teichweg 15, 22081 Hamburg <br> Germany <br> Phone: +49 405 2474 31120 <br> Email: j.ackermann@gfa-cert.com <br> Website: gfa-cert.com',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'Global Gateway Certifications Sdn. Bhd.',
                            contactInformation:'Sesumaran a/l Subramaniam <br> No. 10, Jalan Rasmi Jaya, Ampang, Selangor, 68000 <br> Malaysia <br> Email: sesumaran@ggc.my <br> Website: ggc.my',
                            accreditation:'RSPO P&C; RSPO SCCS ( Worldwide excluding USA & China)'
                        },
                        {
                            nameOfCertificationBody:'Gut Certifizierungsgesellschaft für Managementsysteme GmbH Umweltgutachter',
                            contactInformation:'Ms Leonie Netter <br> Eichenstraße 3b 12435 Berlin <br> Germany <br> Phone: +49 (0) 30 2332021-82 <br> Email: leonie.netter@gut-cert.de <br> Website: gut-cert.de/produkte/nachhaltigkeit/lieferketten/rspo.html',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'IBD Certifications Ltd',
                            contactInformation:'Leonardo Sanchez Gomes <br> Amando de Barros 2275, 18602-150 Botucatu / SP <br> Brazil <br> Phone: +5514 3811 9800 <br> Email: leonardo@ibd.com.br <br> Website: ibd.com.br',
                            accreditation:'RSPO P&C and RSPO SCCS Worldwide <br> ASI has suspended IBD Certifications Ltd. (IBD) for the scope RSPO P&C worldwide on 8 June 2022. The suspension is due to 21.4, Table 1, item 8 of ASI-PRO-20-101-V5.1.'
                        },
                        {
                            nameOfCertificationBody:'ICEA Istituto per la Certificazione Etica ed Ambientale',
                            contactInformation:'Michela Coli <br> Via Giovanni Brugnoli, 15 – 40122 Bologna <br> Italy <br> Phone: + 39 0512 729 86 <br> Email: fo@icea.info <br> Website: icea.info/en',
                            accreditation:'RSPO SCCS <br> Geographical scope: Europe'
                        },
                        {
                            nameOfCertificationBody:'Intertek Certification International Sdn. Bhd.',
                            contactInformation:'Mohd Hafiz Mat Hussain <br> D-28-3, Level 28, Menara Suezcap 1, No. 2, Jalan Kerinchi, Gerbang Kerinchi Lestari, 59200, Kuala Lumpur <br> Malaysia <br> Phone: +60136411303 <br> Email: mohdhafiz.mathussain@intertek.com <br> Website: intertek.com',
                            accreditation:'RSPO P&C for Malaysia, Indonesia, and Cambodia (excluding NPP) <br> RSPO SCCS for Europe and Asia'
                        },
                        {
                            nameOfCertificationBody:'Kiwa Colombia S.A.S',
                            contactInformation:'Diego Alejandro Franco Sanchez <br> Carrera 15 No 3B-71 Zipaquirá - Cundinamarca 250252 <br> Colombia <br> Phone: +57 1 881 5963 <br> Email: diego.franco@kiwa.com <br> Website: kiwa.com/lat/es',
                            accreditation:'RSPO SCCS Worldwide (excluding China)'
                        },
                        {
                            nameOfCertificationBody:'Preferred by Nature OÜ',
                            contactInformation:'Maria Arrevillaga <br> Filosoofi 31, Tartu 50108, <br> Estonia <br> Phone: + 1 289-681-7042 <br> Email: rspo@preferredbynature.org <br> Website: preferredbynature.org',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'PT Mutuagung Lestari',
                            contactInformation:'Octo Nainggolan <br> Jalan Raya Bogor Km 33,5, No19 16953 Depok <br> Indonesia <br> Email: octo.nainggolan@mutucertification.com <br> Website: mutucertification.com/id',
                            accreditation:'RSPO P&C <br> Geographical scope: Indonesia and Malaysia.'
                        },
                        {
                            nameOfCertificationBody:'PT SAI Global Indonesia',
                            contactInformation:'Setyo Sutadiono <br> Graha Iskandarsyah 4th floor, Jl. Iskandarsyah Raya No. 66 C, Kebayoran Baru – Jakarta 12160 Indonesia <br> Indonesia <br> Phone: +62 21 720 6186 <br> Email: saig.rspo@saiglobal.com <br> Website: saiglobal.com',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'PT SGS Indonesia',
                            contactInformation:'Ahmad Furqon <br> The Garden Centre, 2nd Floor, Cilandak Commercial Estate Jl. Raya Cilandak KKO, 12560, Jakarta <br> Indonesia <br> Phone: +62 21 2978 0600 <br> Email: ahmad.furqon@sgs.com <br> Website: sgs.co.id',
                            accreditation:'RSPO P&C and RSPO SCCS Worldwide.'
                        },
                        {
                            nameOfCertificationBody:'PT TUV Rheinland Indonesia',
                            contactInformation:'Ms. Dian Susanty Soeminta <br> Menara Karya Building, 10th Floor; JI.H.R. Rasuna Said Block X-5 Kav 1-2, 12950 Jakarta <br> Indonesia <br> Phone: +62 21 579 44 579 <br> Email: soeminta@idn.tuv.com <br> Website: tuv.com',
                            accreditation:'RSPO P&C and RSPO SCCS Worldwide.'
                        },
                        {
                            nameOfCertificationBody:'SCS Global Services',
                            contactInformation:'Kendra Bishop <br> 2000 Powell Street, Suite 600, 94608 Emeryville, CA <br> United States <br> Phone: +1510 457 4004 <br> Email: kbishop@scsglobalservices.com <br> Website: scsglobalservices.com',
                            accreditation:'RSPO P&C & SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'Sirim QAS International Sdn. Bhd.',
                            contactInformation:"Kamini Sooriamoorthy <br> SIRIM Complex, 1, Persiaran Dato' Menteri, Section 2 40700 Shah Alam Selangor <br> Malaysia <br>  Phone: +603 5544 6448 <br> Email: kamini@sirim.my <br> Website: sirim-qas.com.my",
                            accreditation:'P&C in Malaysia & Indonesia <br> SCCS Worldwide (Excluding China)'
                        },
                        {
                            nameOfCertificationBody:'TÜV NORD INTEGRA bvba',
                            contactInformation:'Sigrid Neys <br> Statiestraat 164, 2600, Antwerp <br> Belgium <br> Phone: +32 3 287 37 60 <br> Email: sneys@tuv-nord.com <br> Website: tuv-nord.com/be/en/index.htm',
                            accreditation:'RSPO SCCS Worldwide'
                        },
                        {
                            nameOfCertificationBody:'Warringtonfire Testing and Certification Limited, trading as BM TRADA',
                            contactInformation:'Jack Gray, Audit Operations Team Manager <br> Chiltern House, Stocking Lane, Hughenden Valley High Wycombe, Buckinghamshire HP14 4ND <br> United Kingdom <br> Phone: +44 (0) 1494 569 736 <br> Email: jack.gray@bmtrada.com <br> Website: https://bmtrada.com',
                            accreditation:'RSPO SCCS Worldwide (excluding China)'
                        }
                    ];
                  this.validationListData = {
            data: this.validationList.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.validationList.length
          }
                    this.isInprogress = false;
                    // this.cdRef.detectChanges();
    }
}
