// src/features/uploads/ui/UploadButton.tsx

import React from "react";
import { FileUploader } from "./FileUploader";

export const UploadButton: React.FC = () => {
  const ref = React.useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        onClick={() => ref.current?.showModal()}
        className="px-4 py-2 bg-amber-500 text-black rounded-lg font-semibold"
      >
        Завантажити файл
      </button>

      <dialog
        ref={ref}
        className="bg-neutral-900 rounded-xl p-6 border border-neutral-700"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Завантаження файлу
        </h2>
        <FileUploader />
        <button
          onClick={() => ref.current?.close()}
          className="mt-4 text-neutral-400 hover:text-white"
        >
          Закрити
        </button>
      </dialog>
    </>
  );
};
