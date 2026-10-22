import assert from "node:assert/strict";
export async function checkReadiness24(page) {
  await page.route("https://example.com/x.png", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>',
    }),
  );
  const result = await page.evaluate(async () => {
    const { mountCalendar, mountDocumentEditor } = await import(
      "/src/planning.mjs"
    );
    const base = {
      id: "a",
      title: "Original",
      start: "2026-10-22T09:00:30.123Z",
      end: "2026-10-22T10:00:30.456Z",
    };
    const host = () => {
      const h = document.createElement("div");
      document.querySelector("main").append(h);
      return h;
    };
    for (const remote of [false, true]) {
      const h = host();
      let payload;
      const c = mountCalendar(h, [base], {
        locale: "en",
        date: "2026-10-22",
        ...(remote
          ? {
              onMutation: async (request) => {
                payload = request;
                return { persisted: true };
              },
            }
          : {}),
      });
      h.querySelector("[data-action=edit-event]").click();
      h.querySelector("form input").value = "Title only";
      if (
        [...h.querySelectorAll("[type=datetime-local]")].some(
          (n) => !n.validity.valid,
        )
      )
        throw Error("Native time validation failed");
      h.querySelector("form").requestSubmit();
      await Promise.resolve();
      await Promise.resolve();
      const saved = c.getSnapshot().items[0];
      if (
        saved.start !== base.start ||
        saved.end !== base.end ||
        saved.title !== "Title only"
      )
        throw Error("Timestamp precision lost");
      if (remote && payload.event.start !== base.start)
        throw Error("Transport precision lost");
      c.destroy();
      h.remove();
    }
    for (const outcome of ["success", "error", "cancel"]) {
      const h = host(),
        pending = [];
      const c = mountCalendar(
        h,
        [
          base,
          {
            ...base,
            id: "b",
            title: "Second",
            start: "2026-10-22T11:00:00.000Z",
            end: "2026-10-22T12:00:00.000Z",
          },
        ],
        {
          locale: "en",
          date: "2026-10-22",
          onMutation: (request, signal) =>
            new Promise((resolve, reject) =>
              pending.push({ request, signal, resolve, reject }),
            ),
        },
      );
      h.querySelector("[data-action=edit-event][data-event=a]").click();
      h.querySelector("form input").value = "New draft";
      h.querySelector("form").requestSubmit();
      h.querySelector("[data-action=delete-event][data-event=b]").click();
      h.querySelector("[data-action=confirm-delete][data-event=b]").click();
      if (!pending[0].signal.aborted)
        throw Error("Superseded save was not aborted");
      if (outcome === "cancel") h.querySelector("[data-action=cancel]").click();
      if (outcome === "error") pending[1].reject(Error("Unavailable"));
      else pending[1].resolve({ persisted: true });
      await Promise.resolve();
      await Promise.resolve();
      pending[0].resolve({ persisted: true });
      await Promise.resolve();
      await Promise.resolve();
      if (h.querySelector("[type=submit]").disabled)
        throw Error("Save remains disabled: " + outcome);
      if (c.getDraft().title !== "New draft") throw Error("Draft lost");
      if (c.getSnapshot().items.length !== (outcome === "success" ? 1 : 2))
        throw Error("Delete result applied incorrectly");
      h.querySelector("form").requestSubmit();
      if (pending.length !== 3) throw Error("Cannot save again");
      pending[2].resolve({ persisted: true });
      await Promise.resolve();
      await Promise.resolve();
      c.destroy();
      h.remove();
    }
    for (const locale of ["de", "ar"]) {
      const { default: messages } = await import("/locales/" + locale + ".mjs");
      const h = host();
      h.style.width = "360px";
      const c = mountCalendar(h, [], { locale, messages, date: "2026-10-22" });
      const expected = locale === "de" ? "Veranstaltungstitel" : "عنوان الحدث";
      if (!h.querySelector('input[aria-label="' + expected + '"]'))
        throw Error("Untranslated calendar");
      if (c.element.dir !== (locale === "ar" ? "rtl" : "ltr"))
        throw Error("Direction mismatch");
      if (c.element.scrollWidth > c.element.clientWidth + 1)
        throw Error("Localized calendar overflow");
      c.destroy();
      const e = mountDocumentEditor(
        h,
        {
          title: "Example",
          blocks: [
            {
              id: "img",
              type: "image",
              text: "Description",
              url: "https://example.com/x.png",
            },
          ],
        },
        { locale, messages },
      );
      const label =
        locale === "de" ? "Alternativtext des Bildes" : "النص البديل للصورة";
      if (!h.querySelector('textarea[aria-label="' + label + '"]'))
        throw Error("Untranslated media");
      if (e.element.scrollWidth > e.element.clientWidth + 1)
        throw Error("Localized editor overflow");
      e.destroy();
      h.remove();
    }
    return {
      precision: true,
      operationTransitions: ["success", "error", "cancel"],
      locales: ["de", "ar"],
    };
  });
  assert.ok(result.precision);
  return result;
}
