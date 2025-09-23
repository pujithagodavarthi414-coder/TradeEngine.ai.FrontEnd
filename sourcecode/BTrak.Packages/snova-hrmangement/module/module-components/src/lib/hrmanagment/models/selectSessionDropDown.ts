export class SelectSessionDropDown {
    Session: string;
}

export function createStubSelectSessionDropDown() {
    const data = new SelectSessionDropDown();
    data.Session = 'Second Half';

    return data;
}
