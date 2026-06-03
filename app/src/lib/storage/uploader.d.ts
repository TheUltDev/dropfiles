export type UploadController = {
  pause: () => void | Promise<void>;
  resume: () => void | Promise<void>;
  cancel: () => void | Promise<void>;
};

export type UploadHandlers = {
  onProgress?: (bytesUploaded: number, bytesTotal?: number) => void;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
};

export declare function startUpload(
  target: unknown,
  handlers?: UploadHandlers,
): Promise<UploadController>;
