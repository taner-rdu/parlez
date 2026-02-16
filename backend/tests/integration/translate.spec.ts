import { test, expect } from "@playwright/test";

test("POST /translate returns French translation", async ({ request }) => {
  const response = await request.post("/translate", {
    data: {
      text: "Hello",
      source_lang: "EN",
      target_lang: "FR",
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.translated_text).toBe("Bonjour");
  expect(body.source_lang).toBe("EN");
  expect(body.target_lang).toBe("FR");
});
