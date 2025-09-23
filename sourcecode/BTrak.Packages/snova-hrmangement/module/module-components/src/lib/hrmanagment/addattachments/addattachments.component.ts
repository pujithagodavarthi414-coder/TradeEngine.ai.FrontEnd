import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addattachments',
  templateUrl: './addattachments.component.html',
  styleUrls: ['./addattachments.component.scss']
})
export class AddattachmentsComponent implements OnInit {
  public show: boolean = false;
  public buttonName: any = 'Add';

  addDoc = [{
    filename: 'file1',
    // tslint:disable-next-line:max-line-length
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since',
    createddate: '26-09-2018',
    edit: 'Edited',
    delete: 'none',
  }, {
    filename: 'file2',
    // tslint:disable-next-line:max-line-length
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since',
    createddate: '25-09-2018',
    edit: 'Edit',
    delete: 'none',
  }];

  constructor() { }

  ngOnInit() {
  }
  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.buttonName = "Cancel";
    else
      this.buttonName = "Add";
  }
  deleteItem(row){

  }
}
