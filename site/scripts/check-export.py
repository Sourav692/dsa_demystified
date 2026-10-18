#!/usr/bin/env python3
"""Check links and anchors in generated website pages (legacy sources excluded)."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import sys

root=Path(__file__).resolve().parents[1]/'out'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.ids=set();self.links=[];self.assets=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id'):self.ids.add(attrs['id'])
        if tag=='a' and attrs.get('href'):self.links.append(attrs['href'])
        if tag in ['img','iframe'] and attrs.get('src'):self.assets.append(attrs['src'])

pages={p:Page(p.read_text()) for p in root.rglob('*.html') if 'content' not in p.relative_to(root).parts and 'lessons' not in p.relative_to(root).parts and not p.name.startswith('_')}
files={p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
errors=[];links=0
for path,page in pages.items():
    for href in page.links+page.assets:
        parsed=urlsplit(href)
        if parsed.scheme or parsed.netloc:continue
        if not parsed.path:
            if parsed.fragment and unquote(parsed.fragment) not in page.ids:errors.append(f'{path.relative_to(root)}: missing anchor {href}')
            continue
        target=unquote(parsed.path).lstrip('/') if parsed.path.startswith('/') else (path.relative_to(root).parent/unquote(parsed.path)).as_posix()
        if not target or target.endswith('/'):target+='index.html'
        if target not in files:errors.append(f'{path.relative_to(root)}: missing {href}')
        links+=1
if errors:
    print('\n'.join(errors[:60]));sys.exit(f'{len(errors)} broken links or anchors')
print(f'Static export verified: {len(pages)} website HTML pages and {links} local links/assets; no missing destinations or local anchors.')
