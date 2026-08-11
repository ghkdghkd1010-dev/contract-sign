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
    <div className="mx-auto max-w-[1000px] bg-white shadow-sm">

      {/* 상단 문서 헤더 */}
      <header className="border-b-[3px] border-[#18283f] px-10 py-7">
        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-[#18283f]">
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#18283f]">
                <span className="text-[22px] font-bold text-[#18283f]">
                  37
                </span>
              </div>
            </div>

            <div>
              <div className="text-[12px] tracking-[4px] text-[#52657f]">
                REPUBLIC OF KOREA
              </div>

              <div className="mt-1 text-[22px] font-bold text-[#111827]">
                제37보병사단
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[13px] tracking-[1px] text-[#52657f]">
              ELECTRONIC CONTRACT
            </div>

            <div className="mt-1 text-[14px] font-medium text-[#34445b]">
              전자계약 시스템
            </div>
          </div>

        </div>
      </header>


      {/* 제목 */}
      <section className="px-12 pb-10 pt-14 text-center">

        <div className="text-[12px] font-semibold tracking-[6px] text-[#52657f]">
          OFFICIAL ELECTRONIC DOCUMENT
        </div>

        <h1 className="mt-5 text-[42px] font-bold tracking-[8px] text-[#111827]">
          계약문서
        </h1>

        <div className="mx-auto mt-7 h-[3px] w-[68px] bg-[#18283f]" />

      </section>


      {/* 계약 기본정보 */}
      <section className="px-12">

        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-[19px] font-bold text-[#111827]">
            계약 기본정보
          </h2>

          <span className="text-[11px] tracking-[2px] text-[#7b8798]">
            CONTRACT INFORMATION
          </span>
        </div>

        <div className="border-t-2 border-[#18283f]">

          <div className="grid grid-cols-2 border-b border-[#cbd5e1]">

            <div className="border-r border-[#cbd5e1] px-5 py-5">
              <div className="text-[12px] text-[#64748b]">
                계약기관
              </div>

              <div className="mt-2 text-[16px] font-semibold text-[#111827]">
                {company || "-"}
              </div>
            </div>

            <div className="px-5 py-5">
              <div className="text-[12px] text-[#64748b]">
                계약상대자
              </div>

              <div className="mt-2 text-[16px] font-semibold text-[#111827]">
                {contractor || "-"}
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* 계약 내용 */}
      <section className="px-12 pt-12">

        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-[19px] font-bold text-[#111827]">
            계약 내용
          </h2>

          <span className="text-[11px] tracking-[2px] text-[#7b8798]">
            CONTRACT DOCUMENT
          </span>
        </div>

        <div className="border-t-2 border-[#18283f]">

          <div className="min-h-[280px] whitespace-pre-wrap px-6 py-7 text-[15px] leading-8 text-[#273449]">
            {contractText || "계약 내용이 없습니다."}
          </div>

        </div>

      </section>


      {/* 계약상대자 서명 */}
      <section className="px-12 pb-12 pt-12">

        <div className="mb-3 flex items-end justify-between">

          <h2 className="text-[19px] font-bold text-[#111827]">
            계약상대자
          </h2>

          <span className="text-[11px] tracking-[2px] text-[#7b8798]">
            CONTRACTOR SIGNATURE
          </span>

        </div>


        <div className="border-t-2 border-[#18283f]">

          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#cbd5e1] px-5 py-5">

            {/* 업체 */}
            <div>
              <div className="text-[11px] tracking-[2px] text-[#64748b]">
                CONTRACTOR
              </div>

              <div className="mt-1 text-[16px] font-bold text-[#111827]">
                {contractor || "-"}
              </div>
            </div>


            {/* 서명 */}
            <div className="flex items-center gap-4">

              <span className="text-[13px] text-[#64748b]">
                전자서명
              </span>

              <div className="flex h-[58px] w-[190px] items-center justify-center border-b border-[#475569]">

                {signature ? (
                  <img
                    src={signature}
                    alt="계약상대자 전자서명"
                    className="max-h-[48px] max-w-[170px] object-contain"
                  />
                ) : (
                  <span className="text-[13px] text-[#94a3b8]">
                    서명란
                  </span>
                )}

              </div>


              {!completed && (
                <button
                  type="button"
                  onClick={onSign}
                  className="rounded-md bg-[#18283f] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#263a57]"
                >
                  {signature ? "서명 수정" : "서명하기"}
                </button>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* 계약 완료 */}
      {!completed && (
        <div className="px-12 pb-14">

          <button
            type="button"
            onClick={onComplete}
            disabled={!signature}
            className={`w-full rounded-md py-4 text-[15px] font-semibold transition ${
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


      {/* 완료 상태 */}
      {completed && (
        <div className="mx-12 mb-14 border border-[#cbd5e1] bg-[#f8fafc] px-6 py-5">

          <div className="flex items-center justify-between">

            <div>
              <div className="text-[11px] tracking-[2px] text-[#64748b]">
                CONTRACT STATUS
              </div>

              <div className="mt-1 text-[16px] font-bold text-[#18283f]">
                전자계약 체결 완료
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#18283f] text-[16px] font-bold text-[#18283f]">
              ✓
            </div>

          </div>

        </div>
      )}


      {/* 하단 */}
      <footer className="border-t border-[#cbd5e1] px-12 py-6">

        <div className="flex items-center justify-between text-[11px] text-[#7b8798]">

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