import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createSupabaseServerClient } from "../lib/supabase";

export const server = {
  auth: {
    register: defineAction({
      accept: "form",
      input: z.object({
        nombre: z.string().trim().min(1, "Ingresa tu nombre"),
        email: z.string().trim().email("Ingresa un correo válido"),
        password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
      }),
      handler: async ({ nombre, email, password }, context) => {
        const supabase = createSupabaseServerClient(context.request, context.cookies);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nombre } },
        });

        if (error) {
          throw new ActionError({ code: "BAD_REQUEST", message: error.message });
        }

        return { hasSession: data.session !== null };
      },
    }),

    login: defineAction({
      accept: "form",
      input: z.object({
        email: z.string().trim().email("Ingresa un correo válido"),
        password: z.string().min(1, "Ingresa tu contraseña"),
      }),
      handler: async ({ email, password }, context) => {
        const supabase = createSupabaseServerClient(context.request, context.cookies);
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          throw new ActionError({ code: "UNAUTHORIZED", message: "Correo o contraseña incorrectos." });
        }

        return { success: true };
      },
    }),

    logout: defineAction({
      accept: "form",
      handler: async (_input, context) => {
        const supabase = createSupabaseServerClient(context.request, context.cookies);
        await supabase.auth.signOut();
        return { success: true };
      },
    }),
  },
};
