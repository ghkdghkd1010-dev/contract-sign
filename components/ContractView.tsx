"use client";

type ContractViewProps = {
  company: string;
  companyBusinessNumber?: string;
  contractor: string;
  contractorBusinessNumber?: string;

  contractText: string;

  productName?: string;
  productDescription?: string;
  quantity?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  deliveryDate?: string | null;
  deliveryAddress?: string;

  signature: string;
  completed: boolean;

  agreementChecked: boolean;
  specialChecked: boolean;

  onAgreementChange: (checked: boolean) => void;
  onSpecialChange: (checked: boolean) => void;

  onSign: () => void;
  onComplete: () => void;
};

const formatMoney = (value?: number | null) => {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value)
  ) {
    return "-";
  }

  return `${Number(value).toLocaleString("ko-KR")}원`;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/*
 * 계약서 문구의 띄어쓰기를 화면에서 통일한다.
 * DB에 기존 문구가 저장되어 있어도 화면에서는
 * 표준적인 띄어쓰기로 표시되도록 처리한다.
 */
const normalizeContractText = (text: string) => {
  return text
    .replace(/계약조건/g, "계약 조건")
    .replace(/계약내용/g, "계약 내용")
    .replace(/계약금액/g, "계약 금액")
    .replace(/계약물품/g, "계약 물품")
    .replace(/계약당사자/g, "계약 당사자")
    .replace(/납품조건/g, "납품 조건")
    .replace(/계약상 의무/g, "계약상의 의무")
    .replace(/제품상세설명/g, "제품 상세 설명")
    .replace(/대금지급/g, "대금 지급")
    .replace(/지급조건/g, "지급 조건")
    .replace(/제(\d+)조\s*\(/g, "제$1조(");
};

/*
 * 계약 조문을 화면에서 보기 좋게 표시한다.
 *
 * 예:
 * 제1조(목적)
 * 제2조(계약 당사자)
 *
 * 조문 제목은 굵게 표시한다.
 */
const renderContractClauses = (text: string) => {
  const normalized = normalizeContractText(text);

  const clauses = normalized
    .split(/(?=제\d+조\([^)]*\))/g)
    .map((clause) => clause.trim())
    .filter(Boolean);

  return (
    <div className="space-y-9">
      {clauses.map((clause, index) => {
        const match = clause.match(
          /^(제\d+조\([^)]*\))([\s\S]*)$/
        );

        if (!match) {
          return (
            <div
              key={index}
              className="whitespace-pre-wrap break-words"
            >
              {clause}
            </div>
          );
        }

        const title = match[1];
        const body = match[2].trim();

        return (
          <div key={index}>
            <div className="mb-2 text-[14px] font-bold leading-7 text-[#243b5a] sm:text-[15px]">
              {title}
            </div>

            <div className="whitespace-pre-wrap break-words text-[13px] leading-7 text-[#334155] sm:text-[14px]">
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function ContractView({
  company,
  companyBusinessNumber,
  contractor,
  contractorBusinessNumber,

  contractText,

  productName,
  productDescription,
  quantity,
  unitPrice,
  totalPrice,
  deliveryDate,
  deliveryAddress,

  signature,
  completed,

  agreementChecked,
  specialChecked,

  onAgreementChange,
  onSpecialChange,

  onSign,
  onComplete,
}: ContractViewProps) {
  const canSign = agreementChecked && specialChecked;

  /*
   * contractText에는 계약 조건과 계약 물품 정보가 함께 저장되어 있음.
   *
   * [계약 물품] 이전까지는 제1조~제11조의 계약 조건이며,
   * 화면에서는 계약 조건 영역에 표시한다.
   */
  const contractClauses = contractText
    ? contractText.split("[계약 물품]")[0].trim()
    : "";

  return (
    <div className="relative mx-auto w-full max-w-[1000px] overflow-hidden bg-white shadow-sm">

      {/* =========================================================
          문서 헤더
      ========================================================= */}
      <header className="relative z-10 border-b-[3px] border-[#18283f] px-5 py-5 sm:px-8 sm:py-6 md:px-10">
        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center sm:h-[68px] sm:w-[68px]">
              <img
                src="/37-logo.webp"
                alt="제37보병사단 마크"
                className="h-full w-full object-contain"
              />
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
      <section className="relative z-10 px-5 pb-6 pt-8 text-center sm:px-10 sm:pb-8 sm:pt-10">

        <div className="text-[8px] font-semibold tracking-[3px] text-[#52657f] sm:text-[12px] sm:tracking-[6px]">
          OFFICIAL ELECTRONIC DOCUMENT
        </div>

        <h1 className="mt-3 text-[30px] font-bold tracking-[4px] text-[#111827] sm:mt-4 sm:text-[42px] sm:tracking-[8px]">
          물품 납품 계약서
        </h1>

        <div className="mx-auto mt-4 h-[3px] w-[55px] bg-[#18283f] sm:mt-5 sm:w-[68px]" />

        <p className="mt-3 text-[12px] text-[#64748b] sm:text-[13px]">
          물품 납품 및 계약 조건에 관한 전자계약 문서
        </p>

      </section>


      {/* =========================================================
          계약 기본정보
      ========================================================= */}
      <section className="relative z-10 px-5 sm:px-10 md:px-12">

        <div className="mb-2 flex items-end justify-between gap-3">

          <h2 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
            계약 기본정보
          </h2>

          <span className="hidden text-[11px] tracking-[2px] text-[#7b8798] sm:block">
            CONTRACT INFORMATION
          </span>

        </div>

        <div className="border-t-2 border-[#18283f]">

          <div className="grid grid-cols-1 sm:grid-cols-2">

            {/* 계약기관 */}
            <div className="border-b border-[#cbd5e1] px-4 py-4 sm:border-b-0 sm:border-r sm:px-5">

              <div className="text-[11px] text-[#64748b] sm:text-[12px]">
                계약기관(갑)
              </div>

              <div className="mt-1.5 text-[15px] font-semibold text-[#111827] sm:text-[16px]">
                {company || "-"}
              </div>

              {companyBusinessNumber && (
                <div className="mt-1.5 text-[12px] text-[#64748b]">
                  사업자등록번호: {companyBusinessNumber}
                </div>
              )}

            </div>


            {/* 계약상대자 */}
            <div className="border-b border-[#cbd5e1] px-4 py-4 sm:border-b-0 sm:px-5">

              <div className="text-[11px] text-[#64748b] sm:text-[12px]">
                계약상대자(을)
              </div>

              <div className="mt-1.5 text-[15px] font-semibold text-[#111827] sm:text-[16px]">
                {contractor || "-"}
              </div>

              {contractorBusinessNumber && (
                <div className="mt-1.5 text-[12px] text-[#64748b]">
                  사업자등록번호: {contractorBusinessNumber}
                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          계약 조건 / 제1조~제11조
      ========================================================= */}
      <section className="relative z-10 px-5 pt-9 sm:px-10 sm:pt-10 md:px-12">

        <div className="mb-2 flex items-end justify-between gap-3">

          <h2 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
            계약 조건
          </h2>

          <span className="hidden text-[11px] tracking-[2px] text-[#7b8798] sm:block">
            CONTRACT TERMS
          </span>

        </div>


        {/* 계약 조건 본문 + 워터마크 */}
        <div className="relative overflow-hidden border-t-2 border-[#18283f] bg-[#fafbfd]">

          {/* =====================================================
              제37보병사단 워터마크
              계약 조건 영역 중앙에 한 번만 표시
          ===================================================== */}
          <img
            src="/37-logo.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.055]"
          />


          {contractClauses ? (
            <div className="relative z-10 px-5 py-6 sm:px-7 sm:py-7">
              {renderContractClauses(contractClauses)}
            </div>
          ) : (
            <div className="relative z-10 px-5 py-6 text-[13px] text-[#94a3b8] sm:px-7 sm:py-7">
              계약 조건이 없습니다.
            </div>
          )}

        </div>

      </section>


      {/* =========================================================
          계약 내용
      ========================================================= */}
      <section className="relative z-10 px-5 pt-9 sm:px-10 sm:pt-10 md:px-12">

        <div className="mb-2 flex items-end justify-between gap-3">

          <h2 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
            계약 내용
          </h2>

          <span className="hidden text-[11px] tracking-[2px] text-[#7b8798] sm:block">
            CONTRACT DETAILS
          </span>

        </div>


        {/* 계약 내용 표 */}
        <div className="border-t-2 border-[#18283f]">

          {/* 제품명 */}
          <div className="grid grid-cols-1 border-b border-[#cbd5e1] sm:grid-cols-[180px_1fr]">

            <div className="bg-[#f8fafc] px-4 py-3.5 text-[12px] font-semibold text-[#475569] sm:px-5">
              제품명
            </div>

            <div className="px-4 py-3.5 text-[14px] font-semibold text-[#111827] sm:px-5">
              {productName || "-"}
            </div>

          </div>


          {/* 제품 상세 설명 */}
          <div className="grid grid-cols-1 border-b border-[#cbd5e1] sm:grid-cols-[180px_1fr]">

            <div className="bg-[#f8fafc] px-4 py-3.5 text-[12px] font-semibold text-[#475569] sm:px-5">
              제품 상세 설명
            </div>

            <div className="whitespace-pre-wrap break-words px-4 py-3.5 text-[14px] leading-7 text-[#273449] sm:px-5">
              {productDescription || "-"}
            </div>

          </div>


          {/* 수량 */}
          <div className="grid grid-cols-1 border-b border-[#cbd5e1] sm:grid-cols-[180px_1fr]">

            <div className="bg-[#f8fafc] px-4 py-3.5 text-[12px] font-semibold text-[#475569] sm:px-5">
              수량
            </div>

            <div className="px-4 py-3.5 text-[14px] text-[#111827] sm:px-5">
              {quantity ?? "-"}
            </div>

          </div>


          {/* 단가 */}
          <div className="grid grid-cols-1 border-b border-[#cbd5e1] sm:grid-cols-[180px_1fr]">

            <div className="bg-[#f8fafc] px-4 py-3.5 text-[12px] font-semibold text-[#475569] sm:px-5">
              단가
            </div>

            <div className="px-4 py-3.5 text-[14px] text-[#111827] sm:px-5">
              {formatMoney(unitPrice)}
            </div>

          </div>


          {/* 총 계약 금액 */}
          <div className="grid grid-cols-1 border-b border-[#cbd5e1] sm:grid-cols-[180px_1fr]">

            <div className="bg-[#f8fafc] px-4 py-3.5 text-[12px] font-semibold text-[#475569] sm:px-5">
              총 계약 금액
            </div>

            <div className="px-4 py-3.5 text-[14px] font-bold text-[#18283f] sm:px-5">
              {formatMoney(totalPrice)}
            </div>

          </div>


          {/* 납품일자 */}
          <div className="grid grid-cols-1 border-b border-[#cbd5e1] sm:grid-cols-[180px_1fr]">

            <div className="bg-[#f8fafc] px-4 py-3.5 text-[12px] font-semibold text-[#475569] sm:px-5">
              납품일자
            </div>

            <div className="px-4 py-3.5 text-[14px] text-[#111827] sm:px-5">
              {formatDate(deliveryDate)}
            </div>

          </div>


          {/* 납품장소 */}
          <div className="grid grid-cols-1 border-b border-[#cbd5e1] sm:grid-cols-[180px_1fr]">

            <div className="bg-[#f8fafc] px-4 py-3.5 text-[12px] font-semibold text-[#475569] sm:px-5">
              납품장소
            </div>

            <div className="px-4 py-3.5 text-[14px] text-[#111827] sm:px-5">
              {deliveryAddress || "-"}
            </div>

          </div>


          {/* 대금 지급 조건 */}
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">

            <div className="bg-[#f8fafc] px-4 py-3.5 text-[12px] font-semibold text-[#475569] sm:px-5">
              대금 지급 조건
            </div>

            <div className="px-4 py-3.5 text-[14px] font-medium text-[#273449] sm:px-5">
              납품 및 검수 완료 후 지급
            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          계약상대자 확인
      ========================================================= */}
      <section className="relative z-10 px-5 pt-8 sm:px-10 sm:pt-9 md:px-12">

        <div className="mb-2 flex items-end justify-between gap-3">

          <h2 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
            계약상대자 확인
          </h2>

          <span className="hidden text-[11px] tracking-[2px] text-[#7b8798] sm:block">
            CONTRACT CONFIRMATION
          </span>

        </div>


        <div className="border-t-2 border-[#18283f] bg-[#fafbfd] px-5 py-5 sm:px-7 sm:py-6">

          <p className="text-[13px] leading-7 text-[#334155] sm:text-[14px]">
            본인은 본 계약서에 기재된{" "}
            <strong>
              계약 당사자, 계약 물품, 제품 상세 설명, 수량, 계약 금액,
              납품 조건 및 계약 조건
            </strong>
            을 모두 확인하였으며, 본 계약 내용에 동의합니다.
          </p>


          <div className="mt-5 space-y-3.5">

            {/* 첫 번째 체크 */}
            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) =>
                  onAgreementChange(e.target.checked)
                }
                className="mt-[3px] h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#18283f]"
              />

              <span className="text-[13px] leading-6 text-[#1e293b] sm:text-[14px]">
                계약 내용을 모두 확인하였습니다.
              </span>

            </label>


            {/* 두 번째 체크 */}
            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={specialChecked}
                onChange={(e) =>
                  onSpecialChange(e.target.checked)
                }
                className="mt-[3px] h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#18283f]"
              />

              <span className="text-[13px] leading-6 text-[#1e293b] sm:text-[14px]">
                계약 조건 및 특약 사항을 확인하였습니다.
              </span>

            </label>

          </div>

        </div>

      </section>


      {/* =========================================================
          서명
      ========================================================= */}
      <section className="relative z-10 px-5 pb-7 pt-8 sm:px-10 sm:pb-9 sm:pt-9 md:px-12">

        <div className="mb-2 flex items-end justify-between gap-3">

          <h2 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
            계약상대자 전자서명
          </h2>

          <span className="hidden text-[11px] tracking-[2px] text-[#7b8798] sm:block">
            CONTRACTOR SIGNATURE
          </span>

        </div>


        <div className="border-t-2 border-[#18283f]">

          <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">

            <div className="min-w-0">

              <div className="text-[10px] tracking-[2px] text-[#64748b] sm:text-[11px]">
                CONTRACTOR
              </div>

              <div className="mt-1 break-words text-[15px] font-bold text-[#111827] sm:text-[16px]">
                {contractor || "-"}
              </div>

            </div>


            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">

              <span className="text-[12px] text-[#64748b]">
                전자서명
              </span>


              <div className="flex h-[60px] w-full max-w-[260px] items-center justify-center border-b border-[#475569] sm:w-[210px]">

                {signature ? (
                  <img
                    src={signature}
                    alt="계약상대자 전자서명"
                    className="max-h-[50px] max-w-[90%] object-contain"
                  />
                ) : (
                  <span className="text-[12px] text-[#94a3b8]">
                    서명란
                  </span>
                )}

              </div>


              {!completed && (
                <button
                  type="button"
                  onClick={() => {

                    if (!canSign) {
                      alert(
                        "서명하기 전에 계약 내용과 계약 조건 및 특약 사항을 모두 확인해 주세요."
                      );

                      return;
                    }

                    onSign();
                  }}
                  className="w-full rounded-md bg-[#18283f] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#263a57] sm:w-auto"
                >
                  {signature ? "서명 수정" : "서명하기"}
                </button>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          계약 완료
      ========================================================= */}
      {!completed && (
        <div className="relative z-10 px-5 pb-8 sm:px-10 sm:pb-10 md:px-12">

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
              : "전자서명 후 계약을 완료해 주세요"}
          </button>

        </div>
      )}


      {/* =========================================================
          완료 상태
      ========================================================= */}
      {completed && (
        <div className="relative z-10 mx-5 mb-8 border border-[#cbd5e1] bg-[#f8fafc] px-5 py-5 sm:mx-10 sm:mb-10 sm:px-6 md:mx-12">

          <div className="flex items-center justify-between gap-4">

            <div>

              <div className="text-[10px] tracking-[2px] text-[#64748b]">
                ELECTRONIC CONTRACT
              </div>

              <div className="mt-1 text-[15px] font-bold text-[#18283f] sm:text-[16px]">
                전자서명이 완료되었습니다.
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
      <footer className="relative z-10 border-t border-[#cbd5e1] px-5 py-7 sm:px-10 md:px-12">

        <div className="flex flex-col items-center justify-between gap-2 text-center text-[10px] leading-5 text-[#7b8798] sm:flex-row sm:text-left">

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