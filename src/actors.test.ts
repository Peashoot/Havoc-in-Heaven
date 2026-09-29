import test from 'node:test';
import assert from 'node:assert/strict';
import { actorsSvg, updateActors } from './actors.ts';
import { filmState } from './timeline.ts';

// Lightweight mock element for testing updateActors in Node.js test runner
class MockElement {
  style: Record<string, string> = {};
  attributes: Record<string, string> = {};
  children: MockElement[] = [];
  id: string = '';
  className: string = '';
  tagName: string = 'g';

  setAttribute(name: string, value: string) {
    this.attributes[name] = value;
  }

  getAttribute(name: string): string | null {
    return this.attributes[name] ?? null;
  }

  querySelector<T = MockElement>(selector: string): T | null {
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      if (this.id === id) return this as unknown as T;
      for (const child of this.children) {
        const found = child.querySelector<T>(selector);
        if (found) return found;
      }
    }
    return null;
  }

  querySelectorAll<T = MockElement>(selector: string): T[] {
    const results: T[] = [];
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      if (this.className.includes(cls)) results.push(this as unknown as T);
    }
    for (const child of this.children) {
      results.push(...child.querySelectorAll<T>(selector));
    }
    return results;
  }
}

function createMockRoot(): { root: any; elements: Record<string, MockElement> } {
  const root = new MockElement();
  root.tagName = 'div';
  root.id = 'actors';

  const elements: Record<string, MockElement> = {};
  const ids = [
    'hero', 'cape-shape', 'hero-staff', 'hero-arms', 'hero-whip', 'eyes', 'eye-rays',
    'kneeling-hero', 'soldier-ranks', 'phoenix-crown', 'feather-left', 'feather-right',
    'costume-pilgrim', 'costume-monkey', 'costume-bima', 'costume-greatsage', 'costume-furnace',
    'head-pilgrim', 'head-monkey', 'head-bima', 'head-crown', 'head-furnace', 'staff-arc'
  ];

  for (const id of ids) {
    const el = new MockElement();
    el.id = id;
    elements[id] = el;
  }

  // Nest under hero
  const hero = elements['hero'];
  hero.children.push(
    elements['cape-shape'], elements['hero-staff'], elements['hero-arms'], elements['hero-whip'],
    elements['eyes'], elements['eye-rays'], elements['phoenix-crown'],
    elements['feather-left'], elements['feather-right'],
    elements['costume-pilgrim'], elements['costume-monkey'], elements['costume-bima'],
    elements['costume-greatsage'], elements['costume-furnace'],
    elements['head-pilgrim'], elements['head-monkey'], elements['head-bima'],
    elements['head-crown'], elements['head-furnace'], elements['staff-arc']
  );

  // Soldiers under soldier-ranks
  const ranks = elements['soldier-ranks'];
  for (let i = 0; i < 30; i++) {
    const s = new MockElement();
    s.className = 'soldier';
    s.setAttribute('data-index', String(i));
    ranks.children.push(s);
  }

  root.children.push(ranks, hero, elements['kneeling-hero']);
  return { root, elements };
}

test('actorsSvg outputs valid markup containing all 5 costume groups and character components', () => {
  const svg = actorsSvg();
  assert.ok(svg.includes('<svg'), 'contains svg root');
  assert.ok(svg.includes('id="hero"'), 'contains hero group');
  assert.ok(svg.includes('id="soldier-ranks"'), 'contains soldier ranks');
  assert.ok(svg.includes('id="costume-pilgrim"'), 'contains pilgrim costume');
  assert.ok(svg.includes('id="costume-monkey"'), 'contains monkey king costume');
  assert.ok(svg.includes('id="costume-bima"'), 'contains bima costume');
  assert.ok(svg.includes('id="costume-greatsage"'), 'contains great sage costume');
  assert.ok(svg.includes('id="costume-furnace"'), 'contains furnace gold costume');
  assert.ok(svg.includes('id="feather-left"'), 'contains left pheasant feather');
  assert.ok(svg.includes('id="feather-right"'), 'contains right pheasant feather');
  assert.ok(svg.includes('id="hero-staff"'), 'contains ruyi jingu bang');
  assert.ok(svg.includes('id="eyes"'), 'contains fiery golden eyes');
  assert.ok(svg.includes('id="eye-rays"'), 'contains furnace eye rays');
  assert.ok(svg.includes('id="kneeling-hero"'), 'contains kneeling hero');

  // Verify 30 soldiers
  const soldierMatches = svg.match(/class="soldier"/g);
  assert.equal(soldierMatches?.length, 30, 'contains exactly 30 soldiers');
});

