#!/usr/bin/env python3
"""Build website metadata from repository content, without editing the sources."""
from pathlib import Path
import csv
import json
import re

SITE = Path(__file__).resolve().parents[1]
ROOT = SITE.parent
slug = lambda value: re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')
relative = lambda path: path.relative_to(ROOT).as_posix()
clean = lambda value: re.sub(r'[*`#_]', '', re.sub(r'[\U0001F000-\U0001FFFF\u2600-\u27BF\uFE0F]', '', value)).strip()
read = lambda path: path.read_text(encoding='utf-8')

tree_overrides = {item['folder']: item for item in json.loads(read(SITE/'content/trees.json'))}
group_names = {**{n:'Algorithmic foundations' for n in range(16,22)}, **{n:'Trees' for n in range(1,5)},12:'Specialized structures',13:'Specialized structures',5:'Graph fundamentals',6:'Graph fundamentals',7:'Graph fundamentals'}
foundations = []
for folder in sorted((ROOT/'deep_dive').glob('[0-9]*')):
    if not folder.is_dir() or not (folder/'README.md').exists(): continue
    number = int(folder.name[:2]); override = tree_overrides.get(folder.name,{})
    interactive = sorted(folder.glob(f'{number:02}_*lesson.html'))[0]
    stem = interactive.stem.removesuffix('_lesson')
    notebook = folder/f'{stem}.ipynb'
    if not notebook.exists(): notebook = sorted(folder.glob(f'{number:02}_*.ipynb'))[0]
    title = override.get('title') or clean(read(folder/'README.md').splitlines()[0]).split('—')[0].strip()
    if folder.name=='14_AStar_Floyd_Warshall':title='A* & Floyd–Warshall'
    paragraph = re.sub(r'\s+', ' ', ' '.join(line.lstrip('> ') for line in read(folder/'README.md').splitlines()[1:10] if line and not line.startswith(('#','Prerequisite','> 🎯'))))
    foundations.append({'slug':override.get('slug',slug(folder.name[3:])), 'title':title,'folder':folder.name,'source':relative(folder/'README.md'),'notebook':relative(notebook),'interactive':relative(interactive),'group':group_names.get(number,'Advanced graph algorithms'),'description':override.get('description') or clean(paragraph)[:210]})

rows = list(csv.DictReader(open(ROOT/'neetcode_150/neetcode150_patterns.csv',encoding='utf-8')))
patterns = {}
problems = {}
for row in rows:
    key = row['leetcode'].rstrip('/').split('/')[-1]
    pattern_id = slug(row['type']+'-'+re.sub(r'^\d+_', '', row['pattern']))
    pattern_folder = ROOT/'neetcode_150'/row['type']/row['pattern']
    if pattern_id not in patterns:
        source = pattern_folder/'README.md'
        interactive = next(iter(sorted(pattern_folder.glob('*_lesson.html'))),None)
        patterns[pattern_id] = {'slug':pattern_id,'title':re.sub(r'^\d+_', '', row['pattern']).replace('_',' '),'category':row['type'].replace('_',' '),'source':relative(source) if source.exists() else None,'interactive':relative(interactive) if interactive else None,'signals':[],'problems':[]}
    pattern = patterns[pattern_id]
    if row['signal'] not in pattern['signals']: pattern['signals'].append(row['signal'])
    pattern['problems'].append(key)
    problems[key] = {'slug':key,'title':row['problem'],'difficulty':row['difficulty'],'category':row['neetcode_category'],'topics':{'neetcode-150':row['neetcode_category']},'pattern':pattern_id,'tracks':['neetcode-150'],'order':int(row['neetcode_no']),'blindOrder':999,'leetcode':row['leetcode'],'signal':row['signal'],'variants':[]}
    notebook = pattern_folder/(row['file']+'.ipynb')
    if notebook.exists():
        html=notebook.with_suffix('.html')
        explanation=notebook.with_name(notebook.stem+'_explained.md')
        problems[key]['variants'].append({'track':'neetcode-150','notebook':relative(notebook),'interactive':relative(html) if html.exists() else None,'explanation':relative(explanation) if explanation.exists() else None})

blind_order=[]
for line in read(ROOT/'blind_75/Blind75_Tracker.md').splitlines():
    if not re.match(r'^\|\s*\[[xX ]\]',line):continue
    found=re.search(r'https://leetcode.com/problems/([^/\s|]+)',line)
    if found and found[1] not in blind_order:blind_order.append(found[1])
for notebook in sorted((ROOT/'blind_75').rglob('*.ipynb')):
    nb=json.loads(read(notebook));intro='\n'.join(''.join(c['source']) for c in nb['cells'][:3])
    match=re.search(r'https://leetcode.com/problems/([^/\s)]+)',intro)
    if not match: raise ValueError(f'Missing canonical URL: {notebook}')
    key=match[1]
    if key not in problems: raise ValueError(f'Blind 75 problem not found in authoritative catalog: {key}')
    problem=problems[key];problem['tracks'].append('blind-75')
    problem['topics']['blind-75']=notebook.relative_to(ROOT/'blind_75').parts[0]
    problem['blindOrder']=blind_order.index(key) if key in blind_order else 999
    html=notebook.with_suffix('.html');explanation=notebook.with_name(notebook.stem+'_explained.md')
    problem['variants'].insert(0,{'track':'blind-75','notebook':relative(notebook),'interactive':relative(html) if html.exists() else None,'explanation':relative(explanation) if explanation.exists() else None})

