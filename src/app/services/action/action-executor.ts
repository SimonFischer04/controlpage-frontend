export abstract class ActionExecutor<T> {
  public abstract executeAction(action: T): void;
}
