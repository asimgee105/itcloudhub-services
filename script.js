(function(){
const slides=[
 {tag:'CORE SERVICE',title:'Proactive IT Management<br>for <em>Growing Businesses</em>',copy:'Fast, monitored infrastructure that keeps your applications online and your team moving.',points:['24/7 Monitoring','Managed Servers','Proactive Support'],art:'hosting',cta:'Plan Your Hosting'},
 {tag:'STRATEGIC CAPABILITY',title:'End-to-End Infrastructure<br>for <em>Multi-Site Businesses</em>',copy:'Design, deploy and manage connected technology across offices, sites and distributed teams.',points:['Multi-Site Design','Centralised Control','Connected Teams'],art:'network',cta:'Plan Infrastructure'},
 {tag:'NETWORK INFRASTRUCTURE',title:'Reliable, Secure Networks<br>Built for <em>Business</em>',copy:'From the internet edge to every endpoint, keep requests flowing safely and reliably.',points:['Secure Routing','Live Traffic','Network Monitoring'],art:'traffic',cta:'Explore Networks'},
 {tag:'SECURITY & PROTECTION',title:'Layered Cybersecurity<br>for <em>Modern Business Threats</em>',copy:'Protect users, applications and data with a practical, end-to-end security strategy.',points:['Identify','Protect','Detect & Respond'],art:'security',cta:'Review Security'},
 {tag:'CLOUD SOLUTIONS',title:'Enterprise Cloud Platforms<br>for <em>Modern Business</em>',copy:'Deploy applications and workloads on flexible platforms with backups and monitoring built in.',points:['Cloud Migration','High Availability','Backup & Recovery'],art:'cloud',cta:'Explore Cloud'},
 {tag:'UNIFIED COMMUNICATIONS',title:'Connect Your Teams<br>with <em>Modern Cloud Communications</em>',copy:'Bring people, devices and locations together through dependable cloud communications.',points:['Cloud Calling','Team Collaboration','Remote Access'],art:'comms',cta:'Connect Your Team'},
 {tag:'AI & AUTOMATION',title:'Automate Workflows.<br><em>Accelerate Business Operations.</em>',copy:'Connect your systems and streamline repetitive tasks with practical automation.',points:['Workflow Design','System Integration','Less Manual Work'],art:'automation',cta:'Explore Automation'},
 {tag:'TECHNOLOGY SOURCING',title:'The Right Technology,<br><em>Sourced and Deployed for You</em>',copy:'Plan, source, configure and deploy the software and hardware your business depends on.',points:['Right-Fit Solutions','Deployment','Ongoing Management'],art:'devices',cta:'Discuss Your Project'}
];
const icon={server:'<rect x="-26" y="-24" width="52" height="48" rx="7"/><path d="M-26 -7h52M-26 9h52"/><circle cx="-17" cy="-16" r="2"/><circle cx="-17" cy="1" r="2"/><circle cx="-17" cy="17" r="2"/>',shield:'<path d="M0 -27 24 -18v20c0 17-9 29-24 36C-15 31-24 19-24 2v-20z"/><path d="m-11 2 8 8 16-17"/>',cloud:'<path d="M-23 14h44a13 13 0 0 0 1-26 21 21 0 0 0-40-5A15 15 0 0 0-23 14z"/>',screen:'<rect x="-27" y="-21" width="54" height="38" rx="4"/><path d="M-11 25h22M0 17v8M-19 -11h38"/>',people:'<circle cx="-10" cy="-11" r="8"/><circle cx="12" cy="-9" r="7"/><path d="M-26 19c0-14 32-14 32 0M5 16c3-10 22-10 24 1"/>',box:'<rect x="-23" y="-20" width="46" height="42" rx="4"/><path d="M-23 -6h46M-13 -14h4M-12 7h24"/>'};
function node(x,y,label,type='server',accent='blue',delay='0s'){return `<div class="art-node ${accent}" style="--x:${x}%;--y:${y}%;--delay:${delay}"><svg viewBox="-32 -35 64 70" aria-hidden="true">${icon[type]}</svg><span>${label}</span></div>`}
function line(x1,y1,x2,y2,color='#277fff',delay='0s'){return `<svg class="art-line" viewBox="0 0 1000 600" preserveAspectRatio="none"><path d="M${x1*10} ${y1*6} L${x2*10} ${y2*6}" stroke="${color}" stroke-width="1.3" stroke-dasharray="4 7" fill="none"/><circle r="3.3" fill="${color}"><animateMotion dur="2.7s" begin="${delay}" repeatCount="indefinite" path="M${x1*10} ${y1*6} L${x2*10} ${y2*6}"/></circle><circle r="2" fill="${color}"><animateMotion dur="2.7s" begin="${delay}" repeatCount="indefinite" path="M${x2*10} ${y2*6} L${x1*10} ${y1*6}"/></circle></svg>`}
const chip=(text,left,top,color='blue')=>`<div class="art-chip ${color}" style="left:${left}%;top:${top}%"><i></i>${text}</div>`;
function art(kind){const custom=window.ProITGraphics?.customArt(kind);if(custom)return custom;let nodes='',lines='',chips='',center='',theme='';
 if(kind==='hosting'){theme='hosting';nodes=node(71,21,'Visitor','people')+node(70,72,'Application','screen')+node(31,72,'Database','server')+node(31,21,'Backup','box');lines=line(71,21,50,46,'#23b8f8')+line(50,54,70,72,'#347bff','.5s')+line(50,54,31,72,'#347bff','1s')+line(31,21,50,46,'#1bddc7','1.5s');center='<div class="center-orb"><span class="orb-glyph">▤</span><small>HOST</small></div>';chips=chip('REQUEST →',65,40)+chip('← RESPONSE',13,50,'teal')+chip('99.9% uptime',68,91)}
 if(kind==='network'){theme='network';nodes=node(27,22,'Auckland','server')+node(74,20,'Wellington','screen')+node(27,75,'Hamilton','box')+node(74,76,'Christchurch','server');lines=line(27,22,50,49)+line(74,20,50,49,'#45a5ff','.7s')+line(27,75,50,53,'#20c8dc','1.2s')+line(74,76,50,53,'#45a5ff','1.9s');center='<div class="center-orb"><span class="orb-glyph">HQ</span><small>SYNCED</small></div>';chips=chip('4 locations online',38,88,'teal')}
 if(kind==='traffic'){theme='traffic';nodes=node(50,18,'Internet','cloud')+node(50,79,'Office Network','server')+node(24,78,'Devices','screen')+node(76,78,'Remote Teams','people');lines=line(50,18,50,45,'#21d0e0')+line(50,55,50,79,'#347bff','.5s')+line(50,52,24,78,'#347bff','1s')+line(50,52,76,78,'#347bff','1.5s');center='<div class="center-orb firewall"><span class="orb-glyph">⬡</span><small>FIREWALL</small></div>';chips=chip('THREAT BLOCKED',73,42,'red')+chip('ENCRYPTED',7,35,'teal')}
 if(kind==='security'){theme='security-art';nodes=node(20,27,'Users','people','blue')+node(80,27,'Applications','screen','blue')+node(20,75,'Network','server','blue')+node(80,75,'Data','box','blue');lines=line(20,27,50,48,'#4268f9')+line(80,27,50,48,'#4268f9','.5s')+line(20,75,50,53,'#7e59ff','1s')+line(80,75,50,53,'#7e59ff','1.5s');center='<div class="center-orb shield-orb"><svg viewBox="-32 -35 64 70">'+icon.shield+'</svg><small>PROTECTED</small></div>';chips=chip('LIVE SCANNING',5,8,'purple')+chip('ALL SYSTEMS SECURE',58,87,'teal')}
 if(kind==='cloud'){theme='cloud-art';nodes=node(22,28,'Website','screen')+node(78,28,'Services','box')+node(22,76,'Backups','server')+node(78,76,'Database','server');lines=line(22,28,50,48,'#12bfe8')+line(78,28,50,48,'#12bfe8','.5s')+line(22,76,50,53,'#3186ff','1s')+line(78,76,50,53,'#3186ff','1.5s');center='<div class="center-orb"><svg viewBox="-32 -35 64 70">'+icon.cloud+'</svg><small>CLOUD</small></div>';chips=chip('AUTO SCALING',36,6,'teal')+chip('SYNC COMPLETE',34,89)}
 if(kind==='comms'){theme='comms';nodes=node(26,23,'Office','people')+node(74,23,'Remote','screen')+node(26,76,'Phone','box')+node(74,76,'Teams','people');lines=line(26,23,50,48,'#20d4e7')+line(74,23,50,48,'#20d4e7','.5s')+line(26,76,50,53,'#1d85ff','1s')+line(74,76,50,53,'#1d85ff','1.5s');center='<div class="center-orb"><span class="orb-glyph">☏</span><small>CONNECTED</small></div>';chips=chip('CALL CONNECTED',5,48,'teal')+chip('HD VOICE',75,48)}
 if(kind==='automation'){theme='automation-art';nodes=node(20,22,'Input','box','purple')+node(80,22,'Validate','shield','purple')+node(20,78,'Notify','people','purple')+node(80,78,'Report','screen','purple');lines=line(20,22,50,48,'#994bff')+line(80,22,50,48,'#994bff','.5s')+line(20,78,50,53,'#24bddd','1s')+line(80,78,50,53,'#24bddd','1.5s');center='<div class="center-orb purple-orb"><span class="orb-glyph">✧</span><small>AUTOMATE</small></div>';chips=chip('TRIGGER',7,49,'purple')+chip('WORKFLOW COMPLETE',64,49,'teal')}
 if(kind==='devices'){theme='devices';nodes=node(27,24,'Laptop','screen')+node(73,24,'Server','server')+node(27,76,'Storage','box')+node(73,76,'Team','people');lines=line(27,24,50,48,'#2b88ff')+line(73,24,50,48,'#2b88ff','.5s')+line(27,76,50,53,'#18cfdf','1s')+line(73,76,50,53,'#18cfdf','1.5s');center='<div class="center-orb"><span class="orb-glyph">✓</span><small>READY</small></div>';chips=chip('CONFIGURED',5,48,'teal')+chip('DEPLOYED',74,48)}
 return `<div class="artboard ${theme}"><div class="artboard-grid"></div>${lines}${nodes}${center}${chips}<span class="visual-edge edge-a"></span><span class="visual-edge edge-b"></span></div>`}
let index=0,paused=false,hovered=false;
const stage=document.querySelector('#hero-visual');
const indicators=document.querySelector('#slide-indicators');
const progress=document.querySelector('#hero-progress-fill');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
slides.forEach((s,i)=>{
 const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`Show slide ${i+1}: ${s.tag}`);
 dot.addEventListener('click',()=>show(i));indicators.append(dot);
});
function updateProgressState(){progress.style.animationPlayState=(paused||hovered)?'paused':'running'}
function show(n){
 index=(n+slides.length)%slides.length;
 const s=slides[index];
 document.querySelector('#hero-tag').textContent=s.tag;
 document.querySelector('#hero-title').innerHTML=s.title;
 document.querySelector('#hero-copy').textContent=s.copy;
 const cta=document.querySelector('#hero-cta');cta.innerHTML=`${s.cta} <span>↗</span>`;
 cta.href=`services/${['managed-it','infrastructure','network-solutions','cybersecurity','cloud-solutions','business-communications','ai-automation','ict-procurement'][index]}/`;
 document.querySelector('#hero-points').innerHTML=s.points.map(p=>`<span>${p}</span>`).join('');
 document.querySelector('#slide-counter').textContent=`${String(index+1).padStart(2,'0')} / 08`;
 stage.innerHTML=art(s.art);stage.classList.remove('reveal');void stage.offsetWidth;stage.classList.add('reveal');
 indicators.querySelectorAll('button').forEach((dot,i)=>{dot.classList.toggle('active',i===index);dot.setAttribute('aria-current',i===index?'true':'false')});
 progress.classList.remove('running');void progress.offsetWidth;
 if(!reducedMotion){progress.classList.add('running');updateProgressState()}
}
progress.addEventListener('animationend',e=>{if(e.animationName==='slide-progress'&&!paused&&!hovered)show(index+1)});
show(0);
document.querySelector('.prev').addEventListener('click',()=>show(index-1));
document.querySelector('.next').addEventListener('click',()=>show(index+1));
document.querySelector('#slide-pause').addEventListener('click',e=>{
 paused=!paused;e.currentTarget.textContent=paused?'▶':'Ⅱ';e.currentTarget.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');updateProgressState();
});
document.addEventListener('keydown',e=>{if(document.activeElement?.closest('input, textarea, select'))return;if(e.key==='ArrowRight')show(index+1);if(e.key==='ArrowLeft')show(index-1)});
document.querySelector('.hero').addEventListener('mouseenter',()=>{hovered=true;updateProgressState()});
document.querySelector('.hero').addEventListener('mouseleave',()=>{hovered=false;updateProgressState()});

const counters=document.querySelectorAll('.stat-value');
function finalValue(el){const end=Number(el.dataset.end),decimals=Number(el.dataset.decimals||0);return end.toFixed(decimals)+(el.dataset.suffix||'')}
function animateCounters(){
 counters.forEach(el=>{
  if(el.dataset.counted)return;el.dataset.counted='true';
  if(reducedMotion||Number(el.dataset.end)===0){el.textContent=finalValue(el);return}
  const start=performance.now(),end=Number(el.dataset.end),decimals=Number(el.dataset.decimals||0),duration=1600;
  function frame(time){const t=Math.min((time-start)/duration,1),eased=1-Math.pow(1-t,3);el.textContent=(end*eased).toFixed(decimals)+(el.dataset.suffix||'');if(t<1)requestAnimationFrame(frame);else el.textContent=finalValue(el)}
  requestAnimationFrame(frame);
 });
}
if('IntersectionObserver'in window){
 const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){animateCounters();observer.disconnect()}},{threshold:.25});observer.observe(document.querySelector('.stats-strip'));
}else animateCounters();
const stages=[{title:'Identify',sub:'Know your attack surface.',desc:'We audit your assets, users, and access points across the business — mapping vulnerabilities before attackers do.',list:['Asset discovery & inventory','Risk assessment','Compliance gap analysis']},{title:'Protect',sub:'Harden every layer.',desc:'Multi-layered security controls protect your people, devices, and network from modern threats.',list:['Endpoint & email security','Firewall & network hardening','MFA & identity management']},{title:'Detect',sub:'Spot threats early.',desc:'Continuous monitoring helps find unusual activity before it can disrupt your operations.',list:['Security monitoring','Threat intelligence','Anomaly detection']},{title:'Respond',sub:'Act with confidence.',desc:'A clear response plan helps your team contain incidents and return to normal quickly.',list:['Incident response planning','Containment & remediation','Team coordination']},{title:'Recover',sub:'Keep business moving.',desc:'Reliable backup and recovery processes restore systems and protect your long-term operations.',list:['Backup & disaster recovery','Business continuity planning','Post-incident improvement']}];document.querySelectorAll('.security-tabs button').forEach(btn=>btn.addEventListener('click',()=>{let n=+btn.dataset.stage,s=stages[n];document.querySelectorAll('.security-tabs button').forEach(b=>{let active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});document.querySelector('#stage-count').textContent=`Stage ${n+1} of 5`;document.querySelector('#stage-title').textContent=s.title;document.querySelector('#stage-subtitle').textContent=s.sub;document.querySelector('#stage-desc').textContent=s.desc;document.querySelector('#stage-list').innerHTML=s.list.map(v=>`<li>${v}</li>`).join('')}));document.querySelector('#stage-list').innerHTML=stages[0].list.map(v=>`<li>${v}</li>`).join('');document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#contact-form').addEventListener('submit',async e=>{e.preventDefault();const d=new FormData(e.currentTarget);const body=`Name: ${d.get('first')} ${d.get('last')}\nCompany: ${d.get('company')}\nEmail: ${d.get('email')}\nLocations: ${d.get('locations')}\n\n${d.get('message')}`;const button=e.currentTarget.querySelector('[type=submit]');try{await navigator.clipboard.writeText(body);button.textContent='Message copied ✓';setTimeout(()=>button.textContent='Prepare Message ↗',3500)}catch{const output=document.createElement('textarea');output.value=body;output.readOnly=true;output.className='copy-output';e.currentTarget.append(output);output.select();button.textContent='Select and copy your message'}});

})();
