(() => {
'use strict';
const $=id=>document.getElementById(id), reduce=matchMedia('(prefers-reduced-motion: reduce)');
const PUBLIC_URL='https://rayray77985-dev.github.io/buaa-yunjian-zhijiang/?v=20261112-photos';
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
const sections=['about','moments','join'].map($);
const rail=document.querySelector('.journey-rail'),railFill=rail.querySelector('span'),railLetter=rail.querySelector('i');
let ticking=false;
function clamp(v){return Math.max(0,Math.min(1,v));}
function updatePosition(){
 const y=scrollY,total=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+clamp(y/Math.max(1,total))+')';
 const show=hero.getBoundingClientRect().bottom<90;dock.classList.toggle('visible',show);dock.inert=!show||shareDialog.open||document.querySelector('#photo-dialog[open]')!==null;
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
 const targets=[...document.querySelectorAll('.ribbon,.section-heading>.eyebrow,.section-heading h2,.section-heading .section-sub,.about-copy>p,.about-tags,.connection-paper,.journey li,.journey-note,.onsite-photo,.letter-intro,.letter-interactive,.voice-card,.care-grid article,.join-paper,.faq>div:first-child,.faq-list details,.closing>p,.closing>.primary')];
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('wait');observer.unobserve(e.target);}}),{rootMargin:'0px 0px -12px 0px',threshold:0});
 const groups=new Map();
 targets.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)return;const n=groups.get(el.parentElement)||0;groups.set(el.parentElement,n+1);el.style.setProperty('--delay',Math.min(n,3)*65+'ms');el.classList.add('reveal','wait');observer.observe(el);});
 document.addEventListener('focusin',e=>{const el=e.target.closest('.wait');if(el){el.classList.remove('wait');observer.unobserve(el);}});
 reduce.addEventListener?.('change',e=>{if(e.matches){targets.forEach(el=>el.classList.remove('wait'));observer.disconnect();}});
}
// A native scroll-snap album keeps every supplied activity image reachable.
const photos=window.YUNJIAN_PHOTOS||[],album=$('album-strip'),photoDialog=$('photo-dialog');
const groupNames={all:'全部活动照片',onsite:'读信与书写',letters:'书信往来',details:'信封与细节'};
let filtered=photos.slice(),albumVisible=false,albumHover=false,albumPlaying=false,albumTimer=null,albumTick=false;
function renderAlbum(){
 album.replaceChildren();
 filtered.forEach(photo=>{
  const figure=document.createElement('figure');figure.className='album-card';
  const button=document.createElement('button');button.type='button';button.className='photo-open album-photo';button.dataset.photoKey=photo.key;button.setAttribute('aria-label','放大活动照片：'+photo.title);
  const image=document.createElement('img');image.src=photo.thumb;image.alt=photo.alt;image.loading='lazy';image.decoding='async';image.width=photo.w;image.height=photo.h;
  const magnify=document.createElement('span');magnify.className='photo-magnify';magnify.textContent='⤢';magnify.setAttribute('aria-hidden','true');
  button.append(image,magnify);
  const caption=document.createElement('figcaption'),tag=document.createElement('span'),title=document.createElement('h3');tag.textContent=photo.label;title.textContent=photo.title;caption.append(tag,title);figure.append(button,caption);album.append(figure);
 });
 album.scrollLeft=0;requestAnimationFrame(updateAlbum);
}
function updateAlbum(){
 const box=album.getBoundingClientRect(),cards=[...album.children];
 const shown=cards.map((card,i)=>({i,rect:card.getBoundingClientRect()})).filter(c=>c.rect.right>box.left+30&&c.rect.left<box.right-30);
 if(shown.length){const first=shown[0].i+1,last=shown[shown.length-1].i+1;$('album-position').textContent=(first===last?first:first+'—'+last)+' / '+filtered.length;}
 $('album-back').disabled=album.scrollLeft<3;$('album-next').disabled=album.scrollLeft>=album.scrollWidth-album.clientWidth-3;
 albumTick=false;
}
function moveAlbum(direction){
 const card=album.firstElementChild;if(!card)return;
 const step=card.getBoundingClientRect().width+parseFloat(getComputedStyle(album).gap);
 album.scrollBy({left:direction*step,behavior:reduce.matches?'instant':'smooth'});
}
function setAlbumPlaying(value){
 albumPlaying=value;clearInterval(albumTimer);
 $('album-play').setAttribute('aria-pressed',String(value));$('album-play').textContent=value?'Ⅱ 暂停慢放':'▷ 开启慢放';
 if(value)albumTimer=setInterval(()=>{
  if(!albumVisible||albumHover||document.hidden||photoDialog.open||shareDialog.open||album.contains(document.activeElement))return;
  if(album.scrollLeft>=album.scrollWidth-album.clientWidth-3)album.scrollTo({left:0,behavior:reduce.matches?'instant':'smooth'});else moveAlbum(1);
 },8000);
}
$('album-play').onclick=()=>setAlbumPlaying(!albumPlaying);
$('album-back').onclick=()=>moveAlbum(-1);$('album-next').onclick=()=>moveAlbum(1);
album.addEventListener('scroll',()=>{if(!albumTick){albumTick=true;requestAnimationFrame(updateAlbum);}},{passive:true});
album.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')albumHover=true;});album.addEventListener('pointerleave',()=>albumHover=false);
album.addEventListener('keydown',e=>{if(e.target!==album)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();moveAlbum(e.key==='ArrowLeft'?-1:1);}});
document.querySelectorAll('[data-photo-group]').forEach(button=>button.onclick=()=>{
 setAlbumPlaying(false);filtered=photos.filter(p=>button.dataset.photoGroup==='all'||p.group===button.dataset.photoGroup);
 document.querySelectorAll('[data-photo-group]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 album.setAttribute('aria-label',groupNames[button.dataset.photoGroup]+'，可左右滑动');renderAlbum();
});
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{albumVisible=entries[0].isIntersecting;},{threshold:.1}).observe(album);
else albumVisible=true;
addEventListener('resize',updateAlbum);reduce.addEventListener?.('change',e=>{if(e.matches)setAlbumPlaying(false);});
let viewerPhotos=[],photoIndex=0,photoZoom=1,photoOpener=null,photoPan=null,touchOrigin=null;
const photoStage=$('photo-stage'),photoCanvas=$('photo-canvas'),photoImage=$('photo-image');
function currentPhoto(){return viewerPhotos[photoIndex];}
function fitPhoto(center=false){
 if(!photoDialog.open||!viewerPhotos.length)return;
 const photo=currentPhoto(),scale=Math.min(Math.max(100,photoStage.clientWidth-32)/photo.w,Math.max(100,photoStage.clientHeight-24)/photo.h)*photoZoom;
 const w=photo.w*scale,h=photo.h*scale;
 photoCanvas.style.width=Math.max(photoStage.clientWidth,w+32)+'px';photoCanvas.style.height=Math.max(photoStage.clientHeight,h+24)+'px';
 photoImage.style.width=w+'px';photoImage.style.height=h+'px';
 $('photo-zoom-reset').textContent=Math.round(photoZoom*100)+'%';$('photo-zoom-out').disabled=photoZoom<=1;$('photo-zoom-in').disabled=photoZoom>=4;
 photoStage.classList.toggle('is-zoomed',photoZoom>1);
 if(center){photoStage.scrollLeft=(photoCanvas.offsetWidth-photoStage.clientWidth)/2;photoStage.scrollTop=(photoCanvas.offsetHeight-photoStage.clientHeight)/2;}
}
function renderPhoto(){
 const photo=currentPhoto();photoZoom=1;touchOrigin=null;photoImage.style.opacity='0';$('photo-loading').textContent='正在展开这张照片…';
 $('photo-title').textContent=photo.title;$('photo-group-label').textContent=photo.label+' · 协会活动照片';$('photo-note').textContent=photo.note;$('photo-counter').textContent=(photoIndex+1)+' / '+viewerPhotos.length;
 photoImage.alt=photo.alt;photoImage.onload=()=>{photoImage.style.opacity='1';$('photo-loading').textContent='';fitPhoto(true);};photoImage.onerror=()=>{$('photo-loading').textContent='照片暂未加载，请稍后重新打开。';};
 photoImage.src=photo.src;fitPhoto(true);
 const next=new Image();next.src=viewerPhotos[(photoIndex+1)%viewerPhotos.length].src;
}
function openPhoto(key,button,list){
 viewerPhotos=list.slice();photoIndex=viewerPhotos.findIndex(p=>p.key===key);if(photoIndex<0)return;
 if(typeof photoDialog.showModal!=='function'){window.open(currentPhoto().src,'_blank','noopener');return;}
 photoOpener=button;photoDialog.showModal();document.body.classList.add('modal-open');renderPhoto();$('photo-close').focus({preventScroll:true});updatePosition();
}
function movePhoto(direction){photoIndex=(photoIndex+direction+viewerPhotos.length)%viewerPhotos.length;renderPhoto();}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-photo-key]');if(!button)return;
 openPhoto(button.dataset.photoKey,button,album.contains(button)?filtered:photos);
});
$('photo-close').onclick=()=>photoDialog.close();$('photo-prev').onclick=()=>movePhoto(-1);$('photo-next').onclick=()=>movePhoto(1);
photoDialog.addEventListener('close',()=>{if(!shareDialog.open)document.body.classList.remove('modal-open');photoOpener?.focus({preventScroll:true});updatePosition();});
photoDialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();movePhoto(e.key==='ArrowLeft'?-1:1);}});
function setPhotoZoom(value){photoZoom=Math.min(4,Math.max(1,value));fitPhoto(true);}
$('photo-zoom-in').onclick=()=>setPhotoZoom(photoZoom+.5);$('photo-zoom-out').onclick=()=>setPhotoZoom(photoZoom-.5);$('photo-zoom-reset').onclick=()=>setPhotoZoom(1);
photoStage.addEventListener('dblclick',()=>setPhotoZoom(photoZoom>1?1:2));
photoStage.addEventListener('touchstart',e=>{touchOrigin=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
photoStage.addEventListener('touchmove',e=>{if(e.touches.length!==1)touchOrigin=null;},{passive:true});
photoStage.addEventListener('touchend',e=>{if(touchOrigin&&photoZoom===1&&e.changedTouches.length===1){const dx=e.changedTouches[0].clientX-touchOrigin.x,dy=e.changedTouches[0].clientY-touchOrigin.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)movePhoto(dx<0?1:-1);}touchOrigin=null;},{passive:true});
photoStage.addEventListener('touchcancel',()=>touchOrigin=null,{passive:true});
photoStage.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||photoZoom===1)return;e.preventDefault();photoStage.setPointerCapture(e.pointerId);photoPan={x:e.clientX,y:e.clientY,left:photoStage.scrollLeft,top:photoStage.scrollTop};});
photoStage.addEventListener('pointermove',e=>{if(!photoPan)return;photoStage.scrollLeft=photoPan.left-(e.clientX-photoPan.x);photoStage.scrollTop=photoPan.top-(e.clientY-photoPan.y);});
photoStage.addEventListener('pointerup',()=>photoPan=null);photoStage.addEventListener('pointercancel',()=>photoPan=null);
addEventListener('resize',()=>fitPhoto(true));
renderAlbum();
})();

