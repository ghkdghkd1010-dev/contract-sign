"use client";

import SignaturePad from "./SignaturePad";

type SignatureModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (image: string) => void;
};

export default function SignatureModal({
  open,
  onClose,
  onSave,
}: SignatureModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="w-full max-w-[560px] overflow-hidden rounded-xl bg-white shadow-2xl">

        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-[#d8dee6] px-6 py-5">

          <div>
            <div className="text-[10px] font-semibold tracking-[3px] text-[#64748b]">
              ELECTRONIC SIGNATURE
            </div>

            <h2 className="mt-1 text-[20px] font-bold text-[#18283f]">
              전자서명
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[22px] text-[#64748b] hover:bg-[#f1f5f9]"
          >
            ×
          </button>

        </div>

        {/* 안내 */}
        <div className="px-6 pt-6">

          <p className="text-[13px] leading-6 text-[#64748b]">
            아래 서명란에 본인의 서명을 입력해주세요.
            <br />
            휴대전화에서는 손가락으로 서명할 수 있습니다.
          </p>

        </div>

        {/* 서명 패드 */}
        <div className="px-6 py-5">
          <SignaturePad onSave={onSave} />
        </div>

      </div>

    </div>
  );
}