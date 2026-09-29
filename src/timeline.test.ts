import test from 'node:test';
import assert from 'node:assert/strict';
import { filmState, sceneOneState, SCENE_BOUNDS, TOTAL_FRAMES } from './timeline.ts';

test('scene one accepts a frame number and returns a stable camera state', () => {
  assert.deepEqual(sceneOneState(75), sceneOneState(75));
  assert.equal(sceneOneState(0).seconds, 0);
  assert.equal(sceneOneState(150).seconds, 5);
});

test('camera advances while the cloud opening grows across scene one', () => {
  const start = sceneOneState(0);
  const middle = sceneOneState(75);
  const end = sceneOneState(149);
  assert.ok(start.cameraScale < middle.cameraScale);
  assert.ok(middle.cameraScale < end.cameraScale);
  assert.ok(start.reveal < middle.reveal);
  assert.ok(middle.reveal < end.reveal);
});

test('all 3150 frames map to the 22 revised storyboard scenes', () => {
  assert.deepEqual([0, 149, 150, 269, 270, 419, 420, 539, 540, 689, 690, 839,
    840, 989, 990, 1109, 1110, 1259, 1260, 1379, 1380, 1529,
    1530, 1679, 1680, 1829, 1830, 1949, 1950, 2099,
    2100, 2219, 2220, 2399, 2400, 2519, 2520, 2639,
    2640, 2819, 2820, 2939, 2940, 3149].map((frame) => filmState(frame).scene),
    Array.from({length: 22}, (_, index) => [index + 1, index + 1]).flat());
  assert.equal(filmState(3150).frame, 3149);
});

test('film state is deterministic and the final title appears after the color burst', () => {
  assert.deepEqual(filmState(1795), filmState(1795));
  assert.equal(filmState(2940).titleOpacity, 0);
  assert.ok(filmState(3085).titleOpacity > 0.9);
});

test('scene boundaries cover 105 seconds without gaps', () => {
  assert.equal(TOTAL_FRAMES, 105 * 30);
  assert.equal(SCENE_BOUNDS.length, 23);
  for (let scene = 1; scene <= 22; scene++) {
    assert.equal(filmState(SCENE_BOUNDS[scene - 1]).scene, scene);
    assert.equal(filmState(SCENE_BOUNDS[scene] - 1).scene, scene);
  }
});

test('color and staff follow the suppression and release arc', () => {
  assert.equal(filmState(430).palette, 'free');
  assert.equal(filmState(730).palette, 'faded');
  assert.equal(filmState(1870).palette, 'punishment');
  assert.equal(filmState(2310).palette, 'fire');
  assert.equal(filmState(2550).palette, 'rainbow');
  assert.equal(filmState(750).staffVisible, 0);
  assert.equal(filmState(1870).staffVisible, 0);
  assert.ok(filmState(2630).staffGlow > 0.9);
  assert.ok(filmState(2600).colorRelease > filmState(2310).colorRelease);
});

test('all numeric controls are finite throughout the film', () => {
  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const state = filmState(frame);
    for (const [key, value] of Object.entries(state)) {
      if (typeof value === 'number') assert.ok(Number.isFinite(value), `frame ${frame}: ${key}`);
    }
  }
});

test('the first staff strike uses exactly two white frames', () => {
  const flashed = Array.from({ length: 150 }, (_, offset) => 1530 + offset)
    .filter((frame) => filmState(frame).flash === 1);
  assert.deepEqual(flashed, [1612, 1613]);
});
