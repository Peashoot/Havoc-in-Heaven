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

test('costumeStage accurately reflects the narrative journey across 22 scenes', () => {
  assert.equal(filmState(160).costumeStage, 'pilgrim');     // Scene 2: 漂洋过海
  assert.equal(filmState(300).costumeStage, 'pilgrim');     // Scene 3: 三星洞求道
  assert.equal(filmState(450).costumeStage, 'monkeyKing');  // Scene 4: 花果山自由
  assert.equal(filmState(720).costumeStage, 'bima');        // Scene 6: 弼马温
  assert.equal(filmState(1000).costumeStage, 'bima');       // Scene 8: 蟠桃会
  assert.equal(filmState(1280).costumeStage, 'monkeyKing'); // Scene 10: 归山
  assert.equal(filmState(1550).costumeStage, 'greatSage');  // Scene 12: 第一棒
  assert.equal(filmState(2300).costumeStage, 'furnaceGold');// Scene 17: 炉火
  assert.equal(filmState(2700).costumeStage, 'greatSage');  // Scene 20: 打入凌霄殿
});

test('3d camera coordinates, target, fov, roll, and featherAngle are finite and valid in all frames', () => {
  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const s = filmState(frame);
    assert.equal(s.cameraPosition.length, 3);
    assert.equal(s.cameraTarget.length, 3);
    assert.ok(s.cameraPosition.every(Number.isFinite), `frame ${frame} cameraPosition`);
    assert.ok(s.cameraTarget.every(Number.isFinite), `frame ${frame} cameraTarget`);
    assert.ok(Number.isFinite(s.cameraFov), `frame ${frame} cameraFov`);
    assert.ok(Number.isFinite(s.cameraRoll), `frame ${frame} cameraRoll`);
    assert.ok(Number.isFinite(s.featherAngle), `frame ${frame} featherAngle`);
  }
});

test('motion graphics kinematics and heroStance are well defined across all frames', () => {
  const stances = new Set(['stand', 'crouch', 'lunge', 'jump', 'strike', 'meditate']);
  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const s = filmState(frame);
    assert.ok(stances.has(s.heroStance), `frame ${frame}: invalid stance ${s.heroStance}`);
    assert.ok(s.heroSquashX > 0 && Number.isFinite(s.heroSquashX), `frame ${frame} heroSquashX`);
    assert.ok(s.heroSquashY > 0 && Number.isFinite(s.heroSquashY), `frame ${frame} heroSquashY`);
    assert.ok(Number.isFinite(s.speedlines) && s.speedlines >= 0 && s.speedlines <= 1.5, `frame ${frame} speedlines`);
    assert.ok(Number.isFinite(s.parallaxForeground), `frame ${frame} parallaxForeground`);
    assert.ok(Number.isFinite(s.parallaxBackground), `frame ${frame} parallaxBackground`);
  }
  // Anticipation crouch before strike in Scene 12
  assert.equal(filmState(1590).heroStance, 'crouch');
  // Explosive strike at impact in Scene 12
  assert.equal(filmState(1612).heroStance, 'strike');
  assert.ok(filmState(1612).speedlines > 0.8);
});


