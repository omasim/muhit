import test from "node:test";
import assert from "node:assert/strict";
import {
  MuhitTokens as T,
  MuhitTheme as Theme,
  MuhitFlow as F,
  MuhitPages as P,
  MuhitSystem as S,
} from "../src/index.mjs";
const proposal = () => ({
  version: "1.0.0",
  page: {
    version: "1.0.0",
    recipe: "settings",
    title: "Settings",
    primaryActionId: "save",
  },
  view: {
    schemaVersion: "1.1.0",
    components: [
      {
        type: "form",
        id: "form",
        title: "Draft",
        fields: [{ name: "name", label: "Name" }],
      },
    ],
  },
  actions: [
    {
      id: "save",
      componentId: "form",
      event: "submit",
      kind: "write",
      label: "Save",
      confirmation: "Store this record?",
    },
  ],
  data: { source: "Example", example: true, persistence: "memory" },
});
test("all 16 modes export valid typed graphs and keep aliases connected", () => {
  for (const p of Theme.presets)
    for (const mode of ["light", "dark"]) {
      const doc = T.document({ preset: p.id, mode });
      assert.ok(T.validate(doc).valid);
      assert.equal(
        doc.component.button.primary.background.$value,
        "{semantic.legacy.button-bg}",
      );
      assert.equal(
        doc.semantic.color.action.primary.$value,
        "{primitive.theme.accent}",
      );
    }
});
test("component tokens follow custom button and card theme settings", () => {
  const doc=T.document({buttonStyle:'outline',cardSurface:'tinted',radius:'square'});
  assert.ok(T.validate(doc).valid);
  assert.equal(doc.component.button.primary.foreground.$value,'{semantic.legacy.button-fg}');
  assert.equal(doc.component.card.background.$value,'{semantic.legacy.card-surface}');
  assert.equal(doc.component.card.radius.$value,'{semantic.legacy.radius-md}');
  assert.deepEqual(doc.primitive.theme['button-bg'].$value,{colorSpace:'srgb',components:[0,0,0],alpha:0});
});
test("token graph rejects cycles, absent references and incompatible types", () => {
  let doc = T.document();
  doc.semantic.color.action.primary.$value = "{semantic.color.action.primary}";
  assert.ok(!T.validate(doc).valid);
  doc = T.document();
  doc.semantic.color.action.primary.$value = "{absent}";
  assert.ok(!T.validate(doc).valid);
  doc = T.document();
  doc.semantic.color.action.primary.$value = "{primitive.space.4}";
  assert.ok(!T.validate(doc).valid);
});
test("theme precedence is explicit and rejects unknown inputs without mutation", () => {
  const product = { preset: "clay", density: "compact" };
  const theme = T.compose(
    [product, { mode: "system" }, { density: "spacious" }],
    { systemMode: "dark" },
  );
  assert.equal(theme.mode, "dark");
  assert.equal(theme.density, "spacious");
  assert.equal(product.density, "compact");
  assert.throws(() => T.compose([{ unknown: true }]));
  let accessed = false;
  assert.throws(() =>
    T.compose([
      {
        get preset() {
          accessed = true;
          return "grove";
        },
      },
    ]),
  );
  assert.equal(accessed, false);
});
test("cancel during validation keeps draft and prevents execution", async () => {
  let finish,
    ran = false,
    signal;
  const f = F.create(
    { name: "" },
    {
      validate: async (v, s) => {
        signal = s;
        return new Promise((r) => (finish = r));
      },
      run: async () => {
        ran = true;
        return { outcome: "success", persisted: true };
      },
    },
  );
  f.setDraft({ name: "Draft" });
  const pending = f.submit();
  f.cancel();
  finish({});
  await pending;
  assert.equal(signal.aborted, true);
  assert.equal(ran, false);
  assert.equal(f.getSnapshot().draft.name, "Draft");
  assert.equal(f.getSnapshot().status, "cancelled");
  f.destroy();
});
test("late old results cannot overwrite a newer submission", async () => {
  let first;
  let n = 0;
  const f = F.create(
    { name: "" },
    {
      run: async () =>
        ++n === 1
          ? new Promise((r) => (first = r))
          : { outcome: "success", persisted: true },
    },
  );
  f.setDraft({ name: "First" });
  const old = f.submit();
  f.cancel();
  f.setDraft({ name: "Second" });
  await f.submit();
  first({ outcome: "success", persisted: true });
  await old;
  assert.equal(f.getSnapshot().baseline.name, "Second");
  assert.equal(f.getSnapshot().dirty, false);
});
test("unpersisted and partial outcomes keep dirty drafts; unknown results fail closed", async () => {
  for (const response of [
    { outcome: "success", persisted: false },
    { outcome: "partial", persisted: true, errors: { one: "Failed" } },
    {},
  ]) {
    const f = F.create({ name: "" }, { run: async () => response });
    f.setDraft({ name: "Draft" });
    await f.submit();
    assert.equal(f.getSnapshot().dirty, true);
    f.reset();
    assert.equal(f.getSnapshot().draft.name, "");
  }
});
test("snapshot restore resets transient work and does not mutate input", () => {
  const f = F.create("Original");
  f.setDraft("Draft");
  const snap = f.getSnapshot();
  f.reset();
  f.restore(snap);
  assert.equal(f.getSnapshot().draft, "Draft");
  assert.equal(f.getSnapshot().baseline, "Original");
  snap.draft = "Changed externally";
  assert.equal(f.getSnapshot().draft, "Draft");
  f.destroy();
  assert.throws(() => f.setDraft("No"));
});
test("page recipes reject incompatible metadata without DOM access", () => {
  for (const recipe of P.recipes)
    assert.ok(
      P.validate({ version: "1.0.0", recipe: recipe.id, title: "Page" }).valid,
    );
  assert.ok(
    !P.validate({ version: "1.0.0", recipe: "unknown", title: "Page" }).valid,
  );
  assert.ok(
    !P.validate({
      version: "1.0.0",
      recipe: "detail",
      title: "",
      html: "unsafe",
    }).valid,
  );
});
test("composition catches cross references and effect bindings", () => {
  assert.ok(S.review(proposal()).valid);
  const p = proposal();
  p.actions[0].componentId = "absent";
  assert.ok(!S.review(p).valid);
  p.actions[0].componentId = "form";
  p.actions[0].event = "form-change";
  assert.ok(!S.review(p).valid);
  p.actions[0].event = "submit";
  delete p.actions[0].confirmation;
  assert.ok(!S.review(p).valid);
});
test("effects require approval plus application authorization", async () => {
  let ran = 0;
  for (const opts of [
    {},
    { approve: () => true },
    { approve: () => true, authorize: () => false },
    { approve: () => "false", authorize: () => true },
    { approve: () => true, authorize: () => ({allowed:false}) },
  ]) {
    const s = S.createSession(proposal(), {
      ...opts,
      execute: async () => {
        ran++;
        return { outcome: "success", persisted: true };
      },
    });
    const r = await s.apply("save", {});
    assert.equal(r.status, "error");
    s.destroy();
  }
  assert.equal(ran, 0);
  const s = S.createSession(proposal(), {
    approve: () => true,
    authorize: () => true,
    execute: async () => {
      ran++;
      return { outcome: "success", persisted: false };
    },
  });
  s.review.proposal.actions[0].kind = "read";
  await s.apply("save", {});
  assert.equal(ran, 1);
  s.destroy();
});
test("cancel during approval never reaches executor", async () => {
  let approve,
    signal,
    ran = false;
  const s = S.createSession(proposal(), {
    approve: async (a, p, s) => {
      signal = s;
      return new Promise((r) => (approve = r));
    },
    authorize: () => true,
    execute: async () => {
      ran = true;
      return { outcome: "success", persisted: true };
    },
  });
  const pending = s.apply("save", {});
  s.cancel("save");
  approve(true);
  assert.equal((await pending).status, "cancelled");
  assert.equal(signal.aborted, true);
  assert.equal(ran, false);
  s.destroy();
});
