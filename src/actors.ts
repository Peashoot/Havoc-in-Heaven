import type { FilmState } from './timeline';

function soldierSvg(index: number): string {
  return `<g class="soldier" data-index="${index}">
    <path d="M-26 0 2-5 11-58-15-75Z M7-1l27-3-8-70-23 8Z" fill="#0a141c" stroke="#8c7855" stroke-width="3"/>
    <path d="M-32-68q6-58 31-63 34 2 42 63l-20 42h-37Z" fill="#18242a" stroke="#98764c" stroke-width="4"/>
    <path d="M-24-110h49 M-18-95h37 M-14-80h29" stroke="#aa8553" stroke-width="3" opacity=".6"/>
    <path d="M-10-130q-36 6-43 44l15 7 22-36 M21-128q31 7 42 46l-15 9-27-37" fill="#152028" stroke="#846947" stroke-width="4"/>
    <path d="M-28-166q0-30 29-38 29 9 27 38l-7 23h-39Z" fill="#101b24" stroke="#b1955d" stroke-width="4"/>
    <path d="M-27-169q28-17 55 0M-31-161h62" fill="none" stroke="#c4a269" stroke-width="5"/>
    <path d="M-7-202-1-229 8-202" fill="#b3935c"/><path d="M-25-147h49" stroke="#d1b481" stroke-width="3"/>
    <path d="M45-93 84-274" stroke="#d8c8a5" stroke-width="6"/><path d="M84-274l-9 27 15 3Z" fill="#d8bb80"/>
    <path d="M40-100q21-18 28-11" fill="none" stroke="#a58a5d" stroke-width="8"/>
  </g>`;
}

