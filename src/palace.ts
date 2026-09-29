const columns = (start: number, end: number, y: number, height: number, count: number, width = 13) =>
  Array.from({ length: count }, (_, i) => {
    const x = start + ((end - start) * i) / (count - 1);
    return `<rect x="${x - width / 2}" y="${y}" width="${width}" height="${height}" fill="url(#pillar)"/><path d="M${x - 11} ${y + height}h22" stroke="#a7864b" stroke-width="3"/>`;
  }).join('');

function roof(cx: number, y: number, width: number, height: number, depth: number, ornate = false): string {
  const left = cx - width / 2;
  const right = cx + width / 2;
  return `<g>
    <path d="M${left - 38} ${y + height + 13} Q${left - 8} ${y + height + 12} ${left + 4} ${y + height - 6} Q${cx} ${y - depth} ${right - 4} ${y + height - 6} Q${right + 8} ${y + height + 12} ${right + 38} ${y + height + 13} Q${right + 15} ${y + height + 28} ${right - 8} ${y + height + 15} L${left + 8} ${y + height + 15} Q${left - 15} ${y + height + 28} ${left - 38} ${y + height + 13}Z" fill="url(#roof)" stroke="#ad8241" stroke-width="4"/>
    <path d="M${left - 31} ${y + height + 10} Q${cx} ${y - depth + 11} ${right + 31} ${y + height + 10}" fill="none" stroke="#d6ad63" stroke-width="3" opacity=".78"/>
    <path d="M${left - 17} ${y + height + 16} Q${cx} ${y - depth + 31} ${right + 17} ${y + height + 16}" fill="none" stroke="#614c36" stroke-width="11" opacity=".74"/>
    <path d="M${left - 45} ${y + height + 11}q-15 -3 -21 -17 M${right + 45} ${y + height + 11}q15 -3 21 -17" fill="none" stroke="#c99c55" stroke-width="5" stroke-linecap="round"/>
    ${ornate ? `<path d="M${cx} ${y - depth + 20}v-29m-11 13q11-20 22 0" fill="none" stroke="#d7b46e" stroke-width="5"/><circle cx="${cx}" cy="${y - depth - 17}" r="5" fill="#f0c981"/>` : ''}
  </g>`;
}

function sideHall(cx: number, y: number, scale: number): string {
  return `<g transform="translate(${cx} ${y}) scale(${scale})">
    <rect x="-180" y="72" width="360" height="107" fill="url(#wall)" stroke="#876c48" stroke-width="3"/>
    <rect x="-194" y="176" width="388" height="20" fill="#817258"/>
    <rect x="-210" y="194" width="420" height="19" fill="#45434a"/>
    ${columns(-150, 150, 88, 87, 7, 11)}
    <rect x="-180" y="76" width="360" height="11" fill="#b59055"/>
    ${roof(0, 0, 365, 78, 20)}
    <rect x="-115" y="-62" width="230" height="66" fill="url(#wall)"/>
    ${columns(-88, 88, -45, 48, 5, 9)}
    ${roof(0, -128, 240, 65, 18)}
  </g>`;
}

export function palaceSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" aria-hidden="true">
    <defs>
      <linearGradient id="roof" x2="0" y2="1"><stop stop-color="#bd9252"/><stop offset=".2" stop-color="#514638"/><stop offset=".58" stop-color="#1a2530"/><stop offset="1" stop-color="#0a1119"/></linearGradient>
      <linearGradient id="wall" x2="0" y2="1"><stop stop-color="#786948"/><stop offset=".46" stop-color="#353944"/><stop offset="1" stop-color="#151d28"/></linearGradient>
      <linearGradient id="pillar" x2="1" y2="0"><stop stop-color="#1a252d"/><stop offset=".44" stop-color="#bb8e4a"/><stop offset=".72" stop-color="#6e5636"/><stop offset="1" stop-color="#1a232d"/></linearGradient>
      <radialGradient id="halo"><stop stop-color="#d6a35f" stop-opacity=".55"/><stop offset=".48" stop-color="#9a7040" stop-opacity=".14"/><stop offset="1" stop-color="#9a7040" stop-opacity="0"/></radialGradient>
      <linearGradient id="stairs" x2="0" y2="1"><stop stop-color="#aa9774"/><stop offset=".42" stop-color="#4f5255"/><stop offset="1" stop-color="#1a2730"/></linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="20"/></filter>
    </defs>
    <ellipse cx="1004" cy="397" rx="560" ry="380" fill="url(#halo)"/>
    <g id="far-mountains" fill="#202b33" opacity=".64">
      <path d="M0 638 140 569 233 605 390 513 517 575 642 527 729 611 890 558 1065 638v260H0Z"/>
      <path d="M1000 642 1187 551 1300 608 1445 505 1552 558 1692 512 1920 650v250h-920Z"/>
    </g>
    <g id="architecture" transform="translate(20 38)">
      <path d="M327 782h1280l98 111H229Z" fill="#2a3035" stroke="#9f8a62" stroke-width="5"/>
      <path d="M356 752h1224v43H356Z" fill="#80745e" stroke="#c1a77b" stroke-width="4"/>
      ${sideHall(375, 512, 0.79)}
      ${sideHall(1545, 512, 0.79)}
      <g opacity=".78">${sideHall(167, 598, 0.57)}${sideHall(1753, 598, 0.57)}</g>
      <rect x="592" y="546" width="736" height="218" fill="url(#wall)" stroke="#b59762" stroke-width="5"/>
      <rect x="574" y="746" width="772" height="27" fill="#a99369"/>
      <rect x="550" y="770" width="820" height="23" fill="#494950"/>
      ${columns(630, 1290, 566, 182, 13, 19)}
      <path d="M601 568h719" stroke="#d0aa68" stroke-width="10"/>
      <path d="M612 611h696" stroke="#3d3938" stroke-width="18"/>
      <path d="M697 747V638h526v109" fill="#151d26" stroke="#866a44" stroke-width="5"/>
      ${columns(738, 1182, 643, 99, 9, 8)}
      <rect x="853" y="646" width="214" height="101" fill="#101921" stroke="#b1905b" stroke-width="7"/>
      <path d="M960 648v99" stroke="#b1905b" stroke-width="6"/>
      ${roof(960, 365, 770, 167, 67)}
      <rect x="690" y="348" width="540" height="80" fill="url(#wall)" stroke="#96794c" stroke-width="4"/>
      ${columns(721, 1199, 360, 65, 11, 12)}
      <path d="M715 360h490" stroke="#c2a06a" stroke-width="8"/>
      ${roof(960, 221, 555, 137, 48, true)}
      <rect x="810" y="214" width="300" height="49" fill="url(#wall)"/>
      ${columns(838, 1082, 223, 36, 7, 8)}
      ${roof(960, 130, 335, 84, 28)}
      <path d="M395 796h1130" stroke="#d5b787" stroke-width="3" opacity=".65"/>
      <path d="M808 793h304l165 289H643Z" fill="url(#stairs)" stroke="#c7ae83" stroke-width="6"/>
      <path d="M777 844h365M742 900h436M708 958h504M674 1023h572" stroke="#c7b18b" stroke-width="8" opacity=".55"/>
      <path d="M808 793 643 1082M1112 793l165 289" stroke="#e1c393" stroke-width="7"/>
    </g>
  </svg>`;
}
