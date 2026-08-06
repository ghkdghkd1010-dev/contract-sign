"use client";

import SignaturePad from "./SignaturePad";

interface SignatureModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (image: string) => void;
}

export default function SignatureModal({
  open,
  onClose,
  onSave,
}: SignatureModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-2xl p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">서명하기</h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <SignaturePad
          onSave={(image) => {
            onSave(image);
            onClose();
          }}
        />

      </div>
    </div>
  );
}