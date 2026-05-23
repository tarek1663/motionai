import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { DEFAULT_PREFERENCES, type OnboardingPreferences } from "@/lib/account/types";
import { getErrorMessage } from "@/lib/utils";

const ALLOWED_PATCH_KEYS = [
  "accent_color",
  "visual_style",
  "default_voice_id",
  "default_format",
  "default_duration",
  "completed",
] as const;

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("onboarding")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    const onboarding: OnboardingPreferences = data
      ? { ...DEFAULT_PREFERENCES, ...data, user_id: userId }
      : { ...DEFAULT_PREFERENCES, user_id: userId };

    return NextResponse.json({ onboarding });
  } catch (err: unknown) {
    console.error("❌ GET onboarding:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const patch: Record<string, unknown> = {};

    for (const key of ALLOWED_PATCH_KEYS) {
      if (body[key] !== undefined) {
        patch[key] = body[key];
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
    }

    patch.updated_at = new Date().toISOString();

    const { data: existing } = await supabase
      .from("onboarding")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from("onboarding")
        .update(patch)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from("onboarding")
        .insert({
          ...DEFAULT_PREFERENCES,
          ...patch,
          user_id: userId,
          completed: patch.completed ?? true,
        })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      onboarding: { ...DEFAULT_PREFERENCES, ...result, user_id: userId },
    });
  } catch (err: unknown) {
    console.error("❌ PATCH onboarding:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
