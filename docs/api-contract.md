# API Contract

## POST /api/extract

Extracts structured symptom entries from a spoken transcript.

### Request

```json
{
  "transcript": "string (required)",
  "language": "string (optional, default: \"en-IN\")"
}
```

- `transcript`: The spoken text to parse (can be in Kannada, Hindi, or English)
- `language`: Language code (en-IN, kn-IN, hi-IN)

### Response

Success (200):

```json
{
  "entries": [
    {
      "date": "2026-10-25",
      "type": "pain|mood|flow|sleep|fatigue|other",
      "severity": 1-5,
      "area": "abdomen|head|back|breast|legs|other|null",
      "source": "voice",
      "note": "short English summary"
    }
  ],
  "source": "llm|fallback",
  "warning": "string (optional, present only on fallback)"
}
```

Error (400): Missing transcript

```json
{
  "error": "transcript is required"
}
```

Error (405): Wrong HTTP method

```json
{
  "error": "POST only"
}
```

### Behavior

- Uses Groq LLM (openai/gpt-oss-120b) to extract symptoms from transcripts
- Falls back to keyword-based extraction if LLM fails
- Never returns an error - always provides entries via fallback
- Sanitizes all output: type, severity, area, and date are validated in code
