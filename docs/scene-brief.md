# Scene builder brief — 《大闹天宫》

You are building one or more scenes of a 105 s, 1920×1080, 30 fps animated short about Sun Wukong
(1961 Shanghai Animation Film Studio design language, rendered as anime-style cut-out animation).
The owner rejected earlier versions because they looked like **PPT / clip-art**: flat, static, unreadable,
linear motion. The goal now is **anime-style motion graphics**: recognisable story beats, deep layered
space, a camera that is always alive, and motion with anticipation, overshoot and follow-through.

## Files

- You own ONLY the scene files you were assigned: `src/scenes/sNN.ts`. You may add private helper files
  named `src/scenes/sNN-*.ts`. **Do not edit any other file** (engine, rig, kit, other scenes, index).
  If you need a new drawing helper, write it inside your own file.
- Do **not** `git commit` (the coordinator commits). Do not run `npm run build` / `export-frames` (they
  write `dist/` and race with other builders).
- Read these first — they are the reference implementations and the API:
  - `src/scenes/s01.ts` (landscape / camera / parallax), `src/scenes/s12.ts` (hero action, fx, crowd physics)
  - `src/engine/scene.ts` (SceneDef, planes, Dom, View), `src/engine/ease.ts` (easing, tracks, noise, shake)
  - `src/rig/hero.ts` + `src/rig/poses.ts` (Wukong rig, pose library, `poseTrack`, `walk`)
  - `src/scenes/kit.ts` (clouds, sea, karst, ridge, pine, hall, pagoda, palaceComplex, heavenGate, column,
    stairs, soldier, immortal, monkey, rays, orb, haze…), `src/scenes/fxkit.ts` (staffSmear, speedLines,
    streaks, shockRing, sparks, motes, whiteFrame)
  - `src/timeline.ts` (scene bounds, transitions)

## Scene contract (see `SceneDef` in src/engine/scene.ts)

```ts
const scene: SceneDef = {
  id: N, bg: '#hex',                 // bg painted behind the SVG
  markup: () => plane(0, …) + plane(0.3, …) + plane(1, … heroMarkup('wukong','king') …) + plane(1.6, …),
  camera: (t) => ({ x, y, zoom, rot }),   // scene coords; {960,540,1} shows the authored 1920x1080 frame
  heroes: (t) => [{ name: 'wukong', costume: 'king', pose: poseTrack(KEYS, t.lf) }],
  update: (d, t) => { d.tf('.sN-thing', `translate(…)`); d.op('.sN-glow', v); },
  fx: (ctx, t, view) => { view.apply(ctx, 0.8); …canvas drawing… },
  shake: (t) => shake(t.lf, HIT, 30, 10),
};
export default scene;
```

