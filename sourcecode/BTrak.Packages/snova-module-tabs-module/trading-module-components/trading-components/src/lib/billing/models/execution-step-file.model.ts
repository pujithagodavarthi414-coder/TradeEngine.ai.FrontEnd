export class ExecutionStepFileModel {
    loisb: FileDetailsModel; //Letter of indemnity for switching BLs
    loidc: FileDetailsModel; //Letter of indemnity for Discharging Cargo
}

export class FileDetailsModel {
    filePath: string;
    fileName: string;
}