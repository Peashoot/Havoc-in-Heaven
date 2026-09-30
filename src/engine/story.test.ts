import test from 'node:test';
import assert from 'node:assert/strict';
import { CAPTIONS, captionAt } from '../captions.ts';
import { SCENES } from '../scenes/index.ts';
import { compose, SCENE_BOUNDS, sceneTime, TOTAL_FRAMES, TRANSITIONS } from '../timeline.ts';
import { transitionLooks } from './render.ts';

test('caption cues have reading time, never overlap, and end before the title', () => {
  let lastEnd = 0;
  for (const cue of CAPTIONS) {
    assert.ok(cue.start >= lastEnd);
    assert.ok(cue.end <= TOTAL_FRAMES);
    const chars = [...cue.text].length;
    assert.ok((cue.end - cue.start - 14) / 30 >= chars / 9, `too fast to read: ${cue.text}`);
    assert.equal(captionAt(cue.start - 1).opacity, 0);
    assert.equal(captionAt(cue.start).opacity, 0);
    assert.equal(captionAt(cue.start + 8).text, cue.text);
    lastEnd = cue.end;
  }
  assert.equal(captionAt(3040).text, '');
  const before = captionAt(1803);
  captionAt(2700);
  assert.deepEqual(captionAt(1803), before, 'scrubbing must not depend on playback history');
});

test('all scene cameras and poses stay finite through every frame and transition overlap', () => {
  const check = (scene: number, frame: number) => {
    const t = sceneTime(scene, frame);
    const def = SCENES[scene];
    for (const value of Object.values(def.camera(t))) assert.ok(Number.isFinite(value), `camera ${scene}:${frame}`);
    for (const hero of def.heroes?.(t) ?? []) {
      for (const [key, value] of Object.entries(hero.pose)) assert.ok(Number.isFinite(value), `${scene}:${frame}:${key}`);
    }
  };
  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const c = compose(frame);
    check(c.a.scene, frame);
    if (c.b) check(c.b.scene, frame);
  }
});

test('transitions enter and leave with the scene camera scale intact', () => {
  for (const transition of TRANSITIONS) {
    const start = transitionLooks({ ...compose(0), transition: transition.type, raw: 0, mix: 0 });
    const end = transitionLooks({ ...compose(0), transition: transition.type, raw: 1, mix: 1 });
    assert.equal(start.a.zoomMul, 1, transition.type);
    assert.ok(Math.abs(start.a.dx) < 1e-9, transition.type);
    assert.equal(end.b.zoomMul, 1, transition.type);
    assert.equal(end.b.dx, 0, transition.type);
    assert.equal(end.b.op, 1, transition.type);
  }
});

test('the capture is shown before the fade into imprisonment', () => {
  const captureFrame = SCENE_BOUNDS[12] + 120;
  assert.equal(compose(captureFrame).transition, null);
  assert.equal(SCENES[13].heroes!(sceneTime(13, captureFrame - 1))[0].pose.staff, 1);
  assert.equal(SCENES[13].heroes!(sceneTime(13, captureFrame))[0].pose.staff, 0);
});
