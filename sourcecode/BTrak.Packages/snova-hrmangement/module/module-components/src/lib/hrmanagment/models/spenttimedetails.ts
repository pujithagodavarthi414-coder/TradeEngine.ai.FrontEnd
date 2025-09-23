export class SpentTimeDetails {
    UserName: string;
    Date: string;
    UserStory: string;
    SpentTime: string;
}

export function createStubSpentTimeDetails() {
    const spentTimeDetails = new SpentTimeDetails();

    spentTimeDetails.UserName = 'Bala Koti	';
    spentTimeDetails.Date = '2018-06-09 07:47';
    spentTimeDetails.UserStory = 'Search for the Name in the Employee directory';
    spentTimeDetails.SpentTime = '13';

    return spentTimeDetails;
}

