export enum TaskType {
  StartEvent,
  MailTask,
  FieldUpdateTask,
  CheckListTask,
  ServiceTask,
  UserTask,
  EndEvent,
  ScriptTask,
  SendTask,
  ReceiveTask,
  XorGateWay,
  AndGateWay,
  EventGateWay,
  messageEvent,
  TimerEvent,
  TerminationEvent,
  ErrorEvent,
  EscalationEvent,
  SignalEvent,
  EventHelperUserTask,
  RecordInsertion,
  NotificationAlert
}

export enum MessageEventType {
  MessageStartEvent,
  MessageIntermediateCatchingEvent,
  MessageIntermediateThrowingEvent,
  MessageInterruptedBoundaryEvent,
  MessageNonInterruptedBoundaryEvent,
  MessageEndEvent
}

export enum TimerDefinitionType {
  Date,
  Duration,
  Cycle
}

export enum TimerEventType {
  TimerStartEvent,
  TimerIntermediateCatchingEvent,
  TimerInterruptedBoundaryEvent,
  TimerNonInterruptedBoundaryEvent
}

export enum SignalEventType {
  SignalStartEvent,
  SignalIntermediateCatchingEvent,
  SignalIntermediateThrowingEvent,
  SignalInterruptedBoundaryEvent,
  SignalNonInterruptedBoundaryEvent,
  SignalEndEvent
}

export enum EscalationEventType {
  // EscalationStartEvent,
  EscalationIntermediateThrowingEvent,
  EscalationInterruptedBoundaryEvent,
  EscalationNonInterruptedBoundaryEvent,
  EscalationEndEvent
}

export enum ErrorEventType {
  //ErrorStartEvent,
  ErrorEndEvent,
  ErrorBoundaryEvent
}