import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/lib/auth.middleware.server";

export const updateMasterPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    newPassword: z.string().min(8),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Verify if the user is MASTER
    const { data: profile, error: profileError } = await context.supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || profile?.role !== 'MASTER') {
      throw new Error("Unauthorized: Only MASTER accounts can perform this action.");
    }

    // Update the password via Admin SDK
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: data.newPassword }
    );

    if (updateError) {
      throw new Error(`Failed to update password: ${updateError.message}`);
    }

    return { success: true };
  });
