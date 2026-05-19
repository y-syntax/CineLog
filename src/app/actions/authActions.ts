"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return { error: error.message };
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile) {
    // If we have full_name in metadata (from signup), create profile now since we are authenticated
    const fullName = data.user.user_metadata?.full_name;
    if (fullName) {
      const isAdmin = email === "yadusrajiv@gmail.com";
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        is_approved: true, // Auto-approve everyone for open community
        is_admin: isAdmin,
        updated_at: new Date().toISOString()
      });
      redirect("/");
    } else {
      // Fallback if no name found
      redirect("/setup");
    }
  }

  redirect("/");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;
  
  const supabase = await createClient();
  // Pass full_name in user metadata so it can be used upon first login
  const { error, data } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        full_name
      }
    }
  });
  
  if (error) {
    return { error: error.message };
  }

  // Redirect to home. If email verification is on, Supabase will handle the lock/auth state.
  redirect("/");
}


export async function saveProfile(formData: FormData) {
  const full_name = formData.get("full_name") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const isAdmin = user.email === "yadusrajiv@gmail.com";

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name,
    email: user.email,
    is_approved: true, // Auto-approve for open community
    is_admin: isAdmin,
    updated_at: new Date().toISOString()
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}


export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
