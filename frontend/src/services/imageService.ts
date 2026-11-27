import { axiosClient } from "../lib/axiosClient";

export interface ImageUploadResponse {
  url: string;
  publicId: string;
}

/** Upload an image file to the shared media upload endpoint. */
export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosClient.post<ImageUploadResponse>("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
