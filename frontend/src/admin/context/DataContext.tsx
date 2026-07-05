import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { DB, ManagedTable, AnyRecord } from "../types";
import { seedDB } from "../data/seed";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../../api/courseApi";
import {
  getPublishedBlogPosts,
  getAllBlogPostsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../../api/blogApi";
import {
  getPublicSuccessStories,
  getAllSuccessStoriesAdmin,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from "../../api/successStoryApi";
import {
  getPublicTeamMembers,
  getAllTeamMembersAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../../api/teamMemberApi";
import {
  getContactSubmissionsAdmin,
  updateContactSubmission,
  deleteContactSubmission,
} from "../../api/contactApi";
import {
  getPublicAnnouncements,
  getAllAnnouncementsAdmin,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../api/announcementApi";

interface DataContextValue {
  db: DB;
  addRecord: (table: ManagedTable, record: Record<string, any>) => Promise<AnyRecord>;
  updateRecord: (table: ManagedTable, id: number, updates: Record<string, any>) => Promise<AnyRecord | null>;
  deleteRecord: (table: ManagedTable, id: number) => Promise<void>;
  getRecord: (table: ManagedTable, id: number) => AnyRecord | null;
  refreshBlogPostsAdmin: () => Promise<void>;
  refreshSuccessStoriesAdmin: () => Promise<void>;
  refreshTeamMembersAdmin: () => Promise<void>;
  refreshContactSubmissionsAdmin: () => Promise<void>;
  refreshAnnouncementsAdmin: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(seedDB);

  useEffect(() => {
    getCourses()
      .then((courses) => setDb((prev) => ({ ...prev, courses: courses as any })))
      .catch((err) => console.error("Failed to load courses from backend:", err));

    getPublishedBlogPosts()
      .then((posts) => setDb((prev) => ({ ...prev, blog_posts: posts as any })))
      .catch((err) => console.error("Failed to load blog posts from backend:", err));

    getPublicSuccessStories()
      .then((stories) => setDb((prev) => ({ ...prev, success_stories: stories as any })))
      .catch((err) => console.error("Failed to load success stories from backend:", err));

    getPublicTeamMembers()
      .then((members) => setDb((prev) => ({ ...prev, team_members: members as any })))
      .catch((err) => console.error("Failed to load team members from backend:", err));

    getPublicAnnouncements()
      .then((announcements) => setDb((prev) => ({ ...prev, announcements: announcements as any })))
      .catch((err) => console.error("Failed to load announcements from backend:", err));

    // NOTE: contact_submissions is never fetched here — there is no public
    // view of contact submissions. It's only loaded on demand via
    // refreshContactSubmissionsAdmin(), when an admin opens that section.
  }, []);

  const refreshBlogPostsAdmin = useCallback(async () => {
    try {
      const posts = await getAllBlogPostsAdmin();
      setDb((prev) => ({ ...prev, blog_posts: posts as any }));
    } catch (err) {
      console.error("Failed to load blog posts (admin):", err);
    }
  }, []);

  const refreshSuccessStoriesAdmin = useCallback(async () => {
    try {
      const stories = await getAllSuccessStoriesAdmin();
      setDb((prev) => ({ ...prev, success_stories: stories as any }));
    } catch (err) {
      console.error("Failed to load success stories (admin):", err);
    }
  }, []);

  const refreshTeamMembersAdmin = useCallback(async () => {
    try {
      const members = await getAllTeamMembersAdmin();
      setDb((prev) => ({ ...prev, team_members: members as any }));
    } catch (err) {
      console.error("Failed to load team members (admin):", err);
    }
  }, []);

  const refreshContactSubmissionsAdmin = useCallback(async () => {
    try {
      const submissions = await getContactSubmissionsAdmin();
      setDb((prev) => ({ ...prev, contact_submissions: submissions as any }));
    } catch (err) {
      console.error("Failed to load contact submissions (admin):", err);
    }
  }, []);

  const refreshAnnouncementsAdmin = useCallback(async () => {
    try {
      const announcements = await getAllAnnouncementsAdmin();
      setDb((prev) => ({ ...prev, announcements: announcements as any }));
    } catch (err) {
      console.error("Failed to load announcements (admin):", err);
    }
  }, []);

  const addRecord = useCallback(async (table: ManagedTable, record: Record<string, any>) => {
    if (table === "courses") {
      const created = await createCourse(record);
      setDb((prev) => ({ ...prev, courses: [...(prev.courses as any), created] }));
      return created;
    }
    if (table === "blog_posts") {
      const created = await createBlogPost(record);
      setDb((prev) => ({ ...prev, blog_posts: [...(prev.blog_posts as any), created] }));
      return created;
    }
    if (table === "success_stories") {
      const created = await createSuccessStory(record);
      setDb((prev) => ({ ...prev, success_stories: [...(prev.success_stories as any), created] }));
      return created;
    }
    if (table === "team_members") {
      const created = await createTeamMember(record);
      setDb((prev) => ({ ...prev, team_members: [...(prev.team_members as any), created] }));
      return created;
    }
    if (table === "announcements") {
      const created = await createAnnouncement(record);
      setDb((prev) => ({ ...prev, announcements: [...(prev.announcements as any), created] }));
      return created;
    }
    // NOTE: contact_submissions has no admin "create" — submissions only
    // come in through the public contact form, handled separately.

    let created!: AnyRecord;
    setDb((prev) => {
      const rows = prev[table] as unknown as AnyRecord[];
      created = { ...record, id: nextId(rows) } as AnyRecord;
      return { ...prev, [table]: [...rows, created] };
    });
    return created;
  }, []);

  const updateRecord = useCallback(async (table: ManagedTable, id: number, updates: Record<string, any>) => {
    if (table === "courses") {
      const updated = await updateCourse(id, updates);
      setDb((prev) => ({
        ...prev,
        courses: (prev.courses as any).map((r: AnyRecord) => (r.id === id ? updated : r)),
      }));
      return updated;
    }
    if (table === "blog_posts") {
      const updated = await updateBlogPost(id, updates);
      setDb((prev) => ({
        ...prev,
        blog_posts: (prev.blog_posts as any).map((r: AnyRecord) => (r.id === id ? updated : r)),
      }));
      return updated;
    }
    if (table === "success_stories") {
      const updated = await updateSuccessStory(id, updates);
      setDb((prev) => ({
        ...prev,
        success_stories: (prev.success_stories as any).map((r: AnyRecord) => (r.id === id ? updated : r)),
      }));
      return updated;
    }
    if (table === "team_members") {
      const updated = await updateTeamMember(id, updates);
      setDb((prev) => ({
        ...prev,
        team_members: (prev.team_members as any).map((r: AnyRecord) => (r.id === id ? updated : r)),
      }));
      return updated;
    }
    if (table === "announcements") {
      const updated = await updateAnnouncement(id, updates);
      setDb((prev) => ({
        ...prev,
        announcements: (prev.announcements as any).map((r: AnyRecord) => (r.id === id ? updated : r)),
      }));
      return updated;
    }
    if (table === "contact_submissions") {
      const updated = await updateContactSubmission(id, updates);
      setDb((prev) => ({
        ...prev,
        contact_submissions: (prev.contact_submissions as any).map((r: AnyRecord) => (r.id === id ? updated : r)),
      }));
      return updated;
    }

    let updated: AnyRecord | null = null;
    setDb((prev) => {
      const rows = prev[table] as unknown as AnyRecord[];
      const next = rows.map((r) => {
        if (r.id === id) {
          updated = { ...r, ...updates };
          return updated;
        }
        return r;
      });
      return { ...prev, [table]: next };
    });
    return updated;
  }, []);

  const deleteRecord = useCallback(async (table: ManagedTable, id: number) => {
    if (table === "courses") {
      await deleteCourse(id);
      setDb((prev) => ({ ...prev, courses: (prev.courses as any).filter((r: AnyRecord) => r.id !== id) }));
      return;
    }
    if (table === "blog_posts") {
      await deleteBlogPost(id);
      setDb((prev) => ({ ...prev, blog_posts: (prev.blog_posts as any).filter((r: AnyRecord) => r.id !== id) }));
      return;
    }
    if (table === "success_stories") {
      await deleteSuccessStory(id);
      setDb((prev) => ({
        ...prev,
        success_stories: (prev.success_stories as any).filter((r: AnyRecord) => r.id !== id),
      }));
      return;
    }
    if (table === "team_members") {
      await deleteTeamMember(id);
      setDb((prev) => ({
        ...prev,
        team_members: (prev.team_members as any).filter((r: AnyRecord) => r.id !== id),
      }));
      return;
    }
    if (table === "announcements") {
      await deleteAnnouncement(id);
      setDb((prev) => ({
        ...prev,
        announcements: (prev.announcements as any).filter((r: AnyRecord) => r.id !== id),
      }));
      return;
    }
    if (table === "contact_submissions") {
      await deleteContactSubmission(id);
      setDb((prev) => ({
        ...prev,
        contact_submissions: (prev.contact_submissions as any).filter((r: AnyRecord) => r.id !== id),
      }));
      return;
    }

    setDb((prev) => {
      const rows = prev[table] as unknown as AnyRecord[];
      return { ...prev, [table]: rows.filter((r) => r.id !== id) };
    });
  }, []);

  const getRecord = useCallback(
    (table: ManagedTable, id: number) => {
      const rows = db[table] as unknown as AnyRecord[];
      return rows.find((r) => r.id === id) || null;
    },
    [db]
  );

  return (
    <DataContext.Provider
      value={{
        db,
        addRecord,
        updateRecord,
        deleteRecord,
        getRecord,
        refreshBlogPostsAdmin,
        refreshSuccessStoriesAdmin,
        refreshTeamMembersAdmin,
        refreshContactSubmissionsAdmin,
        refreshAnnouncementsAdmin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}