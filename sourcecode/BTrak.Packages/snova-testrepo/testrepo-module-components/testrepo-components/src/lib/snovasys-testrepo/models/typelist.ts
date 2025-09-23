export class Type {
    value: string;
    name: string;
  }
  export function createStubType() {
    const type = new Type();
    type.value = 'Acceptance';
    type.name = 'Acceptance';
    return type;
 }