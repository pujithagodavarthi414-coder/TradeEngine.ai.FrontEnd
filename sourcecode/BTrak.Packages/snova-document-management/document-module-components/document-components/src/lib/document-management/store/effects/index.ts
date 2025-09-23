import * as fromFolders from './folder.effects';
import * as fromFile from './file.effects';
import * as fromFileUpload from './file-upload.effects';
import * as fromFilesUpload from './fileupload.effects';
import * as fromStore from './store.effects';
import * as fromNotification from './notification-validator.effects';
import * as fromSnackBar from './snackbar.effects';
import * as fromSoftLabels from './soft-labels.effects';
import * as fromStoreConfiguration from './store-configurations.effects';

export const allDocumentModuleEffects: any = [
    fromFolders.FolderEffects,
    fromFile.FileEffects,
    fromStore.StoreEffects,
    fromNotification.NotificationValidatorEffects,
    fromFileUpload.FileUploadEffects,
    fromFilesUpload.FileUploadEffects,
    fromSnackBar.SnackbarEffects,
    fromSoftLabels.SoftLabelConfigurationEffects,
    fromStoreConfiguration.StoreConfigurationEffects
]
