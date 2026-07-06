import { Link, useParams } from 'react-router-dom';
import { useData } from '../admin/context/DataContext.tsx';
import { getBlogBySlug, getBlogList } from '../data/blogHelpers.js';

export default function BlogDetail() {
  const { slug } = useParams();
  const { db } = useData();
  const post = getBlogBySlug(db.blog_posts, slug);

  if (!post) {
    return (
      <div className="section" style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="eyebrow">Post Not Found</div>
          <h1 style={{ maxWidth: '20ch', margin: '0 auto 16px' }}>We couldn't find that post.</h1>
          <p style={{ maxWidth: '44ch', margin: '0 auto 26px' }}>
            It may have been renamed or the link is out of date. Take a look at everything else we've written.
          </p>
          <Link to="/blogs" className="btn btn-accent">See all posts</Link>
        </div>
      </div>
    );
  }

  const related = getBlogList(db.blog_posts).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <Link to="/blogs" className="link-arrow" style={{ color: 'var(--accent)', marginBottom: 18, display: 'inline-flex' }}>
            ← All posts
          </Link>
          <div className="eyebrow">{post.meta}</div>
          <h1 style={{ maxWidth: '24ch' }}>{post.title}</h1>
          {post.teaser && <p className="hero-lead">{post.teaser}</p>}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <img
              src={post.featuredImage || `https://placehold.co/1000x520/1C1917/F59E0B?text=${post.img}`}
              alt={`${post.title} cover`}
              style={{ borderRadius: 'var(--radius-lg)', marginBottom: 36, width: '100%' }}
            />
            {post.body.map((para, i) => (
              <p key={i} style={{ fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '1.4em' }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="branch-callout">
            <div>
              <h3>Want to actually build this skill, not just read about it?</h3>
              <p>This lesson is part of a full hands-on course at our Shujabad campus.</p>
            </div>
            <Link to="/courses" className="btn btn-accent">Explore Courses</Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Keep Reading</div>
              <h2 style={{ fontSize: '1.5rem' }}>More from the blog</h2>
            </div>
            <div className="grid grid-3">
              {related.map((p) => (
                <div className="card blog-card" key={p.slug}>
                  <img
                    className="blog-thumb"
                    src={p.featuredImage || `https://placehold.co/500x310/1C1917/F59E0B?text=${p.img}`}
                    alt={`${p.title} thumbnail`}
                  />
                  <div className="blog-body">
                    <div className="blog-meta">{p.meta}</div>
                    <h3>{p.title}</h3>
                    {p.teaser && <p>{p.teaser}</p>}
                    <Link to={`/blogs/${p.slug}`} className="link-arrow">Read more →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}