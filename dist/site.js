(function(){
const nav=document.querySelector('.nav'),toggle=document.querySelector('.menu-toggle');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu')});
document.querySelectorAll('.nav-group > button').forEach(button=>button.addEventListener('click',()=>{const group=button.closest('.nav-group');const open=!group.classList.contains('open');document.querySelectorAll('.nav-group').forEach(g=>{g.classList.remove('open');g.querySelector('button').setAttribute('aria-expanded','false')});group.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open))}));
document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))document.querySelectorAll('.nav-group').forEach(g=>{g.classList.remove('open');g.querySelector('button').setAttribute('aria-expanded','false')})});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.nav-group').forEach(g=>{g.classList.remove('open');g.querySelector('button').setAttribute('aria-expanded','false')});nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
const targets=document.querySelectorAll('.scroll-reveal,.service-grid article,.feature-panel,.problem-grid article,.automation-grid article,.offer-grid a,.trust-stats div');
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}})},{threshold:.08});targets.forEach((el,i)=>{el.classList.add('will-reveal');el.style.setProperty('--reveal-delay',`${Math.min(i%5,4)*70}ms`);observer.observe(el)})}

})();
