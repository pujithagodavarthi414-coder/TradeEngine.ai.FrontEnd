import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';
import { ProgramDetails } from '../../../models/programs-details.model';
import { LivesManagementService } from '../../../services/lives-management.service';
import { ProgramSearchModel } from '../../../models/program-search.model';
import { CountryModel } from '../../../models/country-model';
import { HRManagementService } from '../../../services/hr-management.service';

@Component({
    selector: 'app-lives-search',
    templateUrl: './lives-search.component.html'
})

export class LivesSearchComponent extends AppBaseComponent implements OnInit {

    openFilter: boolean = false;
    programsList: ProgramDetails[];
    tempList: ProgramDetails[];
    countrys: CountryModel[] = [];
    anyOperationInProgress: boolean = false;
    programDetailsGetInProgress: boolean = false;
    searchText: string;

    sdgFilterList: any = [];
    esgFilterList: any = [];
    selectedFilter: any = [];
    tempEsg: any;

    constructor(private router: Router, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
        private cdRef: ChangeDetectorRef, private livesService: LivesManagementService, private countryService: HRManagementService) {
        super();
    }

    ngOnInit() {
        this.getCountrys();
        this.getProgramBasicDetails();
        // var programs: any = {};
        // programs.formDataObject = {};
        // programs.commencementDate = "October 2020";
        // programs.formDataObject.programDuration = "11 Years";
        // programs.programName = "SMILE PROGRAM - Smallholder Inclusion for better Livelihood and Empowerment";
        // programs.imageUrl = "https://appfiles01.blob.core.windows.net/235ca35a-a7d9-4bda-81f9-8b62de2f4389/hrm/a749eff3-6620-47fb-bd5a-3a73f7dcae04/smileprogram-0e3194e4-2a78-4198-ac4d-5b48b8fbb1b7.png";
        // programs.formDataObject.country = "Indonesia";
        // programs.formDataObject.phase1 = "03";
        // programs.programId = "ID0001";
        // programs.formDataObject.objective = "A partnership between mid-stream processor and trader Apical Group, downstream producer Kao Corporation, and upstream producer Asian Agri, the SMILE Program is implemented with the framework provided by the RSPO. SMILE not only improves the knowledge and technical expertise of independent smallholders but also supports their journey in obtaining RSPO certification by 2030.";
        // programs.formDataObject.phase = "Apical";
        // programs.id = "3f8480b5-9e29-4c2a-ada6-cd2d1cd5306a";
        // this.programsList.push(programs);
        // this.tempList = this.programsList;

        // programs = new ProgramDetails();
        // programs.commencementDate = "";
        // programs.duration = "05 Years";
        // programs.programName = "Improving worker wellbeing through health and safety programs";
        // programs.image = "https://appfiles01.blob.core.windows.net/235ca35a-a7d9-4bda-81f9-8b62de2f4389/hrm/a749eff3-6620-47fb-bd5a-3a73f7dcae04/healthandsafety-12215377-0e55-4a3b-a35a-716c4f37c88f.png";
        // programs.country = "Indonesia";
        // programs.phases = "02";
        // programs.programId = "ID0002";
        // programs.description = "Managing 167 oil palm estates, with a total area of 485,600 hectares. Promoting a healthy and safe working environment for 49,000 direct employees, 67,000 smallholders and 58,000 casual workers";
        // programs.programOwner = "";
        // this.programsList.push(programs);

        // programs = new ProgramDetails();
        // programs.commencementDate = "";
        // programs.duration = "10 Years";
        // programs.programName = "Reduce chemicals used through integrated pest management";
        // programs.image = "https://appfiles01.blob.core.windows.net/235ca35a-a7d9-4bda-81f9-8b62de2f4389/hrm/a749eff3-6620-47fb-bd5a-3a73f7dcae04/pestmanagement-5ca39ad3-0a23-498f-94d5-9ef776fb4909.png";
        // programs.country = "Indonesia";
        // programs.phases = "03";
        // programs.programId = "ID0003";
        // programs.description = "Managing 200 oil palm estates, with a total area of 500,000 hectares and taking IPM programs advantage for appropriate pest management strategies, including the judicious use of pesticides.";
        // programs.programOwner = "";
        // this.programsList.push(programs);

        this.sdgFilterList.push("No Poverty", "Zero Hunger", "Good Health & Wellbeing", "Quality Education", "Gender Equality", "Clean Water & Sanitation",
            "Affordable & Clean Energy", "Decent Work & Economic Growth", "Industry, Innovation & Infrastructure", " Reduced Inequality", "Sustainable cities & Communities",
            "Responsible Consumption & Production", "Climate Action", "Life below Water", "Life on Land", "Peace, Justice & Strong Institutions",
            "Partnerships for the Goals");

        var esg = ["GHG emissions", "Energy efficiency", "Water and Waste efficiency", "Materials efficiency", "Other Air emissions efficiency", "Environmental Compliance",
            "Biodiversity", "Carbon Intensity", "Environmental management system"];
        this.esgFilterList.push({ type: "Environmental (E)", filters: esg });

        esg = ["Health and Safety", "Employees diversity and equality", "Training", "Human Rights Assessment", "Community Engagement", "Suppliers", "Marketing and Labelling",
            "Human Rights"];
        this.esgFilterList.push({ type: "Social (S)", filters: esg });

        esg = ["Board of Directors", "Compensation", "Ownership and control", "Audit", "Tax approach", "Compliance cases", "Shareholder democracy", "Executive compensation"];
        this.esgFilterList.push({ type: "Governance (G)", filters: esg });
    }

