import * as fromFileUpload from './file-upload.effects';
import * as fromFolders from "./folder.effects";
import * as fromFile from "./file.effects";
import * as fromStoreConfiguration from "./store-configurations.effects";
import * as fromStore from "./store.effects";
import * as fromSnackbar from "./snackbar.effects";
import * as fromSoftLabelEffects from "./soft-labels.effects";
import * as fromNotificationEffects from "./notification-validator.effects";

export const allCommonModuleEffects: any = [
    fromFolders.FolderEffects,
    fromFile.FileEffects,
    fromFileUpload.FileUploadEffects,
    fromStoreConfiguration.StoreConfigurationEffects,
    fromStore.StoreEffects,
    fromSnackbar.SnackbarEffects,
    fromSoftLabelEffects.SoftLabelConfigurationEffects,
    fromNotificationEffects.NotificationValidatorEffects
];
