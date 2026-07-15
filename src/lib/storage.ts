/**
 * Leo Club CMS — Supabase Storage Utility
 * ----------------------------------------------------------------
 * Handles file uploads (images, videos, PDFs, documents) to Supabase Storage.
 * Creates signed URLs for private files and public URLs for public files.
 */
import { createClient as createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Upload a file to Supabase Storage.
 * @param file — The File object to upload
 * @param bucket — Bucket name (e.g., "images", "documents", "media")
 * @param folder — Folder within the bucket (e.g., "board", "events")
 * @returns { url: string } — The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string = "images",
  folder: string = "uploads"
): Promise<{ url: string; error?: string }> {
  if (!supabaseUrl || !supabaseKey) {
    return { url: "", error: "Supabase not configured" };
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  // Generate a unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("[Supabase Storage] Upload error:", error);
      return { url: "", error: error.message };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl };
  } catch (err) {
    console.error("[Supabase Storage] Exception:", err);
    return { url: "", error: err instanceof Error ? err.message : "Upload failed" };
  }
}

/**
 * Delete a file from Supabase Storage.
 * @param bucket — Bucket name
 * @param path — Full path of the file to delete
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseUrl || !supabaseKey) {
    return { success: false, error: "Supabase not configured" };
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}

/**
 * List all files in a bucket/folder.
 */
export async function listFiles(
  bucket: string = "images",
  folder: string = ""
): Promise<{ files: { name: string; url: string }[]; error?: string }> {
  if (!supabaseUrl || !supabaseKey) {
    return { files: [], error: "Supabase not configured" };
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder);
    if (error) {
      return { files: [], error: error.message };
    }

    const files = (data || [])
      .filter((item) => item.name !== ".emptyFolderPlaceholder")
      .map((item) => ({
        name: item.name,
        url: supabase.storage.from(bucket).getPublicUrl(`${folder}/${item.name}`).data.publicUrl,
      }));

    return { files };
  } catch (err) {
    return { files: [], error: err instanceof Error ? err.message : "List failed" };
  }
}

/**
 * Validate a file before upload.
 * @param file — The File object
 * @param allowedTypes — Array of allowed MIME types
 * @param maxSizeMB — Maximum file size in MB
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed. Allowed: ${allowedTypes.join(", ")}` };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }
  return { valid: true };
}
