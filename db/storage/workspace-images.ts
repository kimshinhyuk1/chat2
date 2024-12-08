import { supabase } from "@/lib/supabase/browser-client"
import { Tables } from "@/supabase/types"

// 이미지를 업로드하는 함수
export const uploadWorkspaceImage = async (
  workspace: Tables<"workspaces">,
  image?: File // 이미지가 선택되지 않을 수 있음
) => {
  const bucket = "workspace_images"

  // 이미지를 제공하지 않으면 로직을 건너뜀
  if (!image) {
    console.warn("No image provided, skipping upload.")
    return workspace.image_path || null // 기존 경로 유지
  }

  const imageSizeLimit = 6000000 // 6MB

  // 이미지 크기 제한
  if (image.size > imageSizeLimit) {
    throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
  }

  const currentPath = workspace.image_path
  let filePath = `${workspace.user_id}/${workspace.id}/${Date.now()}`

  // 기존 이미지 삭제
  if (currentPath && currentPath.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([currentPath])

    if (deleteError) {
      throw new Error("Error deleting old image")
    }
  }

  // 새 이미지 업로드
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, image, {
      upsert: true
    })

  if (error) {
    throw new Error("Error uploading image")
  }

  return filePath
}

// 이미지를 다운로드하는 함수
export const getWorkspaceImageFromStorage = async (filePath?: string) => {
  // 경로가 없으면 로직을 건너뜀
  if (!filePath) {
    console.warn("No file path provided, skipping signed URL generation.")
    return null // 이미지 경로가 없으면 null 반환
  }

  try {
    const { data, error } = await supabase.storage
      .from("workspace_images")
      .createSignedUrl(filePath, 60 * 60 * 24) // 24시간 유효

    if (error) {
      throw new Error("Error downloading workspace image")
    }

    return data.signedUrl
  } catch (error) {
    console.error("Unhandled error:", error)
    return null // 오류 발생 시 null 반환
  }
}
