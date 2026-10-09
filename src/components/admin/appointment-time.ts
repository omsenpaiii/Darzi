/** HTML datetime-local values have no timezone. Convert explicitly before saving. */
export type ClockChangeOccurrence = "earlier" | "later";
type TimeResolution = { occurrence?: ClockChangeOccurrence; preserveInstant?: string };

function formatter(timezone: string) {
 return new Intl.DateTimeFormat("en-CA", {timeZone:timezone, year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23"});
}
function wallTime(instant: number, format: Intl.DateTimeFormat): string {
 const parts = format.formatToParts(new Date(instant));
 const get = (type: string) => parts.find(part => part.type === type)?.value || "";
 return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
export function dateTimeInZone(iso: string, timezone: string): string {
 return wallTime(Date.parse(iso),formatter(timezone));
}

/** Return every instant for a local minute, including both sides of a clock-change fold. */
export function zonedDateTimeCandidates(value: string, timezone: string): string[] {
 const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
 if(!match) throw new Error("Choose a valid appointment date and time.");
 const [,year,month,day,hour,minute] = match.map(Number);
 const desired = Date.UTC(year,month-1,day,hour,minute);
 if(new Date(desired).toISOString().slice(0,16)!==value) throw new Error("Choose a valid appointment date and time.");
 const format = formatter(timezone), offsets = new Set<number>();
 // Nearby UTC samples capture the offsets on both sides of a clock transition,
 // including fractional-hour zones and transitions larger or smaller than an hour.
 for(let hours=-48;hours<=48;hours+=6) {
  const sample = desired+hours*3600000;
  offsets.add(sample-Date.parse(`${wallTime(sample,format)}:00Z`));
 }
 return [...offsets].map(offset=>desired+offset).filter(instant=>wallTime(instant,format)===value).sort((a,b)=>a-b).map(instant=>new Date(instant).toISOString());
}

export function zonedDateTimeToIso(value: string, timezone: string, resolution: TimeResolution = {}): string {
 const candidates = zonedDateTimeCandidates(value,timezone);
 if(!candidates.length) throw new Error("That local time does not exist because the clocks change. Choose another time.");
 if(!resolution.occurrence && resolution.preserveInstant && Number.isFinite(Date.parse(resolution.preserveInstant)) && dateTimeInZone(resolution.preserveInstant,timezone)===value) {
  return new Date(resolution.preserveInstant).toISOString();
 }
 if(candidates.length>1 && !resolution.occurrence) throw new Error("That local time occurs twice because the clocks change. Choose the earlier or later occurrence.");
 return resolution.occurrence==="later" ? candidates[candidates.length-1] : candidates[0];
}
