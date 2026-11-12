(() => {
'use strict';
const $=id=>document.getElementById(id), reduce=matchMedia('(prefers-reduced-motion: reduce)');
const PUBLIC_URL='https://rayray77985-dev.github.io/buaa-yunjian-zhijiang/?v=20261112';
const topics={
campus:{number:'01',title:'你窗外的日常，也许是我的新鲜事。',copy:'一条常走的校园小路、一次社团活动，或课堂上让你眼前一亮的小知识。把它讲得具体一点，让远方的伙伴也能“看见”。',question:'“最近有没有一件小事，让你特别开心？”'},
study:{number:'02',title:'分享走过的路，也听听你想去的地方。',copy:'聊聊一次学习中的尝试、一个让你坚持下去的小方法，或你怎样慢慢认识自己的专业。分享亲身经历，也认真回应对方真正关心的问题。',question:'“有没有一门课，或一个问题，让你想再多了解一点？”'},
hometown:{number:'03',title:'说说你的家乡，也认识我的四季。',copy:'一种家乡的味道、一条熟悉的街道，或一个节日里的小习惯。用平等、尊重的方式分享，让书信成为认识彼此生活的一扇窗。',question:'“如果我第一次去你的家乡，你最想介绍什么？”'}
};
let letterOpen=false;
function openLetter(){
 letterOpen=true;$('open-letter').hidden=true;$('open-letter').setAttribute('aria-expanded','true');$('letter-body').hidden=false;
 $('letter-body').querySelector('[data-topic]').focus({preventScroll:true});
}
function foldLetter(){letterOpen=false;$('letter-body').hidden=true;$('open-letter').hidden=false;$('open-letter').setAttribute('aria-expanded','false');$('open-letter').focus({preventScroll:true});}
$('open-letter').onclick=openLetter;$('fold-letter').onclick=foldLetter;
document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{
 const data=topics[button.dataset.topic];
 document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 $('topic-number').textContent='话题 / '+data.number;$('topic-title').textContent=data.title;$('topic-copy').textContent=data.copy;$('topic-question').textContent=data.question;
 const el=document.querySelector('.topic-content');
 if(!reduce.matches&&el.animate)el.animate([{opacity:.45,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:300,easing:'ease-out'});
}));
let toastTimer;
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3200);}
async function copy(value,message){
 let ok=false;
 try{await navigator.clipboard.writeText(value);ok=true;}catch(_){
  const input=document.createElement('textarea');input.value=value;input.setAttribute('readonly','');input.style.cssText='position:fixed;top:0;left:0;opacity:0';(shareDialog.open?shareDialog:document.body).append(input);input.focus();input.select();
  try{ok=document.execCommand('copy');}catch(_){}input.remove();
 }
 if(ok)toast(message);else window.prompt('请复制以下内容：',value);
}
$('copy-account').onclick=()=>copy('北航蓝天志愿者','公众号名称已复制，可前往微信搜索');
const shareDialog=$('share-dialog');let opener=null;
function share(){
 opener=document.activeElement;
 try{const code=qrcode(0,'M');code.addData(PUBLIC_URL);code.make();$('share-qr').src=code.createDataURL(7,4);}catch(_){}
 if(typeof shareDialog.showModal==='function'){shareDialog.showModal();document.body.classList.add('modal-open');shareDialog.querySelector('.close-dialog').focus();}
 else{copy(PUBLIC_URL,'项目链接已复制，分享给朋友吧');}
}
document.querySelectorAll('.share-trigger').forEach(b=>b.onclick=share);
shareDialog.querySelector('.close-dialog').onclick=()=>shareDialog.close();
shareDialog.addEventListener('click',e=>{if(e.target===shareDialog){const r=shareDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)shareDialog.close();}});
shareDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus({preventScroll:true});updatePosition();});
$('copy-link').onclick=()=>copy(PUBLIC_URL,'项目链接已复制，分享给朋友吧');
const dock=document.querySelector('.mobile-dock'),hero=document.querySelector('.hero'),progress=document.querySelector('.reading-track span');
const sections=['about','journey','join'].map($);
const rail=document.querySelector('.journey-rail'),railFill=rail.querySelector('span'),railLetter=rail.querySelector('i');
let ticking=false;
function clamp(v){return Math.max(0,Math.min(1,v));}
function updatePosition(){
 const y=scrollY,total=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+clamp(y/Math.max(1,total))+')';
 const show=hero.getBoundingClientRect().bottom<90;dock.classList.toggle('visible',show);dock.inert=!show||shareDialog.open;
 let current='about';sections.forEach(section=>{if(section.getBoundingClientRect().top<innerHeight*.5)current=section.id;});
 dock.querySelectorAll('a').forEach(a=>{if(a.dataset.section===current)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
 const journey=document.getElementById('journey').getBoundingClientRect(),amount=clamp((innerHeight*.85-journey.top)/(journey.height*.9));
 railFill.style.transform='scaleX('+amount+')';railLetter.style.left=amount*100+'%';
 document.querySelector('.hero-xiaogu').style.animationPlayState=document.hidden||hero.getBoundingClientRect().bottom<0?'paused':'running';
 ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updatePosition);}},{passive:true});
addEventListener('resize',updatePosition);document.addEventListener('visibilitychange',updatePosition);updatePosition();
if('IntersectionObserver'in window&&!reduce.matches){
 const targets=[...document.querySelectorAll('.ribbon,.section-heading>.eyebrow,.section-heading h2,.section-heading .section-sub,.about-copy>p,.about-tags,.connection-paper,.journey li,.journey-note,.letter-intro,.letter-interactive,.voice-card,.care-grid article,.join-paper,.faq>div:first-child,.faq-list details,.closing>p,.closing>.primary')];
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('wait');observer.unobserve(e.target);}}),{rootMargin:'0px 0px -12px 0px',threshold:0});
 const groups=new Map();
 targets.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)return;const n=groups.get(el.parentElement)||0;groups.set(el.parentElement,n+1);el.style.setProperty('--delay',Math.min(n,3)*65+'ms');el.classList.add('reveal','wait');observer.observe(el);});
 document.addEventListener('focusin',e=>{const el=e.target.closest('.wait');if(el){el.classList.remove('wait');observer.unobserve(el);}});
 reduce.addEventListener?.('change',e=>{if(e.matches){targets.forEach(el=>el.classList.remove('wait'));observer.disconnect();}});
}
})();

