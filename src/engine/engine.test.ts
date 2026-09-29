import test from 'node:test';
import assert from 'node:assert/strict';
import { compose, SCENE_BOUNDS, TOTAL_FRAMES, TRANSITIONS, sceneAt } from '../timeline.ts';
import { inBack, outBack, track } from './ease.ts';
import { planeMatrix } from './scene.ts';
import { transitionLooks } from './render.ts';
import { REST, solve } from '../rig/hero.ts';
import { P } from '../rig/poses.ts';

test('every frame maps to one of 22 scenes; film is 3150 frames at 30 fps', () => {
  assert.equal(TOTAL_FRAMES, 3150);
  assert.equal(TRANSITIONS.length, 21);
  for (let s = 1; s <= 22; s++) {
    assert.equal(sceneAt(SCENE_BOUNDS[s - 1]), s);
    assert.equal(sceneAt(SCENE_BOUNDS[s] - 1), s);
  }
});

test('transitions are centred on scene boundaries and blend monotonically', () => {
  for (let i = 0; i < TRANSITIONS.length; i++) {
    const b = SCENE_BOUNDS[i + 1];
    const { len } = TRANSITIONS[i];
    let last = -1;
    for (let f = b - len / 2; f < b + len / 2; f++) {
      const c = compose(f);
      assert.ok(c.b, `frame ${f} should be inside transition ${i + 1}->${i + 2}`);
      assert.equal(c.a.scene, i + 1);
      assert.equal(c.b!.scene, i + 2);
      assert.ok(c.mix >= last, `mix must not go backwards at ${f}`);
      last = c.mix;
    }
    assert.equal(compose(b + len / 2).b, null);
  }
});

test('the first staff strike (frames 1612–1613) is outside any transition', () => {
  for (const f of [1612, 1613]) {
    const c = compose(f);
    assert.equal(c.a.scene, 12);
    assert.equal(c.b, null);
    assert.equal(c.a.lf, f - 1530);
  }
});

test('incoming scene is always fully visible when a transition ends', () => {
  for (const tr of TRANSITIONS) {
    const looks = transitionLooks({ frame: 0, a: {} as never, b: {} as never, transition: tr.type, mix: 1, raw: 1 });
    assert.ok(looks.b.op > 0.99, tr.type);
    assert.equal(looks.b.dx, 0, tr.type);
  }
});

test('easing: anticipation dips below 0, overshoot exceeds 1, both land exactly', () => {
  assert.ok(inBack(0.3) < 0);
  assert.ok(outBack(0.7) > 1);
  assert.equal(inBack(1), 1);
  assert.ok(Math.abs(outBack(1) - 1) < 1e-9);
  assert.equal(track([[0, 10], [10, 20]], 5), 15);
});

test('camera at rest leaves every plane untouched; far planes move less', () => {
  for (const z of [0, 0.3, 1, 1.8]) assert.deepEqual(planeMatrix({ x: 960, y: 540, zoom: 1 }, z).map((v) => +v.toFixed(6)), [1, 0, 0, 1, 0, 0]);
  const cam = { x: 1260, y: 540, zoom: 1 };
  const far = planeMatrix(cam, 0.3)[4], near = planeMatrix(cam, 1.5)[4];
  assert.ok(Math.abs(near) > Math.abs(far));
});

test('rig: planted feet touch the ground line; staff points along staffA', () => {
  for (const pose of [REST, P.crouch, P.strike, P.kneel, P.meditate]) {
    const s = solve({ ...pose, plant: 1 });
    assert.ok(Number.isFinite(s.hipY));
  }
  const s = solve({ ...P.heroic, staff: 1, staffA: -90 });
  const [[, tailY], [, headY]] = s.staffEnds;
  assert.ok(headY < tailY, 'staffA = -90 points the staff head upward');
});
