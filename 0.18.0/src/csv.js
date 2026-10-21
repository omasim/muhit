/* Shared spreadsheet-safe CSV cells. */
(function (global) {
  "use strict";
  function cell(value) {
    let text = String(value ?? "");
    if (
      /^[\s\u0000-\u001f\u007f\uFEFF]*[=+@\-]/.test(text) ||
      /^[\t\r\n]/.test(text)
    )
      text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }
  global.MuhitCSV = Object.freeze({ cell });
})(globalThis);
