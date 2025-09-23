import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-candidate-popups-details',
  templateUrl: 'candidate-popups-component.html',

})
export class AppcandidatepopupsdetailsComponent implements OnInit {
  @Input() src: string;
  @Input() name: string;
  @Input() size: string;
  @Input() isNameRequired ? = true;
  @ViewChild('documentFormDirective') documentFormDirective: FormGroupDirective;
  selectedIndex;
  candidate: string;
  @Output() closePopup = new EventEmitter<string>();
  @Input('selectedIndex')
  set _setSelectedIndex(selectedIndex: string) {
    this.selectedIndex = selectedIndex;
  }

  @Input('candidate')
  set _setcandidate(candidate: any) {
    this.candidate = candidate;
  }

  isAnyOperationIsInprogress = true;
  documents: any;
  candidateDocument: any;
  documentForm: FormGroup;
  CandidateDocumentsId: string;
  DocumentName: string;
  timeStamp: any;
  ratingTypeTitle: any;
  isThereAnError: boolean;
  validationMessage: string;
  searchText: any;
  document: any;
  isArchived = false;
  documentTitle: any;
  anyOperationInProgress$: Observable<boolean>;

  ngOnInit() {}

  constructor() {}

  closeCandidateDialog() {
    this.closePopup.emit('');
  }

}


