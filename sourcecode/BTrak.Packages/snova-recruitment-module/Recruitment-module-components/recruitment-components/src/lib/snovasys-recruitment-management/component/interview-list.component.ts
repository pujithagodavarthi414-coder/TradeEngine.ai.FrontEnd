import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { InterviewScheduleModel } from '../../snovasys-recruitment-management-apps/models/interviewschedule.model';
import { LoadCandidateItemsTriggered, RefreshCandidatesList } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/candidate.reducers';
import { CandidateSearchtModel } from '../models/candidate-search.model';


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-interview-list',
    templateUrl: 'interview-list.component.html'
})
export class InteriviewListComponent extends CustomAppBaseComponent implements OnInit {
    @Output() selectInterviewType = new EventEmitter<object>();
    @Output() pagingChanged = new EventEmitter<any>();
    @Output() changeInterviewType = new EventEmitter<object>();
    interviewTypesModel: InterviewScheduleModel;
    interviewTypes: any;
    selectedInterviewTypeId: any;
    interviewTypeselected: boolean;
    selectedInterviewType: any;
    assignee: string;
    isRefresh = false;

    @Input('interviewTypes')
    set _interviewTypes(data: any) {
        if (data) {
            this.interviewTypes = data;
            this.tempList = this.interviewTypes;
            this.totalCount = this.interviewTypes[0].totalCount;
            this.selectedInterviewTypeId = this.interviewTypes[0].assignee;
            this.assignee = this.interviewTypes[0].assignee;
            length = data.length;
            this.getCandiates();
        }
    }
    @Input('candidateUpdatedinSide')
    set _candidateUpdatedinSide(candidateUpdatedinSide: boolean) {
        if (candidateUpdatedinSide) {
            this.isRefresh = true;
            this.getCandiates();
            this.cdRef.detectChanges();
        }
    }

    @Input('selectInterviewType')
    set _selectedInterviewType(data: any) {
        if (data) {
            this.interviewTypeselected = true;
            this.selectedInterviewType = data;
        }
    }

    searchText: string = null;
    tempList: any;
    isArchived = false;
    isAnyOperationIsInprogress = true;
    isThereAnError: boolean;
    skills: any;
    validationMessage: any;
    temp: any;
    totalCount: any = 0;
    pageSize = 25;
    pageIndex: number;
    pageNumber = 1;
    pageSizeOptions: number[] = [25, 50, 100, 150, 200];

    constructor(
        private store: Store<State>,
        public dialog: MatDialog,
        private cdRef: ChangeDetectorRef) {
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
        const temp = this.tempList.filter(intList => (intList.assigneeNames.toLowerCase().indexOf(this.searchText) > -1));
        this.interviewTypes = temp;
    }

    handleClickOnSkillComponent(interviewTypesModel: InterviewScheduleModel) {
        this.interviewTypesModel = interviewTypesModel;
        this.assignee = interviewTypesModel.assignee;
        this.selectedInterviewTypeId = this.assignee;
        this.interviewTypeselected = true;
        this.getCandiates();
        this.selectInterviewType.emit({ interview: interviewTypesModel, checked: true });
        this.cdRef.detectChanges();
    }

    getCandiates() {
        const candidateSearchtModel = new CandidateSearchtModel();
        candidateSearchtModel.interviewerId = this.assignee;
        candidateSearchtModel.pageSize = this.pageSize;
        candidateSearchtModel.pageNumber = this.pageNumber;
        if (this.isRefresh) {
            this.store.dispatch(new RefreshCandidatesList(candidateSearchtModel)); } else {
            this.store.dispatch(new LoadCandidateItemsTriggered(candidateSearchtModel)); }
    }
    selectSkills(event) {}

    getInterviewersList(pageEvent) {
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
        if ((this.interviewTypes.length > 0 && this.interviewTypes[0].totalCount > 25
             && this.interviewTypes.length > 24 && this.interviewTypes !== undefined
              && this.interviewTypes.length !== 0) || (this.totalCount > 25 && this.pageNumber > 1)) {
            return 'p-0 m-0 alljobs-list';
        } else {
            return 'p-0 m-0 allgoals-list';
        }
    }
}
