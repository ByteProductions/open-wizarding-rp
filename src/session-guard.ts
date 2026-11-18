/** This port must read server-owned state; never populate it from client request fields. */
export interface SessionIdentity {
  readonly accountId: number;
  readonly characterId: number;
  /** Adapter-owned connection generation, changed on every reconnect. */
  readonly generation: string;
  readonly trust: string;
}
export interface SessionReader {
  read(playerId: number): SessionIdentity | null;
  hasCapability(playerId: number, capability: string): Promise<boolean>;
}
function valid(session: SessionIdentity | null): session is SessionIdentity {
  return session !== null && session.trust === 'verified'
    && Number.isSafeInteger(session.accountId) && session.accountId > 0
    && Number.isSafeInteger(session.characterId) && session.characterId > 0
    && typeof session.generation === 'string' && session.generation.length > 0;
}
export async function authorizeSession(playerId: number, capability: string, reader: SessionReader): Promise<Readonly<SessionIdentity>> {
  if (!Number.isSafeInteger(playerId) || playerId < 0 || typeof capability !== 'string' || !/^[a-z][a-z0-9.:-]{0,63}$/.test(capability)) throw new Error('INVALID_AUTHORIZATION_REQUEST');
  const live = reader.read(playerId);
  if (!valid(live)) throw new Error('VERIFIED_SESSION_REQUIRED');
  const before = {...live};
  if (await reader.hasCapability(playerId,capability) !== true) throw new Error('CAPABILITY_REQUIRED');
  const after = reader.read(playerId);
  if (!valid(after) || after.accountId !== before.accountId || after.characterId !== before.characterId || after.generation !== before.generation) throw new Error('SESSION_CHANGED');
  return Object.freeze(before);
}
