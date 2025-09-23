export class jobsModel {
    
    constructor(
      public id: string,
      public jobName: string,
      public userName: string,
      public color: string,
      public userProfileImage: string,
      public totalJobs : number,
      public filledJobs : number

      ) {

       }
  }