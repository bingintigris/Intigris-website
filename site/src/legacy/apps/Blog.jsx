/* Converted from Blog.html (inline page script) by scripts/convert-legacy.mjs */
import React from 'react';
import { getLang } from '../../lib/i18n.js';
import { getSupabase } from '../../lib/supabase.js';
import { doc, win } from '../../lib/env.js';
import { lp, switchLang } from '../../lib/i18n.js';
import { SiteHeader } from '../components/Header.jsx';
import { SiteFooter } from '../components/Footer.jsx';
import { SiteCookieConsent } from '../components/CookieConsent.jsx';

    const { useState, useEffect } = React;

    /* ---- tiny markdown -> html (mirrors admin renderer) ---- */
    function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function inl(s){
      return s
        .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
        .replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>')
        .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    }
    function md(src){
      const lines = esc(src||'').replace(/\r\n/g,'\n').split('\n');
      const out=[]; let list=null, para=[];
      const fp=()=>{ if(para.length){out.push('<p>'+inl(para.join(' '))+'</p>');para=[];} };
      const cl=()=>{ if(list){out.push('</'+list+'>');list=null;} };
      for(const raw of lines){
        const line=raw.trimEnd();
        if(!line.trim()){fp();cl();continue;}
        let m;
        if((m=line.match(/^(#{1,6})\s+(.*)$/))){fp();cl();const l=Math.min(m[1].length,6);out.push('<h'+l+'>'+inl(m[2])+'</h'+l+'>');continue;}
        if(/^(-{3,})$/.test(line.trim())){fp();cl();out.push('<hr/>');continue;}
        if((m=line.match(/^\s*[-•]\s+(.*)$/))){fp();if(list!=='ul'){cl();list='ul';out.push('<ul>');}out.push('<li>'+inl(m[1])+'</li>');continue;}
        if((m=line.match(/^\s*\d+[.)]\s+(.*)$/))){fp();if(list!=='ol'){cl();list='ol';out.push('<ol>');}out.push('<li>'+inl(m[1])+'</li>');continue;}
        cl();para.push(line.trim());
      }
      fp();cl();return out.join('\n');
    }
    function fmtDate(d){ if(!d) return ''; const x=new Date(d); return isNaN(x)?'':x.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }

    const urlSlug = new URLSearchParams(win.location.search).get('post') || (win.location.pathname.match(/\/blog-posts\/([^/]+)/) || [])[1] || null;

    function nav(r){
      if (r === 'blog') return (win.location.href = lp("/blog"));
      return (win.location.href = lp("/"));
    }

    /* ---------- Blog index ---------- */
    function BlogIndex({ posts }) {
      const [cat, setCat] = useState('All');
      const cats = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];
      const list = cat === 'All' ? posts : posts.filter(p => p.category === cat);
      const [hero, ...rest] = list;

      return (
        <main style={{ background: 'var(--intigris-off-white)' }}>
          <section className="container-wide" style={{ paddingTop: 120, paddingBottom: 32 }}>
            <div className="eyebrow" style={{ color: 'var(--intigris-coral)' }}>INTIGRIS · BLOG</div>
            <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 500, letterSpacing: '-0.028em', lineHeight: 1.02, margin: '12px 0 0' }}>
              Ideas on Salesforce,<br/><span style={{ color: 'var(--intigris-coral)', fontStyle: 'italic' }}>and how we work.</span>
            </h1>
          </section>

          {/* category filter */}
          <div className="container-wide" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 28 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                border: '1px solid var(--border)', borderRadius: 999, padding: '7px 16px', cursor: 'pointer',
                fontSize: 14, fontWeight: 500,
                background: cat === c ? 'var(--intigris-dark-brown)' : 'transparent',
                color: cat === c ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)',
              }}>{c}</button>
            ))}
          </div>

          {/* featured */}
          {hero && (
            <div className="container-wide" style={{ paddingBottom: 24 }}>
              <a href={lp(`/blog-posts/${hero.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 40, alignItems: 'center', background: 'var(--intigris-paper)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '16/10', overflow: 'hidden', background: 'var(--intigris-off-white-200)' }}>
                  {hero.cover_image_url && <img src={hero.cover_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ padding: '32px 40px 32px 0' }}>
                  <div className="eyebrow" style={{ color: 'var(--intigris-coral)' }}>{hero.category || 'Article'}</div>
                  <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.06, margin: '10px 0 0' }}>{hero.title}</h2>
                  <p style={{ marginTop: 12, fontSize: 16, fontWeight: 400, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{hero.excerpt}</p>
                  <div style={{ marginTop: 16, fontSize: 13, color: 'var(--fg-muted)' }}>{fmtDate(hero.published_at)} · {hero.read_minutes || 4} min read</div>
                </div>
              </a>
            </div>
          )}

          {/* grid */}
          <div className="container-wide blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, paddingBottom: 96 }}>
            {rest.map(p => (
              <a key={p.id} href={lp(`/blog-posts/${p.slug}`)} className="blog-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', background: 'var(--intigris-paper)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '16/10', overflow: 'hidden', background: 'var(--intigris-off-white-200)' }}>
                  {p.cover_image_url && <img src={p.cover_image_url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="eyebrow" style={{ color: 'var(--intigris-coral)' }}>{p.category || 'Article'}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.15, margin: '8px 0 0' }}>{p.title}</h3>
                  <p style={{ marginTop: 8, fontSize: 14, fontWeight: 400, color: 'var(--fg-muted)', lineHeight: 1.5, flex: 1 }}>{p.excerpt}</p>
                  <div style={{ marginTop: 14, fontSize: 12.5, color: 'var(--fg-muted)' }}>{fmtDate(p.published_at)} · {p.read_minutes || 4} min read</div>
                </div>
              </a>
            ))}
          </div>
        </main>
      );
    }

    /* ---------- Single post ---------- */
    function BlogPost({ post }) {
      return (
        <main style={{ background: 'var(--intigris-off-white)' }}>
          <article className="container" style={{ maxWidth: 760, paddingTop: 120, paddingBottom: 96 }}>
            <a href={lp("/blog")} style={{ fontSize: 14, color: 'var(--intigris-coral)', textDecoration: 'none' }}>← All articles</a>
            <div className="eyebrow" style={{ color: 'var(--intigris-coral)', marginTop: 24 }}>{post.category || 'Article'}</div>
            <h1 style={{ fontSize: 'clamp(32px,4.5vw,56px)', fontWeight: 500, letterSpacing: '-0.026em', lineHeight: 1.04, margin: '12px 0 0' }}>{post.title}</h1>
            <div style={{ marginTop: 16, fontSize: 14, color: 'var(--fg-muted)' }}>
              {post.author_name || 'Intigris'} · {fmtDate(post.published_at)} · {post.read_minutes || 4} min read
            </div>
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt="" style={{ width: '100%', borderRadius: 20, margin: '28px 0 8px', display: 'block' }} />
            )}
            <div className="post-body" dangerouslySetInnerHTML={{ __html: md(post.body) }} />
          </article>
        </main>
      );
    }

    /* props come from the build (pre-built /blog and /blog-posts/<slug> pages); without them the page loads in the browser */
    function App({ slug: slugProp, post: prePost, posts: prePosts } = {}) {
      const slug = slugProp ?? urlSlug;
      const [lang, setLang] = useState(getLang());
      const [posts, setPosts] = useState(prePosts ?? null);
      const [post, setPost] = useState(prePost); // undefined=loading, null=not found
      const changeLang = (n) => { switchLang(n); doc.documentElement.setAttribute('lang', n); setLang(n); };

      useEffect(() => {
        const sb = getSupabase();
        if (!sb || (slug ? prePost !== undefined : prePosts)) return;
        if (slug) {
          sb.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle()
            .then(({ data }) => setPost(data || null));
        } else {
          sb.from('blog_posts')
            .select('id,title,slug,excerpt,cover_image_url,category,author_name,read_minutes,published_at')
            .eq('status', 'published').order('published_at', { ascending: false })
            .then(({ data }) => setPosts(data || []));
        }
      }, []);

      return (
        <>
          <SiteHeader overlay={false} megaTheme="cream" lang={lang} onLang={changeLang} onNav={nav} />
          {slug ? (
            post === undefined
              ? <Loading />
              : post ? <BlogPost post={post} /> : <NotFound />
          ) : (
            posts === null ? <Loading /> : <BlogIndex posts={posts} />
          )}
          <SiteFooter />
          <SiteCookieConsent />
        </>
      );
    }

    function Loading(){ return <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', paddingTop: 76, color: 'var(--fg-muted)' }}>Loading…</main>; }
    function NotFound(){ return <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', paddingTop: 76 }}><div style={{ textAlign: 'center' }}><h1 style={{ fontSize: 32, fontWeight: 500 }}>Article not found</h1><p style={{ marginTop: 8 }}><a href={lp("/blog")} style={{ color: 'var(--intigris-coral)' }}>← Back to the blog</a></p></div></main>; }

export default App;
