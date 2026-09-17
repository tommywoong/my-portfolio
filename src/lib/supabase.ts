import { createClient } from '@supabase/supabase-js';
import { Project, Post, SiteSettings, SkillCategory } from './types';
import { INITIAL_PROJECTS, INITIAL_POSTS, DEFAULT_SITE_SETTINGS, INITIAL_SKILL_CATEGORIES } from './mockData';
import { idbGet, idbSet } from './indexedDb';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage Keys - Version 10 for full user dataset sync
const KEYS = {
  PROJECTS: 'portfolio_tech_projects_v10',
  POSTS: 'portfolio_tech_posts_v10',
  SETTINGS: 'portfolio_tech_settings_v10',
  SKILLS: 'portfolio_tech_skills_v10'
};

// High-Capacity Hybrid Storage Engine: Uses IndexedDB (Unlimited MBs) + localStorage
async function getStoredData<T>(key: string, initialValue: T): Promise<T> {
  if (typeof window === 'undefined') return initialValue;

  try {
    const directIdb = await idbGet<T>(key);
    if (directIdb !== null && directIdb !== undefined) {
      return directIdb;
    }
  } catch (err) {
    console.warn('Storage read warning:', err);
  }

  await idbSet(key, initialValue);
  try {
    localStorage.setItem(key, JSON.stringify(initialValue));
  } catch {
    // Ignore localStorage quota errors
  }
  return initialValue;
}

async function setStoredData<T>(key: string, value: T): Promise<void> {
  if (typeof window === 'undefined') return;

  await idbSet(key, value);

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.info('Saved to IndexedDB storage engine.');
  }
}

// ----------------------------------------------------
// SITE SETTINGS SERVICES
// ----------------------------------------------------
export async function getSiteSettingsService(): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) {
        return {
          brandName: data.brand_name || DEFAULT_SITE_SETTINGS.brandName,
          brandSuffix: data.brand_suffix || DEFAULT_SITE_SETTINGS.brandSuffix,
          brandSubtitle: data.brand_subtitle || DEFAULT_SITE_SETTINGS.brandSubtitle,
          brandLogoUrl: data.brand_logo_url || '',
          heroBadge: data.hero_badge || DEFAULT_SITE_SETTINGS.heroBadge,
          heroTitle: data.hero_title || DEFAULT_SITE_SETTINGS.heroTitle,
          heroSubtitle: data.hero_subtitle || DEFAULT_SITE_SETTINGS.heroSubtitle,
          contactEmail: data.contact_email || DEFAULT_SITE_SETTINGS.contactEmail,
          githubUrl: data.github_url || DEFAULT_SITE_SETTINGS.githubUrl,
          linkedinUrl: data.linkedin_url || DEFAULT_SITE_SETTINGS.linkedinUrl,
          facebookUrl: data.facebook_url || DEFAULT_SITE_SETTINGS.facebookUrl,
          footerAbout: data.footer_about || DEFAULT_SITE_SETTINGS.footerAbout,
          totalProjectsCount: data.total_projects_count || DEFAULT_SITE_SETTINGS.totalProjectsCount,
          uptimeMetric: data.uptime_metric || DEFAULT_SITE_SETTINGS.uptimeMetric,
          hostingCostMetric: data.hosting_cost_metric || DEFAULT_SITE_SETTINGS.hostingCostMetric,
          projectsTitle: data.projects_title || data.projectsTitle || DEFAULT_SITE_SETTINGS.projectsTitle,
          projectsSubtitle: data.projects_subtitle || data.projectsSubtitle || DEFAULT_SITE_SETTINGS.projectsSubtitle,
          skillsTitle: data.skills_title || data.skillsTitle || DEFAULT_SITE_SETTINGS.skillsTitle,
          skillsSubtitle: data.skills_subtitle || data.skillsSubtitle || DEFAULT_SITE_SETTINGS.skillsSubtitle,
          postsTitle: data.posts_title || data.postsTitle || DEFAULT_SITE_SETTINGS.postsTitle,
          postsSubtitle: data.posts_subtitle || data.postsSubtitle || DEFAULT_SITE_SETTINGS.postsSubtitle,
          contactTitle: data.contact_title || data.contactTitle || DEFAULT_SITE_SETTINGS.contactTitle,
          contactSubtitle: data.contact_subtitle || data.contactSubtitle || DEFAULT_SITE_SETTINGS.contactSubtitle,
        };
      }
    } catch (err) {
      console.warn('Supabase settings fetch error:', err);
    }
  }
  return getStoredData<SiteSettings>(KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
}

