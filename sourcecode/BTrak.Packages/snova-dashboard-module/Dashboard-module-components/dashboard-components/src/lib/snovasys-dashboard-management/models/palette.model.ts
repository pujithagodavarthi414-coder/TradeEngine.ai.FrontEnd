export class PaletteModel {
    palette: PaletteSubModel[];
    type: string;
}

export class PaletteSubModel {
    value: number;
    color: string;
    label: string;
}