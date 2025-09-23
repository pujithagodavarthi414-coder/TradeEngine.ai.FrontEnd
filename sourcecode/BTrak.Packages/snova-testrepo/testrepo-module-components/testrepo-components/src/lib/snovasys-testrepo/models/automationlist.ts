export class Automation {
    value: string;
    name: string;
  }
  export function createStubAutomation() {
    const automation = new Automation();
    automation.value = 'Ranorex';
    automation.name = 'Ranorex';
    return automation;
 }