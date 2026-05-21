export type Brand<TValue, TBrand extends string> = TValue & {
  readonly __brand: TBrand;
};

export type ISODateTimeString = Brand<string, "ISODateTimeString">;

export type Result<TOk, TError> =
  | { readonly ok: true; readonly value: TOk }
  | { readonly ok: false; readonly error: TError };

export function ok<TOk>(value: TOk): Result<TOk, never> {
  return { ok: true, value };
}

export function err<TError>(error: TError): Result<never, TError> {
  return { ok: false, error };
}
