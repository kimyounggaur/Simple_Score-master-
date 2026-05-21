import type { EventId, MeasureId, StaffId } from "../model/types";

export type Selection =
  | { readonly kind: "none" }
  | { readonly kind: "event"; readonly eventId: EventId }
  | { readonly kind: "measure"; readonly measureId: MeasureId; readonly staffId?: StaffId }
  | { readonly kind: "range"; readonly measureIds: MeasureId[]; readonly staffIds: StaffId[] };

export const emptySelection: Selection = { kind: "none" };
