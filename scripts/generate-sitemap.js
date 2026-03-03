import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables manually since this is a script
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVariables = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    let value = valueParts.join('=').trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    envVariables[key.trim()] = value;
  }
});

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || envVariables['VITE_SUPABASE_URL'];
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || envVariables['VITE_SUPABASE_PUBLISHABLE_KEY'];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const SITE_URL = 'https://gamecollab.site';

async function generateSitemap() {
  const urls = [];
  
  // 1. Static Routes
  const staticRoutes = [
    '',
    '/projects',
    '/about',
    '/services',
    '/following',
    '/auth'
  ];
  staticRoutes.forEach(route => {
    urls.push({
      loc: `${SITE_URL}${route}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: route === '' ? 1.0 : 0.8
    });
  });

  try {
    // 2. Dynamic Routes - Projects
    const { data: projects } = await supabase.from('projects').select('id, updated_at');
    if (projects) {
      projects.forEach(project => {
        urls.push({
          loc: `${SITE_URL}/projects/${project.id}`,
          lastmod: project.updated_at || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8
        });
      });
    }

    // 3. Dynamic Routes - Service Offerings
    const { data: services } = await supabase.from('service_offerings').select('id, updated_at');
    if (services) {
      services.forEach(service => {
        urls.push({
          loc: `${SITE_URL}/services/${service.id}`,
          lastmod: service.updated_at || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8
        });
      });
    }

    // 4. Dynamic Routes - Posts
    const { data: posts } = await supabase.from('project_posts').select('id, created_at');
    if (posts) {
      posts.forEach(post => {
        urls.push({
          loc: `${SITE_URL}/posts/${post.id}`,
          lastmod: post.created_at || new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7
        });
      });
    }

    // 5. Dynamic Routes - Users (Profiles)
    const { data: profiles } = await supabase.from('profiles').select('username');
    if (profiles) {
      profiles.forEach(profile => {
        if (profile.username) {
          urls.push({
            loc: `${SITE_URL}/users/${encodeURIComponent(profile.username)}`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.6
          });
        }
      });
    }
  } catch (err) {
    console.error("Error fetching data from Supabase:", err);
  }

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  urls.forEach(urlObj => {
    xml += `  <url>\n`;
    xml += `    <loc>${urlObj.loc}</loc>\n`;
    xml += `    <lastmod>${urlObj.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${urlObj.changefreq}</changefreq>\n`;
    xml += `    <priority>${urlObj.priority.toFixed(1)}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += `</urlset>`;

  // Write to public/sitemap.xml
  const publicPath = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
  
  const sitemapPath = path.resolve(publicPath, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  
  console.log(`Sitemap generated successfully with ${urls.length} entries at: ${sitemapPath}`);
}

generateSitemap();
