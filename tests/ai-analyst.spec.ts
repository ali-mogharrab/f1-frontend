import { expect, test } from "@playwright/test";
import {
  articleQuestion,
  articleSource,
  authenticate,
  completeChat,
  conversation,
  envelope,
  hybridQuestion,
  id,
  metadata,
  mockAnalyst,
  question,
  raceSource,
  rejected,
  standingSource,
  user,
} from "./ai-fixtures";

test.beforeEach(async ({ page }) => {
  await authenticate(page);
});

test("suggestions fill the composer, submit through the API once, and preserve canonical history", async ({
  page,
}) => {
  const state = await mockAnalyst(page, { delay: 400 });
  await page.goto("/ai-analyst");
  await expect(
    page.getByRole("heading", { name: "F1 AI Analyst" }),
  ).toBeVisible();
  await expect(page.getByText("Offline Demo", { exact: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: new RegExp(question.replaceAll(".", "\\.")) })
    .click();
  const input = page.getByRole("textbox", { name: "Your question" });
  await expect(input).toHaveValue(question);
  await input.press("Enter");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Waiting for answer" }),
  ).toBeDisabled();
  await expect(page.getByLabel("Analyst message")).toHaveCount(1);
  await expect(page.getByLabel("Your message", { exact: true })).toHaveCount(1);
  await expect(
    page.getByText("Offline Demo", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText(/Scripted demonstration with synthetic/),
  ).toBeVisible();
  expect(state.posts).toEqual([{ message: question }]);
  await expect(page).toHaveURL(new RegExp(`conversation=${id}`));
  await input.fill("Follow-up\nquestion");
  await input.press("Shift+Enter");
  expect(state.posts).toHaveLength(1);
  await input.fill("Who won the 2030 championship?");
  await input.press("Enter");
  await expect(page.getByLabel("Analyst message")).toHaveCount(2);
  expect(state.posts[1].conversation_id).toBe(id);
  await page.reload();
  await expect(page.getByLabel("Analyst message")).toHaveCount(2);
});

test("article and structured sources use valid routes, untrusted text and unknown references stay inert", async ({
  page,
}) => {
  await mockAnalyst(page, {
    sources: [articleSource, standingSource, raceSource],
    answer: `Report [${articleSource.id}] and snapshot [${standingSource.id}]. Result [${raceSource.id}]. Unknown [article_chunk:unknown]. <img src=x onerror=alert(1)> [evil](javascript:alert(1))`,
  });
  await page.goto("/ai-analyst");
  await page.getByRole("textbox").fill(articleQuestion);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByLabel("Analyst message")).toBeVisible();
  await page
    .getByRole("button", { name: `Show source 1: ${articleSource.title}` })
    .click();
  await expect(
    page.getByRole("link", { name: /DEMO: Ferrari race pace notebook/ }),
  ).toHaveAttribute("href", "/articles/demo-ferrari-race-pace");
  await expect(
    page.getByRole("link", { name: /2026 Ferrari standings/ }),
  ).toHaveAttribute("href", "/standings");
  await expect(page.getByRole("link", { name: raceSource.title })).toHaveCount(
    0,
  );
  await expect(
    page.getByText("[source unavailable]", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".analyst-message img")).toHaveCount(0);
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  await expect(
    page.getByLabel("Analyst message").locator(".analyst-message-text"),
  ).toContainText("<img src=x onerror=alert(1)>");
});

test("real metadata never gets a demo label and no-evidence responses need no sources", async ({
  page,
}) => {
  await mockAnalyst(page, {
    answer: "The available local records do not contain this information.",
    sources: [],
    metadata: { demo: false, mode: "openai", insufficient_evidence: true },
  });
  await page.goto("/ai-analyst");
  await page.getByRole("textbox").fill("Unknown question");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByText(/Insufficient evidence · Missing/)).toBeVisible();
  await expect(page.getByText("Offline Demo", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /\d+ sources/ })).toHaveCount(
    0,
  );
});

