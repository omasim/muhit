import { MuhitFlow as Flow } from "../../src/index.mjs";
function node(tag, text, cls) {
  const n = document.createElement(tag);
  if (text) n.textContent = text;
  if (cls) n.className = cls;
  return n;
}
function button(text, fn) {
  const n = node("button", text, "mh-button");
  n.type = "button";
  n.onclick = fn;
  return n;
}
function section(parent, title) {
  const s = node("section", null, "mh-system-panel mh-stack-system");
  s.append(node("h2", title));
  parent.append(s);
  return s;
}
function wait(signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted)
      return reject(new DOMException("Cancelled", "AbortError"));
    const done = () => {
        signal.removeEventListener("abort", cancel);
        resolve();
      },
      t = setTimeout(done, 300),
      cancel = () => {
        clearTimeout(t);
        reject(new DOMException("Cancelled", "AbortError"));
      };
    signal.addEventListener("abort", cancel, { once: true });
  });
}
export function bulkExample(parent) {
  const area = section(parent, "Toplu işlem ve kısmi sonuç"),
    list = node("fieldset"),
    legend = node("legend", "Örnek kayıtları seç"),
    status = node("p");
  status.role = "status";
  list.append(legend);
  area.append(
    node(
      "p",
      "İşlem yalnız bu örneğin belleğini değiştirir. İlk denemede ikinci kayıt başarısız olur; yeniden deneme yalnız başarısız kayıtları işler.",
    ),
    list,
    status,
  );
  const checkboxes = [],
    complete = new Set();
  let attempted = false;
  for (const [id, label] of [
    ["a", "Araştırma planı"],
    ["b", "Tasarım raporu"],
    ["c", "İnceleme notu"],
  ]) {
    const row = node("label", null, "mh-check"),
      input = node("input");
    input.type = "checkbox";
    input.value = id;
    input.setAttribute("aria-label", label);
    row.append(input, document.createTextNode(label));
    list.append(row);
    checkboxes.push(input);
  }
  const flow = Flow.create(
    { ids: [] },
    {
      run: async ({ ids }, signal) => {
        await wait(signal);
        const failed = attempted ? [] : ids.filter((id) => id === "b");
        attempted = true;
        const done = ids.filter((id) => !failed.includes(id));
        done.forEach((id) => complete.add(id));
        return {
          outcome: failed.length ? "partial" : "success",
          persisted: !failed.length,
          data: { done, failed },
          ...(failed.length
            ? { errors: { b: "Örnek bağlantı hatası; yeniden denenebilir." } }
            : {}),
        };
      },
      onChange: (s) => {
        const busy = ["validating", "submitting"].includes(s.status);
        list.disabled = busy;
        run.disabled = busy;
        cancel.hidden = !busy;
      },
    },
  );
  const run = button("Seçilenleri işle", async () => {
      const ids = checkboxes.filter((c) => c.checked).map((c) => c.value);
      if (!ids.length) {
        status.textContent = "Önce en az bir kayıt seçin.";
        return;
      }
      flow.setDraft({ ids });
      status.textContent = "İşleniyor…";
      const result = await flow.submit();
      if (result.status === "cancelled") {
        status.textContent =
          "İptal edildi. Seçim korundu; yeni değişiklik uygulanmadı.";
        return;
      }
      if (!["partial", "success"].includes(result.status)) {
        status.textContent = "İşlem başarısız. Seçim korundu.";
        return;
      }
      const { done, failed } = result.result.data;
      checkboxes.forEach((c) => {
        c.disabled = complete.has(c.value);
        c.checked = failed.includes(c.value);
      });
      run.textContent = failed.length
        ? "Başarısız kayıtları yeniden dene"
        : "Seçilenleri işle";
      status.textContent =
        done.length +
        " kayıt örnek bellekte işlendi; " +
        failed.length +
        " kayıt başarısız.";
    }),
    cancel = button("Toplu işlemi iptal et", () => {
      flow.cancel();
      run.focus();
    });
  run.id = "bulk-run";
  cancel.id = "bulk-cancel";
  cancel.hidden = true;
  area.append(run, cancel);
  return () => flow.destroy();
}
export function wizardExample(parent) {
  const area = section(parent, "Çok adımlı hazırlık"),
    progress = node("p"),
    first = node("div"),
    second = node("div"),
    label = node("label", "Çalışmanın adı"),
    input = node("input", null, "mh-input"),
    review = node("p"),
    message = node("p"),
    actions = node("div", null, "mh-cluster");
  input.id = "wizard-name";
  label.htmlFor = input.id;
  input.required = true;
  first.append(label, input);
  second.append(node("h3", "İncele"), review);
  message.role = "status";
  area.append(progress, first, second, message, actions);
  let step = 0;
  const flow = Flow.create(
    { name: "" },
    {
      run: async (draft, signal) => {
        await wait(signal);
        return { outcome: "success", persisted: false, data: draft };
      },
    },
  );
  function render() {
    progress.textContent = "Adım " + (step + 1) + " / 2";
    first.hidden = step !== 0;
    second.hidden = step !== 1;
    back.hidden = step === 0;
    next.hidden = step !== 0;
    submit.hidden = step !== 1;
    review.textContent = "Çalışma: " + input.value;
  }
  const next = button("İncelemeye geç", () => {
      if (!input.reportValidity()) return;
      flow.setDraft({ name: input.value });
      step = 1;
      render();
      back.focus();
    }),
    back = button("Önceki adıma dön", () => {
      flow.cancel();
      step = 0;
      render();
      input.focus();
    }),
    submit = button("Hazırlığı tamamla", async () => {
      submit.disabled = true;
      message.textContent = "Hazırlanıyor…";
      const s = await flow.submit();
      submit.disabled = false;
      message.textContent =
        s.status === "success"
          ? "Hazırlık tamamlandı. Veri kaydedilmedi; taslak korunuyor."
          : "İptal edildi. Taslak korunuyor.";
    });
  submit.id = "wizard-submit";
  actions.append(back, next, submit);
  input.oninput = () => flow.setDraft({ name: input.value });
  render();
  return () => flow.destroy();
}
