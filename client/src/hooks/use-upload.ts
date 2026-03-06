import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch(api.upload.path, {
        method: api.upload.method,
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to upload file");
      return api.upload.responses[200].parse(await res.json());
    },
  });
}
