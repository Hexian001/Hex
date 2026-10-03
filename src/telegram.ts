import type { AppConfig } from "./config.js";

export type TelegramClient = {
  enabled: boolean;
  ok: boolean;
  send: (text: string) => Promise<boolean>;
  probe: () => Promise<boolean>;
};

export function createTelegram(cfg: AppConfig): TelegramClient {
  const enabled =
    cfg.telegramEnabled && Boolean(cfg.telegramToken) && Boolean(cfg.telegramChatId);

  let ok = false;

  async function send(text: string): Promise<boolean> {
    if (!enabled) {
      ok = false;
      return false;
    }
    try {
      const url = `https://api.telegram.org/bot${cfg.telegramToken}/sendMessage`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: cfg.telegramChatId,
          text,
          disable_web_page_preview: true,
        }),
      });
      ok = res.ok;
      if (!res.ok) {
        const body = await res.text();
        console.error(`[telegram] send failed ${res.status}: ${body}`);
      }
      return ok;
    } catch (err) {
      ok = false;
      console.error("[telegram] send error", err);
      return false;
    }
  }

  async function probe(): Promise<boolean> {
    if (!enabled) {
      ok = false;
      return false;
    }
    try {
      const url = `https://api.telegram.org/bot${cfg.telegramToken}/getMe`;
      const res = await fetch(url);
      ok = res.ok;
      return ok;
    } catch {
      ok = false;
      return false;
    }
  }

  return {
    get enabled() {
      return enabled;
    },
    get ok() {
      return ok;
    },
    send,
    probe,
  };
}
