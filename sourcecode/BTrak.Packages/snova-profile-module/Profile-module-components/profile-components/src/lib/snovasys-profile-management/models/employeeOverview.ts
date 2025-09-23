export class EmployeeOverView {
    employeeName: string;
    fullName: string;
    surName: string;
    email: string;
    mobileNo: string;
    companyName: string;
    companyWebsite: string;
    note: string;
    street: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
    educationDetails: EducationDetails[];
    workExperienceDetails: WorkExperienceDetails[];
    skills: string[];
    languages: string[];
    reportToEmployeeName: string[];
    profileImage: string;
    firstName: string;
    designationName: string;
    branchName: string;
    countryName: string;
    zipcode: any;
}

export class EducationDetails {
    Institution: string;
    EducationLevel: string;
    MajorSpecialization: string;
}

export class WorkExperienceDetails {
    companyName: string;
    designationName: string;
    fromDate: Date;
    toDate: Date;
}
