// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type OmitFirst<T extends any[]> = T extends [any, ...infer R]
  ? R
  : never;
