import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SkillsModel } from '../../../snovasys-recruitment-management-apps/models/skills.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-skills-list',
  templateUrl: 'skills-list.component.html'
})
export class SkillsListComponent extends CustomAppBaseComponent implements OnInit {
  @Output() selectSkill = new EventEmitter<object>();
  @Output() pagingChanged = new EventEmitter<any>();
  @Output() changeSkill = new EventEmitter<object>();
  @Input() loading: boolean;
  @Input('skills')
  set _skills(data: any) {
    if (data) {
      this.skills = data;
      this.totalCount = this.skills[0].totalCount;
      this.tempList = this.skills;
      if (this.skills.length > 0) {
        this.selectedSkillId = this.skills[0].skillId;
      }
      this.length = data.length;
    }
  }

  @Input('selectedSkill')
  set _selectedSkill(data: any) {
    if (data) {
      this.skillselected = true;
      this.selectedSkill = data;
    }
  }

  selectedSkillModel: SkillsModel;
  skillselected: boolean;
  selectedSkill: any;
  length: any;
  totalCount: any = 0;
  pageSize = 25;
  pageIndex: number;
  pageNumber = 1;
  pageSizeOptions: number[] = [25, 50, 100, 150, 200];
  searchText: string = null;
  tempList: any;
  isArchived = false;
  isAnyOperationIsInprogress = true;
  isThereAnError: boolean;
  skills: any;
  validationMessage: any;
  temp: any;
  selectedSkillId: any;
  candidateLoader = Array;
  candidateLoaderCount = 4;

  constructor( public dialog: MatDialog ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  closeSearch() {
    this.filterByName(null);
  }

  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    } else {
      this.searchText = '';
    }
    const temp = this.tempList.filter(address => (address.skillName.toLowerCase().indexOf(this.searchText) > -1));
    this.skills = temp;
    this.length = this.skills.length;
  }

  handleClickOnSkillComponent(selectedSkillModel: SkillsModel) {
    this.selectedSkillModel = selectedSkillModel;
    this.selectedSkillId = selectedSkillModel.skillId;
    this.skillselected = true;
    this.selectSkill.emit({ skill: selectedSkillModel, checked: true });
  }

  selectSkills(event) {}

  getSkillsList(pageEvent) {
    if (pageEvent.pageSize !== this.pageSize) {
      this.pageNumber = 1;
      this.pageIndex = 0;
    } else {
      this.pageNumber = pageEvent.pageIndex + 1;
      this.pageIndex = pageEvent.pageIndex;
    }
    this.pageSize = pageEvent.pageSize;
    this.pagingChanged.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize });
  }

  getclass() {
    if ((this.skills.length > 0 && this.skills[0].totalCount > 25 && this.skills.length > 24
      && this.skills !== undefined && this.skills.length !== 0) || (this.totalCount > 25 && this.pageNumber > 1)) {
      return 'p-0 m-0 alljobs-list';
    } else {
      return 'p-0 m-0 allgoals-list';
    }
  }

}
