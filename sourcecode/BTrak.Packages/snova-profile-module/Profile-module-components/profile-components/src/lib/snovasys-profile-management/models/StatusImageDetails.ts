export class StatusImageDetails {
    Img: string;
}

export function createStubStatusImageDetails() {
    const data = new StatusImageDetails();
    data.Img = 'assets/images/face-1.jpg';

    return data;
}