export async function saveSiteSettingsService(settings: SiteSettings): Promise<SiteSettings> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('settings').upsert({
        id: 1,
        brand_name: settings.brandName,
        brand_suffix: settings.brandSuffix,
        brand_subtitle: settings.brandSubtitle,
        brand_logo_url: settings.brandLogoUrl,
        hero_badge: settings.heroBadge,
        hero_title: settings.heroTitle,
        hero_subtitle: settings.heroSubtitle,
        contact_email: settings.contactEmail,
        github_url: settings.githubUrl,
        linkedin_url: settings.linkedinUrl,
        facebook_url: settings.facebookUrl,
        footer_about: settings.footerAbout,
        total_projects_count: settings.totalProjectsCount,
        uptime_metric: settings.uptimeMetric,
        hosting_cost_metric: settings.hostingCostMetric,
        projects_title: settings.projectsTitle,
        projects_subtitle: settings.projectsSubtitle,
        skills_title: settings.skillsTitle,
        skills_subtitle: settings.skillsSubtitle,
        posts_title: settings.postsTitle,
        posts_subtitle: settings.postsSubtitle,
        contact_title: settings.contactTitle,
        contact_subtitle: settings.contactSubtitle
      });
    } catch (err) {
      console.error('Supabase settings save error:', err);
    }
  }
  await setStoredData(KEYS.SETTINGS, settings);
  return settings;
}

// ----------------------------------------------------
// SKILL CATEGORIES SERVICES
// ----------------------------------------------------
export async function getSkillCategoriesService(): Promise<SkillCategory[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('skills').select('*');
      if (data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          skills: item.skills || []
        }));
      }
    } catch (err) {
      console.warn('Supabase skills fetch error:', err);
    }
  }
  return getStoredData<SkillCategory[]>(KEYS.SKILLS, INITIAL_SKILL_CATEGORIES);
}

export async function saveSkillCategoriesService(categories: SkillCategory[]): Promise<SkillCategory[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      for (const cat of categories) {
        await supabase.from('skills').upsert({
          id: cat.id,
          title: cat.title,
          skills: cat.skills
        });
      }
    } catch (err) {
      console.error('Supabase skills save error:', err);
    }
  }
  await setStoredData(KEYS.SKILLS, categories);
  return categories;
}

// ----------------------------------------------------
// PROJECT DATA SERVICES
// ----------------------------------------------------
export async function getProjectsService(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug || item.id,
          summary: item.summary,
          description: item.description,
          category: item.category,
          tags: item.tags || [],
          imageUrl: item.image_url || item.imageUrl,
          mobileMockupUrl: item.mobile_mockup_url || item.mobileMockupUrl || '',
          mockupType: item.mockup_type || item.mockupType || 'iphone',
          videoUrl: item.video_url || item.videoUrl || '',
          galleryImages: item.gallery_images || item.galleryImages || [],
          demoUrl: item.demo_url || item.demoUrl,
          githubUrl: item.github_url || item.githubUrl,
          featured: item.featured ?? false,
          completionDate: item.completion_date || item.completionDate || '2025-12',
          metrics: item.metrics || [],
          architectureHighlights: item.architecture_highlights || item.architectureHighlights || [],
          createdAt: item.created_at || new Date().toISOString()
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage store:', err);
    }
  }

  return getStoredData<Project[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
}

export async function saveProjectService(project: Omit<Project, 'id' | 'createdAt'> & { id?: string }): Promise<Project> {
  const newId = project.id || `proj-${Date.now()}`;
  const now = new Date().toISOString();

  const fullProject: Project = {
    id: newId,
    title: project.title,
    slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    summary: project.summary,
    description: project.description,
    category: project.category,
    tags: project.tags,
    imageUrl: project.imageUrl,
    mobileMockupUrl: project.mobileMockupUrl || '',
    mockupType: project.mockupType || 'iphone',
    videoUrl: project.videoUrl || '',
    galleryImages: project.galleryImages || [],
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    featured: project.featured,
    completionDate: project.completionDate,
    metrics: project.metrics || [],
    architectureHighlights: project.architectureHighlights || [],
    createdAt: now
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').upsert({
        id: newId,
        title: project.title,
        slug: fullProject.slug,
        summary: project.summary,
        description: project.description,
        category: project.category,
        tags: project.tags,
        image_url: project.imageUrl,
        mobile_mockup_url: project.mobileMockupUrl,
        mockup_type: project.mockupType,
        video_url: project.videoUrl,
        gallery_images: project.galleryImages,
        demo_url: project.demoUrl,
        github_url: project.githubUrl,
        featured: project.featured,
        completion_date: project.completionDate,
        metrics: project.metrics,
        architecture_highlights: project.architectureHighlights
      });
    } catch (err) {
      console.error('Supabase project upsert failed:', err);
    }
  }

  const existing = await getStoredData<Project[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
  const updated = project.id 
    ? existing.map(p => p.id === project.id ? fullProject : p)
    : [fullProject, ...existing];

  await setStoredData(KEYS.PROJECTS, updated);
  return fullProject;
}

