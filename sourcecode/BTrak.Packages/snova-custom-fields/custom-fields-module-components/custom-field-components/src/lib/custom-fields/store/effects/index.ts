import * as fromCustomFieldEffects from './custom-fields.effects';
import * as fromCustomFieldHistoryEffects from "./custom-field-history.effects";
import * as fromSoftlabelEffects from "./soft-labels.effects";

export const allCommonModuleEffects: any = [
    fromCustomFieldEffects.CustomFieldEffects,
    fromCustomFieldHistoryEffects.CustomFieldHistoryEffects,
    fromSoftlabelEffects.SoftLabelConfigurationEffects
];
