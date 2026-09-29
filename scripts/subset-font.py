#!/usr/bin/env python3
"""Subset Noto Serif CJK SC (Black/Bold) to the Chinese characters used in src/ -> public/fonts/film-serif.woff2.

Run after changing any on-screen Chinese text:  python3 scripts/subset-font.py
Needs: fonts-noto-cjk, python3-fonttools, python3-brotli (apt).
"""
import pathlib, re
from fontTools import subset
from fontTools.ttLib import TTCollection

root = pathlib.Path(__file__).resolve().parent.parent
chars = set()
for p in (root / 'src').rglob('*.ts'):
    if p.name.endswith('.test.ts'):
        continue
    for m in re.finditer(r'[㐀-鿿豈-﫿　-〿＀-￯]', p.read_text(encoding='utf-8')):
        chars.add(m.group(0))
chars |= set('大闹天宫南天门斜月三星洞')

src = None
for cand in ['/usr/share/fonts/opentype/noto/NotoSerifCJK-Black.ttc', '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc']:
    if pathlib.Path(cand).exists():
        src = cand
        break
coll = TTCollection(src)
font = next(f for f in coll.fonts if 'SC' in f['name'].getDebugName(1))
opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['*']
sub = subset.Subsetter(opts)
sub.populate(text=''.join(sorted(chars)))
sub.subset(font)
out = root / 'public' / 'fonts' / 'film-serif.woff2'
out.parent.mkdir(parents=True, exist_ok=True)
font.flavor = 'woff2'
font.save(out)
print(f'{len(chars)} glyphs from {pathlib.Path(src).name} -> {out} ({out.stat().st_size // 1024} KB)')
