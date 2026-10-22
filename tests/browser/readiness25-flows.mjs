import assert from "node:assert/strict";
export async function checkReadiness25(page) {
  const result = await page.evaluate(async () => {
    const { mountCalendar, mountDocumentEditor, mountNotificationCenter } =
      await import("/src/planning.mjs");
    let cases = 0;
    const tick = () => new Promise((r) => setTimeout(r, 0));
    for (const observer of ["onChange", "onDraftChange", "onDirtyChange"])
      for (const asynchronous of [false, true]) {
        const h = document.createElement("div");
        document.querySelector("main").append(h);
        let acknowledgments = 0,
          diagnostics = [];
        const c = mountCalendar(h, [], {
          locale: "en",
          date: "2026-10-22",
          onMutation: async () => {
            acknowledgments++;
            return { persisted: true };
          },
          [observer]: () => {
            if (asynchronous) return Promise.reject(Error("Observer failure"));
            throw Error("Observer failure");
          },
          onObserverError: (e, name) => diagnostics.push(name),
        });
        const fields = h.querySelectorAll("form input");
        fields[0].value = "Saved";
        fields[1].value = "2026-10-22T09:00";
        fields[2].value = "2026-10-22T10:00";
        fields[0].dispatchEvent(new Event("input", { bubbles: true }));
        h.querySelector("form").requestSubmit();
        await tick();
        if (
          acknowledgments !== 1 ||
          c.getSnapshot().items.length !== 1 ||
          c.getDraft().title !== "" ||
          !h.textContent.includes("Server save confirmed.")
        )
          throw Error("Observer changed save result: " + observer);
        if (!diagnostics.includes(observer))
          throw Error("Missing observer diagnostic");
        h.querySelector("[data-action=delete-event]").click();
        h.querySelector("[data-action=confirm-delete]").click();
        await tick();
        if (
          c.getSnapshot().items.length ||
          !h.textContent.includes("Server deletion confirmed.")
        )
          throw Error("Observer changed deletion result");
        c.destroy();
        h.remove();
        cases++;
      }
    for (const observer of ["onDraftChange", "onDirtyChange"]) {
      const h = document.createElement("div");
      document.querySelector("main").append(h);
      let errors = 0;
      const e = mountDocumentEditor(
        h,
        { title: "Before", blocks: [] },
        {
          locale: "en",
          onSave: async () => ({ persisted: true }),
          [observer]: () => {
            throw Error("Observer");
          },
          onObserverError: () => errors++,
        },
      );
      const title = h.querySelector("input");
      title.value = "After";
      title.dispatchEvent(new Event("input", { bubbles: true }));
      [...h.querySelectorAll("button")]
        .find((b) => b.textContent === "Save to server")
        .click();
      await tick();
      if (
        e.isDirty() ||
        !h.textContent.includes("Server save confirmed.") ||
        !errors
      )
        throw Error("Editor observer changed result");
      e.destroy();
      h.remove();
      cases++;
    }
    for (const locale of ["de", "ar"])
      for (const outcome of ["success", "failure"]) {
        const { default: messages } = await import(
          "/locales/" + locale + ".mjs"
        );
        const h = document.createElement("div");
        h.style.width = "320px";
        document.querySelector("main").append(h);
        const n = mountNotificationCenter(h, [], {
          locale,
          messages,
          onPreferences: async () => {
            if (outcome === "failure") throw Error("Unavailable");
            return { persisted: true };
          },
        });
        h.querySelector("[data-action=preferences]").click();
        await tick();
        const key =
          outcome === "success"
            ? "Tercihler sunucuda doğrulandı."
            : "Tercihler kaydedilemedi; seçimlerin korunuyor.";
        if (
          !h.textContent.includes(messages[key]) ||
          n.element.scrollWidth > n.element.clientWidth + 1 ||
          n.element.dir !== (locale === "ar" ? "rtl" : "ltr")
        )
          throw Error("Localized notification flow failed");
        h.querySelector("[data-action=cancel]").click();
        n.destroy();
        h.remove();
      }
    return { cases, notificationLocales: ["de", "ar"] };
  });
  assert.equal(result.cases, 8);
  const example = await page.context().newPage();
  try {
    await example.setViewportSize({width:390,height:844});
    await example.goto(new URL('/examples/async-search.html',page.url()).href);
    await example.locator('#build').click();
    await example.locator('#status').filter({hasText:'İndeks hazır.'}).waitFor();
    await example.locator('#query').fill('Araştırma 99');
    await example.locator('#search').click();
    assert.equal(await example.locator('#results li').count(),25);
    assert.ok(await example.evaluate(()=>[...document.querySelectorAll('button,input')].every(e=>e.getBoundingClientRect().height>=44)));
    assert.equal(await example.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  } finally {await example.close();}

  return result;
}