exercises=[]
for folder in sorted((ROOT/'company_loops/atlassian').iterdir(),key=lambda p:int(p.name.split('.')[0]) if p.name.split('.')[0].isdigit() else 999):
    if not folder.is_dir() or not (folder/'README.md').exists():continue
    title=clean(read(folder/'README.md').splitlines()[0]);notebook=next(iter(folder.glob('*.ipynb')),None);explanation=next(iter(folder.glob('*_explained.md')),None)
    description=next((clean(line.split('**Tags:**')[-1]).split('·')[0].strip(' ,') for line in read(folder/'README.md').splitlines() if '**Tags:**' in line),'Practical coding exercise and follow-up discussion.')
    exercises.append({'slug':slug(title),'title':title,'source':relative(folder/'README.md'),'notebook':relative(notebook) if notebook else None,'explanation':relative(explanation) if explanation else None,'description':description})

resources=[]
for parent in [ROOT/'docs',ROOT/'neetcode_150/docs']:
    for file in sorted(parent.iterdir()):
        if not file.is_file():continue
        title=clean(file.stem.replace('_',' '))
        kind='Video links' if 'YouTube' in title or 'links' in title.lower() else 'Study guide' if file.suffix=='.md' else 'Download'
        resources.append({'slug':slug(file.stem),'title':title,'source':relative(file),'format':file.suffix.lstrip('.').upper(),'kind':kind})
for title,source in [('Atlassian DSA study guide','company_loops/atlassian/DSA_Study_Guide.md'),('DSA used in Atlassian exercises','company_loops/atlassian/DSA_Used.md')]:
    if (ROOT/source).exists():resources.append({'slug':slug(title),'title':title,'source':source,'format':'MD','kind':'Study guide'})
for file in sorted((ROOT/'blind_75').glob('*/patterns.html')):
    title=file.parent.name+' pattern cheat sheet'
    resources.append({'slug':slug(title),'title':title,'source':relative(file),'format':'HTML','kind':'Cheat sheet'})
resources.append({'slug':'original-preparation-roadmap','title':'Original preparation roadmap','source':'leetcode-prep-roadmap.html','format':'HTML','kind':'Study guide'})
resource_slugs=[r['slug'] for r in resources]
for resource in resources:
    if resource_slugs.count(resource['slug'])>1:resource['slug']+='-'+resource['format'].lower()
assert len({r['slug'] for r in resources})==len(resources),'Resource slug collision'

source_routes={'README.md':'/','deep_dive/README.md':'/foundations/','blind_75/README.md':'/practice/blind-75/','neetcode_150/README.md':'/practice/neetcode-150/','company_loops/atlassian/README.md':'/company-prep/atlassian/'}
for item in foundations: source_routes[item['source']]='/foundations/'+item['slug']+'/'
for item in patterns.values():
    if item['source']:source_routes[item['source']]='/patterns/'+item['slug']+'/'
for problem in problems.values():
    for variant in problem['variants']:
        source_routes[variant['notebook']]='/problems/'+problem['slug']+'/'
        if variant['explanation']:source_routes[variant['explanation']]='/problems/'+problem['slug']+'/'
for item in exercises:source_routes[item['source']]='/company-prep/atlassian/'+item['slug']+'/'
for item in resources:source_routes[item['source']]='/resources/'+item['slug']+'/'
assets=[]
for parent in ['deep_dive','blind_75','neetcode_150','company_loops','docs']:
    assets += [relative(p) for p in (ROOT/parent).rglob('*') if p.is_file() and p.suffix.lower() in {'.html','.ipynb','.md','.png','.jpg','.jpeg','.svg','.pdf','.docx','.xlsx'} and not any(part.startswith('.') for part in p.relative_to(ROOT).parts)]
assets+=['leetcode-prep-roadmap.html','bench_utils.py','company_loops/atlassian/bench_utils.py']
catalog={'foundations':foundations,'patterns':list(patterns.values()),'problems':list(problems.values()),'exercises':exercises,'resources':resources,'sourceRoutes':source_routes,'assets':sorted(set(assets))}
assert len(foundations)==21 and len(problems)==150 and len(patterns)==55 and sum('blind-75' in p['tracks'] for p in problems.values())==75
(SITE/'generated').mkdir(exist_ok=True)
(SITE/'generated/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
search=[]
for kind,items,prefix in [('Foundation',foundations,'/foundations/'),('Pattern',list(patterns.values()),'/patterns/'),('Problem',list(problems.values()),'/problems/'),('Company exercise',exercises,'/company-prep/atlassian/'),('Resource',resources,'/resources/')]:
    for item in items:
        ready=bool(item.get('variants',[])) if kind=='Problem' else bool(item.get('source'))
        search.append({'title':item['title'],'description':kind+' · '+(item.get('description') or item.get('signal') or item.get('category') or item.get('kind',''))+(' · Study material planned' if not ready else ''),'href':prefix+item['slug']+'/','kind':kind,'id':('problem:'+item['slug']) if kind=='Problem' else item['slug'] if kind=='Foundation' else kind.lower().replace(' ','-')+':'+item['slug']})
(SITE/'generated/search.json').write_text(json.dumps(search,ensure_ascii=False)+'\n',encoding='utf-8')
print(f'Catalog: {len(foundations)} foundations, {len(patterns)} patterns ({sum(bool(p["source"]) for p in patterns.values())} written), 150 problems ({sum(bool(p["variants"]) for p in problems.values())} with material), {len(exercises)} exercises, {len(resources)} resources.')
