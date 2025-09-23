export class CaseDetails{
    Id:string;
    Name:string;
    Type:string;
    Priority:string;
    Estimate:string;
    References:string;
    AutomationType:string;
    Steps:string[];
    ExpectedResult:string;
    Attachments:string;
    SuiteName:string;
    SectionName:string;
}
export function createStubcaseDetails() {
    const caseDetails = new CaseDetails();
    caseDetails.Id = 'C14754';
    caseDetails.Name = 'User unable to log into the account if the password is not valid';
    caseDetails.Type = 'Acceptance';
    caseDetails.Priority = 'High';
    caseDetails.Estimate = 'None';
    caseDetails.References = 'None';
    caseDetails.AutomationType = 'Ranorex';
    caseDetails.Steps = ['1.Give the invalid email id','2.Enter the password according to the email id'];
    caseDetails.ExpectedResult = 'User should not logged in to the account';
    caseDetails.Attachments='No attachements';
    caseDetails.SectionName='Log in functionality';
    caseDetails.SuiteName='Regression Pack';
    return caseDetails;
 }