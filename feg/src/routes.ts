export type RouteConfig = {
    path: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    // Set to false for routes you don't want in the sitemap
    // TODO: Set to false for the Admin route
    includeInSitemap?: boolean;
};

export const routes: RouteConfig[] = [
    { path: '/',        changefreq: 'weekly',  priority: 1.0, includeInSitemap: true },
    { path: '/about',   changefreq: 'monthly', priority: 0.7, includeInSitemap: true },
    { path: '/contact', changefreq: 'monthly', priority: 0.5, includeInSitemap: true },
];