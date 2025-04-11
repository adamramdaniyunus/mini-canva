import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect to home page if not logged in
  },
});

export const config = {
  matcher: [
    "/create/:path*",
    "/dashboard/:path*",
    "/design/:path*",
  ],
};