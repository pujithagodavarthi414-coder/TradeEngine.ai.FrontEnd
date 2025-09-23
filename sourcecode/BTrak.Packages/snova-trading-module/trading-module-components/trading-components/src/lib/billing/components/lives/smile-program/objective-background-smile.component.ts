import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';
import { ProgramDetails } from '../../../models/programs-details.model';
import { ProgramSearchModel } from '../../../models/program-search.model';
import { LivesManagementService } from '../../../services/lives-management.service';
import { CountryModel } from '../../../models/country-model';
import { HRManagementService } from '../../../services/hr-management.service';
import { LocalStorageProperties } from '../../../constants/localstorage-properties';

@Component({
  selector: 'app-objective-background-smile',
  templateUrl: './objective-background-smile.component.html',
  styleUrls: ['./objective-background-smile.component.scss']
})

export class ObjectAndBackgroundSmileComponent extends AppBaseComponent implements OnInit {
    displayLevel2: boolean = false;
    displayLevel3: boolean = false;

    programsDetails: ProgramDetails;
    countrys: CountryModel[] = [];
    anyOperationInProgress: boolean = false;
    programDetailsGetInProgress: boolean = false;
    programId: any;
    showInterestInprogress: boolean;
    user: any;
    isLoadingInProgress: boolean;
    isUserLevelInprogress: boolean;
    kpiList: any;
    sdgGoalsKeys: any = [];
    sdgGoalsValues: any = {};
    esgKeys: any = [];
    esgValues: any = {};
    userLevel: any = [];
    
