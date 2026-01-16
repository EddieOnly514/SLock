import type { NextFunction, Request, Response } from "express";
import { supabaseClient, supabaseAdmin } from "../config/supabase";
import type { UserProfile } from "../types/user";

type RequireAuthRequest = Request & { user?: UserProfile };

async function requireAuth(req: RequireAuthRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
    const authHeader = req.headers.authorization ?? "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
        }

    const {
      data: userData,
      error: userError,
    } = await supabaseClient.auth.getUser(token);

        if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
        }

    const {
      data: profileData,
      error: profileError,
    } = await supabaseAdmin.from("users").select("*").eq("id", userData.user.id).single();

    if (profileError || !profileData) {
      return res.status(500).json({ error: profileError?.message ?? "Failed to load profile" });
        }

    req.user = profileData as UserProfile;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("requireAuth error:", message);
    return res.status(500).json({ error: "Authentication check failed" });
    }
}

export { requireAuth };
