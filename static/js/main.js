const nav=document.getElementById('nav'),menu=document.querySelector('.menu'),links=document.querySelector('header nav');
addEventListener('scroll',()=>{
  nav?.classList.toggle('scrolled',scrollY>10);
},{passive:true});
menu?.addEventListener('click',()=>{
  if (!links) return;
  const open=links.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Close menu':'Open menu');
});
addEventListener('keydown',event=>{
  if(event.key!=='Escape'||!links?.classList.contains('open')) return;
  links.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
  menu?.setAttribute('aria-label','Open menu');
  menu?.focus();
});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=a.getAttribute('href');if(!target || target==='#') return;const el=document.querySelector(target);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}}));
window.addEventListener('resize',()=>{
  if (window.innerWidth > 768 && links) links.classList.remove('open');
  if (menu) {
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open menu');
  }
});

const revealItems=document.querySelectorAll('.section,.page-hero,.detail-hero,.card,.project-card,.form-card,.stats');
if ('IntersectionObserver' in window) {
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -32px'});
  revealItems.forEach((item,index)=>{
    item.classList.add('reveal');
    if (index % 4) item.classList.add(`reveal-delay-${index % 4}`);
    revealObserver.observe(item);
  });
} else revealItems.forEach(item=>item.classList.add('is-visible'));

const currentPath=window.location.pathname;
document.querySelectorAll('header nav a:not(.button)').forEach(link=>{
  if (link.pathname === currentPath) link.setAttribute('aria-current','page');
});

const staticSearch=document.querySelector('[data-static-search]');
if(staticSearch){
  const items=document.querySelectorAll('[data-static-item]');
  const query=new URLSearchParams(location.search);
  const searchInput=staticSearch.querySelector('input[name="q"]');
  let category=query.get('category')||'all';
  const filterItems=()=>{
    const term=searchInput?.value.trim().toLocaleLowerCase()||'';
    items.forEach(item=>{
      const matchesText=item.textContent.toLocaleLowerCase().includes(term);
      const matchesCategory=category==='all'||item.dataset.category===category;
      item.hidden=!(matchesText&&matchesCategory);
    });
  };
  staticSearch.addEventListener('submit',event=>event.preventDefault());
  searchInput?.addEventListener('input',filterItems);
  document.querySelectorAll('[data-static-filters] [data-category]').forEach(link=>{
    link.addEventListener('click',event=>{
      event.preventDefault();
      category=link.dataset.category||'all';
      history.replaceState(null,'',category==='all'?location.pathname:`?category=${encodeURIComponent(category)}`);
      filterItems();
    });
  });
  filterItems();
}

/* Paste your Tally form URL between the quotes before launch. It is public, not a secret. */
const tallyUrl='';
document.querySelectorAll('[data-tally-link]').forEach(link=>{
  if(!tallyUrl){link.hidden=true;return;}
  link.href=tallyUrl;
  link.target='_blank';
  link.rel='noopener noreferrer';
});

if(tallyUrl){
  document.querySelectorAll('.form-card').forEach(card=>{
    if(!/not configured/i.test(card.textContent)) return;
    card.innerHTML='<h2>Send an enquiry</h2><p>Share your name and phone number and our team will contact you.</p><a class="button" href="'+tallyUrl+'" target="_blank" rel="noopener noreferrer">Open secure enquiry form</a><p><small>By continuing, you will open our form provider in a new tab. Please read our <a href="/privacy-policy/">Privacy Policy</a>.</small></p>';
  });
}

