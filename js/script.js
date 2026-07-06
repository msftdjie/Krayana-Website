/* KRAYANA — Interactive Experience (Vanilla JavaScript) */
'use strict';
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

// Loading screen
window.addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('hidden'),650));

// Header, scroll progress, active navigation, back-to-top
const header=$('#header'), progress=$('#scrollProgress'), backTop=$('#backTop');
const sections=$$('main section[id]'), navLinks=$$('.nav a');
function onScroll(){
  const y=scrollY, max=document.documentElement.scrollHeight-innerHeight;
  header.classList.toggle('scrolled',y>40); backTop.classList.toggle('show',y>650);
  progress.style.width=`${max?y/max*100:0}%`;
  let current='home'; sections.forEach(s=>{if(y>=s.offsetTop-180)current=s.id});
  navLinks.forEach(a=>a.classList.toggle('active',a.hash===`#${current}`));
}
addEventListener('scroll',onScroll,{passive:true}); onScroll();
backTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

// Mobile navigation
const nav=$('#nav'), navToggle=$('#navToggle');
function closeNav(){nav.classList.remove('open');document.body.classList.remove('menu-open');navToggle.setAttribute('aria-expanded','false')}
navToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');document.body.classList.toggle('menu-open',open);navToggle.setAttribute('aria-expanded',String(open))});
navLinks.forEach(a=>a.addEventListener('click',closeNav));

// Scroll reveal
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

// Product filtering
const filterButtons=$$('.filters button'), cards=$$('.product-card');
filterButtons.forEach(btn=>btn.addEventListener('click',()=>{filterButtons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');cards.forEach(card=>{const show=btn.dataset.filter==='all'||card.dataset.category===btn.dataset.filter;card.classList.toggle('hidden',!show)})}));

// Product gallery lightbox
const lightbox=$('#lightbox'), lightboxImage=$('#lightboxImage');
function closeLightbox(){lightbox.classList.remove('open');document.body.classList.remove('lightbox-open')}
$$('.lightbox-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{const card=trigger.closest('.product-card'), source=$('img',trigger);lightboxImage.src=source.src;lightboxImage.alt=source.alt;lightboxImage.style.objectPosition=getComputedStyle(source).objectPosition;$('#lightboxTitle').textContent=$('h3',card).textContent;$('#lightboxCategory').textContent=$('small',card).textContent;lightbox.classList.add('open');document.body.classList.add('lightbox-open')}));
$('#lightboxClose').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});addEventListener('keydown',e=>{if(e.key==='Escape'){closeLightbox();closeNav()}});

// Testimonial slider
let slide=0; const track=$('#testimonialTrack'), total=$$('.testimonial-track blockquote').length;
function setSlide(n){slide=(n+total)%total;track.style.transform=`translateX(-${slide*100}%)`;$('#slideNow').textContent=String(slide+1).padStart(2,'0')}
$('#prevTest').addEventListener('click',()=>setSlide(slide-1));$('#nextTest').addEventListener('click',()=>setSlide(slide+1));
let autoSlide=setInterval(()=>setSlide(slide+1),6000);$('.testimonial-wrap').addEventListener('mouseenter',()=>clearInterval(autoSlide));

// FAQ accordion
$$('.accordion article button').forEach(button=>button.addEventListener('click',()=>{const item=button.parentElement,wasOpen=item.classList.contains('open');$$('.accordion article').forEach(a=>{a.classList.remove('open');$('button',a).setAttribute('aria-expanded','false')});if(!wasOpen){item.classList.add('open');button.setAttribute('aria-expanded','true')}}));

// Contact form validation (front-end demo)
const form=$('#contactForm');
form.addEventListener('submit',e=>{e.preventDefault();let valid=true;$$('input,select,textarea',form).forEach(field=>{const error=field.nextElementSibling;let msg='';if(!field.value.trim())msg='Bagian ini perlu diisi.';else if(field.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))msg='Gunakan format email yang valid.';else if(field.name==='message'&&field.value.trim().length<10)msg='Tuliskan sedikitnya 10 karakter.';error.textContent=msg;if(msg)valid=false});const status=$('#formStatus');if(valid){status.textContent='Terima kasih. Pesan Anda sudah tercatat dalam simulasi ini.';form.reset()}else status.textContent='Mohon periksa kembali data Anda.'});

// Footer newsletter micro-interaction
$('.newsletter').addEventListener('submit',e=>{e.preventDefault();const input=$('input',e.currentTarget);if(input.value){input.value='';input.placeholder='Terima kasih sudah bergabung!'}});
