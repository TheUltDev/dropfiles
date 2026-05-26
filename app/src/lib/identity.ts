import * as SecureStore from 'expo-secure-store';

const OWNER_TOKEN_KEY = 'dropfiles_owner_token';

export async function getOwnerToken(): Promise<string> {
  const existing = await SecureStore.getItemAsync(OWNER_TOKEN_KEY);
  if (existing) return existing;
  const token = crypto.randomUUID();
  await SecureStore.setItemAsync(OWNER_TOKEN_KEY, token);
  return token;
}

export async function resetOwnerToken(): Promise<string> {
  const token = crypto.randomUUID();
  await SecureStore.setItemAsync(OWNER_TOKEN_KEY, token);
  return token;
}
