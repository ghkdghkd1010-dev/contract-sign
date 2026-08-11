"use client";

type ContractViewProps = {
  company: string;
  contractor: string;
  contractText: string;
  signature: string;
  completed: boolean;
  onSign: () => void;
  onComplete: () => void;
};

export default function ContractView({
  company,
  contractor,
  contractText,
  signature,
  completed,
  onSign,
  onComplete,
}: ContractViewProps) {
  return (
    <div className="relative mx-auto w-full max-w-[1000px] overflow-hidden bg-white shadow-sm">

      {/* =========================================================
          37사단 워터마크
          - 문서 전체 기준 중앙보다 조금 아래
          - 계약 내용 영역에 자연스럽게 위치
          - opacity 0.08
      ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[58%] z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
      >
        <img
          src="/37-logo.webp"
          alt=""
          className="h-auto w-[300px] object-contain sm:w-[360px] md:w-[420px]"
        />
      </div>

      {/* =========================================================
          상단 문서 헤더
      ========================================================= */}
      <header className="relative z-10 border-b-[3px] border-[#18283f] px-5 py-6 sm:px-8 sm:py-7 md:px-10">
        <div className="flex items-start justify-between gap-4">

          {/* 좌측 */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

            {/* 37사단 마크 */}
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-[3px] border-[#18283f] sm:h-[68px] sm:w-[68px]">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#18283f] sm:h-[54px] sm:w-[54px]">
                <span className="text-[17px] font-bold text-[#18283f] sm:text-[22px]">
                  37
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="truncate text-[8px] tracking-[2px] text-[#52657f] sm:text-[12px] sm:tracking-[4px]">
                REPUBLIC OF KOREA
              </div>

              <div className="mt-1 truncate text-[17px] font-bold text-[#111827] sm:text-[22px]">
                제37보병사단
              </div>
            </div>
          </div>

          {/* 우측 */}
          <div className="shrink-0 text-right">
            <div className="text-[9px] tracking-[0.5px] text-[#52657f] sm:text-[13px] sm:tracking-[1px]">
              ELECTRONIC CONTRACT
            </div>

            <div className="mt-1 text-[10px] font-medium text-[#34445b] sm:text-[14px]">
              전자계약 시스템
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          제목
      ========================================================= */}
      <section className="relative z-10 px-5 pb-8 pt-10 text-center sm:px-10 sm:pb-10 sm:pt-14">

        <div className="text-[8px] font-semibold tracking-[3px] text-[#52657f] sm:text-[12px] sm:tracking-[6px]">
          OFFICIAL ELECTRONIC DOCUMENT
        </div>

        <h1 className="mt-4 text-[30px] font-bold tracking-[4px] text-[#111827] sm:mt-5 sm:text-[42px] sm:tracking-[8px]">
          계약문서
        </h1>

        <div className="mx-auto mt-5 h-[3px] w-[55px] bg-[#18283f] sm:mt-7 sm:w-[68px]" />
      </section>

      {/* =========================================================
          계약 기본정보
      ========================================================= */}
      <section className="relative z-10 px-5 sm:px-10 md:px-12">

        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
            계약 기본정보
          </h2>

          <span className="hidden text-[11px] tracking-[2px] text-[#7b8798] sm:block">
            CONTRACT INFORMATION
          </span>
        </div>

        <div className="border-t-2 border-[#18283f]">

          <div className="grid grid-cols-1 border-b border-[#cbd5e1] sm:grid-cols-2">

            {/* 계약기관 */}
            <div className="border-b border-[#cbd5e1] px-4 py-4 sm:border-b-0 sm:border-r sm:px-5 sm:py-5">
              <div className="text-[11px] text-[#64748b] sm:text-[12px]">
                계약기관
              </div>

              <div className="mt-2 break-words text-[15px] font-semibold leading-6 text-[#111827] sm:text-[16px]">
                {company || "-"}
              </div>
            </div>

            {/* 계약상대자 */}
            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <div className="text-[11px] text-[#64748b] sm:text-[12px]">
                계약상대자
              </div>

              <div className="mt-2 break-words text-[15px] font-semibold leading-6 text-[#111827] sm:text-[16px]">
                {contractor || "-"}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          계약 내용
      ========================================================= */}
      <section className="relative z-10 px-5 pt-9 sm:px-10 sm:pt-12 md:px-12">

        <div className="mb-3 flex items-end justify-between gap-3">

          <h2 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
            계약 내용
          </h2>

          <span className="hidden text-[11px] tracking-[2px] text-[#7b8798] sm:block">
            CONTRACT DOCUMENT
          </span>

        </div>

        <div className="border-t-2 border-[#18283f]">

          <div className="min-h-[220px] whitespace-pre-wrap break-words px-4 py-5 text-[14px] leading-7 text-[#273449] sm:min-h-[280px] sm:px-6 sm:py-7 sm:text-[15px] sm:leading-8">
            {contractText || "계약 내용이 없습니다."}
          </div>

        </div>
      </section>

      {/* =========================================================
          계약상대자 서명
      ========================================================= */}
      <section className="relative z-10 px-5 pb-9 pt-9 sm:px-10 sm:pb-12 sm:pt-12 md:px-12">

        <div className="mb-3 flex items-end justify-between gap-3">

          <h2 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
            계약상대자
          </h2>

          <span className="hidden text-[11px] tracking-[2px] text-[#7b8798] sm:block">
            CONTRACTOR SIGNATURE
          </span>

        </div>

        <div className="border-t-2 border-[#18283f]">

          <div className="flex flex-col gap-5 border-b border-[#cbd5e1] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">

            {/* 업체 */}
            <div className="min-w-0">

              <div className="text-[10px] tracking-[2px] text-[#64748b] sm:text-[11px]">
                CONTRACTOR
              </div>

              <div className="mt-1 break-words text-[15px] font-bold leading-6 text-[#111827] sm:text-[16px]">
                {contractor || "-"}
              </div>

            </div>

            {/* 서명 영역 */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">

              <span className="text-[12px] text-[#64748b] sm:text-[13px]">
                전자서명
              </span>

              <div className="flex h-[58px] w-full max-w-[260px] items-center justify-center border-b border-[#475569] sm:w-[190px]">

                {signature ? (
                  <img
                    src={signature}
                    alt="계약상대자 전자서명"
                    className="max-h-[48px] max-w-[90%] object-contain"
                  />
                ) : (
                  <span className="text-[12px] text-[#94a3b8] sm:text-[13px]">
                    서명란
                  </span>
                )}

              </div>

              {!completed && (
                <button
                  type="button"
                  onClick={onSign}
                  className="w-full rounded-md bg-[#18283f] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#263a57] sm:w-auto sm:py-2.5"
                >
                  {signature ? "서명 수정" : "서명하기"}
                </button>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          계약 완료 버튼
      ========================================================= */}
      {!completed && (
        <div className="relative z-10 px-5 pb-10 sm:px-10 sm:pb-14 md:px-12">

          <button
            type="button"
            onClick={onComplete}
            disabled={!signature}
            className={`w-full rounded-md py-4 text-[14px] font-semibold transition sm:text-[15px] ${
              signature
                ? "bg-[#18283f] text-white hover:bg-[#263a57]"
                : "cursor-not-allowed bg-[#e2e8f0] text-[#94a3b8]"
            }`}
          >
            {signature
              ? "전자계약 완료"
              : "전자서명 후 계약을 완료해주세요"}
          </button>

        </div>
      )}

      {/* =========================================================
          완료 상태
      ========================================================= */}
      {completed && (
        <div className="relative z-10 mx-5 mb-10 border border-[#cbd5e1] bg-[#f8fafc] px-5 py-5 sm:mx-10 sm:mb-14 sm:px-6 md:mx-12">

          <div className="flex items-center justify-between gap-4">

            <div className="min-w-0">

              <div className="text-[10px] tracking-[2px] text-[#64748b]">
                CONTRACT STATUS
              </div>

              <div className="mt-1 text-[15px] font-bold text-[#18283f] sm:text-[16px]">
                전자계약 체결 완료
              </div>

            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#18283f] text-[16px] font-bold text-[#18283f]">
              ✓
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          하단
      ========================================================= */}
      <footer className="relative z-10 border-t border-[#cbd5e1] px-5 py-8 sm:px-10 sm:py-8 md:px-12">

        <div className="flex flex-col items-center gap-2 text-center text-[10px] leading-5 text-[#7b8798] sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <span>
            본 전자문서는 전자계약 시스템을 통해 작성되었습니다.
          </span>

          <span className="tracking-[1px]">
            ELECTRONIC DOCUMENT
          </span>

        </div>

      </footer>

    </div>
  );
}