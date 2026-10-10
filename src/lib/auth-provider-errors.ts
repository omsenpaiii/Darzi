type ProviderError = {code?:unknown;message?:unknown;status?:unknown};

export function isDuplicateAuthAccount(error:ProviderError|null|undefined):boolean {
  if(!error||![400,409,422].includes(error.status as number))return false;
  const code=typeof error.code==="string"?error.code.toLowerCase():"";
  if(["user_already_exists","email_exists","user_already_exists_use_another_email"].includes(code))return true;
  // Current Neon SDK normalizes Better Auth's newer 422 duplicate code to
  // validation_failed, while preserving this exact upstream message.
  return error.status===422&&code==="validation_failed"&&typeof error.message==="string"
    && /^user already exists\.?\s*use another email\.?$/i.test(error.message.trim());
}

export function authFailureStatus(error:ProviderError|null|undefined,fallback=401):number {
  const status=error?.status;
  return typeof status==="number"&&Number.isInteger(status)&&(status===429||status>=500&&status<=599)?status:fallback;
}
