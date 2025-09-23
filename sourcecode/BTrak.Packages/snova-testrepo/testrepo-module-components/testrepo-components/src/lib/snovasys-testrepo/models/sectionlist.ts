export class Section {
    value: string;
    name: string;
  }

  export function createStubSection() {
    const section = new Section();
    section.value = 'Log In Functionality';
    section.name = 'Log In Functionality';
    return section;
 }