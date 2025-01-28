import { z } from "zod";

export const ECurrency = z.enum(["USD", "EUR", "GBP", "JPY", "CFA"])

export const ELanguageCode = z.enum(["en", "es", "fr", "de", "ja"]);
