export class GenericFormSubmitted {
    oldFormJson: string;
    genericFormSubmittedId: string;
    formId: string;
    formJson: string;
    uniqueNumber: string;
    isArchived: boolean;
    isFinalSubmit: boolean;
    genericFormName: string;
    timeStamp: any;
    formData: string;
    customApplicationId: string;
    publicFormId: string;
    isFormReadonly: boolean;
    isAbleToLogin: boolean;
    isApproveNeeded: boolean;
    isApproved: boolean;
    allowAnnonymous:boolean;


}

export class GenericFormSubmittedSearchInputModel{
     genericFormSubmittedId:string;
     formId :string
     customApplicationId:string;
     UserId :string;
     IsArchived:boolean
     Key:string;
     QuerytoFilter: string; 
     FormName : string;
     CustomApplicationName : string;
     PageNumber:any;
     PageSize:any;
     IsPagingRequired: boolean;
     IsLatest: boolean;
     ParamsKeyModel:any;
     DateFrom :any;
     DateTo :any;
     userIds: any;
     subject: string;
     message: string;
  
    
    }