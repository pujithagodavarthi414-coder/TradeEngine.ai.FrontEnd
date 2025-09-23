import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ChangeDetectionStrategy, ViewChildren, QueryList, ChangeDetectorRef } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { Observable } from "rxjs/internal/Observable";
import { select, Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import * as _ from 'underscore';
import { Actions, ofType } from "@ngrx/effects";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from '@angular/forms';import { tap } from 'rxjs/operators';
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { CandidateSearchCriteriaInputModel } from "../../models/candidate-input.model";
import { RecruitmentService } from "../../../snovasys-recruitment-management-apps/services/recruitment.service";
import { State } from "../../../store/reducers.ts";

@Component({
  selector: "gc-skills-candidates-list",
  templateUrl: "skills-candidates-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsCandidateComponent extends CustomAppBaseComponent implements OnInit {
  candidate: any;
    skills: any;
    skill: any;
 
  @Input("skills")
  set _goal(data: any) {
  if(data){
    this.skills = data;
    this.skill = this.skills[0];
  }
}
  @Input("candidate")
  set _candidate(data: CandidateSearchCriteriaInputModel) {
    this.candidate = data;
  }

  constructor(location: Location,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private router: Router,
    public dialog: MatDialog,
    private recruitmentService: RecruitmentService,
    private store: Store<State>,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  applyClassForUniqueName(userStoryTypeColor) {
    if (userStoryTypeColor) {
      return "asset-badge"
    } else {
      return "userstory-unique"
    }
  }

}