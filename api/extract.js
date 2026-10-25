import { chat, parseJson } from "./_lib/llm.js";
import { keywordExtract } from "./_lib/keywordExtract.js";

const ALLOWED_TYPES = ["pain", "mood", "flow", "sleep", "fatigue", "other"];
const ALLOWED_AREAS = ["abdomen", "head", "back", "breast", "legs", "other", null];

function sanitizeEntry(entry, today) {
  const dayOffset = entry.day_offset ?? 0;
  const date = new Date(today);
  date.setDate(date.getDate() + dayOffset);
  const dateStr = date.toISOString().split("T")[0];

  const type = ALLOWED_TYPES.includes(entry.type) ? entry.type : "other";
  const severity = Math.max(1, Math.min(5, Math.round(entry.severity ?? 3)));
  const area = entry.area === "null" || entry.area === null ? null : entry.area;
  const safeArea = ALLOWED_AREAS.includes(area) ? area : null;
  const note = (entry.note || "").slice(0, 200);

  return {
    date: dateStr,
    type,
    severity,
    area: safeArea,
    source: "voice",
    note,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { transcript, language = "en-IN" } = req.body || {};
  if (!transcript) {
    return res.status(400).json({ error: "transcript is required" });
  }

  const today = new Date().toISOString().split("T")[0];

  const systemPrompt =
    "You extract health symptom logs from a woman's spoken sentence. The sentence may be in Kannada, Hindi or English. Reply with ONLY a JSON object, no explanation, no markdown: `{\"entries\":[{\"type\":\"pain|mood|flow|sleep|fatigue|other\",\"severity\":1-5,\"area\":\"abdomen|head|back|breast|legs|other|null\",\"day_offset\":0,\"note\":\"short English summary\"}]}`. Rules: one entry per distinct symptom mentioned, usually 1. severity: 1 mild, 3 moderate, 5 severe; if not stated, guess from words like very or unbearable. day_offset: 0 for today, -1 for yesterday, -2 for two days ago. note: short English summary of what she said. Do not diagnose. Do not add symptoms she did not mention.";

  const userMessage = `Language: ${language}\nSentence: ${transcript}`;

  try {
    const llmResponse = await chat({
      system: systemPrompt,
      user: userMessage,
      maxTokens: 1000,
    });

    const parsed = parseJson(llmResponse);
    const entries = (parsed.entries || []).map((e) => sanitizeEntry(e, today));

    if (entries.length === 0) {
      throw new Error("No entries returned from LLM");
    }

    return res.status(200).json({ entries, source: "llm" });
  } catch (err) {
    console.error(err);
    const fallbackEntries = keywordExtract(transcript, today);
    return res.status(200).json({
      entries: fallbackEntries,
      source: "fallback",
      warning: err.message,
    });
  }
}
