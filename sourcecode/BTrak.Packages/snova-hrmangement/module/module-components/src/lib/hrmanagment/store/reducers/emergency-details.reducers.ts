import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { EmployeeEmergencyContactDetails } from '../../models/employee-emergency-contact-details-model';
import { EmergencyDetailsActions, EmergencyDetailsActionTypes } from '../actions/emergency-details.actions';

export interface State extends EntityState<EmployeeEmergencyContactDetails> {
    loadingEmergencyDetails: boolean;
    creatingEmergencyContact: boolean;
    gettingEmergencyContactById: boolean;
    createEmergencyContactErrors: string[];
    EmployeeDetails: EmployeeEmergencyContactDetails[];
    EmployeeContact: EmployeeEmergencyContactDetails;
    EmployeeEmergencyContactId: string;
    exceptionMessage: string;
}

export const EmergencyContactAdapter: EntityAdapter<EmployeeEmergencyContactDetails> = createEntityAdapter<EmployeeEmergencyContactDetails>({
    selectId: (emergencyContacts: EmployeeEmergencyContactDetails) => emergencyContacts.emergencyContactId
});

export const initialState: State = EmergencyContactAdapter.getInitialState({
    loadingEmergencyDetails: false,
    creatingEmergencyContact: false,
    gettingEmergencyContactById: false,
    createEmergencyContactErrors: [''],
    EmployeeDetails: null,
    EmployeeContact: null,
    EmployeeEmergencyContactId: '',
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: EmergencyDetailsActions
): State {
    switch (action.type) {
        case EmergencyDetailsActionTypes.LoadEmergencyDetailsTriggered:
            return { ...state, loadingEmergencyDetails: true };
        case EmergencyDetailsActionTypes.LoadEmergencyDetailsCompleted:
            return EmergencyContactAdapter.addAll(action.emergencyDetails, {
                ...state,
                loadingEmergencyDetails: false, EmployeeDetails: action.emergencyDetails
            });
        case EmergencyDetailsActionTypes.CreateEmergencyDetailsTriggered:
            return { ...state, creatingEmergencyContact: true };
        case EmergencyDetailsActionTypes.CreateEmergencyDetailsCompleted:
            return { ...state, creatingEmergencyContact: false, EmployeeEmergencyContactId: action.employeeEmergencyContactId };
        case EmergencyDetailsActionTypes.CreateEmergencyDetailsFailed:
            return { ...state, creatingEmergencyContact: false, createEmergencyContactErrors: action.validationMessages };
        case EmergencyDetailsActionTypes.DeleteEmergencyContactDetailsCompleted:
            return EmergencyContactAdapter.removeOne(action.employeeEmergencyContactId,  {...state, creatingEmergencyContact: false});
        case EmergencyDetailsActionTypes.GetEmergencyContactByIdTriggered:
            return { ...state, gettingEmergencyContactById: true };
        case EmergencyDetailsActionTypes.GetEmergencyContactByIdCompleted:
            return { ...state, gettingEmergencyContactById: false, EmployeeContact: action.emergencyContact };
        case EmergencyDetailsActionTypes.CreateEmergencyContactCompletedWithInPlaceUpdate:
            return EmergencyContactAdapter.updateOne(action.emergencyDetailsUpdates.emergencyDetailsUpdate, state);
        case EmergencyDetailsActionTypes.RefreshEmergencyDetails:
            return EmergencyContactAdapter.upsertOne(action.emergencyContact, state);
        case EmergencyDetailsActionTypes.ExceptionHandled:
            return { ...state, creatingEmergencyContact: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}