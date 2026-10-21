/* Shared boundary checks. No DOM, network or evaluation. */
(function (global) {
  "use strict";
  function json(value) {
    let count = 0;
    const seen = new Set();
    function visit(v, depth) {
      if (++count > 100000 || depth > 40)
        throw TypeError("JSON limit exceeded");
      if (v === null || typeof v === "boolean") return v;
      if (typeof v === "string") {
        if (v.length > 500000) throw TypeError("String limit exceeded");
        return v;
      }
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (!v || typeof v !== "object" || seen.has(v))
        throw TypeError("Plain finite JSON required");
      const proto = Object.getPrototypeOf(v);
      if (!Array.isArray(v) && proto !== Object.prototype && proto !== null)
        throw TypeError("Plain JSON object required");
      seen.add(v);
      const out = Array.isArray(v) ? [] : {};
      for (const key of Object.keys(v)) {
        if (["__proto__", "constructor", "prototype"].includes(key))
          throw TypeError("Reserved key");
        const d = Object.getOwnPropertyDescriptor(v, key);
        if (!d || !("value" in d)) throw TypeError("Accessors are not JSON");
        out[key] = visit(d.value, depth + 1);
      }
      seen.delete(v);
      return out;
    }
    return visit(value, 0);
  }
  function object(value, keys, required = []) {
    if (
      !value ||
      Array.isArray(value) ||
      typeof value !== "object" ||
      Object.keys(value).some((k) => !keys.includes(k)) ||
      required.some((k) => !(k in value))
    )
      throw TypeError("Invalid object fields");
  }
  function text(v, max = 240) {
    return typeof v === "string" && v.trim().length > 0 && v.length <= max;
  }
  global.MuhitContracts = Object.freeze({ json, object, text });
})(typeof window !== "undefined" ? window : globalThis);
