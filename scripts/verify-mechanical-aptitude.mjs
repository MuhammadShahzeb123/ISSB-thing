import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const bankPath = path.join(repositoryRoot, "app", "mechanical-aptitude", "questions.ts");
const sourceText = fs.readFileSync(bankPath, "utf8");
const compiled = ts.transpileModule(sourceText, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: bankPath,
});

const loadedModule = { exports: {} };
const execute = new Function("module", "exports", compiled.outputText);
execute(loadedModule, loadedModule.exports);

const {
  CATEGORY_LABELS,
  mechanicalQuestions,
  PRINCIPLE_SOURCES,
} = loadedModule.exports;

const errors = [];
const fail = (message) => errors.push(message);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isPositiveNumber = (value) => Number.isFinite(value) && value > 0;

function validateDiagram(diagram, id) {
  if (diagram === undefined) return;
  if (!diagram || typeof diagram !== "object" || Array.isArray(diagram)) {
    fail(`${id}: diagram must be an object`);
    return;
  }

  const labelFields = {
    lever: ["leftLabel", "rightLabel"],
    pulley: ["loadLabel", "effortLabel"],
    gears: ["labelA", "labelB"],
    incline: ["loadLabel"],
    spring: ["forceLabel"],
    hydraulic: [],
    balance: ["leftLabel", "rightLabel"],
  };
  const numberFields = {
    lever: ["fulcrum", "leftArm", "rightArm"],
    pulley: ["supportingStrands"],
    gears: ["teethA", "teethB"],
    incline: ["rise", "run"],
    spring: ["extension"],
    hydraulic: ["areaA", "areaB", "forceA"],
    balance: [],
  };

  if (!Object.hasOwn(labelFields, diagram.type)) {
    fail(`${id}: unknown diagram type "${diagram.type}"`);
    return;
  }

  for (const field of labelFields[diagram.type]) {
    if (!isNonEmptyString(diagram[field])) fail(`${id}: diagram ${field} must be a non-empty string`);
  }
  for (const field of numberFields[diagram.type]) {
    if (!isPositiveNumber(diagram[field])) fail(`${id}: diagram ${field} must be a positive finite number`);
  }

  if (diagram.type === "lever" && (diagram.fulcrum < 20 || diagram.fulcrum > 180)) {
    fail(`${id}: lever fulcrum must fit the 20–180 SVG coordinate range`);
  }
  if (diagram.type === "pulley") {
    if (!["fixed", "movable", "block-and-tackle"].includes(diagram.arrangement)) {
      fail(`${id}: invalid pulley arrangement`);
    }
    if (!Number.isInteger(diagram.supportingStrands) || diagram.supportingStrands > 8) {
      fail(`${id}: supportingStrands must be an integer from 1 to 8`);
    }
  }
  if (diagram.type === "gears" && !["mesh", "open-belt", "crossed-belt"].includes(diagram.connectedBy)) {
    fail(`${id}: invalid gear connection`);
  }
  if (diagram.type === "balance" && !["level", "left-down", "right-down"].includes(diagram.state)) {
    fail(`${id}: invalid balance state`);
  }
}

if (!Array.isArray(mechanicalQuestions)) {
  fail("mechanicalQuestions must be an array");
} else {
  if (mechanicalQuestions.length !== 100) {
    fail(`expected exactly 100 questions, found ${mechanicalQuestions.length}`);
  }

  const expectedIds = new Set(Array.from({ length: 100 }, (_, index) => `MA-${String(index + 1).padStart(3, "0")}`));
  const seenIds = new Set();
  const categoryCounts = new Map(Object.keys(CATEGORY_LABELS).map((category) => [category, 0]));

  for (const question of mechanicalQuestions) {
    const id = isNonEmptyString(question?.id) ? question.id : "<missing id>";
    if (!/^MA-\d{3}$/.test(id)) fail(`${id}: ID must match MA-000`);
    if (seenIds.has(id)) fail(`${id}: duplicate ID`);
    seenIds.add(id);
    expectedIds.delete(id);

    if (!isNonEmptyString(question?.prompt)) fail(`${id}: prompt is required`);
    if (!Array.isArray(question?.choices) || question.choices.length !== 4) {
      fail(`${id}: choices must contain exactly four entries`);
    } else {
      const normalizedChoices = question.choices.map((choice) => (
        typeof choice === "string" ? choice.trim().toLocaleLowerCase() : ""
      ));
      if (normalizedChoices.some((choice) => !choice)) fail(`${id}: every choice must be a non-empty string`);
      if (new Set(normalizedChoices).size !== 4) fail(`${id}: choices must be unique`);
    }

    if (!Number.isInteger(question?.answerIndex) || question.answerIndex < 0 || question.answerIndex > 3) {
      fail(`${id}: answerIndex must be an integer from 0 to 3`);
    }
    if (!isNonEmptyString(question?.explanation) || question.explanation.trim().length < 20) {
      fail(`${id}: a concise explanatory sentence is required`);
    }
    if (!["easy", "medium", "hard"].includes(question?.difficulty)) {
      fail(`${id}: difficulty must be easy, medium, or hard`);
    }
    if (!Object.hasOwn(CATEGORY_LABELS, question?.category)) {
      fail(`${id}: unknown category "${question?.category}"`);
    } else {
      categoryCounts.set(question.category, categoryCounts.get(question.category) + 1);
    }
    if (!Array.isArray(question?.sources) || question.sources.length === 0) {
      fail(`${id}: at least one public principle-source tag is required`);
    } else {
      for (const source of question.sources) {
        const sourceRecord = PRINCIPLE_SOURCES[source];
        if (!sourceRecord) {
          fail(`${id}: unknown principle-source tag "${source}"`);
        } else if (!isNonEmptyString(sourceRecord.label) || !/^https:\/\//.test(sourceRecord.url)) {
          fail(`${id}: source "${source}" needs a label and public HTTPS URL`);
        }
      }
    }
    validateDiagram(question?.diagram, id);
  }

  if (expectedIds.size > 0) fail(`missing stable IDs: ${[...expectedIds].join(", ")}`);
  for (const [category, count] of categoryCounts) {
    if (count < 10) fail(`category "${category}" has insufficient coverage (${count}; minimum 10)`);
  }
}

if (errors.length > 0) {
  console.error(`Mechanical aptitude verification failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const diagramCount = mechanicalQuestions.filter((question) => question.diagram).length;
const coverage = Object.keys(CATEGORY_LABELS)
  .map((category) => `${category}=${mechanicalQuestions.filter((question) => question.category === category).length}`)
  .join(", ");

console.log(`Mechanical aptitude bank verified: ${mechanicalQuestions.length} questions, ${diagramCount} diagrams.`);
console.log(`Category coverage: ${coverage}`);
