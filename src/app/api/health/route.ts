import { createClient } from "@supabase/supabase-js";
import { connection } from "next/server";

import { getSupabaseConfig } from "@/lib/supabase/config";

export async function GET() {
  await connection();

  const config = getSupabaseConfig();

  if (!config) {
    return Response.json({
      status: "ok",
      supabase: "not_configured",
      message: "The app is running. Add Supabase environment variables next.",
    });
  }

  const supabase = createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      return Response.json(
        {
          status: "error",
          supabase: "connection_failed",
          message: error.message,
        },
        { status: 503 },
      );
    }

    return Response.json({
      status: "ok",
      supabase: "connected",
    });
  } catch {
    return Response.json(
      {
        status: "error",
        supabase: "connection_failed",
        message: "Could not reach Supabase. Check the project URL and status.",
      },
      { status: 503 },
    );
  }
}
