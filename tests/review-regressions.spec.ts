import { expect, test } from "@playwright/test";
import { authenticate, conversation, id, mockAnalyst, question, rejected } from "./ai-fixtures";

test.beforeEach(async ({ page }) => authenticate(page));

test("new conversation clears the previous conversation's demo metadata", async ({ page }) => {
  await mockAnalyst(page);
  await page.goto("/ai-analyst");
  await page.getByRole("textbox", { name: "Your question" }).fill(question);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByLabel("Analyst message")).toHaveCount(1);
  await page.getByRole("button", { name: "New conversation", exact: true }).click();
  await expect(page.getByText("Offline Demo", { exact: true })).toHaveCount(0);
});

test("simultaneous unauthorized history requests share one refresh", async ({ page }) => {
  await mockAnalyst(page, { initial: [conversation()] });
  let refreshes = 0;
  await page.route("**/api/users/token/refresh/", async (route) => {
    refreshes++;
    await new Promise((resolve) => setTimeout(resolve, 150));
    await route.fulfill({ json: { access: "fresh-access" } });
  });
  await page.route("**/api/ai/conversations/**", async (route) => {
    if (route.request().headers().authorization === "Bearer test-access") {
      await route.fulfill({ status: 401, json: rejected("Expired.") });
    } else await route.fallback();
  });
  await page.goto(`/ai-analyst?conversation=${id}`);
  await expect(page.getByRole("textbox", { name: "Your question" })).toBeEnabled();
  expect(refreshes).toBe(1);
});

test("logout during token refresh cannot restore credentials or replay chat", async ({ page }) => {
  await mockAnalyst(page);
  let posts = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/ai/chat/", (route) => {
    posts++;
    return route.fulfill({ status: 401, json: rejected("Expired.") });
  });
  await page.route("**/api/users/token/refresh/", async (route) => {
    await gate;
    await route.fulfill({ json: { access: "late-access" } });
  });
  await page.goto("/ai-analyst");
  await page.getByRole("textbox", { name: "Your question" }).fill(question);
  const refreshing = page.waitForRequest("**/api/users/token/refresh/");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await refreshing;
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  const refreshed = page.waitForResponse("**/api/users/token/refresh/");
  release();
  await refreshed;
  await expect(page).toHaveURL(/\/login$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("f1_access_token"))).toBeNull();
  expect(posts).toBe(1);
});

test("browser history navigation does not carry a failed turn into another chat", async ({ page }) => {
  const first = conversation();
  const second = conversation("22222222-2222-4222-8222-222222222222");
  second.title = "Second conversation";
  await mockAnalyst(page, { initial: [first, second], chat: (route) => route.abort() });
  await page.goto(`/ai-analyst?conversation=${first.id}`);
  await page.getByRole("navigation", { name: "Saved conversations" }).getByRole("button", { name: /Second conversation/ }).click();
  await expect(page).toHaveURL(new RegExp(`conversation=${second.id}$`));
  await expect(page.locator(".analyst-workspace-title")).toHaveText("Second conversation");
  await page.getByRole("textbox", { name: "Your question" }).fill("Uncertain request");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Delivery not confirmed");
  await page.goBack();
  await expect(page.getByRole("textbox", { name: "Your question" })).toBeEnabled();
  await expect(page.getByRole("textbox", { name: "Your question" })).toHaveValue("");
  await expect(page.getByRole("alert")).toHaveCount(0);
});
