// Module
export * from './lib/snova-role-management/rolemanagement.module';
// Module

// Components
import { RoleManagementContainerComponent } from './lib/snova-role-management/containers/role-management';
import { RolePermissionsComponent } from './lib/snova-role-management/components/role-permissions.component';
import { EntityPermissionsComponent } from './lib/snova-role-management/components/entity-permissions.component';

export { RoleManagementContainerComponent };
export { RolePermissionsComponent };
export { EntityPermissionsComponent };
// Components

// Models
import { EntityRoleModel } from './lib/snova-role-management/models/entity-role-model';
import { EntityTypeFeatureModel } from './lib/snova-role-management/models/entity-type-feature-model';
import { EntityTypeRoleFeatureModel } from './lib/snova-role-management/models/entity-type-role-feature-model';
import { RoleModel } from './lib/snova-role-management/models/role-model';

export { EntityRoleModel };
export { EntityTypeFeatureModel };
export { EntityTypeRoleFeatureModel };
export { RoleModel };
// Models

// Services
import { RoleService } from './lib/snova-role-management/services/role.service';

export { RoleService };
export {SoftLabelPipe};
export {CustomAppBaseComponent};
export {EntityRoleDialogComponent};
export {MapToKeysPipe};
export {CapitalizeFirstPipe};
export{RoleDialogComponent};
// Services

// Session routes
import { RoleManagementRoutes } from './lib/snova-role-management/rolemanagement.routing';
import { SoftLabelPipe } from './lib/snova-role-management/pipes/softlabels.pipes';
import { CustomAppBaseComponent } from './lib/globaldependencies/components/componentbase';
import { EntityRoleDialogComponent } from './lib/snova-role-management/components/entity-role-dialog.component';
import { MapToKeysPipe } from './lib/snova-role-management/pipes/groupBy.pipe';
import { CapitalizeFirstPipe } from './lib/snova-role-management/pipes/capitalizeFirst.pipe';
import { RoleDialogComponent } from './lib/snova-role-management/components/role-dialog.component';

export { RoleManagementRoutes };
 // Session routes