test("history paginates, opens saved chats, and starts an empty new conversation", async ({
  page,
}) => {
  const details = Array.from({ length: 21 }, (_, index) => ({
    ...conversation(`history-${index}`),
    title: `Saved analysis ${index}`,
  }));
  details[20].messages = [
    {
      id: "saved-answer",
      role: "assistant",
      content: "Saved demonstration answer.",
      sources: [],
      metadata,
      sequence: 1,
      created_at: details[20].created_at,
    },
  ];
  await mockAnalyst(page, { initial: details });
  await page.goto("/ai-analyst");
  await page.getByRole("button", { name: "Load more conversations" }).click();
  await page.getByRole("button", { name: /Saved analysis 20/ }).click();
  await expect(
    page.getByText("Saved demonstration answer.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "New conversation", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /Every result has a story/ }),
  ).toBeVisible();
  await expect(page.getByLabel("Analyst message")).toHaveCount(0);
});

for (const status of [400, 429, 503, 504]) {
  test(`a confirmed ${status} rejection offers only an explicit retry`, async ({
    page,
  }) => {
    const state = await mockAnalyst(page, {
      chat: async (route, state) => {
        if (state.posts.length === 1)
          await route.fulfill({
            status,
            headers: { "Retry-After": "60" },
            json: rejected("The request was rejected."),
          });
        else await completeChat(route, state);
      },
    });
    await page.goto("/ai-analyst");
    await page.getByRole("textbox").fill(question);
    await page
      .getByRole("button", { name: "Send message", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText("Message not sent");
    await expect(
      page.getByRole("button", { name: "Try again", exact: true }),
    ).toBeVisible();
    expect(state.posts).toHaveLength(1);
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await expect(page.getByLabel("Analyst message")).toHaveCount(1);
    expect(state.posts).toHaveLength(2);
    expect(state.conversations[0].messages).toHaveLength(2);
  });
}

for (const failure of ["network", "proxy-timeout"] as const) {
  test(`uncertain ${failure} delivery cannot be blindly retried`, async ({
    page,
  }) => {
    const state = await mockAnalyst(page, {
      chat: async (route, state) => {
        // Simulate a committed response whose delivery is lost.
        state.conversations.push({
          ...conversation(),
          messages: [
            {
              id: "saved-user",
              role: "user",
              content: question,
              sources: [],
              metadata: {},
              sequence: 0,
              created_at: "2026-11-09T12:00:00Z",
            },
            {
              id: "saved-assistant",
              role: "assistant",
              content: "Already saved answer.",
              sources: [],
              metadata,
              sequence: 1,
              created_at: "2026-11-09T12:00:00Z",
            },
          ],
        });
        if (failure === "network") await route.abort("failed");
        else
          await route.fulfill({
            status: 504,
            body: "Gateway timeout",
            contentType: "text/html",
          });
      },
    });
    await page.goto("/ai-analyst");
    await page.getByRole("textbox").fill(question);
    await page
      .getByRole("button", { name: "Send message", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText(
      "Delivery not confirmed",
    );
    await expect(
      page.getByRole("button", { name: "Try again", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Send message", exact: true }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Check saved messages" }).click();
    await page
      .getByRole("navigation", { name: "Saved conversations" })
      .getByRole("button")
      .first()
      .click();
    await expect(
      page.getByText("Already saved answer.", { exact: true }),
    ).toBeVisible();
    expect(state.posts).toHaveLength(1);
  });
}

test("404 and 409 errors require a new conversation or a history reload", async ({
  page,
}) => {
  const existing = conversation();
  let responseStatus = 409;
  const state = await mockAnalyst(page, {
    initial: [existing],
    chat: async (route) => {
      await route.fulfill({
        status: responseStatus,
        json: rejected("Conversation changed."),
      });
    },
  });
  await page.goto(`/ai-analyst?conversation=${id}`);
  await page.getByRole("textbox").fill(question);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Reload its history");
  await page.getByRole("button", { name: "Check saved messages" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  responseStatus = 404;
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("unavailable");
  expect(state.posts).toHaveLength(2);
  await page
    .getByRole("button", { name: "New conversation", exact: true })
    .click();
  await expect(page.getByRole("textbox")).toHaveValue("");
});

test("missing saved history can be retried without sending a POST", async ({
  page,
}) => {
  const state = await mockAnalyst(page);
  await page.goto("/ai-analyst?conversation=not-owned");
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
  await page
    .getByRole("button", { name: "Retry loading conversation" })
    .click();
  await expect(
    page.getByRole("button", { name: "Send message", exact: true }),
  ).toBeDisabled();
  expect(state.posts).toHaveLength(0);
});

test("JWT refresh retries only the rejected unauthenticated request", async ({
  page,
}) => {
  const state = await mockAnalyst(page);
  let attempts = 0;
  await page.route("**/api/users/token/refresh/", (route) =>
    route.fulfill({ json: { access: "refreshed-access" } }),
  );
  await page.route("**/api/ai/chat/", async (route) => {
    attempts++;
    if (attempts === 1)
      await route.fulfill({
        status: 401,
        json: rejected("Expired access token."),
      });
    else {
      expect(route.request().headers().authorization).toBe(
        "Bearer refreshed-access",
      );
      state.posts.push(route.request().postDataJSON());
      await completeChat(route, state);
    }
  });
  await page.goto("/ai-analyst");
  await page.getByRole("textbox").fill(question);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByLabel("Analyst message")).toBeVisible();
  expect(attempts).toBe(2);
  expect(state.conversations[0].messages).toHaveLength(2);
});

test("expired refresh credentials return to the existing login and hide history", async ({
  page,
}) => {
  await mockAnalyst(page);
  await page.route("**/api/ai/chat/", (route) =>
    route.fulfill({ status: 401, json: rejected("Expired.") }),
  );
  await page.route("**/api/users/token/refresh/", (route) =>
    route.fulfill({ status: 401, json: rejected("Expired refresh.") }),
  );
  await page.goto("/ai-analyst");
  await page.getByRole("textbox").fill(question);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByText("Your session expired. Please sign in to continue."),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Conversation messages" }),
  ).toHaveCount(0);
});

test("protected routing returns to the analyst after normal login", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.removeItem("f1_access_token");
    localStorage.removeItem("f1_refresh_token");
  });
  await mockAnalyst(page);
  await page.route("**/api/users/token/", (route) =>
    route.fulfill({
      json: { access: "login-access", refresh: "login-refresh" },
    }),
  );
  await page.route("**/api/users/me/", (route) =>
    route.fulfill({ json: envelope(user) }),
  );
  await page.goto("/ai-analyst");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Username", { exact: true }).fill("analyst");
  await page
    .getByLabel("Password", { exact: true })
    .fill("local-only-password");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(/\/ai-analyst$/);
  await expect(
    page.getByRole("heading", { name: "F1 AI Analyst" }),
  ).toBeVisible();
});

test("layouts remain usable in light/dark desktop, tablet and mobile sizes", async ({
  page,
}, testInfo) => {
  await mockAnalyst(page, {
    sources: [articleSource],
    answer: `Reported evidence [${articleSource.id}].`,
  });
  await page.goto("/ai-analyst");
  await page.screenshot({
    path: testInfo.outputPath("analyst-desktop-dark-empty.png"),
    fullPage: true,
  });
  await page.getByRole("textbox").fill(articleQuestion);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByLabel("Analyst message")).toBeVisible();
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const dark of [true, false]) {
      await page.evaluate(
        (value) => document.documentElement.classList.toggle("dark", value),
        dark,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath(
          `analyst-${width}-${dark ? "dark" : "light"}.png`,
        ),
        fullPage: true,
      });
    }
  }
  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Your question" }),
  ).toBeHidden();
  await expect(
    page.getByRole("complementary", { name: "Conversation history" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Saved conversations" })
    .getByRole("button")
    .first()
    .click();
  await expect(
    page.getByRole("complementary", { name: "Conversation history" }),
  ).toBeHidden();
});

test("new answers do not pull a reader away from older content", async ({
  page,
}) => {
  const detail = conversation();
  detail.messages = Array.from({ length: 30 }, (_, index) => ({
    id: `long-${index}`,
    role: index % 2 ? ("assistant" as const) : ("user" as const),
    content:
      `Recorded message ${index}. ` + "Evidence for this example. ".repeat(20),
    sources: [],
    metadata: {},
    sequence: index,
    created_at: detail.created_at,
  }));
  await mockAnalyst(page, { initial: [detail] });
  await page.goto(`/ai-analyst?conversation=${id}`);
  await expect(page.getByLabel("Analyst message")).toHaveCount(15);
  expect(
    await page
      .locator(".analyst-room")
      .evaluate((element) => element.scrollHeight - element.clientHeight),
  ).toBeLessThanOrEqual(2);
  const region = page.getByRole("region", { name: "Conversation messages" });
  await region.evaluate((element) => {
    element.scrollTop = 0;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect(
    page.getByRole("button", { name: "Latest messages" }),
  ).toBeVisible();
  await page.getByRole("textbox").fill(hybridQuestion);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByLabel("Analyst message")).toHaveCount(16);
  expect(await region.evaluate((element) => element.scrollTop)).toBeLessThan(
    100,
  );
  await page.getByRole("button", { name: "Latest messages" }).click();
  expect(await region.evaluate((element) => element.scrollTop)).toBeGreaterThan(
    100,
  );
});
