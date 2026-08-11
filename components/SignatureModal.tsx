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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
      <div className="my-auto flex max-h-[95vh] w-full max-w-[560px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#d8dee6] px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <div className="text-[9px] font-semibold tracking-[2px] text-[#64748b] sm:text-[10px] sm:tracking-[3px]">
              ELECTRONIC SIGNATURE
            </div>

            <h2 className="mt-1 text-[18px] font-bold text-[#18283f] sm:text-[20px]">
              전자서명
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[22px] text-[#64748b] hover:bg-[#f1f5f9]"
          >
            ×
          </button>
        </div>

        {/* 안내 */}
        <div className="shrink-0 px-4 pt-5 sm:px-6 sm:pt-6">
          <p className="text-[12px] leading-6 text-[#64748b] sm:text-[13px]">
            아래 서명란에 본인의 서명을 입력해주세요.
            <br />
            휴대전화에서는 손가락으로 서명할 수 있습니다.
          </p>
        </div>

        {/* 서명 패드 */}
        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <SignaturePad onSave={onSave} />
        </div>
      </div>
    </div>
  );
}