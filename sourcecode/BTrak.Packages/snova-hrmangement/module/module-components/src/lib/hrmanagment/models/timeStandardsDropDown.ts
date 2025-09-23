export class TimeStandardsDropDown {
    Time: string;
}

export function createStubTimeStandardsDropDown() {
    const data = new TimeStandardsDropDown();
    data.Time = 'Indian Standard Time';

    return data;
}
