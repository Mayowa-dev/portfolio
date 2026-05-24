// ─── Cursor ─────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
(function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();
document.querySelectorAll('a,button,.tech-card,.project-card,.stat-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.width='18px';cursor.style.height='18px';cursor.style.background='var(--accent2)';ring.style.width='52px';ring.style.height='52px';ring.style.borderColor='rgba(123,92,240,.5)'});
  el.addEventListener('mouseleave',()=>{cursor.style.width='10px';cursor.style.height='10px';cursor.style.background='var(--accent)';ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='rgba(79,142,247,.4)'});
});

// ─── Background particles ────────────────────────────────────────────
const bgC = document.getElementById('bg-canvas');
const bgCtx = bgC.getContext('2d');
function resizeBg(){bgC.width=window.innerWidth;bgC.height=window.innerHeight}
resizeBg();window.addEventListener('resize',resizeBg);
const PARTICLES=80;
const pts=Array.from({length:PARTICLES},()=>({
  x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,
  vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,
  r:Math.random()*1.5+.5,
  a:Math.random()
}));
function drawBg(){
  bgCtx.clearRect(0,0,bgC.width,bgC.height);
  pts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=bgC.width;if(p.x>bgC.width)p.x=0;
    if(p.y<0)p.y=bgC.height;if(p.y>bgC.height)p.y=0;
    bgCtx.beginPath();bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    bgCtx.fillStyle=`rgba(79,142,247,${p.a*.35})`;bgCtx.fill();
  });
  pts.forEach((a,i)=>{
    for(let j=i+1;j<pts.length;j++){
      const b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<130){
        bgCtx.beginPath();bgCtx.moveTo(a.x,a.y);bgCtx.lineTo(b.x,b.y);
        bgCtx.strokeStyle=`rgba(79,142,247,${.08*(1-d/130)})`;bgCtx.lineWidth=.5;bgCtx.stroke();
      }
    }
  });
  requestAnimationFrame(drawBg);
}
drawBg();


const ic=document.getElementById('interactive-canvas');
const ict=ic.getContext('2d');
let trail=[],isDragging=false,lastX=0,lastY=0;
function resizeIC(){ic.width=Math.min(860,window.innerWidth-40)}
resizeIC();window.addEventListener('resize',resizeIC);

function icPoint(x,y){
  const rect=ic.getBoundingClientRect();
  return{x:x-rect.left,y:y-rect.top};
}
ic.addEventListener('mousemove',e=>{
  const p=icPoint(e.clientX,e.clientY);
  trail.push({x:p.x,y:p.y,life:1,color:`hsl(${Date.now()/20%360},80%,65%)`});
  if(trail.length>200)trail.shift();
});
ic.addEventListener('touchmove',e=>{
  e.preventDefault();
  const t=e.touches[0],p=icPoint(t.clientX,t.clientY);
  trail.push({x:p.x,y:p.y,life:1,color:`hsl(${Date.now()/20%360},80%,65%)`});
  if(trail.length>200)trail.shift();
},{passive:false});

function drawIC(){
  ict.clearRect(0,0,ic.width,ic.height);
  ict.fillStyle='rgba(13,18,32,0.15)';
  ict.fillRect(0,0,ic.width,ic.height);
  trail.forEach((p,i)=>{
    p.life-=.012;
    if(p.life<0)return;
    const size=p.life*8;
    ict.beginPath();ict.arc(p.x,p.y,size,0,Math.PI*2);
    ict.fillStyle=p.color.replace(')',`,${p.life*.7})`).replace('hsl','hsla');
    ict.fill();
    if(i>0){
      const prev=trail[i-1];
      ict.beginPath();ict.moveTo(prev.x,prev.y);ict.lineTo(p.x,p.y);
      ict.strokeStyle=p.color.replace(')',`,${p.life*.5})`).replace('hsl','hsla');
      ict.lineWidth=size*1.2;ict.lineCap='round';ict.stroke();
    }
  });
  trail=trail.filter(p=>p.life>0);
  requestAnimationFrame(drawIC);
}
drawIC();


const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));


window.addEventListener('scroll',()=>{
  document.getElementById('navbar').style.borderBottomColor=
    window.scrollY>60?'rgba(255,255,255,.1)':'transparent';
});


document.querySelector('.form-submit').addEventListener('click',function(){
  this.textContent='Message Sent ✓';
  this.style.background='linear-gradient(135deg,#06E3D4,#4F8EF7)';
  setTimeout(()=>{this.textContent='Send Message →';this.style.background=''},3000);
});


document.getElementById('nav-menu').addEventListener('click',()=>{
  const links=document.querySelector('.nav-links');
  links.style.display=links.style.display==='flex'?'none':'flex';
  links.style.flexDirection='column';
  links.style.position='absolute';
  links.style.top='70px';links.style.left='0';links.style.right='0';
  links.style.background='rgba(8,12,23,0.98)';
  links.style.padding='1.5rem 2.5rem';
  links.style.borderBottom='1px solid rgba(255,255,255,.07)';
  links.style.gap='1.25rem';
});