    displayCountryName(id) {
        if (id != "" && id != null && id != undefined) {
            var country = this.countrys.filter(x => x.countryId.toLowerCase() == id.toLowerCase());
            return country[0].countryName;
        } else {
            return "";
        }
    }

    toggleFilter() {
        this.openFilter = !this.openFilter;
    }

    navigateToMore(program) {
        let value = program.programName;
        this.router.navigate(['lives/object-background', program.programId]);
        // this.router.navigate(['lives/object-background/'+ value]);
    }

    onSelectFilter(value) {
        var index = this.selectedFilter.findIndex(x => x == value);
        if (index > -1) {
            this.selectedFilter.splice(index, 1);
        } else {
            this.selectedFilter.push(value);
        }
        this.setProgramListData();
    }

    checkIsFilterSelected(value) {
        var index = this.selectedFilter.findIndex(x => x == value);
        if (index > -1) {
            return true;
        }
        return false;
    }

    setProgramListData() {
        if (this.selectedFilter.length > 0) {
            //this.tempList = this.programsList.filter(x => x.programName.includes("SMILE PROGRAM"));
            var filteredValues = [];
            this.selectedFilter.forEach(filter => {
                var value = this.programsList.filter(x => (x.formDataObject["applicableSdGs"] != null && x.formDataObject["applicableSdGs"].toLowerCase().includes(filter.toLowerCase())) ||
                    (x.formDataObject["applicableEsgIndicators"] != null && x.formDataObject["applicableEsgIndicators"].toLowerCase().includes(filter.toLowerCase())));
                if (value != null && value.length > 0) {
                    value.forEach(x => {
                        var index = filteredValues.findIndex(x => x.programId == x.programId);
                        if (index == -1) {
                            filteredValues.push(x);
                        }
                    });
                }
            });
            this.tempList = filteredValues;
        } else {
            this.tempList = this.programsList;
        }
        this.tempEsg = this.tempList;
    }

    getProgramBasicDetails() {
        this.programDetailsGetInProgress = true;
        var programSearchModel = new ProgramSearchModel();
        this.livesService.getProgramBasicDetails(programSearchModel).subscribe((response: any) => {
            if (response.success) {
                this.programsList = response.data;
                if (this.programsList.length > 0) {
                    this.programsList.forEach((x) => {
                        x.formDataObject = JSON.parse(x.formData);
                    })
                }
                this.tempList = this.programsList;
            } else {
                this.programsList = [];
                this.tempList = this.programsList;
            }
            this.tempEsg = this.tempList;
            this.programDetailsGetInProgress = false;
            this.cdRef.detectChanges();
        });
    }

    getCountrys() {
        this.anyOperationInProgress = true;
        let countryModel = new CountryModel();
        this.countryService.getCountries(countryModel).subscribe((response: any) => {
            this.anyOperationInProgress = false;
            this.countrys = response.data;
        })
    }
    search() {
        if (this.searchText) {
            const progressListData = this.tempEsg.filter(esg => (esg.programName.toLowerCase().indexOf(this.searchText) > -1));
            this.tempList = progressListData;
            this.cdRef.detectChanges();
        }
    }
    closeSearch() {
        this.searchText = null;
        this.tempList = this.tempEsg;
    }

    generateSixDigitNumber(data) {
            var number = (data);
            var formattedNumber = this.padLeadingZeros(number, 5);
            var tradeIdGeneration = 'ID' + formattedNumber;
            return tradeIdGeneration;
    }

    padLeadingZeros(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

}
