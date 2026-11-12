import { expect, test } from "@playwright/test";

const listCases = [
  { route: "drivers", endpoint: "racing/drivers", record: (n: number) => ({
    id: `driver-${n}`, full_name: `Driver ${n}`, abbreviation: `D${n}`,
    country: "Demo", status: "active", current_team_name: null,
  }), label: "Driver" },
  { route: "teams", endpoint: "racing/teams", record: (n: number) => ({
    id: `team-${n}`, name: `Team ${n}`, country: "Demo", is_active: true,
    world_championships: 0,
  }), label: "Team" },
  { route: "races", endpoint: "racing/races", record: (n: number) => ({
    id: `race-${n}`, name: `Race ${n}`, race_date: "2026-01-01",
    season_year: 2026, round_number: n, circuit_name: "Demo circuit", status: "completed",
  }), label: "Race" },
  { route: "articles", endpoint: "content/articles", record: (n: number) => ({
    id: `article-${n}`, title: `Article ${n}`, slug: `article-${n}`,
    published_at: "2026-01-01T12:00:00Z", summary: "Demo article",
  }), label: "Article" },
];

for (const scenario of listCases) {
  test(`${scenario.route} exposes later API pages and resets pagination when searching`, async ({ page }) => {
    const requests: URL[] = [];
    await page.route(`**/api/${scenario.endpoint}/**`, async (route) => {
      const url = new URL(route.request().url());
      requests.push(url);
      const second = url.searchParams.get("page") === "2";
      const filtered = Boolean(url.searchParams.get("search"));
      const results = filtered ? [scenario.record(99)] : second
        ? [scenario.record(21)]
        : Array.from({ length: 20 }, (_, i) => scenario.record(i + 1));
      await route.fulfill({ json: {
        count: filtered ? 1 : 21, results,
        next: filtered || second ? null : "?page=2",
        previous: second ? "?page=1" : null,
      } });
    });
    await page.goto(`/${scenario.route}`);
    await expect(page.getByText(`${scenario.label} 1`, { exact: true }).last()).toBeVisible();
    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page.getByText(`${scenario.label} 21`, { exact: true }).last()).toBeVisible();
    await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
    await page.getByRole("searchbox").fill("Filtered");
    await expect(page.getByText(`${scenario.label} 99`, { exact: true }).last()).toBeVisible();
    expect(requests.at(-1)?.searchParams.get("page")).toBe("1");
    expect(requests.at(-1)?.searchParams.get("search")).toBe("Filtered");
  });
}

test("driver and constructor standings paginate independently", async ({ page }) => {
  await page.route("**/api/standings/**", async (route) => {
    const url = new URL(route.request().url());
    const driver = url.pathname.includes("drivers");
    const second = url.searchParams.get("page") === "2";
    const indices = second ? [21] : Array.from({ length: 20 }, (_, i) => i + 1);
    await route.fulfill({ json: {
      count: 21, next: second ? null : "?page=2", previous: second ? "?page=1" : null,
      results: indices.map((n) => ({
        id: `${driver ? "driver" : "constructor"}-${n}`, position: n, points: "10.00", wins: 0,
        driver: `driver-${n}`, driver_name: `Standing driver ${n}`, driver_country: "Demo",
        team: `team-${n}`, team_name: `Standing team ${n}`, team_country: "Demo", podiums: 0,
      })),
    } });
  });
  await page.goto("/standings");
  await page.getByRole("navigation", { name: "Driver standings pages" }).getByRole("button", { name: "Next page" }).click();
  await expect(page.getByText("Standing driver 21", { exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Constructor standings pages" })).toContainText("Page 1");
  await page.getByRole("navigation", { name: "Constructor standings pages" }).getByRole("button", { name: "Next page" }).click();
  await expect(page.getByRole("navigation", { name: "Constructor standings pages" })).toContainText("Page 2");
});

test("race, qualifying and sprint tables expose every result page", async ({ page }) => {
  await page.route("**/api/racing/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/racing/races/demo-race/") {
      return route.fulfill({ json: {
        id: "demo-race", name: "Demo race", season_year: 2026, round_number: 1,
        race_date: "2026-01-01", status: "completed", circuit: null,
      } });
    }
    const second = url.searchParams.get("page") === "2";
    const indices = second ? [21] : Array.from({ length: 20 }, (_, i) => i + 1);
    return route.fulfill({ json: {
      count: 21, next: second ? null : "?page=2", previous: second ? "?page=1" : null,
      results: indices.map((n) => ({
        id: `result-${n}`, driver: `driver-${n}`, driver_name: `Result driver ${n}`,
        team: "team", team_name: "Demo team", position: n, points: "0.00", status: "finished",
      })),
    } });
  });
  await page.goto("/races/demo-race");
  for (const title of ["Race results", "Qualifying", "Sprint"]) {
    const navigation = page.getByRole("navigation", { name: `${title} pages` });
    await navigation.getByRole("button", { name: "Next page" }).click();
    await expect(navigation.locator("..").getByText("Result driver 21", { exact: true })).toBeVisible();
    await expect(navigation.getByRole("button", { name: "Next page" })).toBeDisabled();
  }
});
