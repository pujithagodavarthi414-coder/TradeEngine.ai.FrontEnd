

import { AppDialogComponent } from "./lib/widget-module/components/app-dialog/app-dialog.component";
import { TabsViewComponent } from "./lib/widget-module/components/tabs-view/tabs-view.component";
import { HiddenWorkspaceslistComponent } from "./lib/widget-module/components/hiddenworkspaces/hiddenworkspaceslist.component";
import { WidgetsgridsterComponent } from "./lib/widget-module/components//widgetsgridster/widgetsgridster.component";
import { CustomAppsListViewComponent } from "./lib/widget-module/components/custom-apps-listview/custom-apps-listview.component";
import { CustomAppFilterComponent } from "./lib/widget-module/components/app-custom-filter/app-custom-filter.component";
import { MessageBoxComponent } from "./lib/widget-module/components/message-box/message-box.component";
import { WidgetNameFilterPipe } from "./lib/globaldependencies/pipes/widgets-name-filter.pipe";
import { AppTagsFilterPipe } from "./lib/globaldependencies/pipes/app-tags-filter.pipe";
import { RemoveSpecialCharactersPipe } from "./lib/globaldependencies/pipes/removeSpecialCharacters.pipe";
import { HeatMapDatePipe } from "./lib/globaldependencies/pipes/heat-map-date-pipe";
import { PaletteLabelPipe } from "./lib/globaldependencies/pipes/palette-label.pipe";
import { sentencePipe } from "./lib/globaldependencies/pipes/sentence-case.pipe";
import { SoftLabelPipe } from "./lib/globaldependencies/pipes/softlabels.pipes";
import { NgMessageTemplateDirective } from "./lib/globaldependencies/directives/message-box.directive";
import { MomentUtcDateAdapter } from "./lib/globaldependencies/directives/moment-utc-date-adapter";
import { WidgetRoutes } from './lib/widget-module/widget.routing';
import { WidgetModule } from './lib/widget-module/widget.module';
import { modulesInfo } from './lib/widget-module/dependencies/models/modulesInfo';
import { ModulesService } from './lib/widget-module/dependencies/services/modules.service';
import { FilteredListviewComponent } from './lib/widget-module/components/apps-filtes-listview/apps-filters-listview';
import { ListViewFilterComponent } from "./lib/widget-module/components/list-view-filter/list-view-filter.component";
import { WidgetLoadingComponent } from "./lib/widget-module/components/widget-loading-component/widgetloading.component";
import { AvatarComponent } from "./lib/globaldependencies/components/avatar.component";
import { CustomAppBaseComponent } from "./lib/globaldependencies/components/componentbase";

export * from './lib/widget-module/widget.module';
export { AppDialogComponent }
export { TabsViewComponent }
export { HiddenWorkspaceslistComponent }
export { WidgetsgridsterComponent }
export { CustomAppsListViewComponent }
export { CustomAppFilterComponent }
export { MessageBoxComponent }
export { WidgetNameFilterPipe }
export { AppTagsFilterPipe }
export { RemoveSpecialCharactersPipe }
export { HeatMapDatePipe }
export { PaletteLabelPipe }
export { sentencePipe }
export { SoftLabelPipe }
export { NgMessageTemplateDirective }
export { MomentUtcDateAdapter }
export { WidgetRoutes }
export { WidgetModule }
export { modulesInfo }
export { ModulesService }
export { FilteredListviewComponent }
export { ListViewFilterComponent }
export { WidgetLoadingComponent }
export { AvatarComponent }
export { CustomAppBaseComponent }

export * from './lib/widget-module/dependencies/store/reducers/index';

