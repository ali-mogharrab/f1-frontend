import { randomBytes } from "node:crypto";
import { expect, test } from "@playwright/test";

test("@live full-stack offline demo uses real Django JWT, tools, retrieval and saved conversations", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    !process.env.AI_TEST_API_URL,
    "Set AI_TEST_API_URL to an explicitly started offline demo backend.",
  );
  test.setTimeout(180_000);
  await page.addInitScript(() => localStorage.setItem("f1_theme", "dark"));
  const api = process.env.AI_TEST_API_URL!.replace(/\/$/, "");
  const username = `ui-review-${randomBytes(6).toString("hex")}`;
  const password = randomBytes(24).toString("base64url");
  const registered = await request.post(`${api}/users/register/`, {
    data: {
      username,
      email: `${username}@example.com`,
      password,
      password_confirm: password,
    },
    timeout: 90_000,
  });
  expect(registered.status()).toBe(201);
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await page.goto("/ai-analyst");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "F1 AI Analyst" }),
  ).toBeVisible({ timeout: 60_000 });
  const questions = [
    "Compare Ferrari and McLaren's performance.",
    "What do the articles say about Ferrari?",
    "What do the articles say about McLaren?",
    "Analyze McLaren's race results and related articles.",
    "Who won the 2030 championship?",
    "Predict next season's champion.",
  ];
  let conversationId = "";
  for (const [index, question] of questions.entries()) {
    const delivered = page.waitForResponse(
      (response) =>
        response.url().endsWith("/ai/chat/") &&
        response.request().method() === "POST",
    );
    await page.getByRole("textbox", { name: "Your question" }).fill(question);
    await page
      .getByRole("button", { name: "Send message", exact: true })
      .click();
    const response = await delivered;
    expect(response.status()).toBe(200);
    const result = (await response.json()).data;
    expect(result.metadata.demo).toBe(true);
    expect(result.metadata.mode).toBe("demo");
    if (conversationId) expect(result.conversation_id).toBe(conversationId);
    conversationId = result.conversation_id;
    if (index < 4) expect(result.sources.length).toBeGreaterThan(0);
    else {
      expect(result.metadata.insufficient_evidence).toBe(true);
      expect(result.sources).toEqual([]);
    }
    await expect(page.getByLabel("Analyst message")).toHaveCount(index + 1);
    await expect(
      page.getByRole("textbox", { name: "Your question" }),
    ).toBeEnabled();
    if (index === 3) {
      expect(
        await page
          .locator(".analyst-room")
          .evaluate((element) => element.scrollHeight - element.clientHeight),
      ).toBeLessThanOrEqual(2);
      await page.screenshot({
        path: testInfo.outputPath("live-desktop-dark.png"),
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByRole("button", { name: "Switch to light mode" }).click();
      await page.screenshot({
        path: testInfo.outputPath("live-mobile-light.png"),
        fullPage: true,
      });
      await page.getByRole("button", { name: "Switch to dark mode" }).click();
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
  }
  await expect(
    page.getByText("Offline Demo", { exact: true }).first(),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("live-desktop-history.png"),
    fullPage: true,
  });
  const articleLink = page
    .getByRole("link", { name: /DEMO: Ferrari race pace notebook/ })
    .first();
  await articleLink.click();
  await expect(page).toHaveURL(/\/articles\/demo-ferrari-race-pace$/);
  await expect(
    page.getByRole("heading", {
      name: "DEMO: Ferrari race pace notebook",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto(`/ai-analyst?conversation=${conversationId}`);
  await expect(page.getByLabel("Analyst message")).toHaveCount(6);
  await page
    .getByRole("button", { name: "New conversation", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /Every result has a story/ }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Saved conversations" })
    .getByRole("button")
    .first()
    .click();
  await expect(page.getByLabel("Analyst message")).toHaveCount(6);
  // The same existing JWT refresh interceptor is used against real Django.
  await page.evaluate(() =>
    localStorage.setItem("f1_access_token", "expired-access-token"),
  );
  await page
    .getByRole("button", { name: "Refresh conversation history" })
    .click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("f1_access_token")))
    .not.toBe("expired-access-token");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "History", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Saved conversations" })
    .getByRole("button")
    .first()
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("live-mobile-dark.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.screenshot({
    path: testInfo.outputPath("live-mobile-history-light.png"),
    fullPage: true,
  });
  expect(browserErrors).toEqual([]);
});
