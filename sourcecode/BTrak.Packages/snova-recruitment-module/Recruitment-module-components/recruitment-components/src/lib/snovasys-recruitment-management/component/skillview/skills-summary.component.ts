
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import {MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "underscore";
import { TranslateService } from "@ngx-translate/core";


// tslint:disable-next-line: ordered-imports
import { DatePipe } from "@angular/common";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { RecruitmentService } from '../../../snovasys-recruitment-management-apps/services/recruitment.service';
import { Store, select } from "@ngrx/store";
import { State } from '../../../snovasys-recruitment-management-apps/store/reducers/index';

@Component({
  selector: "gc-skills-summary",
  templateUrl: "skills-summary-component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SkillsSummaryComponent extends CustomAppBaseComponent implements OnInit {
  skill: any;
  skillSelected: boolean;
    expansionIcon: boolean;
    panelOpenState: boolean;
  @Input("skill")
  set _skill(data: any) {
    this.expansionIcon = false;
    this.panelOpenState = false;
    this.skill = data;
  }
  @Input("skillSelected")
  set _jobSelected(data: boolean) {
    this.skillSelected = data;
    this.expansionIcon = false;
    this.panelOpenState = false;
  }  

  @Input() isAnyOperationIsInProgress = false;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @Output() selectSkill = new EventEmitter<Object>();

  isArchived: boolean;

  constructor(
   private translateService: TranslateService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private store: Store<State>,
    public recruitmentService:RecruitmentService,
    private router: Router,
    private snackbar: MatSnackBar) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  closeMatMenu() {
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }
  togglePanel() {
    this.expansionIcon = !this.expansionIcon;
    if (this.skill.skillId === '0') {
      this.panelOpenState = false;
    } else {
      this.panelOpenState = !this.panelOpenState;
    }
  }
}