export async function saveAllProjectsService(projects: Project[]): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      for (const proj of projects) {
        await supabase.from('projects').upsert({
          id: proj.id,
          title: proj.title,
          slug: proj.slug,
          summary: proj.summary,
          description: proj.description,
          category: proj.category,
          tags: proj.tags,
          image_url: proj.imageUrl,
          mobile_mockup_url: proj.mobileMockupUrl,
          mockup_type: proj.mockupType,
          video_url: proj.videoUrl,
          gallery_images: proj.galleryImages,
          demo_url: proj.demoUrl,
          github_url: proj.githubUrl,
          featured: proj.featured,
          completion_date: proj.completionDate,
          metrics: proj.metrics,
          architecture_highlights: proj.architectureHighlights
        });
      }
    } catch (err) {
      console.error('Supabase saveAllProjects error:', err);
    }
  }

  await setStoredData(KEYS.PROJECTS, projects);
  return projects;
}

export async function saveAllPostsService(posts: Post[]): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      for (const post of posts) {
        await supabase.from('posts').upsert({
          id: post.id,
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          content: post.content,
          category: post.category,
          author: post.author,
          read_time: post.readTime,
          published_at: post.publishedAt,
          cover_image_url: post.imageUrl,
          tags: post.tags
        });
      }
    } catch (err) {
      console.error('Supabase saveAllPosts error:', err);
    }
  }

  await setStoredData(KEYS.POSTS, posts);
  return posts;
}

export async function deleteProjectService(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete failed:', err);
    }
  }

  const existing = await getStoredData<Project[]>(KEYS.PROJECTS, INITIAL_PROJECTS);
  const updated = existing.filter(p => p.id !== id);
  await setStoredData(KEYS.PROJECTS, updated);
  return true;
}

// ----------------------------------------------------
// POST / BLOG DATA SERVICES
// ----------------------------------------------------
export async function getPostsService(): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug || item.id,
          summary: item.summary,
          content: item.content,
          category: item.category,
          author: item.author || 'Admin',
          readTime: item.read_time || item.readTime || '5 phút đọc',
          imageUrl: item.image_url || item.imageUrl,
          videoUrl: item.video_url || item.videoUrl || '',
          galleryImages: item.gallery_images || item.galleryImages || [],
          publishedAt: item.published_at || item.publishedAt || new Date().toISOString(),
          tags: item.tags || []
        }));
      }
    } catch (err) {
      console.warn('Supabase posts fetch failed:', err);
    }
  }

  return getStoredData<Post[]>(KEYS.POSTS, INITIAL_POSTS);
}

export async function savePostService(post: Omit<Post, 'id' | 'publishedAt'> & { id?: string }): Promise<Post> {
  const newId = post.id || `post-${Date.now()}`;
  const now = new Date().toISOString().split('T')[0];

  const fullPost: Post = {
    id: newId,
    title: post.title,
    slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    summary: post.summary,
    content: post.content,
    category: post.category,
    author: post.author,
    readTime: post.readTime,
    imageUrl: post.imageUrl,
    videoUrl: post.videoUrl || '',
    galleryImages: post.galleryImages || [],
    publishedAt: now,
    tags: post.tags
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('posts').upsert({
        id: newId,
        title: post.title,
        slug: fullPost.slug,
        summary: post.summary,
        content: post.content,
        category: post.category,
        author: post.author,
        read_time: post.readTime,
        image_url: post.imageUrl,
        video_url: post.videoUrl,
        gallery_images: post.galleryImages,
        tags: post.tags,
        published_at: now
      });
    } catch (err) {
      console.error('Supabase post upsert error:', err);
    }
  }

  const existing = await getStoredData<Post[]>(KEYS.POSTS, INITIAL_POSTS);
  const updated = post.id 
    ? existing.map(p => p.id === post.id ? fullPost : p)
    : [fullPost, ...existing];

  await setStoredData(KEYS.POSTS, updated);
  return fullPost;
}

export async function deletePostService(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('posts').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase post delete error:', err);
    }
  }

  const existing = await getStoredData<Post[]>(KEYS.POSTS, INITIAL_POSTS);
  const updated = existing.filter(p => p.id !== id);
  await setStoredData(KEYS.POSTS, updated);
  return true;
}
