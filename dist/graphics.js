(function(){
/* Each graphic is live SVG: paths, devices and packets remain editable code. */
const graphicBase=(theme,body)=>`<div class="diagram ${theme}"><svg viewBox="0 0 520 420" role="presentation" aria-hidden="true"><defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="cloudFill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#175d81"/><stop offset="1" stop-color="#092039"/></linearGradient><linearGradient id="shieldFill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#244d97" stop-opacity=".55"/><stop offset="1" stop-color="#43205e" stop-opacity=".6"/></linearGradient></defs>${body}</svg></div>`;
const packet=(path,color='#29a8ff',delay='0s',duration='3.4s',radius=4)=>`<circle r="${radius}" fill="${color}" filter="url(#glow)"><animateMotion dur="${duration}" begin="${delay}" repeatCount="indefinite" path="${path}"/></circle>`;
const diagramLine=(path,color='#1b78c0')=>`<path d="${path}" fill="none" stroke="${color}" stroke-width="1.35" stroke-dasharray="5 5" opacity=".7"/>`;
const label=(x,y,text,color='#8ac2ff',size=10)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="600">${text}</text>`;
const ring=(x,y,r,color='#2b8ee7')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#102953" stroke="${color}" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="${r+6}" fill="none" stroke="${color}" stroke-opacity=".15"/>`;
function customArt(kind){
 if(kind==='traffic'){
  const paths=['M260 52 L260 165','M260 165 L260 260','M260 260 L102 338','M260 260 L260 350','M260 260 L422 338'];
  return graphicBase('router-diagram',`<g class="diagram-grid"></g>${paths.map(p=>diagramLine(p)).join('')}${packet(paths[0],'#3296ff','0s')}${packet(paths[1],'#3296ff','.8s')}${packet(paths[2],'#0bd4e3','1.4s')}${packet(paths[3],'#0bd4e3','1.9s')}${packet(paths[4],'#0bd4e3','2.4s')}
  <g class="diagram-box"><rect x="222" y="27" width="76" height="49" rx="7" stroke="#388aff"/>${label(260,57,'ROUTER')}</g>
  <g class="diagram-box"><rect x="222" y="140" width="76" height="52" rx="7" stroke="#d84b55"/>${label(260,170,'FIREWALL','#ff7180')}</g>
  <g class="diagram-box"><rect x="222" y="234" width="76" height="52" rx="7" stroke="#16cadf"/>${label(260,265,'SWITCH','#4ee8f5')}</g>
  ${[[102,338,'AP-1'],[260,350,'AP-2'],[422,338,'AP-3']].map(([x,y,t])=>`<circle cx="${x}" cy="${y}" r="23" fill="#091a2a" stroke="#0ebed3" stroke-width="1.8"/>${label(x,y+3,t,'#45d8ed',9)}<path d="M${x-20} ${y-24} Q${x} ${y-43} ${x+20} ${y-24}" fill="none" stroke="#0fb8da" stroke-opacity=".35"/>`).join('')}`);
 }
 if(kind==='network'){
  let links=[[260,205,110,70],[260,205,415,68],[260,205,110,340],[260,205,415,340]];
  return graphicBase('hq-diagram',links.map(([x1,y1,x2,y2],i)=>diagramLine(`M${x1} ${y1} L${x2} ${y2}`)+packet(`M${x1} ${y1} L${x2} ${y2}`,'#56a9ff',`${i*.6}s`)).join('')+`<circle cx="260" cy="205" r="37" fill="#1b5dd5" stroke="#75b3ff" stroke-width="2" filter="url(#glow)"/>${label(260,211,'HQ','#fff',17)}`+[[110,70,'Auckland'],[415,68,'Wellington'],[110,340,'Hamilton'],[415,340,'Christchurch']].map(([x,y,t])=>`${ring(x,y,24)}${label(x,y+3,t,'#fff',9)}`).join(''));
 }
 if(kind==='security'){
  const orbits=[`<ellipse cx="260" cy="209" rx="170" ry="64" fill="none" stroke="#2d5caa" stroke-dasharray="5 6" opacity=".5"/>`,`<ellipse cx="260" cy="209" rx="132" ry="49" fill="none" stroke="#4856aa" stroke-dasharray="5 6" opacity=".5"/>`];
  return graphicBase('shield-diagram',`${orbits.join('')}<g class="shield-symbol" filter="url(#glow)"><path d="M260 56 328 91v103c0 72-25 115-68 145-43-30-68-73-68-145V91z" fill="url(#shieldFill)" stroke="#a382d6" stroke-width="2.5"/><path d="m239 192 17 19 31-36" fill="none" stroke="#67b4ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>`+[[74,159,'#f45e68'],[444,137,'#38e186'],[87,312,'#9bc960'],[432,315,'#f69b58']].map(([x,y,c],i)=>`<circle cx="${x}" cy="${y}" r="12" fill="${c}" fill-opacity=".16" stroke="${c}"/><path d="M${x-4} ${y-4}l8 8m0-8-8 8" stroke="${c}" stroke-width="1"/><circle class="threat-wave" cx="${x}" cy="${y}" r="12" fill="none" stroke="${c}" opacity=".4" style="animation-delay:${i*.7}s"/>`).join('')+packet('M74 159 Q170 175 192 194','#f45e68')+packet('M444 137 Q349 155 329 177','#38e186','1s'));
 }
 if(kind==='cloud'){
  const links=['M84 196 L205 196','M317 196 L433 196','M260 231 L260 350','M210 217 L110 350','M308 217 L410 350'];
  return graphicBase('cloud-diagram',`<circle cx="260" cy="194" r="165" fill="none" stroke="#2a82b0" stroke-opacity=".16" stroke-dasharray="5 7"/><circle cx="260" cy="194" r="120" fill="none" stroke="#2a82b0" stroke-opacity=".13" stroke-dasharray="4 7"/>${links.map((p,i)=>diagramLine(p,'#168bbb')+packet(p,'#39b9f5',`${i*.35}s`)).join('')}
  <path d="M205 232 Q171 232 178 195 Q181 171 204 168 Q212 132 247 134 Q271 125 290 154 Q324 150 332 184 Q349 219 316 232z" fill="url(#cloudFill)" stroke="#3abcf6" stroke-width="2.4" filter="url(#glow)"/>${label(258,197,'CLOUD','#e4f8ff',16)}
  ${[[83,196,'OneDrive','#238cf1'],[150,127,'Azure','#1893ec'],[150,266,'SharePoint','#10aaaf'],[373,127,'Intune','#228af3'],[433,196,'Teams','#6c71b9'],[374,266,'Outlook','#248af2']].map(([x,y,t,c])=>`<circle cx="${x}" cy="${y}" r="25" fill="#08192c" stroke="${c}" stroke-width="2"/>${label(x,y+3,t,'#e3f5ff',8)}`).join('')}
  ${[[110,350,'PC'],[260,350,'Mobile'],[410,350,'Laptop']].map(([x,y,t])=>`<rect x="${x-26}" y="${y-15}" width="52" height="36" rx="5" fill="#0b1b2e" stroke="#167eb0"/>${label(x,y+6,t,'#84b6d4',9)}`).join('')}<rect x="359" y="58" width="135" height="37" rx="5" fill="#0c344d" stroke="#1689bc"/><circle cx="376" cy="76" r="5" fill="#36b7ea"/>${label(433,80,'Synced ✓','#78d4f3',10)}`);
 }
 if(kind==='automation'){
  const cols=[[72,120],[72,194],[72,270],[72,345]],mid=[[210,145],[210,230],[210,315]],next=[[340,177],[340,268]],out=[[465,205],[465,287]];
  const edges=[];cols.forEach(([x,y],i)=>{mid.forEach(([a,b],j)=>{if((i+j)%2===0||j===1)edges.push([x,y,a,b])})});mid.forEach(([x,y],i)=>next.forEach(([a,b])=>edges.push([x,y,a,b])));next.forEach(([x,y])=>out.forEach(([a,b])=>edges.push([x,y,a,b])));
  return graphicBase('ai-diagram',edges.map(([x1,y1,x2,y2],i)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${i%3?'#3755a1':'#168bc9'}" opacity=".38" stroke-width="1"/>`+(i%3===0?packet(`M${x1} ${y1} L${x2} ${y2}`,'#27bee8',`${i*.18}s`,'3s',3):'')).join('')+[[cols,'#7a47cd'],[mid,'#7547d6'],[next,'#8654d9'],[out,'#0caad0']].map(([arr,color])=>arr.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="14" fill="#0a1733" stroke="${color}" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="5" fill="${color}"/>`).join('')).join('')+`<rect x="130" y="381" width="80" height="26" rx="4" fill="#211645" stroke="#7345c8"/>${label(170,398,'Input','#ceb5ff',9)}<rect x="251" y="381" width="80" height="26" rx="4" fill="#143447" stroke="#1c9fb0"/>${label(291,398,'Process','#a9eaf5',9)}<rect x="372" y="381" width="80" height="26" rx="4" fill="#211645" stroke="#7345c8"/>${label(412,398,'Output','#ceb5ff',9)}`);
 }
 if(kind==='devices'){
  return graphicBase('devices-diagram',`<g class="device-laptop"><rect x="34" y="140" width="117" height="75" rx="6" fill="#102a5b" stroke="#458ef7" stroke-width="2" filter="url(#glow)"/><rect x="42" y="148" width="101" height="58" rx="3" fill="#152555" stroke="#3a75be"/>${label(92,181,'LAPTOP','#9abfff',11)}<path d="M28 222h128l-7 9H35z" fill="#224ea5" stroke="#4288e7"/></g>
  <g><rect x="187" y="89" width="86" height="147" rx="7" fill="#122549" stroke="#3a86e8" stroke-width="2"/>${[0,1,2,3].map(i=>`<rect x="194" y="${100+i*30}" width="72" height="22" rx="3" fill="#193255" stroke="#4673b4"/>`).join('')}${label(230,253,'SERVER','#70adf9',10)}</g>
  <g><rect x="335" y="145" width="135" height="48" rx="5" fill="#0c2539" stroke="#17aeca" stroke-width="2"/>${Array.from({length:9},(_,i)=>`<rect x="${345+i*13}" y="157" width="7" height="22" fill="#153c60" stroke="#2e7b9e" stroke-width=".5"/>`).join('')}${label(403,212,'SWITCH','#42d5e8',10)}</g>
  <g><rect x="374" y="246" width="58" height="110" rx="8" fill="#10244a" stroke="#377cd2" stroke-width="2"/><rect x="380" y="252" width="46" height="83" fill="#142a58"/><circle cx="403" cy="346" r="4" fill="#4279ce"/>${label(403,372,'MOBILE','#83aaf0',10)}</g>
  ${diagramLine('M151 178 L187 178')}${diagramLine('M273 178 L335 169')}${diagramLine('M403 193 L403 246')}${packet('M151 178 L187 178','#38adff')}${packet('M273 178 L335 169','#29cedc','1s')}${packet('M403 193 L403 246','#37a1ff','2s')}`);
 }
 return null;
}

window.ProITGraphics={customArt};
})();
