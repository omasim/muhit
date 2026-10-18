/* Muhit Icons 1.1 — hand-authored SVG geometry, MIT. */
(function(global){
  "use strict";
  const paths={
  "resize-horizontal": "<path d=\"M3 12h18M7 8l-4 4 4 4m10-8 4 4-4 4\"/>",
  "board": "<rect x=\"3\" y=\"3\" width=\"5\" height=\"15\" rx=\"1\"/><rect x=\"10\" y=\"3\" width=\"5\" height=\"10\" rx=\"1\"/><rect x=\"17\" y=\"3\" width=\"4\" height=\"18\" rx=\"1\"/>",
  "cards": "<rect x=\"3\" y=\"6\" width=\"15\" height=\"15\" rx=\"2\"/><path d=\"M7 3h12a2 2 0 0 1 2 2v12M7 11h7M7 15h4\"/>",
  "form": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 8h4m-4 4h10m-10 4h7\"/>",
  "bell": "<path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4\"/>",
  "layout": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 8h18M8 8v13\"/>",
  "more": "<circle cx=\"5\" cy=\"12\" r=\"1\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"19\" cy=\"12\" r=\"1\"/>",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 6v6l4 2\"/>",
  "lock": "<rect x=\"4\" y=\"10\" width=\"16\" height=\"12\" rx=\"2\"/><path d=\"M8 10V6a4 4 0 0 1 8 0v4m-4 5v3\"/>",
  "chevron-forward": "<path d=\"m9 5 7 7-7 7\"/>",

  "home": "<path d=\"M3 11 10 4Q12 2 14 4L21 11M5 10v9q0 2 2 2h3v-7h4v7h3q2 0 2-2v-9\"/>",
  "grid": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"2\"/>",
  "menu": "<path d=\"M4 6h16M4 12h12M4 18h16\"/>",
  "search": "<circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m15.5 15.5 5 5\"/>",
  "arrow-forward": "<path d=\"M4 12h16m-6-6 6 6-6 6\"/>",
  "arrow-back": "<path d=\"M20 12H4m6-6-6 6 6 6\"/>",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\"/>",
  "external-link": "<path d=\"M13 4h7v7m0-7L10 14M9 5H6q-2 0-2 2v11q0 2 2 2h11q2 0 2-2v-3\"/>",
  "plus": "<path d=\"M12 4v16M4 12h16\"/>",
  "minus": "<path d=\"M4 12h16\"/>",
  "close": "<path d=\"m6 6 12 12M18 6 6 18\"/>",
  "check": "<path d=\"m4 12 5 5L20 6\"/>",
  "edit": "<path d=\"m14 4 6 6M4 20l5-1L20 8q2-2 0-4t-4 0L5 15 4 20Z\"/>",
  "copy": "<rect x=\"8\" y=\"8\" width=\"12\" height=\"13\" rx=\"2\"/><path d=\"M15 8V5q0-2-2-2H5Q3 3 3 5v8q0 2 2 2h3\"/>",
  "download": "<path d=\"M12 3v12m-5-5 5 5 5-5M4 17v2q0 2 2 2h12q2 0 2-2v-2\"/>",
  "upload": "<path d=\"M12 15V3m-5 5 5-5 5 5M4 17v2q0 2 2 2h12q2 0 2-2v-2\"/>",
  "refresh": "<path d=\"M20 9a8 8 0 1 0 0 7M20 3v6h-6\"/>",
  "trash": "<path d=\"M3 6h18M9 6V3h6v3M5 6l1 13q0 2 2 2h8q2 0 2-2l1-13M10 10v7m4-7v7\"/>",
  "filter": "<path d=\"M3 4h18l-7 8v7l-4 2v-9L3 4Z\"/>",
  "sort": "<path d=\"M6 4v16m-3-3 3 3 3-3M12 5h9M12 10h7M12 15h5\"/>",
  "table": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 9h18M3 14h18M9 9v11\"/>",
  "chart": "<path d=\"M4 3v15q0 2 2 2h15M8 15v-4m5 4V6m5 9V9\"/>",
  "layers": "<path d=\"m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5\"/>",
  "link": "<path d=\"m9 15 6-6M7 14l-2 2a3 3 0 0 0 4 4l4-4a3 3 0 0 0 0-4M17 10l2-2a3 3 0 0 0-4-4l-4 4a3 3 0 0 0 0 4\"/>",
  "file": "<path d=\"M14 3H6Q4 3 4 5v14q0 2 2 2h12q2 0 2-2V9l-6-6v6h6M8 13h8M8 17h5\"/>",
  "folder": "<path d=\"M3 7V5q0-2 2-2h4l3 4h7q2 0 2 2v10q0 2-2 2H5q-2 0-2-2V7h9\"/>",
  "book": "<path d=\"M12 6v15M12 6Q7 2 3 4v15q4-2 9 2 5-4 9-2V4q-4-2-9 2Z\"/>",
  "bookmark": "<path d=\"M6 5q0-2 2-2h8q2 0 2 2v16l-6-4-6 4V5Z\"/>",
  "note": "<path d=\"M4 5q0-2 2-2h12q2 0 2 2v10l-6 6H6q-2 0-2-2V5ZM14 21v-6h6M8 8h8M8 12h5\"/>",
  "archive": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"5\" rx=\"1\"/><path d=\"M5 8v11q0 2 2 2h10q2 0 2-2V8M10 12h4\"/>",
  "person": "<circle cx=\"12\" cy=\"7\" r=\"4\"/><path d=\"M4 21v-2a8 6 0 0 1 16 0v2\"/>",
  "people": "<circle cx=\"8\" cy=\"7\" r=\"3\"/><path d=\"M2 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M17 14a5 5 0 0 1 5 5v2\"/>",
  "message": "<path d=\"M5 4h14q2 0 2 2v10q0 2-2 2h-9l-6 3V6q0-2 2-2ZM8 9h9M8 13h6\"/>",
  "share": "<circle cx=\"5\" cy=\"12\" r=\"3\"/><circle cx=\"19\" cy=\"5\" r=\"3\"/><circle cx=\"19\" cy=\"19\" r=\"3\"/><path d=\"m8 11 8-5M8 13l8 5\"/>",
  "heart": "<path d=\"M12 20C10 18 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-7 10-9 12Z\"/>",
  "accessibility": "<circle cx=\"12\" cy=\"4\" r=\"2\"/><path d=\"M3 8q9 3 18 0M12 10v5m0 0-5 6m5-6 5 6\"/>",
  "leaf": "<path d=\"M20 3C10 2 4 6 4 13c0 8 15 9 16-10ZM3 21 15 9\"/>",
  "sprout": "<path d=\"M12 21V11M12 14C5 15 3 10 3 6c6-1 10 3 9 8ZM12 11c0-6 4-9 9-8 0 6-3 9-9 8\"/>",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5\"/>",
  "moon": "<path d=\"M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z\"/>",
  "water": "<path d=\"M12 2C9 7 5 10 5 15a7 7 0 0 0 14 0c0-5-4-8-7-13ZM8 15q0 4 4 4\"/>",
  "landscape": "<path d=\"M2 20 8 9l4 6 4-8 6 13H2ZM5 20q7-5 14 0\"/><circle cx=\"7\" cy=\"4\" r=\"2\"/>",
  "spark": "<path d=\"M12 3q1 8 9 9-8 1-9 9-1-8-9-9 8-1 9-9Z\"/>",
  "nodes": "<circle cx=\"12\" cy=\"5\" r=\"3\"/><circle cx=\"5\" cy=\"18\" r=\"3\"/><circle cx=\"19\" cy=\"18\" r=\"3\"/><path d=\"m10 8-4 7m8-7 4 7M8 18h8\"/>",
  "settings": "<path d=\"M4 6h2m4 0h10M4 12h10m4 0h2M4 18h4m4 0h8\"/><circle cx=\"8\" cy=\"6\" r=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"2\"/><circle cx=\"10\" cy=\"18\" r=\"2\"/>",
  "shield": "<path d=\"M12 3 3 7v5q0 6 9 10 9-4 9-10V7l-9-4Zm-5 9 3 3 7-7\"/>",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v6M12 7v.1\"/>",
  "warning": "<path d=\"M10 4q2-3 4 0l8 15q1 2-2 2H4q-3 0-2-2l8-15ZM12 9v5m0 3v.1\"/>"
};
  const names=Object.freeze(Object.keys(paths));
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function svg(name, options={}) {
    if (!Object.prototype.hasOwnProperty.call(paths,name)) throw new TypeError('Unknown Muhit icon: '+name);
    const size=options.size ?? 24, stroke=options.stroke ?? 1.75;
    if (![16,20,24,32].includes(size)) throw new TypeError('Icon size must be 16, 20, 24 or 32');
    if (![1.5,1.75,2].includes(stroke)) throw new TypeError('Icon stroke must be 1.5, 1.75 or 2');
    if (options.dir!==undefined && !['ltr','rtl'].includes(options.dir)) throw new TypeError('Invalid icon direction');
    if (options.label!==undefined && (typeof options.label!=='string'||!options.label.trim())) throw new TypeError('Icon label must be nonempty text');
    const a11y=options.label ? 'role="img" aria-label="'+escape(options.label)+'"' : 'aria-hidden="true"';
    const body=options.dir==='rtl' && ["arrow-forward", "arrow-back", "chevron-forward"].includes(name) ? '<g transform="translate(24 0) scale(-1 1)">'+paths[name]+'</g>' : paths[name];
    return '<svg xmlns="http://www.w3.org/2000/svg" class="mh-symbol" data-icon="'+name+'" data-icon-direction="'+(options.dir||'auto')+'" viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="currentColor" stroke-width="'+stroke+'" stroke-linecap="round" stroke-linejoin="round" focusable="false" '+(options.stroke!==undefined?'data-icon-stroke="'+stroke+'" ':'')+a11y+'>'+body+'</svg>';
  }
  function mount(host,name,options={}) {
    const markup=svg(name,options);
    const element=typeof host==='string' ? document.querySelector(host) : host;
    if (!element?.ownerDocument) throw new TypeError('Icon host required');
    // Parse only our validated, generated SVG vocabulary; no HTML/Trusted Types sink.
    const doc=element.ownerDocument, stack=[];
    let node;
    for (const token of markup.matchAll(/<(\/?)([a-z]+)([^>]*?)(\/?)>/g)) {
      if (token[1]) { stack.pop(); continue; }
      const child=doc.createElementNS('http://www.w3.org/2000/svg',token[2]);
      for (const attr of token[3].matchAll(/([\w:-]+)="([^"]*)"/g)) {
        if (attr[1] !== 'aria-label') child.setAttribute(attr[1],attr[2]);
      }
      if (!node) { node=child; if(options.label) child.setAttribute('aria-label',options.label); }
      else stack[stack.length-1].append(child);
      if (!token[4]) stack.push(child);
    }
    element.append(node);
    return {element:node,destroy(){node.remove()}};
  }
  global.MuhitIcons=Object.freeze({names,svg,mount});
})(globalThis);
