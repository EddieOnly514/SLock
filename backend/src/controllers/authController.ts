import type { Request, Response } from "express";
import { supabaseClient, supabaseAdmin } from "../config/supabase";
import {
  validateRegisterPayload,
  validateLoginPayload,
  validateRefreshPayload,
} from "../utils/validate";
import type { RegisterData, LoginData, RefreshData } from "../types/validation";
import type { UserProfile } from "../types/user";

const GENERIC_SERVER_ERROR = 'An unexpected server error occurred.';

async function registerAccount(req: Request, res: Response): Promise<Response> {
  try {
    const validationResult = validateRegisterPayload(req.body);

    if (validationResult.error || !validationResult.data) {
      console.error("Register validation error:", validationResult.error?.message);
      return res.status(400).json({ error: validationResult.error?.message ?? "Invalid payload" });
    }

    const { email, username, password } = validationResult.data as RegisterData;

    const {
      data: authData,
      error: authError,
    } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (authError || !authData?.user) {
      console.error("Signup error:", authError?.message ?? "Unknown error");
      return res.status(400).json({ error: authError?.message ?? "Failed to create account" });
    }

    const { error: profileError } = await supabaseClient
      .from("users")
      .upsert({
        id: authData.user.id,
        username,
        email: authData.user.email!,
        privacy_preset: "totals_only"
      }, { onConflict: "id" })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError.message);
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      if (deleteError) {
        console.error("Failed to rollback user creation:", deleteError.message);
      }
      return res.status(500).json({ error: "Failed to create user profile" });
    }

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: GENERIC_SERVER_ERROR });
  }
}

async function loginAccount(req: Request, res: Response): Promise<Response> {
  try {
    const validationResult = validateLoginPayload(req.body);

    if (validationResult.error || !validationResult.data) {
      console.error("Login validation error:", validationResult.error?.message);
      return res.status(400).json({ error: validationResult.error?.message ?? "Invalid payload" });
    }

    const { email, password } = validationResult.data as LoginData;

    const {
      data: loginData,
      error: loginError,
    } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (loginError || !loginData?.user || !loginData.session) {
      console.error("Login error:", loginError?.message ?? "Unknown error");
      return res.status(401).json({ error: loginError?.message ?? "Invalid credentials" });
    }

    const { data: userDataResult, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", loginData.user.id)
      .single();

    if (userError || !userDataResult) {
      console.error("User profile fetch error:", userError?.message ?? "Unknown error");
      return res.status(500).json({ error: "Failed to load user profile" });
    }

    const userData = userDataResult as UserProfile;

    return res.status(200).json({
      accessToken: loginData.session.access_token,
      refreshToken: loginData.session.refresh_token,
      user: userData,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: GENERIC_SERVER_ERROR });
  }
}

async function refreshSession(req: Request, res: Response): Promise<Response> {
  try {
    const validationResult = validateRefreshPayload(req.body ?? {});

    if (validationResult.error || !validationResult.data) {
      return res.status(400).json({ error: validationResult.error?.message ?? "Invalid payload" });
    }

    const { refreshToken } = validationResult.data as RefreshData;

    const {
      data: refreshData,
      error: refreshError,
    } = await supabaseClient.auth.refreshSession({ refresh_token: refreshToken });

    if (refreshError || !refreshData?.session || !refreshData.user) {
      console.error("Refresh error:", refreshError?.message ?? "Unknown error");
      return res.status(401).json({ error: refreshError?.message ?? "Invalid refresh token" });
    }

    const { data: refreshedUserResult, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", refreshData.user.id)
      .single();

    if (userError || !refreshedUserResult) {
      console.error("User profile fetch error:", userError?.message ?? "Unknown error");
      return res.status(500).json({ error: "Failed to load user profile" });
    }

    const userData = refreshedUserResult as UserProfile;

    return res.status(200).json({
      accessToken: refreshData.session.access_token,
      refreshToken: refreshData.session.refresh_token,
      user: userData,
    });
  } catch (error) {
    console.error("REFRESH ERROR:", error);
    return res.status(500).json({ error: GENERIC_SERVER_ERROR });
  }
}

async function logoutAccount(req: Request, res: Response): Promise<Response> {
  try {
    const validationResult = validateRefreshPayload(req.body ?? {});

    if (validationResult.error || !validationResult.data) {
      return res.status(400).json({ error: validationResult.error?.message ?? "Invalid payload" });
    }

    const authenticatedUser = req.user;
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Unauthenticated request" });
    }

    const { refreshToken } = validationResult.data as RefreshData;
    const authHeader = req.headers.authorization ?? "";
    const [, accessToken] = authHeader.split(" ");

    if (!accessToken) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const { error: setSessionError } = await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (setSessionError) {
      console.error("Set session error:", setSessionError.message);
      return res.status(400).json({ error: setSessionError.message });
    }

    const { error: signOutError } = await supabaseClient.auth.signOut({ scope: "global" });

    if (signOutError) {
      console.error("Sign out error:", signOutError.message);
      return res.status(500).json({ error: signOutError.message });
    }

    return res.status(200).json({ message: "Successfully logged out!" });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({ error: GENERIC_SERVER_ERROR });
  }
}

export { registerAccount, loginAccount, refreshSession, logoutAccount };
