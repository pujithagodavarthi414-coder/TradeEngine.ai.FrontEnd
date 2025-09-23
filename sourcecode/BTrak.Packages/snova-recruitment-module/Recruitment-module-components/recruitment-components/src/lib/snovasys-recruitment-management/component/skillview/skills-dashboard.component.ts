import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, ChangeDetectorRef, Type, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, ViewContainerRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { SkillsModel } from "../../../snovasys-recruitment-management-apps/models/skills.model";
import { RecruitmentService } from "../../../snovasys-recruitment-management-apps/services/recruitment.service";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
@Component({
  selector: "app-skill-dashboard",
  templateUrl: "skills-dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsDashBoardComponent extends CustomAppBaseComponent implements OnInit {
  isAnyOperationIsInprogress: boolean;
    isArchived: boolean;
    isThereAnError: boolean;
    skills: any;
    temp: any;
    validationMessage: any;
  constructor(private store: Store<State>,
    private ngModuleRef: NgModuleRef<any>,
    private ngModuleFactoryLoader: NgModuleFactoryLoader,
    private recruitmentService: RecruitmentService,
    private vcr: ViewContainerRef,
    private cdRef: ChangeDetectorRef) {
    super();
    
  }
  ngOnInit() {
    super.ngOnInit();
    this.getSkills();
  }

  getSkills() {
    this.isAnyOperationIsInprogress = true;
    var skillsModel = new SkillsModel();
    skillsModel.isArchived = this.isArchived;
    this.recruitmentService.getSkills(skillsModel).subscribe((response: any) => {
        if (response.success == true) {
            this.isThereAnError = false
            this.skills = response.data;
            this.temp = this.skills
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        }
        else {
            this.isThereAnError = true;
            this.validationMessage = response.apiResponseMessages[0].message;
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        }
    });
}
}