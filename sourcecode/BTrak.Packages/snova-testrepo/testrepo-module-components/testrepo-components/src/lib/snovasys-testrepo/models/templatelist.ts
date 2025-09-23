export class Template {
    value: string;
    name: string;
  }
  export function createStubTemplate() {
    const template = new Template();
    template.value = 'Test Case (Text)';
    template.name = 'Test Case (Text)';
    return template;
 }