const OWNER_TOKEN_KEY = 'dropfiles_owner_token';

export async function getOwnerToken(): Promise<string> {
  if (typeof localStorage === 'undefined')
    return crypto.randomUUID();
  const existing = localStorage.getItem(OWNER_TOKEN_KEY);
  if (existing)
    return existing;
  const token = crypto.randomUUID();
  localStorage.setItem(OWNER_TOKEN_KEY, token);
  return token;
}

export async function resetOwnerToken(): Promise<string> {
  const token = crypto.randomUUID();
  if (typeof localStorage !== 'undefined')
    localStorage.setItem(OWNER_TOKEN_KEY, token);
  return token;
}
