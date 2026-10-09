import type { GarmentItem } from "./types";

export const MAX_LABEL_GARMENTS = 50;
export const MAX_LABEL_COPIES = 10;
export const GARMENT_QR_OPTIONS = { width: 512, margin: 4, errorCorrectionLevel: "M" as const };

// Printed identities are issued after intake is finalised. Draft rows can still
// be removed or reordered, so they must not be attached to physical garments.
export function canPrintGarment(item: Pick<GarmentItem, "stage">) {
  return item.stage !== "draft" && item.stage !== "new_order";
}

export function garmentQrUrl(origin: string, token: string) {
  return `${origin}/admin/items/${encodeURIComponent(token)}`;
}

export function resolveQrOrigin(configured: string | undefined, currentOrigin: string) {
  const url = new URL(configured?.trim() || currentOrigin);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Configure a valid public website address before generating labels.");
  return url.origin;
}

export function parseGarmentCode(value: string, origins: string[]) {
  const code = value.trim();
  if (!code || code.length > 512) throw new Error("Enter the printed garment ID or its QR link.");
  if (/^[a-z][a-z0-9+.-]*:/i.test(code)) {
    const url = new URL(code);
    const match = url.pathname.match(/^\/admin\/items\/([^/]+)\/?$/);
    if (!["http:", "https:"].includes(url.protocol) || !origins.includes(url.origin) || !match) throw new Error("This is not a garment QR for this workspace. Use the printed garment ID instead.");
    return decodeURIComponent(match[1]);
  }
  if (/[\s/\\?#]/.test(code)) throw new Error("Enter a garment ID, QR token or complete garment QR link.");
  return code;
}

export function resolveLabelJob(items: GarmentItem[], selection: string | null, copiesParam: string | null) {
  const ids = [...new Set((selection || "").split(",").map(id => id.trim()).filter(Boolean))];
  const copies = copiesParam === null ? 1 : Number(copiesParam);
  if (!ids.length) return { items: [], copies: 1, error: "Choose garments from Scan to prepare their labels." };
  if (ids.length > MAX_LABEL_GARMENTS) return { items: [], copies: 1, error: `Choose up to ${MAX_LABEL_GARMENTS} garments per print job.` };
  if (!Number.isInteger(copies) || copies < 1 || copies > MAX_LABEL_COPIES) return { items: [], copies: 1, error: `Choose from 1 to ${MAX_LABEL_COPIES} copies per garment.` };
  const byId = new Map(items.map(item => [item.id, item]));
  const selected = ids.map(id => byId.get(id));
  if (selected.some(item => !item)) return { items: [], copies, error: "One or more garments are no longer available to your account. Return to Scan and choose the current records." };
  const available = selected as GarmentItem[];
  if (available.some(item => !canPrintGarment(item))) return { items: [], copies, error: "Finish intake and send the commission to India before printing its garment labels." };
  return { items: available, copies, error: "" };
}
