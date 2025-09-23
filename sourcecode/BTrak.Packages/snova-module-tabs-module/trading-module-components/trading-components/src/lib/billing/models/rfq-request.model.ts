export class RFQRequestModel{
    dataSetId: string;
    dataSourceId: string;
    templateId: string;
    templateTypeId: string;
    statusId: string;
    dataJson: any;
    clientId: any;
    brokerId: any;
    version: any;
    isAccepted: boolean;
    isRejected: boolean;
    rejectedComments: any;
    sendBackComments: any;
    rfqId: any;
    vesselConfirmationStatusId: any;
    vesselConfirmationTemplateId: any;
    isVesselConfirmationChange: any;
    isRequestVesselConfirmation: any;
    vesselConfirmationFormData: any;
}