/** 카톡 등 공유용 요약 카드 — 점수·과목명만 (개인정보 없음) */

export type ResultShareCardData = {
  examTitle: string;
  scorePercent: number;
  correct: number;
  total: number;
  /** 약점 과목 한글명 (최대 표시 개수는 렌더러에서 제한) */
  weakDisplayNames: string[];
};

const MAX_WEAK_LINES = 5;
const MAX_TITLE_CHARS = 28;

function truncateTitle(s: string): string {
  const t = s.trim();
  if (t.length <= MAX_TITLE_CHARS) return t;
  return `${t.slice(0, MAX_TITLE_CHARS)}…`;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    if (ctx.measureText(rest).width <= maxWidth) {
      lines.push(rest);
      break;
    }
    let cut = rest.length;
    while (cut > 1 && ctx.measureText(rest.slice(0, cut)).width > maxWidth) {
      cut -= 1;
    }
    if (cut < 1) cut = 1;
    lines.push(rest.slice(0, cut));
    rest = rest.slice(cut).trimStart();
  }
  return lines;
}

export function renderResultSharePng(
  data: ResultShareCardData,
): Promise<Blob | null> {
  if (typeof document === "undefined") return Promise.resolve(null);

  const W = 900;
  const H = 1100;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);

  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#e4e4e7";
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);

  ctx.textAlign = "center";
  ctx.fillStyle = "#18181b";
  ctx.font =
    '600 38px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.fillText("자격증 도우미", W / 2, 88);

  ctx.fillStyle = "#52525b";
  ctx.font =
    '500 30px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  const title = truncateTitle(data.examTitle);
  const titleLines = wrapLines(ctx, title, W - 100);
  let ty = 150;
  for (const line of titleLines.slice(0, 2)) {
    ctx.fillText(line, W / 2, ty);
    ty += 40;
  }

  ctx.fillStyle = "#059669";
  ctx.font =
    '700 100px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.fillText(`${data.scorePercent}%`, W / 2, 340);

  ctx.fillStyle = "#3f3f46";
  ctx.font =
    '600 48px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.fillText(`정답 ${data.correct} / ${data.total}문항`, W / 2, 430);

  ctx.textAlign = "left";
  ctx.fillStyle = "#71717a";
  ctx.font =
    '600 26px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.fillText("약점 과목 (참고)", 56, 540);

  ctx.fillStyle = "#3f3f46";
  ctx.font =
    '500 26px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  const weakList = data.weakDisplayNames.slice(0, MAX_WEAK_LINES);
  let wy = 590;
  if (weakList.length === 0) {
    ctx.fillText("—", 56, wy);
    wy += 40;
  } else {
    for (const w of weakList) {
      const parts = wrapLines(ctx, `· ${w}`, W - 112);
      for (const p of parts) {
        ctx.fillText(p, 56, wy);
        wy += 36;
      }
    }
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#a1a1aa";
  ctx.font =
    '400 20px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.fillText("개인정보 없음 · 참고용 모의 결과", W / 2, H - 56);

  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png", 0.92);
  });
}
