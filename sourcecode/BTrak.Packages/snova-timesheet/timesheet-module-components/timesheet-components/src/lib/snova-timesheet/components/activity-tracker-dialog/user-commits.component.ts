import { Component, Inject, Input } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Page } from '../../models/Page';
import { TimesheetService } from '../../services/timesheet-service.service';
import { RepositoryCommitsModel } from '../../models/repository-commits.model';
import { GridSettings } from '../../models/grid-settings.model';
import { process, State } from "@progress/kendo-data-query";

@Component({
    selector: "app-user-commit-details",
    templateUrl: "user-commits.component.html"
})

export class UserCommitsViewComponent extends CustomAppBaseComponent {

    @Input('commitsData')
    set _commitsData(data: any) {
        this.loadingIndicator = true;
        this.userCommitDetails = data;
        this.gridSettings = {
            state: {
                skip: 0,
                take: 30,

                filter: {
                    logic: "and",
                    filters: []
                }
            },
            gridData: { data: [], total: 0 },
            selectedTimeZoneType: 0,
            columnsConfig: []
        };
        this.gridSettings.gridData = process(this.userCommitDetails, this.gridSettings.state);
        this.loadingIndicator = false;
    }

    public gridSettings: GridSettings = {
        state: {
            skip: 0,
            take: 30,

            filter: {
                logic: "and",
                filters: []
            }
        },
        gridData: { data: [], total: 0 },
        selectedTimeZoneType: 0,
        columnsConfig: []
    };

    appType: string;
    page = new Page();
    sortBy: string;
    sortDirectionAsc: boolean;
    userCommitDetails: RepositoryCommitsModel[];
    loadingIndicator: boolean;

    constructor() {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    openInNewTab(redirectUrl) {
        if (redirectUrl.dataItem && redirectUrl.dataItem.commitReferenceUrl) {
            window.open(redirectUrl.dataItem.commitReferenceUrl, "_blank");
        }
    }

    dataStateChange(state: State): void {
        this.gridSettings.state = state;
        this.gridSettings.gridData = process(this.userCommitDetails, state);
    }
}