- `t.lf` = local frame (0 = scene start), `t.p` = 0..1 progress, `t.dur` = length. During the transitions
  at both ends your scene is also rendered with `lf` slightly **negative** or **> dur** (up to 15 frames).
  Everything must still look right there: keep the camera drifting (don't freeze), clamp events.
- **Deterministic**: output must be a pure function of `t`. No `Math.random`, `Date`, or state kept
  between calls. Use `rand(n)` / `noise(x)` from ease.ts.
- All ids you define in markup (gradients, filters, clipPaths) must be prefixed `sN-` (two scenes are
  mounted at once). CSS classes you animate should be prefixed `sN-` too.
- Never overwrite the `transform` attribute of a kit element that already has one (kit soldiers, monkeys,
  immortals, pines carry their own transform). Wrap them: `<g class="s11-row-3">${soldier(…)}</g>` and
  animate the wrapper. (This bug already cost one iteration in s12.)
- Hero: `heroMarkup(name, costume)` inside a plane, pose with `poseTrack([[lf, pose, ease], …], t.lf)`.
  Pose fields: `x, y` = feet position in plane coords, `s` scale (1 ≈ 415 px tall), `face` ±1,
  angles in degrees for `lean, torso, head, uaF/faF` (front arm), `uaB/faB`, `thF/shF/fF`, `thB/shB/fB`,
  `staff` 0..1 visibility, `staffA` direction of the staff head (0 forward, -90 up, 90 down),
  `grip`, `twoHand` (rear hand IK onto staff), `staffGlow`, `plant` (snap feet to y), `dy`,
  face: `mouth` (-1 frown..1 grin), `brow` (0 calm..1 fierce), `lid` (1 closed), `glow` (golden eyes), `look`.
  `wind` pushes cape/plumes. Cape, scarf and pheasant plumes follow through automatically from motion.
  Start from the pose library `P.*` and override fields; use `at(pose, x, y, s, face)`.
  Costumes: `pilgrim` (scenes 2–3), `king` (4, 10), `bima` (5–6), `sage` (7–9, 11–13, 19–22), `furnace` (14–18).

## Quality bar (what "done" means)

1. **Readable story**: a stranger must understand the beat from any single frame (who, where, what).
   Use Chinese mythological props and architecture from the kit; draw extra characters you need
   (菩提祖师, 太白金星, 七仙女, 太上老君, 玉帝, 天马, 猴群…) as proper ink-outlined cel shapes.
2. **Depth**: at least 4 planes — sky (z 0), far (≈0.15–0.35), mid (≈0.5–0.8), subject (1), and a
   **foreground occluder** (z ≥ 1.4: rocks, branches, clouds, columns, curtain edges) that crosses the frame
   edge. Far planes: lighter, hazier, lower contrast (`haze()`), near planes darker/saturated.
3. **Camera is never static**: always a push, pull, pan, crane or drift (plus `noise` handheld sway).
   Big moments get a zoom punch with `outExpo` + `outBack` settle, and `shake`.
4. **Motion quality**: no linear tweens. Big actions = anticipation (`inBack` or a pose that pulls back)
   → fast action (`outExpo`) → overshoot/settle (`outBack`/`outSpring`). Secondary motion: things
   sway, drift, flicker (flags, water, flames, hair).
5. **Composition**: subject on thirds / leading lines, clear silhouette against background, nothing
   important under the 58 px letterbox bars at top/bottom.
6. **Colour story** (the film's arc — freedom = colour): 1–4 jade/gold dawn, saturated; 5–7 cold gold,
   getting greyer; 8–9 dim warm banquet with red; 10 warm sunset; 11–13 storm dark blue-black with gold
   accents; 14–16 near-monochrome grey-blue / black; 17 fire red→orange→gold→cyan→violet; 18 gold;
   19–22 full rainbow release, 22 ends in black + gold title.

## Verification loop (mandatory)

Render and LOOK at your frames after every meaningful change:

```bash
node scripts/snap.mjs 1545 1575 1600 1612 1640 --out frames/sNN --sheet sNN --cols 3
# then Read frames/sNN/sNN.jpg (contact sheet) or single frames frames/sNN/f-*.png
```

Use global frame numbers. Check each rendered frame honestly against the quality bar: is it readable?
Deep? Is the subject clear? Does anything look like clip-art, a placeholder rectangle, a hard seam, or
floating/misaligned geometry? Fix and re-render. Expect 4–8 iterations per scene; do not stop at "it
renders". Also render the frames around your scene's start and end boundaries to see the transitions
(they blend with the neighbouring scene, which may still be a placeholder card — that's fine).
Keep each snap call to ≤ 10 frames (other builders share the CPU).
Finally run `npx tsc --noEmit` and `npm test` — both must pass.

## Report

Reply with: what each scene shows beat by beat, the contact sheet path of your final render,
and an honest list of remaining weaknesses. Do not claim anything you did not see in a render.

## Storyboard

Frames are global. Transitions blend over `len` frames centred on each boundary.

| # | frames | beat | transition out |
|---|---|---|---|
| 1 | 0–149 | 云海天宫 (done) | cloud wall, 30f |
| 2 | 150–269 | **漂洋过海** Wukong (pilgrim) punts a bamboo raft across the sea, tracking shot left→right: Huaguo shore behind him → open sea → storm (rain, lightning, raft pitching on big curling waves) → calm night → dawn with a misty mountain and stone steps rising ahead. Camera trucks alongside; waves in 3–4 parallax layers; foreground wave crests/spray. | dissolve 26f (sea spray → mountain mist) |
| 3 | 270–419 | **三星洞求道** Mountain gate 斜月三星洞 in mist, bamboo, pines. Wukong climbs stone steps, kneels and bows to 菩提祖师 (old master seated on a dais, white beard, whisk); quick montage of learning (bamboo scrolls, hand seal, still leaves); then he leaps onto a 筋斗云 somersault cloud and shoots off screen right. | whip pan 18f (camera pans right) |
| 4 | 420–539 | **花果山·自由** Huaguo Mountain: jade karst pinnacles, the 水帘洞 waterfall, peach trees, monkeys leaping. Wukong (king) lands on the summit rock, summons the 如意金箍棒 (staff grows from tiny to full with glow), twirls it and strikes a heroic pose; brightest, most saturated colours of the film; monkeys cheer. | flash 20f (staff glint → decree light) |
| 5 | 540–689 | **天庭诏安** A golden imperial decree scroll descends on a cloud carried by 太白金星 (old immortal, white beard); the scroll unrolls in light; reveal 南天门 (heavenGate) and white jade stairs; Wukong (bima) walks up the stairs, small against the gate (low-angle, looking up). Cold gold, pale blue. | dissolve 22f |
| 6 | 690–839 | **弼马温** Heavenly stables: celestial horses gallop across clouds; Wukong (bima, with whip — draw a whip prop) runs among them happily; camera pulls out to reveal lofty palace terraces above where officials look down — Wukong becomes tiny, their shadow falls over him. Colour drains toward grey-gold. | dissolve 24f |
| 7 | 840–989 | **门外** A long cold corridor of columns in strong one-point perspective; Wukong walks alone toward huge red doors; a warm gold line of light through the gap; the doors open to reveal the 蟠桃会 banquet (tables, peaches, fairies) — no seat for him. Cold blue outside vs warm inside. | push 20f (through the door) |
| 8 | 990–1109 | **笑容消失** Close-up of Wukong's face (costume bima, scale ~3–5): smile fades to anger (mouth 0.8 → -0.8, brow 0 → 1); quick inserts: giant peaches, a wine jar, golden cups, elixir gourd; a peach falls into his hand and he bites it. Dim warm light, dark background. | whip 14f |
| 9 | 1110–1259 | **闹蟠桃会** He leaps onto the banquet table (tears off his official hat), kicks cups, staff sweep, wine arcs through the air, dishes and peaches fly, immortals and fairies scatter; ends on a spinning golden elixir pill filling the frame. Fast cuts / whip camera, lots of flying props. | flash 18f (pill → sun) |
| 10 | 1260–1379 | **归山** A setting sun (matching the pill's position) over Huaguo; Wukong (king) somersaults down from the sky to the mountain; monkeys swarm to greet him; warm last happiness. | ink 26f (dark clouds swallow the sun) |
| 11 | 1380–1529 | **天兵压境** Black storm clouds cover the sun; row after row of heavenly soldiers appear across the sky with banners (many parallax rows); low angle from behind Wukong (sage armour appears) standing on the peak; his staff flies back into his hand at the end. | dissolve 16f → 12 |
| 12 | 1530–1679 | 第一棒 (done) | whip 16f |
| 13 | 1680–1829 | **杀向天宫** Wukong (sage) flies upward through cloud layers, knocking soldiers aside, spears flying, vertical tracking; 南天门 appears above in the final seconds. Very fast, streaks, match-cut energy. | black 24f |
| 14 | 1830–1949 | **锁** After black: heavy iron chains; Wukong (furnace costume = scorched, desaturated) kneels chained before the enormous 南天门; his staff lies far away on the stones. Huge scale contrast; grey-blue monochrome. | dissolve 20f |
| 15 | 1950–2099 | **雷、刀、火** Three punishments strike him: thunder bolt, a giant executioner's blade that shatters on him, fire; camera creeps in; at the end he lifts his head and his eyes hold a faint golden ember. | black 22f |
| 16 | 2100–2219 | **入炉** 太上老君's alchemy hall; the bronze Eight-Trigrams furnace (八卦炉) with trigram symbols; the furnace door opens, Wukong is thrown in, the door closes; black; one red ember remains in the dark. | dissolve 22f |
| 17 | 2220–2399 | **炉火** Inside the furnace: fire cycles red → orange → gold → cyan → violet; Wukong struggles then sits in meditation (P.meditate); particles converge on him. | push 18f |
| 18 | 2400–2519 | **火眼金睛** Extreme close-up: his eyes open, golden light bursts from them (glow 1); cracks spread across the furnace wall; his staff (outside) starts glowing. | flash 16f |
| 19 | 2520–2639 | **破炉** A beat of silence, then the furnace explodes: bronze shards and rainbow light fly toward the camera; Wukong rises from the blast and catches his flying staff. | whip 16f |
| 20 | 2640–2819 | **一路打入凌霄殿** Rampage toward the throne hall: red columns rushing past (foreground), white jade steps cracking, soldiers flying; each strike adds a colour (red, gold, cyan, blue, violet); fastest cutting of the film. | dissolve 18f |
| 21 | 2820–2939 | **凌霄宝殿** He bursts through the hall doors; a thousand soldiers surround him in the vast hall; the Jade Emperor's throne in the distance; sudden stillness; slow push in to his eyes. | flash 18f |
| 22 | 2940–3149 | **大闹天宫** One final swing releases all colours in a burst; the light contracts to a single golden point; black; the title 大闹天宫 (class `brush` text, big, gold gradient, with a red seal) fades in; a last spark dies. | — |
