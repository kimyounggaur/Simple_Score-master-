export type XmlRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is XmlRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return [];
  }
  return [value];
}

export function child(record: XmlRecord, key: string): unknown {
  return record[key];
}

export function childRecord(record: XmlRecord, key: string): XmlRecord | undefined {
  const value = child(record, key);
  return isRecord(value) ? value : undefined;
}

export function text(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (isRecord(value) && "#text" in value) {
    return text(value["#text"]);
  }
  return undefined;
}

export function numberValue(value: unknown): number | undefined {
  const content = text(value);
  if (!content) {
    return undefined;
  }
  const number = Number(content);
  return Number.isFinite(number) ? number : undefined;
}
