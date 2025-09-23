import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { Subject, Observable } from 'rxjs';

import "../../globaldependencies/helpers/fontawesome-icons";

import { State } from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Router } from '@angular/router';

import * as $_ from 'jquery';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';

const $ = $_;

@Component({
    selector: 'app-audit-activity-view',
    templateUrl: './app-audit-activity-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddAuditActivityViewComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() closePopUp = new EventEmitter<any>();

    @Input("dashboardFilters")
    set _dashboardFilters(data: any) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    public ngDestroyed$ = new Subject();

    softLabels: SoftLabelConfigurationModel[];

    dashboardFilters: any;
    isFromDashboard: boolean = false;

    constructor(private store: Store<State>,
        private actionUpdates$: Actions, private routes: Router, private cdRef: ChangeDetectorRef) {
        super();

        this.getSoftLabelConfigurations();

        if (!(this.routes.url.includes('projects'))) {
            this.isFromDashboard = true;
            this.cdRef.markForCheck();
        }
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    fitContent(optionalParameters: any) {
        if (optionalParameters['gridsterView']) {
            // $(optionalParameters['gridsterViewSelector'] + ' #contact-details-form').height($(optionalParameters['gridsterViewSelector']).height() - 90);
            var height = $(optionalParameters['gridsterViewSelector']).height();
            var counter = 0;
            var applyHeight = setInterval(function () {
                if (counter > 10) {
                    clearInterval(applyHeight);
                }
                counter++;
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-overall-activity').length > 0) {
                    // $(optionalParameters['gridsterViewSelector'] + ' .fit-content-testsuite-history-scroll').css('max-height', (height - 180) + 'px');
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-overall-activity').css("cssText", `max-height: ${height - 45}px !important;`);
                    // clearInterval(applyHeight);
                }
            }, 1000);
        }
    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.routes.navigateByUrl('/projects');
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}