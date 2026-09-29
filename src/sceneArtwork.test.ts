import test from 'node:test';
import assert from 'node:assert/strict';
import { sceneArtwork } from './sceneArtwork.ts';

function containsElement(svg: string, selectorOrTag: string): boolean {
  if (selectorOrTag.startsWith('.')) {
    const className = selectorOrTag.slice(1);
    const regex = new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`);
    return regex.test(svg);
  }
  if (selectorOrTag.startsWith('#')) {
    const id = selectorOrTag.slice(1);
    const regex = new RegExp(`id="${id}"`);
    return regex.test(svg);
  }
  return svg.includes(`<${selectorOrTag}`) || svg.includes(`class="${selectorOrTag}"`);
}

function countMatches(svg: string, regex: RegExp): number {
  const matches = svg.match(regex);
  return matches ? matches.length : 0;
}

test('sceneArtwork generates valid SVGs for all 22 scenes with data-scene markers', () => {
  for (let scene = 1; scene <= 22; scene++) {
    const svg = sceneArtwork(scene);
    assert.ok(svg.startsWith('<svg'), `Scene ${scene} should start with <svg tag`);
    assert.ok(svg.endsWith('</svg>'), `Scene ${scene} should end with </svg> tag`);
    assert.ok(svg.includes('viewBox="0 0 1920 1080"'), `Scene ${scene} should have standard 1920x1080 viewBox`);
    assert.ok(svg.includes(`data-scene="${scene}"`), `Scene ${scene} must have data-scene="${scene}" attribute`);
    assert.ok(svg.includes('<defs>'), `Scene ${scene} should have defs section with gradients`);
  }
});

test('Step 1: Scenes 1-4 contain blue-green landscapes, raft details, and Sanxing cave elements', () => {
  // Scene 1: Celestial palace amidst cloud sea and mountains
  const s1 = sceneArtwork(1);
  assert.ok(containsElement(s1, '.sky'), 'Scene 1 should include sky backdrop');
  assert.ok(containsElement(s1, '.palace-complex') || containsElement(s1, '.han-tang-roof'), 'Scene 1 should include palace architecture');

  // Scene 2: 5-panel scroll, raft with ropes/bamboo pole, ocean foreground, voyage gate
  const s2 = sceneArtwork(2);
  assert.ok(containsElement(s2, '.long-scroll-landscape'), 'Scene 2 must have .long-scroll-landscape for horizontal scrolling');
  assert.ok(containsElement(s2, '.raft'), 'Scene 2 must have .raft element');
  assert.ok(containsElement(s2, '.voyage-gate'), 'Scene 2 must have .voyage-gate element');
  assert.ok(containsElement(s2, '.sea-foreground'), 'Scene 2 must have .sea-foreground element');
  assert.ok(containsElement(s2, '.ink-mist'), 'Scene 2 should have .ink-mist');

  // Scene 3: Sanxing cave mountain gate, bamboo grove, stone stairs, ink mist
  const s3 = sceneArtwork(3);
  assert.ok(containsElement(s3, '.mountain-gate'), 'Scene 3 must have .mountain-gate');
  assert.ok(containsElement(s3, '.stone-stairs'), 'Scene 3 should have .stone-stairs');
  assert.ok(containsElement(s3, '.ink-mist'), 'Scene 3 must have .ink-mist');
  assert.ok(s3.includes('bamboo') || containsElement(s3, '.bamboo-shadows') || s3.includes('松') || containsElement(s3, '.pine-tree'), 'Scene 3 should have bamboo or pines');

  // Scene 4: Huaguo Mountain freedom, waterfall, ancient pines, blue-green peaks
  const s4 = sceneArtwork(4);
  assert.ok(containsElement(s4, '.waterfall'), 'Scene 4 must have .waterfall');
  assert.ok(containsElement(s4, '.far-mountains'), 'Scene 4 should have blue-green mountain peaks');
  assert.ok(containsElement(s4, '.pine-tree'), 'Scene 4 should have ancient pine trees');
});

test('Step 2: Scenes 5-10 contain Nantianmen, celestial stables, and Peach Banquet art', () => {
  // Scene 5: Nantianmen cold gold gate, stone stairs, heavenly decree
  const s5 = sceneArtwork(5);
  assert.ok(containsElement(s5, '.heavenly-decree'), 'Scene 5 must have .heavenly-decree');
  assert.ok(containsElement(s5, '.mountain-gate'), 'Scene 5 must have .mountain-gate');
  assert.ok(containsElement(s5, '.stone-stairs'), 'Scene 5 must have .stone-stairs');

  // Scene 6: Celestial stables, horses in flight, high court officials
  const s6 = sceneArtwork(6);
  assert.ok(containsElement(s6, '.celestial-horses'), 'Scene 6 must have .celestial-horses');
  assert.ok(containsElement(s6, '.high-court-officials'), 'Scene 6 must have .high-court-officials');
  assert.ok(containsElement(s6, '.stable-beams'), 'Scene 6 should have .stable-beams');

  // Scene 7: Outside banquet doors, door-left, door-right
  const s7 = sceneArtwork(7);
  assert.ok(containsElement(s7, '.banquet-door'), 'Scene 7 must have .banquet-door');
  assert.ok(containsElement(s7, '.door-left'), 'Scene 7 must have .door-left');
  assert.ok(containsElement(s7, '.door-right'), 'Scene 7 must have .door-right');

  // Scene 8: Peach banquet feast inserts, 9000-year peach banquet table, elixir gourds
  const s8 = sceneArtwork(8);
  assert.ok(containsElement(s8, '.feast-inserts'), 'Scene 8 must have .feast-inserts');
  assert.ok(containsElement(s8, '.banquet-table'), 'Scene 8 must have .banquet-table');
  assert.ok(s8.includes('peach') || s8.includes('elixir') || containsElement(s8, '.elixir-flask'), 'Scene 8 should include peaches and elixir gourds');

  // Scene 9: Havoc at banquet, flying crockery, wine splash, fleeing immortals
  const s9 = sceneArtwork(9);
  assert.ok(containsElement(s9, '.flying-crockery'), 'Scene 9 must have .flying-crockery');
  assert.ok(containsElement(s9, '.wine-splash'), 'Scene 9 must have .wine-splash');
  assert.ok(containsElement(s9, '.banquet-disorder'), 'Scene 9 must have disordered tables');
  assert.ok(containsElement(s9, '.immortal-silhouettes'), 'Scene 9 must have .immortal-silhouettes');

  // Scene 10: Returning to Huaguo Mountain with monkeys
  const s10 = sceneArtwork(10);
  assert.ok(containsElement(s10, '.returning-monkeys'), 'Scene 10 must have .returning-monkeys');
});

test('Step 3: Scenes 11-19 contain army siege, execution chains, and Eight Trigrams furnace', () => {
  // Scene 11: Army siege, dark clouds, soldier ranks
  const s11 = sceneArtwork(11);
  assert.ok(containsElement(s11, '.siege-cloud'), 'Scene 11 must have .siege-cloud');
  assert.ok(containsElement(s11, '.army-ranks'), 'Scene 11 must have .army-ranks');

  // Scene 12: Descending spears, impact ground
  const s12 = sceneArtwork(12);
  assert.ok(containsElement(s12, '.descending-spears'), 'Scene 12 must have .descending-spears');
  assert.ok(containsElement(s12, '.impact-ground'), 'Scene 12 must have .impact-ground');

  // Scene 13: Battle scroll rush, staff trail
  const s13 = sceneArtwork(13);
  assert.ok(containsElement(s13, '.battle-scroll'), 'Scene 13 must have .battle-scroll');
  assert.ok(containsElement(s13, '.staff-trail'), 'Scene 13 must have .staff-trail');

  // Scene 14: Execution platform chains, fallen staff
  const s14 = sceneArtwork(14);
  assert.ok(containsElement(s14, '.chains'), 'Scene 14 must have .chains');
  assert.ok(containsElement(s14, '.fallen-staff'), 'Scene 14 must have .fallen-staff');

  // Scene 15: Thunder, blade, fireline
  const s15 = sceneArtwork(15);
  assert.ok(containsElement(s15, '.punishment-tools'), 'Scene 15 must have .punishment-tools');
  assert.ok(containsElement(s15, '.thunder'), 'Scene 15 must have .thunder');
  assert.ok(containsElement(s15, '.blade'), 'Scene 15 must have .blade');
  assert.ok(containsElement(s15, '.fireline'), 'Scene 15 must have .fireline');

  // Scene 16: Entering the furnace, closing door
  const s16 = sceneArtwork(16);
  assert.ok(containsElement(s16, '.eight-trigrams-furnace'), 'Scene 16 must have .eight-trigrams-furnace');
  assert.ok(containsElement(s16, '.closing-door'), 'Scene 16 must have .closing-door');

  // Scene 17: Samadhi fire flames with multi-path structure for animation loop
  const s17 = sceneArtwork(17);
  assert.ok(containsElement(s17, '.furnace-flames'), 'Scene 17 must have .furnace-flames');
  const flamePaths = countMatches(s17, /<path[^>]*class="[^"]*flame[^"]*"|<g[^>]*class="furnace-flames"[^>]*>[\s\S]*?<\/g>/);
  assert.ok(flamePaths > 0, 'Scene 17 must have flame paths inside .furnace-flames');
  // Check that querySelectorAll('.furnace-flames path') will find at least 5 paths
  const flameBlock = s17.match(/<g[^>]*class="[^"]*furnace-flames[^"]*"[\s\S]*?<\/g>/)?.[0] || '';
  const pathsInFlames = countMatches(flameBlock, /<path\b/g);
  assert.ok(pathsInFlames >= 5, `Expected >= 5 paths in .furnace-flames, got ${pathsInFlames}`);

  // Scene 18: Fiery eyes rays, furnace cracks
  const s18 = sceneArtwork(18);
  assert.ok(containsElement(s18, '.eye-rays'), 'Scene 18 must have .eye-rays');
  assert.ok(containsElement(s18, '.furnace-cracks'), 'Scene 18 must have .furnace-cracks');

  // Scene 19: Exploding furnace shards, released color trails
  const s19 = sceneArtwork(19);
  assert.ok(containsElement(s19, '.furnace-shards'), 'Scene 19 must have .furnace-shards');
  assert.ok(containsElement(s19, '.released-color-trails'), 'Scene 19 must have .released-color-trails');
});

test('Step 4: Scenes 20-22 contain collapsing Lingxiao columns and five-color release', () => {
  // Scene 20: Collapsing dragon pillars, released color trails with multiple paths
  const s20 = sceneArtwork(20);
  assert.ok(containsElement(s20, '.rushing-pillars'), 'Scene 20 must have .rushing-pillars');
  assert.ok(containsElement(s20, '.released-color-trails'), 'Scene 20 must have .released-color-trails');
  const trailsBlock = s20.match(/<g[^>]*class="[^"]*released-color-trails[^"]*"[\s\S]*?<\/g>/)?.[0] || '';
  const pathsInTrails = countMatches(trailsBlock, /<path\b/g);
  assert.ok(pathsInTrails >= 5, `Expected >= 5 paths in .released-color-trails for Scene 20, got ${pathsInTrails}`);

  // Scene 21: Lingxiao Great Hall columns, constellation dome particles
  const s21 = sceneArtwork(21);
  assert.ok(containsElement(s21, '.great-hall-columns'), 'Scene 21 must have .great-hall-columns');
  assert.ok(containsElement(s21, '.hall-star-particles'), 'Scene 21 must have .hall-star-particles');

  // Scene 22: Final five-color burst and victory aureole
  const s22 = sceneArtwork(22);
  assert.ok(containsElement(s22, '.released-color-trails'), 'Scene 22 must have .released-color-trails');
  assert.ok(containsElement(s22, '.final-release'), 'Scene 22 must have .final-release');
});

test('main.ts updateArtwork contract: all animated selectors match exactly in their respective scenes', () => {
  const requirements: Record<number, string[]> = {
    2: ['.long-scroll-landscape', '.raft', '.voyage-gate', '.sea-foreground'],
    3: ['.mountain-gate', '.ink-mist'],
    5: ['.heavenly-decree', '.mountain-gate', '.stone-stairs'],
    6: ['.celestial-horses', '.high-court-officials'],
    7: ['.banquet-door', '.door-left', '.door-right'],
    8: ['.feast-inserts'],
    9: ['.flying-crockery'],
    11: ['.army-ranks'],
    12: ['.descending-spears'],
    16: ['.closing-door'],
    17: ['.furnace-flames'],
    18: ['.eye-rays', '.furnace-cracks'],
    19: ['.furnace-shards', '.released-color-trails'],
    20: ['.released-color-trails'],
    22: ['.released-color-trails', '.final-release'],
  };

  for (const [sceneStr, selectors] of Object.entries(requirements)) {
    const scene = Number(sceneStr);
    const svg = sceneArtwork(scene);
    for (const selector of selectors) {
      assert.ok(containsElement(svg, selector), `Scene ${scene} must contain selector "${selector}" for main.ts updateArtwork`);
    }
  }

  // Specifically verify querySelectorAll('.furnace-flames path') in scene 17
  const s17 = sceneArtwork(17);
  const flameBlock = s17.match(/<g[^>]*class="[^"]*furnace-flames[^"]*"[\s\S]*?<\/g>/)?.[0] || '';
  assert.ok(countMatches(flameBlock, /<path\b/g) >= 7, 'Scene 17 must have >= 7 paths in .furnace-flames');

  // Specifically verify querySelectorAll('.released-color-trails path') in scene 20
  const s20 = sceneArtwork(20);
  const trailsBlock = s20.match(/<g[^>]*class="[^"]*released-color-trails[^"]*"[\s\S]*?<\/g>/)?.[0] || '';
  assert.ok(countMatches(trailsBlock, /<path\b/g) >= 5, 'Scene 20 must have >= 5 paths in .released-color-trails');
});

