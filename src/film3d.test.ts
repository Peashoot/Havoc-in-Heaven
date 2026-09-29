import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { initFilm3D, type Film3D } from './film3d.ts';
import { filmState } from './timeline.ts';

function createMockCanvas(): HTMLCanvasElement {
  return {
    width: 1920,
    height: 1080,
    style: {},
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as HTMLCanvasElement;
}

describe('Three.js 3D Mythical Space and Camera Renderer (film3d)', () => {
  test('initializes Film3D instance with scene, camera, and required methods', () => {
    const canvas = createMockCanvas();
    const film3d = initFilm3D(canvas);

    assert.equal(typeof film3d.render, 'function');
    assert.equal(typeof film3d.resize, 'function');
    assert.equal(typeof film3d.dispose, 'function');
    assert.ok(film3d.scene instanceof THREE.Scene);
    assert.ok(film3d.camera instanceof THREE.PerspectiveCamera);
    assert.equal(film3d.camera.aspect, 1920 / 1080);
    assert.equal(film3d.camera.near, 1);
    assert.equal(film3d.camera.far, 10000);
  });

  test('drives camera position, target, fov, and roll deterministically from FilmState', () => {
    const canvas = createMockCanvas();
    const film3d = initFilm3D(canvas);

    // Test Scene 1 state
    const s1 = filmState(60);
    film3d.render(s1);

    assert.equal(film3d.camera?.position.x, s1.cameraPosition[0]);
    assert.equal(film3d.camera?.position.y, s1.cameraPosition[1]);
    assert.equal(film3d.camera?.position.z, s1.cameraPosition[2]);
    assert.equal(film3d.camera?.fov, s1.cameraFov);
    assert.equal(film3d.camera?.rotation.z, s1.cameraRoll);

    // Test Scene 9 (strike and roll)
    const s9 = filmState(1200);
    film3d.render(s9);

    assert.equal(film3d.camera?.position.x, s9.cameraPosition[0]);
    assert.equal(film3d.camera?.position.y, s9.cameraPosition[1]);
    assert.equal(film3d.camera?.position.z, s9.cameraPosition[2]);
    assert.equal(film3d.camera?.fov, s9.cameraFov);
    assert.equal(film3d.camera?.rotation.z, s9.cameraRoll);

    // Test Scene 19 (break furnace)
    const s19 = filmState(2460);
    film3d.render(s19);

    assert.equal(film3d.camera?.position.x, s19.cameraPosition[0]);
    assert.equal(film3d.camera?.position.y, s19.cameraPosition[1]);
    assert.equal(film3d.camera?.position.z, s19.cameraPosition[2]);
    assert.equal(film3d.camera?.fov, s19.cameraFov);
  });

  test('contains 3D Cloud Sea and modulates wave heights deterministically with cloudSpeed', () => {
    const canvas = createMockCanvas();
    const film3d = initFilm3D(canvas);

    const cloudSea = film3d.scene?.getObjectByName('cloud-sea') as THREE.Mesh;
    assert.ok(cloudSea, 'Cloud sea mesh should exist in scene');

    const s1 = filmState(0);
    film3d.render(s1);
    const posAttr = cloudSea.geometry.attributes.position as THREE.BufferAttribute;
    const y0 = posAttr.getY(10);

    const s2 = filmState(100);
    film3d.render(s2);
    const y100 = posAttr.getY(10);

    assert.notEqual(y0, y100, 'Cloud wave displacement should vary over frames');

    // Deterministic replay: rendering s1 again must return exactly y0
    film3d.render(s1);
    assert.equal(posAttr.getY(10), y0, 'Cloud waves must be 100% deterministic on replay');
  });

  test('contains Nantianmen architecture with dragon columns and responds to gateReveal', () => {
    const canvas = createMockCanvas();
    const film3d = initFilm3D(canvas);

    const nantianmen = film3d.scene?.getObjectByName('nantianmen') as THREE.Group;
    assert.ok(nantianmen, 'Nantianmen group should exist in scene');

    const leftCol = nantianmen.getObjectByName('column-left');
    const rightCol = nantianmen.getObjectByName('column-right');
    const dragonLeft = nantianmen.getObjectByName('dragon-left');
    const dragonRight = nantianmen.getObjectByName('dragon-right');
    const steps = nantianmen.getObjectByName('celestial-steps');
    const roof = nantianmen.getObjectByName('golden-roof');

    assert.ok(leftCol, 'Left pillar should exist');
    assert.ok(rightCol, 'Right pillar should exist');
    assert.ok(dragonLeft, 'Left coiled dragon relief should exist');
    assert.ok(dragonRight, 'Right coiled dragon relief should exist');
    assert.ok(steps, 'White marble steps platform should exist');
    assert.ok(roof, 'Double-eave golden roof should exist');

    // Gate reveal visibility check
    const sClosed = filmState(450); // Scene 4, no gate
    film3d.render(sClosed);
    assert.equal(nantianmen.visible, false);

    const sGate = filmState(15); // Scene 1, gate opening
    film3d.render(sGate);
    assert.equal(nantianmen.visible, true);
  });

  test('contains Eight Trigrams Furnace, rotates trigram rings, and explodes debris when state.debris > 0', () => {
    const canvas = createMockCanvas();
    const film3d = initFilm3D(canvas);

    const furnace = film3d.scene?.getObjectByName('eight-trigrams-furnace') as THREE.Group;
    assert.ok(furnace, 'Eight Trigrams furnace group should exist');

    const tripodLegs = furnace.getObjectByName('tripod-legs');
    const furnaceEars = furnace.getObjectByName('furnace-ears');
    const trigramRings = furnace.getObjectByName('trigram-rings') as THREE.Group;
    const debrisGroup = film3d.scene?.getObjectByName('debris-group') as THREE.Group;

    assert.ok(tripodLegs, 'Tripod bronze legs should exist');
    assert.ok(furnaceEars, 'Two bronze ritual ears should exist');
    assert.ok(trigramRings, 'Encircled trigram rings should exist');
    assert.ok(debrisGroup, 'Debris group should exist');
    assert.ok(debrisGroup.children.length >= 24, 'Debris group should have polyhedral bronze shards');

    // Ring rotation check across frames
    const f10 = filmState(10);
    film3d.render(f10);
    const rot1 = trigramRings.rotation.y;

    const f50 = filmState(50);
    film3d.render(f50);
    const rot2 = trigramRings.rotation.y;
    assert.notEqual(rot1, rot2, 'Trigram rings must rotate over time');

    // Debris explosion check
    const sNoDebris = filmState(100);
    film3d.render(sNoDebris);
    assert.equal(debrisGroup.visible, false);

    const sDebris = filmState(2580); // Scene 19 "破炉", debris is high
    film3d.render(sDebris);
    assert.equal(debrisGroup.visible, true);
    const firstShard = debrisGroup.children[0] as THREE.Mesh;
    assert.ok(firstShard.position.z > 0 || Math.abs(firstShard.position.x) > 10, 'Shards should scatter outward');

    // Deterministic replay
    film3d.render(f10);
    assert.equal(trigramRings.rotation.y, rot1);
  });

  test('contains 3D particle system with gold powder, fire sparks, and mist particles', () => {
    const canvas = createMockCanvas();
    const film3d = initFilm3D(canvas);

    const particles = film3d.scene?.getObjectByName('particles-group') as THREE.Group;
    assert.ok(particles, 'Particles group should exist');

    const goldPowder = particles.getObjectByName('gold-powder') as THREE.Points;
    const fireSparks = particles.getObjectByName('fire-sparks') as THREE.Points;
    const mistParticles = particles.getObjectByName('mist-particles') as THREE.Points;

    assert.ok(goldPowder, 'Gold foil powder points should exist');
    assert.ok(fireSparks, 'Samadhi fire sparks points should exist');
    assert.ok(mistParticles, 'Cloud mist particles points should exist');

    const posGold = goldPowder.geometry.attributes.position as THREE.BufferAttribute;
    assert.ok(posGold.count >= 200, 'Gold powder should have ample particles');

    // Render updates particles deterministically
    const s1 = filmState(10);
    film3d.render(s1);
    const y0 = posGold.getY(5);

    const s2 = filmState(120);
    film3d.render(s2);
    const y1 = posGold.getY(5);
    assert.notEqual(y0, y1, 'Particles should move over frames');

    film3d.render(s1);
    assert.equal(posGold.getY(5), y0, 'Particles motion must be 100% deterministic');
  });

  test('resize and dispose cleanly handle renderer and resources', () => {
    const canvas = createMockCanvas();
    let disposed = false;
    let resizedW = 0;
    let resizedH = 0;
    const mockRenderer = {
      domElement: canvas,
      setSize: (w: number, h: number) => { resizedW = w; resizedH = h; },
      setPixelRatio: () => {},
      render: () => {},
      dispose: () => { disposed = true; },
      toneMapping: THREE.ACESFilmicToneMapping,
    } as unknown as THREE.WebGLRenderer;

    const film3d = initFilm3D(canvas, { renderer: mockRenderer });
    film3d.resize(1280, 720);
    assert.equal(resizedW, 1280);
    assert.equal(resizedH, 720);
    assert.equal(film3d.camera?.aspect, 1280 / 720);

    film3d.dispose();
    assert.equal(disposed, true);
  });

  test('maintains strict 100% determinism when scrubbing frames forward and backward', () => {
    const canvas = createMockCanvas();
    const film3d = initFilm3D(canvas);

    const frameA = 45;
    const frameB = 1850;
    const frameC = 2580;

    const sA = filmState(frameA);
    const sB = filmState(frameB);
    const sC = filmState(frameC);

    // Initial render at A
    film3d.render(sA);
    const camA1 = film3d.camera?.position.clone();
    const fovA1 = film3d.camera?.fov;
    const cloudSea = film3d.scene?.getObjectByName('cloud-sea') as THREE.Mesh;
    const yCloudA1 = (cloudSea.geometry.attributes.position as THREE.BufferAttribute).getY(15);
    const trigramRings = film3d.scene?.getObjectByName('trigram-rings') as THREE.Group;
    const rotRingsA1 = trigramRings.rotation.y;

    // Jump to B and C
    film3d.render(sB);
    film3d.render(sC);

    // Jump back to A
    film3d.render(sA);
    const camA2 = film3d.camera?.position.clone();
    const fovA2 = film3d.camera?.fov;
    const yCloudA2 = (cloudSea.geometry.attributes.position as THREE.BufferAttribute).getY(15);
    const rotRingsA2 = trigramRings.rotation.y;

    assert.equal(camA1?.x, camA2?.x);
    assert.equal(camA1?.y, camA2?.y);
    assert.equal(camA1?.z, camA2?.z);
    assert.equal(fovA1, fovA2);
    assert.equal(yCloudA1, yCloudA2);
    assert.equal(rotRingsA1, rotRingsA2);
  });

  test('dynamically adjusts lighting and furnace glow based on fire and colorRelease', () => {
    const canvas = createMockCanvas();
    const film3d = initFilm3D(canvas);

    const furnace = film3d.scene?.getObjectByName('eight-trigrams-furnace') as THREE.Group;
    const trigramRings = furnace.getObjectByName('trigram-rings') as THREE.Group;
    const outerRing = trigramRings.children[0] as THREE.Mesh;
    const mat = outerRing.material as THREE.MeshStandardMaterial;

    // Normal calm scene
    const sCalm = filmState(200); // Scene 2
    film3d.render(sCalm);
    const calmEmissiveIntensity = mat.emissiveIntensity;

    // High fire scene (Scene 18)
    const sFire = filmState(2450);
    film3d.render(sFire);
    const fireEmissiveIntensity = mat.emissiveIntensity;
    assert.ok(fireEmissiveIntensity > calmEmissiveIntensity, 'Emissive intensity should spike during furnace fire');

    // Rainbow release scene (Scene 20)
    const sRainbow = filmState(2700);
    film3d.render(sRainbow);
    assert.ok(mat.emissive.r >= 0 && mat.emissive.g >= 0 && mat.emissive.b >= 0);
  });
});