    constructor(private router: Router, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
        private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, private livesService: LivesManagementService,
        private countryService: HRManagementService) {
        super();
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.programId = routeParams.id;   
            }
        });
        this.getProgramBasicDetails();
        this.user = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
        this.getUserLevelAccess();
        this.getKPIData();
        // console.log("this.user", this.user);
    }

    ngOnInit() {
        this.getCountrys();
    }
    
    navigate(value) {
        if(value == "level2") {
            this.showInterest();
        } else if(value == "level3") {
            
        }
    }

    knowMoreClick() {
        this.router.navigate(['lives/smile-level-two', this.programId]);
    }

    displayLevel3Emit(value) {
        if(value) {
            this.knowMoreClick();
        }
    }

    validateUserAccess() {
        if(this.checkLevelPermission("98B3DA9D-2989-468F-9E12-16F1DBF97983") || this.checkLevelPermission("8964657D-706D-472B-956A-95482C374E85")) {
            return true;
        } else {
            return false;
        }
    }

    checkLevelPermission(id) {
        var exists = false;
        this.userLevel.forEach((x: any) => {
            if(x.levelId.toLowerCase() == id.toLowerCase()) {
                exists = true;
            }
        });
        return exists;
    }

    getProgramBasicDetails() {
        this.programDetailsGetInProgress = true;
        var programSearchModel = new ProgramSearchModel();
        if(this.programId != null && this.programId != "") {
            programSearchModel.dataSetId = this.programId;
        }
        this.livesService.getProgramBasicDetails(programSearchModel).subscribe((response: any) => {
            if(response.success) {
                this.programsDetails = response.data[0];
                this.programsDetails.formDataObject = JSON.parse(this.programsDetails.formData);
            } else {
                this.programsDetails = null;
            }
            this.programDetailsGetInProgress = false;
            this.cdRef.detectChanges();
        });      
    }

    getCountrys() {
        this.anyOperationInProgress = true;
        this.livesService.getCountries().subscribe((response: any) => {
          this.anyOperationInProgress = false;
          this.countrys = response.data;
        })
    }

    showInterest() {
        var program = {};
        program["id"] = this.programId;
        this.showInterestInprogress = true;
        this.livesService.updateShowInerestOnProgram(program).subscribe((response: any) =>{
            if(response.success) {
                this.toaster.success("Thank you for your interest in the program. You will receive Program Owner's response on your registered email id", "",
                {
                    positionClass: "toast-top-center"
                });
            } else {

            }
            this.showInterestInprogress = false;
        });
    }

    showCountryName(id) {
        if(id != "") {
            var country = this.countrys.filter(x => x.countryId.toLowerCase() == id.toLowerCase());
            return country[0].countryName;
        } else {
            return "";
        }
    }

    getUserLevelAccess() {
        var accessModel = {};
        accessModel["programId"] = this.programId;
        accessModel["userAutheticationId"] = this.user.id;
        this.isUserLevelInprogress = true;
        this.livesService.getUserLevelAccess(accessModel).subscribe((response: any) => {
            this.isUserLevelInprogress = false;
            if(response.success) {
                this.userLevel = response.data;
            } else {
                this.userLevel = [];
            }
        });
    }

    getKPIData() {
        var searchModel: any = {};
        searchModel.programId = this.programId;
        searchModel.isArchived = false;
        this.isLoadingInProgress = true;
        this.livesService.getESGIndicators(searchModel).subscribe((response: any) => {
            this.isLoadingInProgress = false;
            if (response.success) {
                this.kpiList = response.data[0];
                var sdg1 = "";
                var sdg2 = "";
                var sdg3 = "";

                var esg1 = "";
                var esg2 = "";
                var esg3 = "";

                var sdgValue1 = this.kpiList.formData.kpi01;
                var sdgValue2 = this.kpiList.formData.kpiNumber02;
                var sdgValue3 = this.kpiList.formData.kpiNumber03;
                if(this.kpiList.formData["tasksForKpi01"].length > 0) {
                    var sdg = [];
                    var esg = [];
                    this.kpiList.formData["tasksForKpi01"].forEach(x => {
                        if(x["applicableSdGs1"].length > 0) {
                            this.sdgGoalsKeys.push(...x["applicableSdGs1"]);
                            sdg.push(...x["applicableSdGs1"]);
                        }

                        if(x["applicableEsgIndicators3"].length > 0) {
                            this.esgKeys.push(...x["applicableEsgIndicators3"]);
                            esg.push(...x["applicableEsgIndicators3"]);
                        }
                    });

                    if(sdg.length > 0)
                    sdg1 = [...new Set(sdg)].toString();

                    if(esg.length > 0)
                    esg1 = [...new Set(esg)].toString();
                    // this.sdgGoalsKeys.push(...this.kpiList.formData.applicableSdGs1);
                    // sdg1 = this.kpiList.formData.applicableSdGs1.toString();
                }
                if(this.kpiList.formData["tasksForKpi02"].length > 0) {
                    var sdg = [];
                    var esg = [];
                    this.kpiList.formData["tasksForKpi02"].forEach(x => {
                        if(x["applicableSdGsForKpi02"].length > 0) {
                            this.sdgGoalsKeys.push(...x["applicableSdGsForKpi02"]);
                            sdg.push(...x["applicableSdGsForKpi02"]);
                        }

                        if(x["applicableEsgIndicators4"].length > 0) {
                            this.esgKeys.push(...x["applicableEsgIndicators4"]);
                            esg.push(...x["applicableEsgIndicators4"]);
                        }
                    });

                    if(sdg.length > 0)
                    sdg2 = [...new Set(sdg)].toString();

                    if(esg.length > 0)
                    esg2 = [...new Set(esg)].toString();
                    // this.sdgGoalsKeys.push(...this.kpiList.formData.applicableSdGsForKpi02);
                    // sdg2 = this.kpiList.formData.applicableSdGsForKpi02.toString();
                }
                if(this.kpiList.formData["tasksForKpi03"].length > 0) {
                    var sdg = [];
                    var esg = [];
                    this.kpiList.formData["tasksForKpi03"].forEach(x => {
                        if(x["applicableSdGsForKpi03"].length > 0) {
                            this.sdgGoalsKeys.push(...x["applicableSdGsForKpi03"]);
                            sdg.push(...x["applicableSdGsForKpi03"]);
                        }

                        if(x["applicableEsgIndicators5"].length > 0) {
                            this.esgKeys.push(...x["applicableEsgIndicators5"]);
                            esg.push(...x["applicableEsgIndicators5"]);
                        }
                    });

                    if(sdg.length > 0)
                    sdg3 = [...new Set(sdg)].toString();

                    if(esg.length > 0)
                    esg3 = [...new Set(esg)].toString();
                    // this.sdgGoalsKeys.push(...this.kpiList.formData.applicableSdGsForKpi03);
                    // sdg3 = this.kpiList.formData.applicableSdGsForKpi03.toString();
                }

                if(this.sdgGoalsKeys.length > 0) {
                    this.sdgGoalsKeys =  [...new Set(this.sdgGoalsKeys)];
                    this.sdgGoalsKeys.forEach(x => {
                        if(x in this.sdgGoalsValues) {
                            if(sdg1 != "" && sdg1.includes(x)) {
                                this.sdgGoalsValues[x].push(sdgValue1);
                            }    
                            if(sdg2 != "" && sdg2.includes(x)) {
                                this.sdgGoalsValues[x].push(sdgValue2);
                            }
                            if(sdg3 != "" && sdg3.includes(x)) {
                                this.sdgGoalsValues[x].push(sdgValue3);
                            }
                        } else {
                            this.sdgGoalsValues[x] = [];
                            if(sdg1 != "" && sdg1.includes(x)) {
                                this.sdgGoalsValues[x].push(sdgValue1);
                            }    
                            if(sdg2 != "" && sdg2.includes(x)) {
                                this.sdgGoalsValues[x].push(sdgValue2);
                            }
                            if(sdg3 != "" && sdg3.includes(x)) {
                                this.sdgGoalsValues[x].push(sdgValue3);
                            }
                        }
                        this.sdgGoalsValues[x] = [...new Set(this.sdgGoalsValues[x])];
                    });
                }

                if(this.esgKeys.length > 0) {
                    this.esgKeys =  [...new Set(this.esgKeys)];
                    this.esgKeys.forEach(x => {
                        if(x in this.esgValues) {
                            if(esg1 != "" && esg1.includes(x)) {
                                this.esgValues[x].push(sdgValue1);
                            }    
                            if(esg2 != "" && esg2.includes(x)) {
                                this.esgValues[x].push(sdgValue2);
                            }
                            if(esg3 != "" && esg3.includes(x)) {
                                this.esgValues[x].push(sdgValue3);
                            }
                        } else {
                            this.esgValues[x] = [];
                            if(esg1 != "" && esg1.includes(x)) {
                                this.esgValues[x].push(sdgValue1);
                            }    
                            if(esg2 != "" && esg2.includes(x)) {
                                this.esgValues[x].push(sdgValue2);
                            }
                            if(esg3 != "" && esg3.includes(x)) {
                                this.esgValues[x].push(sdgValue3);
                            }
                        }
                        this.esgValues[x] = [...new Set(this.esgValues[x])];
                    });
                }

            } else {

            }
        })
    }
}
