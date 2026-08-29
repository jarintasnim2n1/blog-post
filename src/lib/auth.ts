import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
// your prisma client instance

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL:
        process.env.BETTER_AUTH_URL,
    trustedOrigins: [

        "https://blog-post-jarintasnim2n1-5742s-projects.vercel.app",

        ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [])
    ],
    logger: {
        disabled: false,
        level: "debug",
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    onAPIError: {
        onError(e) {
            console.error("=== BETTER AUTH ERROR ===");
            console.error("Error:", e);
            console.error("=========================");
        },
    },
});

export default auth;
