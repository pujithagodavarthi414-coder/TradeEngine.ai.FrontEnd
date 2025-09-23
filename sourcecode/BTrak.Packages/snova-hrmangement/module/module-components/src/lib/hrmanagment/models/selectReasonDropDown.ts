export class SelectReasonDropDownList {
    ReasonList: string;
}

export function createStubSelectReasonDropDownList() {
    const selectReasonDropDownListValue = new SelectReasonDropDownList();

    selectReasonDropDownListValue.ReasonList = 'Personal Work';
    return selectReasonDropDownListValue;
}
