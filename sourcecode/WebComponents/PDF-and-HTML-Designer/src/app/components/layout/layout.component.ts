import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/services/document.service';
import { DataStateChangeEvent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { orderBy, process, SortDescriptor, State } from '@progress/kendo-data-query';
import { LocalStorageProperties } from 'src/app/constants/localstorage-properties';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  state: State = {
    skip: 0,
    take: 15,
  };
  showdocumenteditor: boolean = false;
  data: any;
  pageSettings: PageSettingsModel;
  isArchived: boolean = false;
  gridData: GridDataResult;
  loading: boolean = false;
  selectedHtmlFile: any;
  searchText: string = null;
  userRoles: string;
  userId:string;

  constructor(private service: DocumentService, private renderer: Renderer2, private toaster: ToastrService, private cdRef: ChangeDetectorRef) {
    this.pageSettings = { pageSize: 10 };
    this.service.Backbutton$.subscribe(data => {
      this.showdocumenteditor = data;
    })
  }

  ngOnInit(): void {
    this.gethtmlfiles(this.isArchived, this.searchText);
    var userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    if(userModel)
    {
       this.userRoles= userModel.roleIds;
       this.userId = userModel.id;
    }
  }

  toggleArchivedStatus() {
    this.searchText = null;
    if (!this.isArchived) {
      this.isArchived = true;
      this.gethtmlfiles(true, this.searchText)
    } else {
      this.isArchived = false
      this.gethtmlfiles(false, this.searchText)
    }
  }

  gethtmlfiles(isArchived: boolean, searchText) {
    this.loading = true;
    this.service.getgriddata(isArchived, searchText).subscribe((response: any) => {
      this.data = response.data;
      let result = this.data;
      if (this.state.sort) {
        result = orderBy(this.data, this.state.sort);
      }
      this.gridData = process(result, this.state);
      this.loading = false;
    })
  }

  openDocumentEditor() {
    this.selectedHtmlFile = null;
    if (this.showdocumenteditor) {
      this.showdocumenteditor = false;
    } else {
      this.showdocumenteditor = true;
    }
  }

  EditFile(event: any) {
    this.showdocumenteditor = true;
    this.service.notifyeditdocument(event)
  }

  archiveTemplate(event: any) {
    this.service.deletehtml(event._id, false).subscribe((response: any) => {
      console.log(response)
      if (response.success == true) {
        this.gethtmlfiles(this.isArchived, this.searchText)
        this.toaster.success("Archived template successfully");
      } else {
        this.toaster.error("Archiving template failed");
      }
    });
  }

  unarchiveTemplate(event: any) {
    this.service.enablehtml(event._id, true).subscribe((response: any) => {
      console.log(response)
      if (response.success == true) {
        this.gethtmlfiles(this.isArchived, this.searchText)
        this.toaster.success("Unarchived template  successfully");

      } else {
        this.toaster.error("Unarchiving template failed");
      }
    });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.cdRef.detectChanges();
    this.state = state;
    let gridData = this.data;
    if (this.state.sort) {
      gridData = orderBy(this.data, this.state.sort);
    }
    this.gridData = process(gridData, this.state);
  }

  editTemplate(data: any) {
    this.selectedHtmlFile = data;
    this.showdocumenteditor = true;
  }

  closeSearch() {
    this.searchText = null;
    this.gethtmlfiles(this.isArchived, this.searchText);
  }

  filterByName(event) {
    if (event != null && event.target.value) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
      this.gethtmlfiles(this.isArchived, this.searchText);
    }
  }

  searchTextChange(event) {
    if (event != null && (event.target.value == "" || event.target.value == null)) {
      this.closeSearch();
    }
  }

  canAccessTemplate(template){
    if(template.templatePermissions !=null && template.templatePermissions.length >0 && this.userRoles != null)
    {
      var hasRoleAccess = template.templatePermissions.find(perm=> perm.roleId && perm.roleId == this.userRoles.toLowerCase());
      var hasUserAccess = template.templatePermissions.find(perm=> perm.userId && perm.userId == this.userId.toLowerCase());
      if(hasRoleAccess || hasUserAccess)
      {
        return true;
      }
      else{
        return false;
      }

    }
    else{
      return true;
    }

  }

}
