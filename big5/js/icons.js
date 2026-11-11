/* Original dock, meter, food, and tool icons. Same ink and chunky stroke as the pet. */
(function (B) {
  'use strict';

  const INK = '#3A271C';

  function svg(body) {
    return '<svg viewBox="0 0 64 64" aria-hidden="true">' + body + '</svg>';
  }

  function strokeIcon(body) {
    return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  const foods = {
    wors: svg(
      '<ellipse cx="32" cy="42" rx="20" ry="9" fill="#E7C49A" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M16 36c4-8 8 6 12 0s8 8 12 0 6-6 8 0" stroke="#8A4030" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<path d="M18 34c3-5 6 4 9 0" stroke="#C46A45" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    ),
    biltong: svg(
      '<path d="M22 16c2 10 1 22 4 32" stroke="#6B3A28" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M32 14c1 12-1 20 2 34" stroke="#8A4E32" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M40 18c2 8 0 18 3 28" stroke="#A86A40" stroke-width="6" fill="none" stroke-linecap="round"/>'
    ),
    milk: svg(
      '<ellipse cx="32" cy="46" rx="16" ry="6" fill="#E7C49A" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M18 42c1-14 6-18 14-18s13 4 14 18" fill="#FFF6E8" stroke="' + INK + '" stroke-width="3"/>' +
      '<ellipse cx="32" cy="28" rx="8" ry="3" fill="#F0E2C0"/>'
    ),
    broth: svg(
      '<ellipse cx="32" cy="46" rx="18" ry="6" fill="#C4894A" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M16 42c1-12 6-16 16-16s15 4 16 16" fill="#E7A05A" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M26 22c1-6 1-6 0-10M34 20c1-6 1-6 0-10" stroke="#C47A12" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    ),
    drum: svg(
      '<path d="M24 44c8-4 10-16 18-28" stroke="#E7C49A" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M24 44c8-4 10-16 18-28" stroke="' + INK + '" stroke-width="3" fill="none"/>' +
      '<ellipse cx="42" cy="16" rx="10" ry="8" fill="#E07A3C" stroke="' + INK + '" stroke-width="3"/>'
    ),
    egg: svg(
      '<ellipse cx="32" cy="36" rx="14" ry="18" fill="#FFF6E8" stroke="' + INK + '" stroke-width="3"/>' +
      '<ellipse cx="27" cy="30" rx="4" ry="6" fill="#fff" opacity=".7"/>'
    ),
    marula: svg(
      '<circle cx="32" cy="34" r="16" fill="#E2B33A" stroke="' + INK + '" stroke-width="3"/>' +
      '<ellipse cx="26" cy="28" rx="5" ry="3" fill="#FFE09A"/>' +
      '<path d="M32 18c2-6 8-4 8 0" stroke="#3E8F55" stroke-width="3" fill="none" stroke-linecap="round"/>'
    ),
    naartjie: svg(
      '<circle cx="32" cy="36" r="15" fill="#F09A2A" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M32 36l-8 6M32 36l8 5M32 36V22" stroke="#E07A18" stroke-width="2" fill="none"/>' +
      '<ellipse cx="40" cy="18" rx="6" ry="3.5" fill="#3E8F55" transform="rotate(-20 40 18)"/>'
    ),
    melon: svg(
      '<path d="M14 40c10-20 26-20 36 0" fill="#F2C56A" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M18 40c8-14 20-14 28 0" fill="#F07078"/>' +
      '<circle cx="28" cy="36" r="1.4" fill="#3A271C"/><circle cx="36" cy="35" r="1.4" fill="#3A271C"/>'
    ),
    leaves: svg(
      '<path d="M32 50V24" stroke="#2F6A38" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="22" cy="30" rx="10" ry="6" fill="#5AAA58" stroke="' + INK + '" stroke-width="3" transform="rotate(-30 22 30)"/>' +
      '<ellipse cx="42" cy="28" rx="10" ry="6" fill="#3E8F55" stroke="' + INK + '" stroke-width="3" transform="rotate(28 42 28)"/>' +
      '<ellipse cx="30" cy="18" rx="8" ry="5" fill="#6BBA62" stroke="' + INK + '" stroke-width="3" transform="rotate(-10 30 18)"/>'
    ),
    lucerne: svg(
      '<path d="M24 46c2-16 2-16 0-28M32 48c1-18 1-18 0-32M40 46c-1-14-1-14 1-26" stroke="#3E8F55" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="24" cy="20" rx="5" ry="3" fill="#6BBA62"/><ellipse cx="32" cy="16" rx="5" ry="3" fill="#4E9A52"/><ellipse cx="41" cy="22" rx="5" ry="3" fill="#5AAA58"/>'
    ),
    carrot: svg(
      '<path d="M32 16c8 10 10 22 0 34-10-12-8-24 0-34z" fill="#F09A2A" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M26 16c2-6 4-6 6-2M32 14c2-6 6-4 6 0" stroke="#3E8F55" stroke-width="3" fill="none" stroke-linecap="round"/>'
    ),
    grass: svg(
      '<path d="M18 46c2-16 6-18 4-28M28 48C30 30 34 28 32 16M40 46c0-14 6-16 4-26" stroke="#3E8F55" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M22 46h22" stroke="#6B4630" stroke-width="3" stroke-linecap="round"/>'
    ),
    mielie: svg(
      '<path d="M18 34c2 14 8 16 14 16s12-2 14-16c-8 4-20 4-28 0z" fill="#5AAA58"/>' +
      '<ellipse cx="32" cy="32" rx="12" ry="16" fill="#F2C431" stroke="' + INK + '" stroke-width="3"/>' +
      '<g fill="#FFE38A"><circle cx="27" cy="24" r="2"/><circle cx="33" cy="24" r="2"/><circle cx="30" cy="29" r="2"/><circle cx="36" cy="30" r="2"/><circle cx="28" cy="35" r="2"/><circle cx="34" cy="36" r="2"/></g>'
    ),
    salt: svg(
      '<rect x="18" y="22" width="28" height="22" rx="6" fill="#F4E6C8" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="26" cy="30" r="2" fill="#fff"/><circle cx="34" cy="34" r="2.2" fill="#fff"/><circle cx="38" cy="28" r="1.6" fill="#fff"/>'
    )
  };

  const tools = {
    soap: svg(
      '<rect x="16" y="26" width="32" height="18" rx="7" fill="#FFF6E8" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="24" cy="20" r="4" fill="#D5F3F4" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<circle cx="36" cy="18" r="3" fill="#D5F3F4" stroke="' + INK + '" stroke-width="2.4"/>'
    ),
    shower: svg(
      '<rect x="18" y="14" width="28" height="12" rx="6" fill="#D5E4E2" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M24 32v10M32 30v14M40 32v10" stroke="#2E9A90" stroke-width="3" stroke-linecap="round"/>'
    ),
    scoop: svg(
      '<path d="M18 48c6-2 10-12 12-20" stroke="#6B4630" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="40" cy="22" rx="12" ry="8" fill="#E7C49A" stroke="' + INK + '" stroke-width="3" transform="rotate(-18 40 22)"/>'
    )
  };

  const meters = {
    hunger: strokeIcon('<path d="M18 34c6-2 8-14 16-22"/><ellipse cx="34" cy="16" rx="8" ry="6"/><path d="M16 36c2 6 8 8 12 4"/>'),
    clean: strokeIcon('<path d="M24 10c6 8 12 14 12 22a12 12 0 0 1-24 0C12 24 18 18 24 10z"/>'),
    energy: strokeIcon('<path d="M18 28a10 10 0 1 0 14-9 8 8 0 1 1-14 9z"/><path d="M34 14l2 4 4 .4-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.4z"/>'),
    fun: strokeIcon('<circle cx="24" cy="24" r="12"/><path d="M18 24c1.2 3 4 5 6 5s4.8-2 6-5"/><circle cx="20" cy="22" r="1.2" fill="currentColor" stroke="none"/><circle cx="28" cy="22" r="1.2" fill="currentColor" stroke="none"/>')
  };

  const tabs = {
    kitchen: strokeIcon('<path d="M16 30h16"/><path d="M18 30c.6 8 3.4 12 8 12s7.4-4 8-12"/><path d="M20 22c.6 2 .6 2 0 4M24 20c.6 2.2.6 2.2 0 4M28 22c.6 2 .6 2 0 4"/>'),
    bath: strokeIcon('<path d="M10 26h28"/><path d="M14 26c0 8 4 12 10 12s10-4 10-12"/><path d="M18 16c4 2 8 2 12 0"/>'),
    boma: strokeIcon('<path d="M8 30h32v6H8z"/><path d="M12 30v-8h14v8"/><path d="M14 22h10"/><path d="M30 18a6 6 0 1 0 0 8 5 5 0 1 1 0-8z"/>'),
    play: strokeIcon('<ellipse cx="24" cy="28" rx="8" ry="6"/><circle cx="16" cy="16" r="3.2"/><circle cx="24" cy="13" r="3.2"/><circle cx="32" cy="16" r="3.2"/><circle cx="36" cy="23" r="2.6"/>'),
    shop: strokeIcon('<path d="M10 20h28l-2 6H12z"/><path d="M14 26v12h20V26"/><path d="M20 32h8"/>')
  };

  B.icons = { foods, tools, meters, tabs };
})(window.Big5 = window.Big5 || {});
