import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { fileModel } from "../../models/fileModel";

import { ValidationModel } from "../../models/validation-messages";
import {
  FileUploadActionsUnion,
  FileUploadActionTypes
} from "../actions/fileupload.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<fileModel> {
  selectedfileUploadId: string | null;
  fileUploadstarted: boolean | false;
  fileUploadErrors: ValidationModel[];
  filesModel: fileModel[];
  loadingFiles: boolean;
}

export const adapter: EntityAdapter<fileModel> = createEntityAdapter<fileModel>(
  {
    selectId: (file: fileModel) => file.fileId,
    sortComparer: false
  }
);

export const initialState: State = adapter.getInitialState({
  selectedfileUploadId: null,
  fileUploadstarted: false,
  fileUploadErrors: [],
  filesModel : [],
  loadingFiles: false
});

export function reducer(
  state = initialState,
  action: FileUploadActionsUnion
): State {
  switch (action.type) {
    case FileUploadActionTypes.FileUploadTriggered:
      return { ...state, fileUploadstarted: true };
    case FileUploadActionTypes.FileUploadCompleted:
      return { ...state, fileUploadstarted: false };
    case FileUploadActionTypes.FileUploadFailed:
      return {
        ...state,
        fileUploadstarted: false,
        fileUploadErrors: action.validationMessages
      };
    case FileUploadActionTypes.LoadUploadedFilesTriggered:
      return { ...state, loadingFiles: true };
    case FileUploadActionTypes.LoadUploadedFilesCompleted:
        return adapter.addAll(action.fileResult, {
          ...state,
          loadingFiles: false
        });
    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getSelectedId = (state: State) => state.selectedfileUploadId;
