const { spawnSync } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");

const projectDirectory = path.join(__dirname, "..");
const reportsDirectory = path.join(projectDirectory, "reports");
const suiteConfigurations = {
  api: {
    tags: "@api",
    evidenceDirectory: "01-api",
    capturesDirectory: null
  },
  e2e: {
    tags: "@e2e and not @mobile",
    evidenceDirectory: "02-e2e",
    capturesDirectory: "02-e2e"
  },
  mobile: {
    tags: "@mobile",
    evidenceDirectory: "05-mobile-opcional",
    capturesDirectory: "05-mobile-opcional"
  }
};

async function removePreviousReports(suite) {
  const generatedReports = [
    "cucumber-report.html",
    "cucumber-report.json"
  ];

  for (const report of generatedReports) {
    await fs.rm(path.join(reportsDirectory, report), { force: true });
  }

  if (suite === "all") {
    for (const category of ["02-e2e", "05-mobile-opcional"]) {
      await fs.rm(path.join(reportsDirectory, "evidencias", category, "capturas"), {
        recursive: true,
        force: true
      });
    }
    return;
  }

  const configuration = suiteConfigurations[suite];
  const evidenceDirectory = path.join(
    reportsDirectory,
    "evidencias",
    configuration.evidenceDirectory
  );
  await fs.rm(path.join(evidenceDirectory, "relatorio.html"), { force: true });
  await fs.rm(path.join(evidenceDirectory, "relatorio.json"), { force: true });

  if (configuration.capturesDirectory) {
    await fs.rm(
      path.join(reportsDirectory, "evidencias", configuration.capturesDirectory, "capturas"),
      { recursive: true, force: true }
    );
  }
}

function runNodeScript(scriptPath, args) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: projectDirectory,
    stdio: "inherit"
  });

  if (result.error) {
    console.error(result.error);
    return 1;
  }

  return result.status === null ? 1 : result.status;
}

async function main() {
  const [suite, ...extraArguments] = process.argv.slice(2);
  if (suite !== "all" && !suiteConfigurations[suite]) {
    throw new Error("Informe uma suíte válida: all, api, e2e ou mobile.");
  }

  await removePreviousReports(suite);

  const cucumberArguments = [];
  if (suite !== "all") {
    const configuration = suiteConfigurations[suite];
    cucumberArguments.push(
      "--tags",
      configuration.tags,
      "--format",
      `html:reports/evidencias/${configuration.evidenceDirectory}/relatorio.html`,
      "--format",
      `json:reports/evidencias/${configuration.evidenceDirectory}/relatorio.json`
    );
  }
  cucumberArguments.push(...extraArguments);

  const cucumberPath = path.join(
    projectDirectory,
    "node_modules",
    "@cucumber",
    "cucumber",
    "bin",
    "cucumber.js"
  );
  const testExitCode = runNodeScript(cucumberPath, cucumberArguments);
  const sanitizerPath = path.join(__dirname, "sanitize-reports.js");
  const sanitizerExitCode = runNodeScript(sanitizerPath, []);

  process.exitCode = testExitCode || sanitizerExitCode;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
