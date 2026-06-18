import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const professionalsQuery = queryOptions({
  queryKey: ["professionals"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("professionals")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
});
