

declare global {
  export type Uuid = string & { _uuidBrand: undefined };
  export type Todo = any & { _todoBrand: undefined };
}
