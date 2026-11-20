const {
  setWorldConstructor,
  setDefaultTimeout,
  Before,
  After
} = require("@cucumber/cucumber");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium, devices, request } = require("@playwright/test");
const LoginPage = require("../../src/pages/login.page");
const StorePage = require("../../src/pages/store.page");

setDefaultTimeout(30_000);

class TestWorld {
  constructor({ attach }) {
    this.attach = attach;
    this.response = undefined;
    this.responseBody = undefined;
    this.loginPage = undefined;
    this.storePage = undefined;
    this.page = undefined;
  }
}

setWorldConstructor(TestWorld);

async function startBrowser(world, contextOptions = {}) {
  world.browser = await chromium.launch({ headless: true });
  world.context = await world.browser.newContext(contextOptions);
  world.page = await world.context.newPage();
  world.loginPage = new LoginPage(world.page);
  world.storePage = new StorePage(world.page);
  world.baseUrl = process.env.E2E_BASE_URL || "https://www.saucedemo.com";
}

Before({ tags: "@api" }, async function () {
  this.api = await request.newContext({
    baseURL: process.env.API_BASE_URL || "https://dummyjson.com",
    extraHTTPHeaders: { Accept: "application/json" }
  });
});

After({ tags: "@api" }, async function () {
  await this.api.dispose();
});

Before({ tags: "@e2e and not @mobile" }, async function () {
  await startBrowser(this);
});

Before({ tags: "@mobile" }, async function () {
  await startBrowser(this, devices["Pixel 5"]);
});

After({ tags: "@e2e" }, async function (scenario) {
  if (this.page) {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, "image/png");

      const isMobile = scenario.pickle.tags.some((tag) => tag.name === "@mobile");
      const category = isMobile ? "05-mobile-opcional" : "02-e2e";
      const evidenceDirectory = path.join(
        __dirname,
        "..",
        "..",
        "reports",
        "evidencias",
        category,
        "capturas"
      );
      const scenarioName = scenario.pickle.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const result = scenario.result.status === "PASSED" ? "aprovado" : "falhou";

      await fs.mkdir(evidenceDirectory, { recursive: true });
      await fs.writeFile(path.join(evidenceDirectory, `${scenarioName}-${result}.png`), screenshot);
    } finally {
      await this.browser.close();
    }
  }
});
