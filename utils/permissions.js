// use this to allow admin only pages
// this is used in the /utils/supabase/middleware.js file
export const allowAdminOnly = ["/users", "/entities", "/requirements"];

export const rolesAllowed = ["admin", "super admin"];
