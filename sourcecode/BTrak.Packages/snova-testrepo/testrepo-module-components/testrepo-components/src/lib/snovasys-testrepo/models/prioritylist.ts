export class Priority {
    value: string;
    name: string;
  }
  export function createStubPriority() {
    const priority = new Priority();
    priority.value = 'High';
    priority.name = 'High';
    return priority;
 }