// ============================================================
// Bridges the admin panel's course records (db.courses, from the
// shared DataContext) with the original hand-written rich content
// in courseData.js (intro, outcomes, tools, instructor bio, etc).
//
// Why this exists: the admin panel manages courses via
// courseOutline (intro, outcomes, tools, whoFor, instructor,
// curriculum) alongside the plain columns (title, slug, duration...).
// The original 6 courses also have long-form marketing copy
// hand-written in courseData.js. For any course whose slug matches
// one of the original 6, we use its courseOutline content first,
// and only fall back to the hardcoded copy for fields the admin
// hasn't filled in. Any brand-new course added purely through the
// admin panel renders correctly with whatever it has.
// ============================================================
import COURSE_DATA from './courseData.js';

const TAG_RULES = [
  { match: /market/i, label: 'Marketing', cls: 'tag-marketing' },
  { match: /design/i, label: 'Design', cls: 'tag-design' },
  { match: /freelanc/i, label: 'Freelancing', cls: 'tag-freelancing' },
  { match: /(e-?commerce|shop)/i, label: 'E-commerce', cls: 'tag-ecommerce' },
];

function tagFor(category) {
  const rule = TAG_RULES.find((r) => r.match.test(category || ''));
  return rule ? { tagLabel: rule.label, tagClass: rule.cls } : { tagLabel: category || 'Content', tagClass: 'tag-content' };
}

export function mergeCourse(adminCourse) {
  const extra = COURSE_DATA[adminCourse.slug];
  const outline = adminCourse.courseOutline || {};

  const tag = extra ? { tagLabel: extra.tagLabel, tagClass: extra.tagClass } : tagFor(adminCourse.category);

  const curriculum =
    outline.curriculum && outline.curriculum.length
      ? outline.curriculum
      : (extra?.curriculum || []);

  return {
    slug: adminCourse.slug,
    title: adminCourse.title,
    category: adminCourse.category,
    duration: adminCourse.duration,
    rating: adminCourse.rating ?? extra?.rating ?? '5.0',
    reviews: adminCourse.reviewCount ?? extra?.reviews ?? 0,
    summary: adminCourse.description || extra?.summary || '',
    intro: outline.intro || extra?.intro || adminCourse.description || '',
    outcomes: (outline.outcomes && outline.outcomes.length ? outline.outcomes : null) || extra?.outcomes || null,
    tools: (outline.tools && outline.tools.length ? outline.tools : null) || extra?.tools || null,
    whoFor: outline.whoFor || extra?.whoFor || null,
    curriculum,
    displayOrder: adminCourse.displayOrder ?? 999,
    ...tag,
  };
}

// All active courses, in admin display-order, for list pages.
export function getCourseList(dbCourses) {
  return dbCourses
    .filter((c) => c.isActive !== false)
    .map(mergeCourse)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCourseBySlug(dbCourses, slug) {
  const found = dbCourses.find((c) => c.slug === slug && c.isActive !== false);
  return found ? mergeCourse(found) : null;
}