test('updateActors switches costume stages seamlessly according to FilmState', () => {
  const { root, elements } = createMockRoot();

  // 1. Pilgrim (Scene 2, frame 160)
  const statePilgrim = filmState(160);
  assert.equal(statePilgrim.costumeStage, 'pilgrim');
  updateActors(statePilgrim, root as any);
  assert.equal(elements['costume-pilgrim'].style.display, 'inline');
  assert.equal(elements['costume-monkey'].style.display, 'none');
  assert.equal(elements['costume-greatsage'].style.display, 'none');

  // 2. Monkey King (Scene 4, frame 450)
  const stateMonkey = filmState(450);
  assert.equal(stateMonkey.costumeStage, 'monkeyKing');
  updateActors(stateMonkey, root as any);
  assert.equal(elements['costume-monkey'].style.display, 'inline');
  assert.equal(elements['costume-pilgrim'].style.display, 'none');
  assert.equal(elements['costume-greatsage'].style.display, 'none');

  // 3. Bima (Scene 6, frame 720)
  const stateBima = filmState(720);
  assert.equal(stateBima.costumeStage, 'bima');
  updateActors(stateBima, root as any);
  assert.equal(elements['costume-bima'].style.display, 'inline');
  assert.equal(elements['costume-monkey'].style.display, 'none');
  assert.equal(elements['hero-whip'].style.opacity, '1');

  // 4. Great Sage (Scene 12, frame 1550)
  const stateGreatSage = filmState(1550);
  assert.equal(stateGreatSage.costumeStage, 'greatSage');
  updateActors(stateGreatSage, root as any);
  assert.equal(elements['costume-greatsage'].style.display, 'inline');
  assert.equal(elements['costume-furnace'].style.display, 'none');
  assert.equal(elements['cape-shape'].style.display, 'inline');

  // 5. Furnace Gold (Scene 17, frame 2300)
  const stateFurnace = filmState(2300);
  assert.equal(stateFurnace.costumeStage, 'furnaceGold');
  updateActors(stateFurnace, root as any);
  assert.equal(elements['costume-furnace'].style.display, 'inline');
  assert.equal(elements['costume-greatsage'].style.display, 'none');
  assert.ok(Number(elements['eye-rays'].style.opacity) > 0);
});

test('updateActors sways pheasant feathers dynamically with featherAngle', () => {
  const { root, elements } = createMockRoot();
  const state = filmState(1550);
  state.featherAngle = 14.5;
  updateActors(state, root as any);

  const leftTransform = elements['feather-left'].getAttribute('transform');
  const rightTransform = elements['feather-right'].getAttribute('transform');
  assert.ok(leftTransform?.includes('rotate('), 'left feather has rotate transform');
  assert.ok(rightTransform?.includes('rotate('), 'right feather has rotate transform');
  assert.ok(leftTransform?.includes('14.5'), 'left feather receives featherAngle');
});

test('updateActors animates articulated arms and adjusts hero transform based on martial stance', () => {
  const { root, elements } = createMockRoot();
  const stateCrouch = filmState(1590); // Scene 12 anticipation crouch
  updateActors(stateCrouch, root as any);
  assert.equal(elements['hero-arms'].style.opacity, '1');
  const armsTransform = elements['hero-arms'].getAttribute('transform');
  assert.ok(armsTransform?.includes('rotate(12)'), 'arms rotate in crouch stance');
  const heroTransform = elements['hero'].getAttribute('transform');
  assert.ok(heroTransform?.includes('scale('), 'hero has scale transform with squash');
});