export function actorsSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" aria-hidden="true">
    <defs>
      <linearGradient id="cape" x2="1" y2="1"><stop stop-color="#8a251f"/><stop offset=".4" stop-color="#4e1014"/><stop offset="1" stop-color="#1a1017"/></linearGradient>
      <linearGradient id="staff" x2="0" y2="1"><stop stop-color="#f7d487"/><stop offset=".2" stop-color="#86602b"/><stop offset=".52" stop-color="#f6c872"/><stop offset=".8" stop-color="#725027"/><stop offset="1" stop-color="#e5bd77"/></linearGradient>
      <filter id="eyeGlow"><feGaussianBlur stdDeviation="8"/></filter>
    </defs>
    <g id="soldier-ranks">${Array.from({ length: 30 }, (_, i) => soldierSvg(i)).join('')}</g>
    <g id="hero">
      <g id="cape-shape">
        <path d="M-27-205Q-102-245-206-183Q-163-133-224-85Q-122-99-104-50Q-74-109-32-124Z" fill="url(#cape)" stroke="#9b3930" stroke-width="5"/>
        <path d="M-36-193Q-113-194-182-153M-40-176Q-106-118-185-101" fill="none" stroke="#bd4a36" stroke-width="3" opacity=".52"/>
      </g>
      <path d="M-40-116-69-15l-17 15h65l24-93 M16-111l17 95 48 16H14L-4-90" fill="#070b10" stroke="#95734c" stroke-width="5"/>
      <path d="M-38-20q-22 10-51 9L-96 0h73 M33-21q23 11 49 10L90 0H18" fill="#0a0e12" stroke="#9a7950" stroke-width="4"/>
      <path d="M-51-211Q-68-178-54-130l25 40h53l27-43q10-58-19-82Z" fill="#080d12" stroke="#a2834e" stroke-width="5"/>
      <path d="M-29-187q30 9 57 0M-35-162q34 13 70 0M-22-135h44" stroke="#b99054" stroke-width="5"/>
      <path d="M-47-195q-40 18-48 77l18 17 37-49M37-196q47 16 60 68l-17 20-43-42" fill="#0a0d12" stroke="#aa8451" stroke-width="5"/>
      <path d="M-57-221q-18-38 1-79 15-32 55-38 46 5 59 46 9 31-5 66l-28 30h-51Z" fill="#070b10" stroke="#a88550" stroke-width="5"/>
      <path d="M-52-282q-33-31-13-57 12 31 41 19M33-320q17-42 46-37-16 34-30 48" fill="#090d11" stroke="#bd985f" stroke-width="5"/>
      <path d="M-57-289q59-31 113 0M-58-265q58-20 115 0" fill="none" stroke="#c49b5b" stroke-width="7"/>
      <path d="M-42-299q-12-31 9-53M40-300q21-32 5-51M0-316v-54" fill="none" stroke="#d1ad6e" stroke-width="7" stroke-linecap="round"/>
      <path d="M-26-235q24 8 49 0" fill="none" stroke="#c08b4a" stroke-width="3"/>
      <g id="eyes"><path d="M-35-263l20 4-17 5ZM13-259l21-4-3 9Z" fill="#ffd884" filter="url(#eyeGlow)"/><path d="M-35-263l20 4-17 5ZM13-259l21-4-3 9Z" fill="#ffdb81"/></g>
      <path d="M-42-112q-45 47-25 90-7-46-39-56" fill="none" stroke="#161017" stroke-width="16" stroke-linecap="round"/>
      <g id="hero-staff">
        <rect x="-12" y="-492" width="24" height="680" rx="11" fill="url(#staff)" stroke="#6c4822" stroke-width="3"/>
        <rect x="-15" y="-486" width="30" height="35" rx="5" fill="#d5a756"/>
        <rect x="-15" y="150" width="30" height="32" rx="5" fill="#d5a756"/>
        <path d="M-11-444h22M-11-427h22M-11 112h22M-11 130h22" stroke="#572f19" stroke-width="4"/>
      </g>
      <g id="hero-whip"><path d="M69-116q90-94 167-31t-52 139" fill="none" stroke="#a69b87" stroke-width="6" stroke-linecap="round"/><path d="M62-129 77-96" stroke="#5e4635" stroke-width="13" stroke-linecap="round"/></g>
    </g>
    <g id="kneeling-hero" transform="translate(960 887) scale(.8)">
      <path d="M-29-123q-102 18-163 115 84-37 137-12Z" fill="url(#cape)" stroke="#8a3b38" stroke-width="5"/>
      <path d="M-36-98q-26 36-18 71l-86 22h94l48-40 41 40h90l-99-30-1-63Z" fill="#090d12" stroke="#a08358" stroke-width="7"/>
      <path d="M-36-141q-30 21-18 68l31 31h55l31-49-17-54Z" fill="#090d12" stroke="#947b58" stroke-width="6"/>
      <path d="M-42-172q-8-51 44-64 46 11 43 62l-23 39h-44Z" fill="#080b10" stroke="#ad9162" stroke-width="6"/>
      <path d="M-55-198q56-24 109 0M-50-178q49-14 100 0M0-231v-33" fill="none" stroke="#c4a66b" stroke-width="7"/>
      <path d="M-55-87q-48 7-83-12M44-89q43 5 96-6" stroke="#87929b" stroke-width="17" fill="none"/>
      <path d="M-23-150l15 2M11-149l15-2" stroke="#b79859" stroke-width="4"/>
    </g>
  </svg>`;
}

export function updateActors(state: FilmState, root: HTMLElement) {
  const hero = root.querySelector<SVGGElement>('#hero')!;
  const cape = root.querySelector<SVGGElement>('#cape-shape')!;
  const staff = root.querySelector<SVGGElement>('#hero-staff')!;
  const whip = root.querySelector<SVGGElement>('#hero-whip')!;
  const eyes = root.querySelector<SVGGElement>('#eyes')!;
  const kneeling = root.querySelector<SVGGElement>('#kneeling-hero')!;
  root.style.filter = state.palette === 'punishment' || state.palette === 'black'
    ? 'grayscale(.82) brightness(.68)'
    : state.palette === 'faded' ? 'grayscale(.62) brightness(.75)' : 'none';
  cape.style.opacity = String(state.palette === 'storm' ? 0.27 : state.palette === 'banquet' ? 0.55 : 1);
  const centered = [14, 15, 16, 17, 18, 19, 21, 22].includes(state.scene);
  const heroX = state.scene === 2 ? 610 + state.raftX * 250 : centered ? 960 : state.heroX;
  const heroY = state.scene === 2 ? 793 : state.scene === 18 ? 1040 : state.heroY;
  const heroScale = state.scene === 18 ? state.heroScale * 1.48 : state.heroScale;
  const hideForInsert = state.scene === 8 && state.progress > 0.45 && state.progress < 0.83;
  const vanish = state.scene === 3 && state.progress > 0.77 && state.progress < 0.81;
  hero.style.opacity = state.scene === 1 || state.scene === 14 || hideForInsert || vanish ? '0' : String(Math.min(1, Math.max(0, heroScale)));
  kneeling.style.opacity = state.scene === 14 ? '1' : '0';
  const heightScale = state.scene === 14 ? heroScale * 0.62 : heroScale;
  hero.setAttribute('transform', `translate(${heroX} ${heroY}) rotate(${state.heroRotation}) scale(${heroScale} ${heightScale})`);
  cape.setAttribute('transform', `rotate(${state.capeAngle} -25 -190)`);
  staff.setAttribute('transform', `translate(70 -155) rotate(${state.staffAngle})`);
  staff.style.opacity = String(state.staffVisible);
  whip.style.opacity = state.scene === 6 ? '1' : '0';
  staff.style.filter = `drop-shadow(0 0 ${3 + state.staffGlow * 21}px rgba(249,187,78,${0.3 + state.staffGlow * 0.6}))`;
  eyes.style.opacity = String(state.eyeGlow);
  eyes.style.filter = `drop-shadow(0 0 ${state.eyeGlow * 21}px #ffc764)`;

  const soldiers = root.querySelectorAll<SVGGElement>('.soldier');
  soldiers.forEach((element, index) => {
    const side = index < 15 ? -1 : 1;
    const local = index % 15;
    const row = Math.floor(local / 5);
    const col = local % 5;
    const targetX = side < 0 ? 70 + col * 102 + row * 24 : 1840 - col * 103 - row * 23;
    const targetY = 744 + row * 75 + (col % 2) * 15;
    const scale = 0.56 + row * 0.17;
    const stagger = Math.min(1, Math.max(0, (state.soldierReveal * 1.35 - row * 0.12 - col * 0.055)));
    const enterX = side * 370 * (1 - stagger);
    const scatter = state.soldierScatter;
    const flyX = side * (150 + (4 - col) * 60 + row * 40) * scatter;
    const flyY = (210 + (index * 73) % 200) * Math.sin(scatter * Math.PI * 0.9);
    const rotate = side * (50 + (index * 19) % 85) * scatter;
    element.style.opacity = String(Math.max(0, Math.min(1, stagger * (1 - scatter * 0.42))));
    element.setAttribute('transform', `translate(${targetX + enterX + flyX} ${targetY - flyY}) rotate(${rotate}) scale(${scale})`);
  });
}
