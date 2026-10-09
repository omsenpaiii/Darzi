import {randomBytes,scryptSync,timingSafeEqual,createHash} from "node:crypto";
export function hashPassword(password:string):string {const salt=randomBytes(16).toString("hex");return `${salt}:${scryptSync(password,salt,64).toString("hex")}`;}
export function checkPassword(password:string,stored:string):boolean {const [salt,hash]=stored.split(":");if(!salt||!hash) return false; const expected=Buffer.from(hash,"hex"),actual=scryptSync(password,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual);}
export function tokenHash(token:string):string{return createHash("sha256").update(token).digest("hex");}
