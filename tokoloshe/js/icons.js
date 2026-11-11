(function (T) {
  'use strict';

  function svg(body) {
    return '<svg viewBox="0 0 64 64" aria-hidden="true">' + body + '</svg>';
  }

  const foods = {
    vetkoek: svg(
      '<ellipse cx="32" cy="46" rx="16" ry="6" fill="#efd2a4"/>' +
      '<ellipse cx="32" cy="34" rx="18" ry="14" fill="#f0b429"/>' +
      '<ellipse cx="32" cy="32" rx="18" ry="13" fill="#f6c453"/>' +
      '<ellipse cx="25" cy="27" rx="6" ry="3.5" fill="#ffe7a3" opacity=".85"/>' +
      '<path d="M24 33c2 4 12 4 16-1" stroke="#e0942a" stroke-width="2" fill="none" stroke-linecap="round"/>'
    ),
    mielie: svg(
      '<path d="M18 30c2 16 8 22 14 22s12-6 14-22c-6 4-22 4-28 0z" fill="#7dae45"/>' +
      '<ellipse cx="32" cy="30" rx="12" ry="16" fill="#f2c431"/>' +
      '<g fill="#ffe38a">' +
      '<circle cx="27" cy="22" r="2"/><circle cx="33" cy="22" r="2"/><circle cx="30" cy="27" r="2"/>' +
      '<circle cx="36" cy="27" r="2"/><circle cx="28" cy="32" r="2"/><circle cx="34" cy="33" r="2"/>' +
      '<circle cx="31" cy="38" r="2"/>' +
      '</g>'
    ),
    wors: svg(
      '<ellipse cx="32" cy="40" rx="20" ry="10" fill="#e2b072"/>' +
      '<ellipse cx="32" cy="36" rx="20" ry="10" fill="#f0c48a"/>' +
      '<path d="M16 34c4-6 8 6 12 0s8 6 12 0 6-4 8 0" stroke="#8a4b2f" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M18 32c3-4 6 4 9 0" stroke="#c47a45" stroke-width="2" fill="none" stroke-linecap="round"/>'
    ),
    rusk: svg(
      '<rect x="16" y="24" width="32" height="20" rx="8" fill="#e6b36a"/>' +
      '<rect x="18" y="26" width="28" height="16" rx="6" fill="#f3d19a"/>' +
      '<path d="M22 30h20M22 35h20M22 40h20" stroke="#e0b36a" stroke-width="1.6" stroke-linecap="round"/>'
    ),
    koeksister: svg(
      '<path d="M16 40c6-14 10 10 16-2 6 12 10-12 16 2" stroke="#e07a1a" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M18 38c5-10 8 8 14-2 5 10 8-10 14 2" stroke="#f6a23a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="24" cy="30" rx="3" ry="1.5" fill="#fff1c9" opacity=".7"/>'
    ),
    pap: svg(
      '<ellipse cx="32" cy="44" rx="18" ry="6" fill="#d9a36a"/>' +
      '<path d="M16 40c1-8 6-12 16-12s15 4 16 12" fill="#f4efe6"/>' +
      '<path d="M20 36c2 6 22 6 24 0" fill="#e25b3a"/>' +
      '<circle cx="28" cy="34" r="1.4" fill="#f3c431"/><circle cx="36" cy="35" r="1.2" fill="#6aaa3a"/>'
    ),
    orange: svg(
      '<circle cx="32" cy="34" r="14" fill="#f28c28"/>' +
      '<ellipse cx="26" cy="28" rx="4" ry="2.5" fill="#ffd19a" opacity=".7"/>' +
      '<path d="M32 20c2-6 8-6 8-2" stroke="#3e8a45" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="38" cy="16" rx="5" ry="3" fill="#4aaa55" transform="rotate(-20 38 16)"/>'
    )
  };

  const tools = {
    soap: svg(
      '<rect x="16" y="26" width="32" height="18" rx="6" fill="#f7f3ea" stroke="#e2d3bf" stroke-width="2"/>' +
      '<circle cx="24" cy="22" r="3" fill="#d7f3f8"/><circle cx="32" cy="18" r="2.2" fill="#d7f3f8"/>' +
      '<circle cx="40" cy="22" r="2.4" fill="#c5ebf2"/>'
    ),
    shower: svg(
      '<path d="M22 14h20" stroke="#8aa0a8" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="20" y="16" width="24" height="10" rx="4" fill="#d5dee2"/>' +
      '<path d="M26 32v8M32 30v12M38 32v8" stroke="#7ec8e3" stroke-width="2.4" stroke-linecap="round"/>'
    ),
    scoop: svg(
      '<path d="M18 44c8-2 12-10 14-18" stroke="#8a5a3a" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="40" cy="24" rx="12" ry="8" fill="#c4b8a4" transform="rotate(-20 40 24)"/>' +
      '<ellipse cx="40" cy="24" rx="8" ry="5" fill="#ded4c4" transform="rotate(-20 40 24)"/>'
    )
  };

  const items = {
    bucket: svg('<ellipse cx="32" cy="40" rx="22" ry="7" fill="#d2b48a"/><ellipse cx="32" cy="30" rx="14" ry="12" fill="#e2c79a"/><ellipse cx="26" cy="26" rx="5" ry="3" fill="#fff" opacity=".35"/>'),
    beanie: svg('<ellipse cx="32" cy="36" rx="16" ry="14" fill="#c4543c"/><circle cx="32" cy="18" r="6" fill="#c4543c"/><rect x="16" y="40" width="32" height="6" rx="3" fill="#a84330"/>'),
    visor: svg('<path d="M14 34c6-8 30-8 36 0" stroke="#2f6d4f" stroke-width="4" fill="none"/><ellipse cx="32" cy="36" rx="20" ry="7" fill="#2f6d4f"/>'),
    jersey: svg('<path d="M16 24l8-6h16l8 6-4 8v20H20V32z" fill="#2a6f7f"/><path d="M20 36h24M20 44h24" stroke="#f4efe6" stroke-width="3"/><path d="M28 18l4 8 4-8" fill="#f4efe6"/>'),
    safari: svg('<path d="M18 22h28v28H18z" fill="#cbb892"/><rect x="22" y="32" width="8" height="8" rx="1" fill="#b7a57a"/><rect x="34" y="32" width="8" height="8" rx="1" fill="#b7a57a"/><circle cx="32" cy="28" r="1.4" fill="#6b5438"/><circle cx="32" cy="36" r="1.4" fill="#6b5438"/>'),
    apron: svg('<path d="M24 16l-4 8M40 16l4 8" stroke="#e07a3d" stroke-width="3"/><rect x="20" y="24" width="24" height="26" rx="6" fill="#e07a3d"/><rect x="26" y="34" width="12" height="8" rx="2" fill="#c9652f"/><rect x="20" y="44" width="24" height="4" fill="#f4efe6"/>'),
    vellies: svg('<ellipse cx="24" cy="40" rx="10" ry="8" fill="#8a5a3a"/><ellipse cx="42" cy="40" rx="10" ry="8" fill="#8a5a3a"/><rect x="16" y="28" width="14" height="12" rx="4" fill="#a56b45"/><rect x="36" y="28" width="14" height="12" rx="4" fill="#a56b45"/>'),
    takkies: svg('<ellipse cx="24" cy="42" rx="12" ry="7" fill="#f7f4ef"/><ellipse cx="44" cy="42" rx="12" ry="7" fill="#f7f4ef"/><path d="M14 40h18M34 40h18" stroke="#2a6f7f" stroke-width="3"/><rect x="28" y="30" width="6" height="8" rx="2" fill="#d4652f"/><rect x="46" y="30" width="6" height="8" rx="2" fill="#d4652f"/>'),
    shades: svg('<circle cx="22" cy="32" r="10" fill="#243038"/><circle cx="42" cy="32" r="10" fill="#243038"/><path d="M32 32h0" stroke="#e6b341" stroke-width="3"/><path d="M12 32h2M50 32h2" stroke="#e6b341" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="28" r="2" fill="#fff" opacity=".4"/>'),
    beads: svg('<path d="M12 36c8 10 32 10 40 0" stroke="#e6d2c0" stroke-width="2" fill="none"/><circle cx="18" cy="34" r="4" fill="#e07a3d"/><circle cx="28" cy="40" r="4" fill="#2a6f7f"/><circle cx="38" cy="40" r="4" fill="#e6b341"/><circle cx="48" cy="34" r="4" fill="#f4efe6" stroke="#e2d3bf"/>'),
    pebble: svg('<path d="M24 22c8 8 8 8 16 0" stroke="#8a7568" stroke-width="2" fill="none"/><ellipse cx="32" cy="38" rx="12" ry="10" fill="#9aabb3"/><ellipse cx="27" cy="34" rx="4" ry="2" fill="#fff" opacity=".55"/>'),
    doek: svg('<path d="M14 36c4-16 32-16 36 0" fill="#d4652f"/><path d="M16 36h32" stroke="#f4efe6" stroke-width="4"/><path d="M34 28c8-6 12 2 8 8" fill="#2a6f7f"/>'),
    scarf: svg('<path d="M18 28h28v8H18z" fill="#1f6b3a"/><path d="M18 32h28" stroke="#e6b341" stroke-width="3"/><path d="M34 36h8v16h-8z" fill="#1f6b3a"/>'),
    vuvu: svg('<path d="M20 44c8-6 16-20 18-28" stroke="#f0c14a" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="40" cy="16" r="6" fill="#f0c14a"/>')
  };

  function tab(path) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
  }

  const tabs = {
    kitchen: tab('<path d="M4 10h16"/><path d="M6 10c.4 5 2.6 8 6 8s5.6-3 6-8"/><path d="M9 6c.4 1 .4 1 0 2M12 5c.4 1.2.4 1.2 0 2.2M15 6c.4 1 .4 1 0 2"/>'),
    bath: tab('<path d="M4 11h16"/><path d="M6 11v1.5C6 16 8.2 18 12 18s6-2 6-5.5V11"/><circle cx="8" cy="8" r=".8" fill="currentColor"/><circle cx="12" cy="7" r=".8" fill="currentColor"/>'),
    stoep: tab('<path d="M3 15h18v3H3z"/><path d="M5 15V10h7v5"/><path d="M6 20h2M16 20h2"/>'),
    shop: tab('<path d="M9 7a3 3 0 0 1 6 0c0 1.6-1.4 2-3 3.2C10.4 9 9 8.6 9 7z"/><path d="M4 19l8-7 8 7"/>'),
    play: tab('<rect x="3" y="5" width="18" height="14" rx="4"/><path d="M10 9l6 3-6 3z" fill="currentColor" stroke="none"/>')
  };

  T.icons = { foods, tools, items, tabs };
})(window.Toko = window.Toko || {});
