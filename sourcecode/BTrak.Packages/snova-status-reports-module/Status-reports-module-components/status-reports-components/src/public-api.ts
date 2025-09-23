import { StatusReportsModule } from './lib/status-reports-management/status-reports.module';
import { StatusReportingDialogComponent } from './lib/status-reports-management/components/status-reporting-dialog.component';
import { StatusReportingComponent } from './lib/status-reports-management/components/statusReporting.component';
import { ViewindividualreportsComponent } from './lib/status-reports-management/components/viewindividualreports.component';
import { ViewreportsComponent } from './lib/status-reports-management/components/viewreports.component';
import { ViewSubmitedReportsComponent } from './lib/status-reports-management/components/viewsubmitedreports.component';
import { StatusReportComponent } from './lib/status-reports-management/components/statusreport.component';
import { StatusreportService } from './lib/status-reports-management/services/statusreport.service';
import { StatusReportRoutes } from './lib/status-reports-management/status-reports.routes';
import { CustomAppBaseComponent } from './lib/globaldependencies/components/componentbase';
import { SoftLabelPipe } from './lib/status-reports-management/pipes/soft-labels.pipe';
import { ViewformComponent } from './lib/status-reports-management/components/view-form.component';
import { AvatarComponent } from './lib/globaldependencies/components/avatar.component';
import { RemoveSpecialCharactersPipe } from './lib/globaldependencies/pipes/removeSpecialCharacters.pipe';
import { ConvertUtcToLocalTimePipe } from './lib/status-reports-management/pipes/utctolocaltimeconversion.pipe';
import { UtcToLocalTimeWithDatePipe } from './lib/globaldependencies/pipes/utctolocaltimewithdate.pipe';
import { StatusReportsNamePipe } from './lib/status-reports-management/pipes/statusreportsnamefilter.pipe';
import { StatusReportsSettingsComponent } from './lib/status-reports-management/components/status-reports-settings.component';
import { SanitizeHtmlPipe } from './lib/status-reports-management/pipes/sanitize.pipe';
import { StatusReportsModuleService } from './lib/status-reports-management/services/statusreports.modules.service';

export { StatusReportsModule }
export { StatusReportRoutes }
export { StatusReportingDialogComponent }
export { StatusReportingComponent }
export { ViewindividualreportsComponent }
export { ViewreportsComponent }
export { ViewSubmitedReportsComponent }
export { StatusReportComponent }
export { StatusreportService } 
export {CustomAppBaseComponent}
export {SoftLabelPipe}
export {ViewformComponent}
export {AvatarComponent}
export {RemoveSpecialCharactersPipe}
export {UtcToLocalTimeWithDatePipe}
export {ConvertUtcToLocalTimePipe}
export {StatusReportsNamePipe}
export {StatusReportsSettingsComponent}
export {SanitizeHtmlPipe}
export{StatusReportsModuleService}