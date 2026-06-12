/**
 * Mirrors the backend's SlugUtils.toSlug — lowercase, hyphenate spaces,
 * strip non-alphanumeric. Used for displaying the slug preview as the
 * admin types the title.
 */
export function slugify(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}