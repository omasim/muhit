// Generated; edit src/icons.js.
export function createIconSet(paths){
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
return Object.freeze({names,svg,mount});
}
