#!/usr/bin/env python3
"""Build editable draw.io diagrams, SVG previews and a self-contained print manual.
Standard library only. Run from any directory with Python 3.
"""
from pathlib import Path
import html
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
INK = '#173c37'

class Diagram:
    def __init__(self, name, width=1200, height=760):
        self.width, self.height = width, height
        self.mx = ET.Element('mxfile', host='app.diagrams.net', agent='IRO assignment generator')
        d = ET.SubElement(self.mx, 'diagram', name=name, id=name.lower().replace(' ', '-'))
        model = ET.SubElement(d, 'mxGraphModel', dx=str(width), dy=str(height), grid='1', page='1', pageWidth=str(width), pageHeight=str(height))
        self.root = ET.SubElement(model, 'root')
        ET.SubElement(self.root, 'mxCell', id='0')
        ET.SubElement(self.root, 'mxCell', id='1', parent='0')
        self.svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img"><title>{html.escape(name)}</title><rect width="100%" height="100%" fill="white"/>']
        self.counter = 1
    def shape(self, text, x, y, w, h, kind='box', fill='#f0f4e8', size=18):
        self.counter += 1
        id_ = str(self.counter)
        style = f'whiteSpace=wrap;html=0;fontFamily=Arial;fontSize={size};fontColor={INK};strokeColor={INK};fillColor={fill};'
        style += {'box':'rounded=1;', 'ellipse':'ellipse;', 'text':'strokeColor=none;fillColor=none;', 'actor':'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;'}[kind]
        cell = ET.SubElement(self.root, 'mxCell', id=id_, value=text, style=style, vertex='1', parent='1')
        ET.SubElement(cell, 'mxGeometry', x=str(x), y=str(y), width=str(w), height=str(h), **{'as':'geometry'})
        if kind == 'ellipse':
            self.svg.append(f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" fill="{fill}" stroke="{INK}"/>')
        elif kind == 'box':
            self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{fill}" stroke="{INK}"/>')
        elif kind == 'actor':
            cx = x+w/2
            self.svg.append(f'<g fill="none" stroke="{INK}" stroke-width="2"><circle cx="{cx}" cy="{y+16}" r="14"/><path d="M{cx} {y+30}v40m-25 -25h50m-25 25l-25 30m25 -30l25 30"/></g>')
            y += h; h = 55
        lines = text.split('\n')
        start = y+h/2 - (len(lines)-1)*size*.65
        for i,line in enumerate(lines):
            self.svg.append(f'<text x="{x+w/2}" y="{start+i*size*1.3}" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="{size}" fill="{INK}">{html.escape(line)}</text>')
        return id_
    def line(self, x1, y1, x2, y2, dashed=False, arrow=False, label=''):
        self.counter += 1
        style = f'edgeStyle=none;rounded=0;html=0;endArrow={"open" if arrow else "none"};strokeColor={INK};fontSize=14;'
        if dashed: style += 'dashed=1;'
        cell = ET.SubElement(self.root, 'mxCell', id=str(self.counter), value=label, style=style, edge='1', parent='1')
        geo = ET.SubElement(cell, 'mxGeometry', relative='1', **{'as':'geometry'})
        ET.SubElement(geo, 'mxPoint', x=str(x1), y=str(y1), **{'as':'sourcePoint'})
        ET.SubElement(geo, 'mxPoint', x=str(x2), y=str(y2), **{'as':'targetPoint'})
        dash = ' stroke-dasharray="7 5"' if dashed else ''
        self.svg.append(f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{INK}" stroke-width="2"{dash}/>')
        if arrow:
            import math
            a = math.atan2(y2-y1,x2-x1)
            points = [(x2-12*math.cos(a-.45),y2-12*math.sin(a-.45)),(x2,y2),(x2-12*math.cos(a+.45),y2-12*math.sin(a+.45))]
            self.svg.append('<polyline points="'+' '.join(f'{x},{y}' for x,y in points)+f'" fill="none" stroke="{INK}" stroke-width="2"/>')
        if label: self.shape(label,(x1+x2)/2-85,(y1+y2)/2-22,170,25,'text',size=14)
    def save(self, stem):
        ET.indent(self.mx)
        (ROOT/'diagrams'/f'{stem}.drawio').write_text(ET.tostring(self.mx,encoding='unicode'),encoding='utf-8')
        (ROOT/'diagrams'/f'{stem}.svg').write_text(''.join(self.svg)+'</svg>',encoding='utf-8')

def diagrams():
    d = Diagram('Ishikawa problem analysis',1200,720)
    d.shape('IRO / ISHIKAWA PROBLEM ANALYSIS',30,15,1140,50,'text',size=24)
    d.shape('Candidate causes to validate through questionnaire responses and interviews',30,70,1140,35,'text',size=17)
    d.line(50,365,970,365,arrow=True)
    branches = [
        ('People','Unclear responsible contact\nReluctance to report\nDigital-literacy barriers',210,True),
        ('Process','Informal verbal reports\nNo tracking reference\nUnclear follow-up',500,True),
        ('Technology','Scattered reporting channels\nPoor internet access\nDifficult interfaces',790,True),
        ('Information','Incomplete descriptions\nMissing location\nUnclear issue categories',210,False),
        ('Governance','Unclear issue ownership\nNo escalation policy\nWeak accountability',500,False),
        ('Environment','Shared infrastructure strain\nDistance between communities\nStudent-resident tensions',790,False)
    ]
    for title,causes,x,top in branches:
        label_y = 135 if top else 565
        d.shape(title,x-140,label_y,250,40,size=20)
        d.shape(causes,x-140,label_y+45,250,100,'text',size=16)
        d.line(x-90,285 if top else 555,x,365)
    d.shape('Delayed or ineffective\nhandling of student\nand community issues',975,295,210,140,fill='#d9f078',size=19)
    d.shape('Hypotheses only: no survey findings are claimed.',30,675,1140,30,'text',size=16)
    d.save('ishikawa')
    d = Diagram('IRO prototype use cases',1200,900)
    d.shape('IRO / PROTOTYPE USE-CASE DIAGRAM',30,10,1140,50,'text',size=24)
    d.shape('IRO browser prototype',245,85,740,735,fill='#ffffff',size=1)
    d.shape('IRO browser prototype',460,95,320,35,'text',size=20)
    d.shape('Reporter\nStudent / indigene / both',15,200,200,100,'actor',size=17)
    d.shape('Staff-demo user\nUnrestricted demonstration',995,485,200,100,'actor',size=17)
    for text,x,y,w,h in [('Submit issue',300,175,240,80),('Track issue',300,330,240,80),('View / filter queue',660,445,250,80),('Update status',660,585,250,80),('Add fictional samples',660,710,250,70),('Validate input',650,165,250,80),('Generate reference',650,285,250,80),('Record status history',300,585,260,80)]:
        d.shape(text,x,y,w,h,'ellipse',size=18)
    d.line(145,255,300,215); d.line(145,270,300,370)
    d.line(1055,540,910,485); d.line(1055,550,910,625); d.line(1055,570,910,745)
    d.line(540,200,650,200,dashed=True,arrow=True,label='<<include>>')
    d.line(535,240,650,315,dashed=True,arrow=True,label='<<include>>')
    d.line(660,625,560,625,dashed=True,arrow=True,label='<<include>>')
    d.shape('Production staff authentication and authority routing are outside this prototype.',30,840,1140,35,'text',size=17)
    d.save('use-case')

def inline(s):
    s = html.escape(s)
    s = re.sub(r'`([^`]+)`',r'<code>\1</code>',s)
    s = re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',s)
    return s

def markdown(text):
    out=[]; table=False; code=False; buffer=[]
    for line in text.splitlines():
        if line.startswith('```'):
            if code: out.append('<pre>'+html.escape('\n'.join(buffer))+'</pre>'); buffer=[]
            code=not code; continue
        if code: buffer.append(line); continue
        is_table=line.startswith('|')
        if table and not is_table: out.append('</tbody></table>'); table=False
        if is_table:
            cells=[c.strip() for c in line.strip('|').split('|')]
            if all(re.fullmatch(r':?-+:?',c) for c in cells): continue
            if not table: out.append('<table><tbody>'); table=True
            out.append('<tr>'+''.join('<td>'+inline(c)+'</td>' for c in cells)+'</tr>'); continue
        if not line.strip(): continue
        if line.startswith('#'):
            level=min(len(line)-len(line.lstrip('#')),4)
            out.append(f'<h{level}>'+inline(line.lstrip('#').strip())+f'</h{level}>')
        elif line.startswith('- '): out.append('<p class="bullet">&#8226; '+inline(line[2:])+'</p>')
        else: out.append('<p>'+inline(line)+'</p>')
    if table: out.append('</tbody></table>')
    return '\n'.join(out)

def manual():
    css='''@page{size:A4;margin:17mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:10pt;line-height:1.4;color:#173c37;max-width:190mm;margin:20px auto}h1{font-size:18pt;border-bottom:2px solid #173c37;padding-bottom:8px}h2{font-size:12pt;margin-top:20px}h3,h4{font-size:10pt}p{margin:7px 0}.bullet{margin-left:10px}table{border-collapse:collapse;width:100%;font-size:10pt}td{border:1px solid #bbc9c0;padding:5px;vertical-align:top;overflow-wrap:anywhere}tr{break-inside:avoid}tr:first-child{font-weight:bold;background:#f0f4e8}section{break-before:page}pre{font-family:monospace;font-size:10pt;line-height:1.35;white-space:pre-wrap;overflow-wrap:anywhere;color:#17251d}code{font-size:10pt}svg{width:100%;height:auto}.cover{padding-top:55mm;min-height:245mm}.cover h1{font-size:32pt}.muted{color:#5b6a61}.screen{padding:12px;background:#f0f4e8}@media print{body{margin:0;max-width:none}.screen{display:none}a{color:inherit;text-decoration:none}}'''
    parts=['<!doctype html><html lang="en"><meta charset="utf-8"><title>IRO - CSC426 Print Manual</title><style>'+css+'</style><body>', '<p class="screen">Print on A4 at 100% scale. Turn browser headers/footers off. Body and source text are 10pt. Print after lecturer acknowledgment.</p>', '<div class="cover"><p>CSC426 / WEEKEND 3</p><h1>IRO<br>Issues Reporting Outlet</h1><p>Software requirements, diagrams, object listing and code listing</p><h2>Temidayo Ayomide Falomo</h2><p>Matric number: <strong>220404260</strong></p><p>Prepared: 19 October 2026</p><p class="muted">Academic browser prototype for AAUA students and host-community indigenes.</p></div>']
    parts.append('<section>'+markdown((ROOT/'docs/SRS.md').read_text())+'</section>')
    for name,title,doc in [('ishikawa','Ishikawa diagram','ishikawa.md'),('use-case','Use-case diagram','use-cases.md')]:
        parts.append('<section><h1>'+title+'</h1>'+(ROOT/f'diagrams/{name}.svg').read_text()+markdown((ROOT/'docs'/doc).read_text())+'</section>')
    parts.append('<section>'+markdown((ROOT/'docs/object-listing.md').read_text())+'</section>')
    parts.append('<section>'+markdown((ROOT/'questionnaire/questionnaire.md').read_text())+'</section>')
    sources=sorted((ROOT/'app').glob('*'))+[ROOT/'questionnaire/create-google-form.gs',ROOT/'tests/model.test.cjs']
    for path in sources:
        source=path.read_text()
        # Wrap compressed CSS into readable rules without changing the source file.
        if path.suffix=='.css': source=source.replace('}', '}\n').replace(';',';\n  ')
        parts.append('<section><h1>Code listing</h1><h2>'+html.escape(str(path.relative_to(ROOT)))+'</h2><pre>'+html.escape(source)+'</pre></section>')
    parts.append('</body></html>')
    (ROOT/'docs/print-manual.html').write_text('\n'.join(parts),encoding='utf-8')

if __name__ == '__main__':
    diagrams()
    manual()
    print('Built 2 editable draw.io diagrams, 2 SVG previews and print-manual.html.')
