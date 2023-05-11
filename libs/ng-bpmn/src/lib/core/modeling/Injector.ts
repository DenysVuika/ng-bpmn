export interface Injector {
  get<T>(name: string): T;
}
