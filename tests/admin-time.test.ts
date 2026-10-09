import assert from "node:assert/strict";
import test from "node:test";
import { dateTimeInZone, zonedDateTimeCandidates, zonedDateTimeToIso } from "../src/components/admin/appointment-time";
test("Melbourne appointment wall times preserve date and daylight saving offset",()=>{
 assert.equal(zonedDateTimeToIso("2026-12-10T14:00","Australia/Melbourne"),"2026-12-10T03:00:00.000Z");
 assert.equal(zonedDateTimeToIso("2026-06-10T14:00","Australia/Melbourne"),"2026-06-10T04:00:00.000Z");
 assert.equal(dateTimeInZone("2026-12-10T03:00:00.000Z","Australia/Melbourne"),"2026-12-10T14:00");
});
test("device timezone selection converts the same instant without moving the appointment",()=>{
 const instant=zonedDateTimeToIso("2026-12-10T14:00","Asia/Kolkata");
 assert.equal(instant,"2026-12-10T08:30:00.000Z");
 assert.equal(zonedDateTimeToIso(dateTimeInZone(instant,"Australia/Melbourne"),"Australia/Melbourne"),instant);
});
test("nonexistent clock-change time and invalid calendar dates are rejected",()=>{
 assert.throws(()=>zonedDateTimeToIso("2026-10-04T02:30","Australia/Melbourne"),/does not exist/);
 assert.throws(()=>zonedDateTimeToIso("2026-02-30T14:00","Australia/Melbourne"),/valid appointment/);
});
test("repeated Melbourne clock-change times require an explicit occurrence for a new time",()=>{
 const wall="2027-04-04T02:30",zone="Australia/Melbourne";
 assert.deepEqual(zonedDateTimeCandidates(wall,zone),["2027-04-03T15:30:00.000Z","2027-04-03T16:30:00.000Z"]);
 assert.throws(()=>zonedDateTimeToIso(wall,zone),/occurs twice/);
 assert.equal(zonedDateTimeToIso(wall,zone,{occurrence:"earlier"}),"2027-04-03T15:30:00.000Z");
 assert.equal(zonedDateTimeToIso(wall,zone,{occurrence:"later"}),"2027-04-03T16:30:00.000Z");
});
test("opening and saving either existing repeated time preserves its exact instant",()=>{
 const zone="Australia/Melbourne";
 for(const original of ["2027-04-03T15:30:00.000Z","2027-04-03T16:30:00.000Z","2027-04-03T15:30:45.123Z"]){
  assert.equal(zonedDateTimeToIso(dateTimeInZone(original,zone),zone,{preserveInstant:original}),original);
 }
 assert.equal(zonedDateTimeToIso("2027-04-04T02:30",zone,{preserveInstant:"2027-04-03T15:30:00.000Z",occurrence:"later"}),"2027-04-03T16:30:00.000Z");
});
test("switching zones preserves both fold occurrences and editing a new fold time needs a choice",()=>{
 const studio="Australia/Melbourne",device="Asia/Kolkata";
 for(const original of ["2027-04-03T15:30:00.000Z","2027-04-03T16:30:00.000Z"]){
  const deviceInstant=zonedDateTimeToIso(dateTimeInZone(original,device),device,{preserveInstant:original});
  assert.equal(zonedDateTimeToIso(dateTimeInZone(deviceInstant,studio),studio,{preserveInstant:deviceInstant}),original);
 }
 assert.throws(()=>zonedDateTimeToIso("2027-04-04T02:45",studio,{preserveInstant:"2027-04-03T15:30:00.000Z"}),/occurs twice/);
});
test("fractional-hour clock changes expose both Lord Howe occurrences and reject its gap",()=>{
 assert.deepEqual(zonedDateTimeCandidates("2027-04-04T01:45","Australia/Lord_Howe"),["2027-04-03T14:45:00.000Z","2027-04-03T15:15:00.000Z"]);
 assert.throws(()=>zonedDateTimeToIso("2026-10-04T02:15","Australia/Lord_Howe"),/does not exist/);
 assert.equal(zonedDateTimeToIso("2027-04-04T01:45","Australia/Lord_Howe",{occurrence:"later"}),"2027-04-03T15:15:00.000Z");
});
