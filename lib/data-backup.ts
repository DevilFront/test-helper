import { LOCAL_DATA_KEYS, type LocalDataKey } from "./local-data-keys";

export const DATA_BACKUP_VERSION = 1 as const;

export type DataBackupPayload = {
  version: typeof DATA_BACKUP_VERSION;
  exportedAt: string;
  /** 알려진 키만 포함 */
  entries: Partial<Record<LocalDataKey, string>>;
};

export function buildDataBackupPayload(): DataBackupPayload {
  const entries: Partial<Record<LocalDataKey, string>> = {};
  if (typeof window === "undefined") {
    return { version: DATA_BACKUP_VERSION, exportedAt: new Date().toISOString(), entries };
  }
  for (const key of LOCAL_DATA_KEYS) {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) entries[key] = v;
    } catch {
      /* ignore */
    }
  }
  return {
    version: DATA_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    entries,
  };
}

export function exportBackupJsonString(): string {
  return JSON.stringify(buildDataBackupPayload(), null, 2);
}

export type ImportBackupResult =
  | { ok: true; appliedKeys: number }
  | { ok: false; error: string };

/** 백업 JSON을 적용. 기존 동일 키는 덮어씀. */
export function importBackupPayload(payload: unknown): ImportBackupResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "형식이 올바르지 않습니다." };
  }
  const o = payload as Record<string, unknown>;
  if (o.version !== DATA_BACKUP_VERSION) {
    return { ok: false, error: "지원하지 않는 백업 버전입니다." };
  }
  if (!o.entries || typeof o.entries !== "object") {
    return { ok: false, error: "entries가 없습니다." };
  }
  const entries = o.entries as Record<string, unknown>;
  let applied = 0;
  try {
    for (const key of Object.keys(entries)) {
      if (!LOCAL_DATA_KEYS.includes(key as LocalDataKey)) continue;
      const v = entries[key];
      if (typeof v !== "string") continue;
      localStorage.setItem(key as LocalDataKey, v);
      applied += 1;
    }
  } catch {
    return { ok: false, error: "저장 공간에 쓸 수 없습니다." };
  }
  return { ok: true, appliedKeys: applied };
}

export function parseBackupJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
