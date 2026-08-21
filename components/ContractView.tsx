"use client";

type ContractItem = {
  id: number;
  productName: string;
  productSpec: string;
  quantity: number;
  unitPrice: number;
};

type ContractViewProps = {
  company: string;
  companyBusinessNumber?: string;

  contractor: string;
  contractorBusinessNumber?: string;

  contractText: string;

  items?: ContractItem[];

  // 기존 단일 품목 호환
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

// ==========================================
// 금액
// ==========================================

function formatMoney(value?: number | null) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "-";
  }

  return `${Number(value).toLocaleString("ko-KR")}원`;
}

// ==========================================
// 날짜
// ==========================================

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// ==========================================
// 계약조건 조문 제목 정리
// ==========================================

function formatContractText(text: string) {
  if (!text) {
    return "계약조건이 없습니다.";
  }

  return text.replace(
    /(제\s*\d+\s*조)\s+\(/g,
    "$1("
  );
}

// ==========================================
// ContractView
// ==========================================

export default function ContractView({
  company,
  companyBusinessNumber,

  contractor,
  contractorBusinessNumber,

  contractText,

  items = [],

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

  // ========================================
  // 기존 단일 품목 데이터 호환
  // ========================================

  const displayItems =
    items.length > 0
      ? items
      : productName
        ? [
            {
              id: 1,
              productName: productName,
              productSpec: productDescription || "",
              quantity: Number(quantity || 0),
              unitPrice: Number(unitPrice || 0),
            },
          ]
        : [];

  // ========================================
  // 실제 화면 표시 합계
  // ========================================

  const calculatedTotal =
    displayItems.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.unitPrice || 0),
      0
    );

  const finalTotal =
    calculatedTotal > 0
      ? calculatedTotal
      : Number(totalPrice || 0);

  // ========================================
  // 계약조건 표시용 텍스트
  // ========================================

  const formattedContractText =
    formatContractText(contractText);

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1250px]
        overflow-hidden
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.08)]
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <header
        className="
          relative
          border-b-[3px]
          border-[#18283f]
          px-5
          py-5
          sm:px-12
          sm:py-8
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            sm:gap-6
          "
        >

          {/* LEFT */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
              sm:gap-5
            "
          >

            <div
              className="
                flex
                h-[52px]
                w-[52px]
                shrink-0
                items-center
                justify-center
                sm:h-[70px]
                sm:w-[70px]
              "
            >

              <img
                src="/25-logo.webp"
                alt="제25보병사단 마크"
                className="
                  h-[50px]
                  w-[50px]
                  object-contain
                  sm:h-[68px]
                  sm:w-[68px]
                "
              />

            </div>

            <div className="min-w-0">

              <p
                className="
                  whitespace-nowrap
                  text-[8px]
                  tracking-[0.18em]
                  text-[#46658d]
                  sm:text-[13px]
                  sm:tracking-[0.38em]
                "
              >
                R E P U B L I C&nbsp;&nbsp;O F&nbsp;&nbsp;K O R E A
              </p>

              <h1
                className="
                  mt-1
                  text-base
                  font-bold
                  tracking-tight
                  text-[#101827]
                  sm:mt-2
                  sm:text-2xl
                "
              >
                제25보병사단
              </h1>

            </div>

          </div>

          {/* RIGHT */}

          <div className="shrink-0 text-right">

            <p
              className="
                whitespace-nowrap
                text-[8px]
                tracking-[0.08em]
                text-[#46658d]
                sm:text-sm
                sm:tracking-[0.12em]
              "
            >
              ELECTRONIC CONTRACT
            </p>

            <p
              className="
                mt-1
                text-[10px]
                font-semibold
                text-[#18283f]
                sm:mt-2
                sm:text-base
              "
            >
              전자계약 시스템
            </p>

          </div>

        </div>

      </header>

      {/* ==================================================
          TITLE
      ================================================== */}

      <section
        className="
          px-5
          pb-8
          pt-9
          sm:px-12
          sm:pb-12
          sm:pt-14
        "
      >

        <div className="text-center">

          <p
            className="
              text-[8px]
              font-medium
              tracking-[0.24em]
              text-[#46658d]
              sm:text-sm
              sm:tracking-[0.42em]
            "
          >
            O F F I C I A L&nbsp;&nbsp;E L E C T R O N I C&nbsp;&nbsp;D O C U M E N T
          </p>

          <h2
            className="
              mt-5
              break-keep
              text-[27px]
              font-black
              tracking-[0.08em]
              text-[#101827]
              sm:mt-7
              sm:text-5xl
              sm:tracking-[0.16em]
            "
          >
            물품 납품 계약서
          </h2>

          <p
            className="
              mt-5
              break-keep
              text-xs
              text-[#5f7899]
              sm:mt-7
              sm:text-base
            "
          >
            물품 납품 및 계약 조건에 관한 전자계약 문서
          </p>

        </div>

      </section>

      {/* ==================================================
          CONTRACT INFORMATION
      ================================================== */}

      <section
        className="
          px-5
          sm:px-12
        "
      >

        <div
          className="
            mb-4
            flex
            items-end
            justify-between
            gap-3
          "
        >

          <h3
            className="
              text-lg
              font-bold
              text-[#101827]
              sm:text-2xl
            "
          >
            계약 기본정보
          </h3>

          <span
            className="
              hidden
              text-[11px]
              tracking-[0.25em]
              text-[#69809e]
              sm:block
              sm:text-xs
            "
          >
            CONTRACT INFORMATION
          </span>

        </div>

        <div className="border-t-[2px] border-[#18283f]">

          <div className="grid grid-cols-1 sm:grid-cols-2">

            {/* 갑 */}

            <div
              className="
                border-b
                border-[#ccd6e2]
                px-4
                py-5
                sm:border-r
                sm:px-5
                sm:py-7
              "
            >

              <p className="text-xs text-[#66809f] sm:text-sm">
                계약기관(갑)
              </p>

              <p
                className="
                  mt-3
                  break-words
                  text-sm
                  font-bold
                  text-[#101827]
                  sm:mt-4
                  sm:text-lg
                "
              >
                {company || "-"}
              </p>

              {companyBusinessNumber && (
                <p
                  className="
                    mt-2
                    break-words
                    text-[11px]
                    text-[#718096]
                    sm:text-xs
                  "
                >
                  사업자등록번호&nbsp;
                  {companyBusinessNumber}
                </p>
              )}

            </div>

            {/* 을 */}

            <div
              className="
                border-b
                border-[#ccd6e2]
                px-4
                py-5
                sm:px-5
                sm:py-7
              "
            >

              <p className="text-xs text-[#66809f] sm:text-sm">
                계약상대자(을)
              </p>

              <p
                className="
                  mt-3
                  break-words
                  text-sm
                  font-bold
                  text-[#101827]
                  sm:mt-4
                  sm:text-lg
                "
              >
                {contractor || "-"}
              </p>

              {contractorBusinessNumber && (
                <p
                  className="
                    mt-2
                    break-words
                    text-[11px]
                    text-[#718096]
                    sm:text-xs
                  "
                >
                  사업자등록번호&nbsp;
                  {contractorBusinessNumber}
                </p>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          CONTRACT TERMS
      ================================================== */}

      <section
        className="
          px-5
          pt-10
          sm:px-12
          sm:pt-14
        "
      >

        <div
          className="
            mb-4
            flex
            items-end
            justify-between
            gap-3
          "
        >

          <h3
            className="
              text-lg
              font-bold
              text-[#101827]
              sm:text-2xl
            "
          >
            계약 조건
          </h3>

          <span
            className="
              hidden
              text-[11px]
              tracking-[0.25em]
              text-[#69809e]
              sm:block
              sm:text-xs
            "
          >
            CONTRACT TERMS
          </span>

        </div>

        <div
          className="
            relative
            overflow-hidden
            border-t-[2px]
            border-[#18283f]
            bg-[#f8fafc]
          "
        >

          {/* ==================================================
              워터마크
              모바일 280px
              PC 430px
              25사단 로고 유지
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              flex
              items-center
              justify-center
              overflow-hidden
            "
          >

            <img
              src="/25-logo.webp"
              alt=""
              aria-hidden="true"
              className="
                h-[280px]
                w-[280px]
                max-w-none
                shrink-0
                object-contain
                opacity-[0.03]
                sm:h-[430px]
                sm:w-[430px]
              "
            />

          </div>

          {/* 계약조건 본문 */}

          <div
            className="
              relative
              px-4
              py-7
              sm:px-8
              sm:py-10
            "
          >

            <div
              className="
                whitespace-pre-wrap
                break-words
                text-[13px]
                leading-7
                text-[#334155]
                sm:text-[15px]
                sm:leading-8
              "
            >
              {formattedContractText}
            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          CONTRACT DETAILS
      ================================================== */}

      <section
        className="
          px-5
          pb-9
          pt-10
          sm:px-12
          sm:pb-12
          sm:pt-14
        "
      >

        <div
          className="
            mb-4
            flex
            items-end
            justify-between
            gap-3
          "
        >

          <h3
            className="
              text-lg
              font-bold
              text-[#101827]
              sm:text-2xl
            "
          >
            계약 내용
          </h3>

          <span
            className="
              hidden
              text-[11px]
              tracking-[0.25em]
              text-[#69809e]
              sm:block
              sm:text-xs
            "
          >
            CONTRACT DETAILS
          </span>

        </div>

        {/* ==================================================
            품목 테이블
        ================================================== */}

        <div
          className="
            overflow-hidden
            border-t-[2px]
            border-[#18283f]
          "
        >

          {/* ==================================================
              PC
          ================================================== */}

          <div className="hidden sm:block">

            <div
              className="
                grid
                grid-cols-[minmax(0,1fr)_130px_150px_170px]
                bg-[#f5f7fa]
                text-sm
                font-bold
                text-[#334155]
              "
            >

              <div className="border-b border-[#ccd6e2] px-5 py-4">
                품목
              </div>

              <div
                className="
                  border-b
                  border-l
                  border-[#ccd6e2]
                  px-5
                  py-4
                  text-center
                "
              >
                수량
              </div>

              <div
                className="
                  border-b
                  border-l
                  border-[#ccd6e2]
                  px-5
                  py-4
                  text-right
                "
              >
                단가
              </div>

              <div
                className="
                  border-b
                  border-l
                  border-[#ccd6e2]
                  px-5
                  py-4
                  text-right
                "
              >
                금액
              </div>

            </div>

            {displayItems.map((item, index) => {

              const itemTotal =
                Number(item.quantity || 0) *
                Number(item.unitPrice || 0);

              return (
                <div
                  key={item.id ?? index}
                  className="
                    grid
                    grid-cols-[minmax(0,1fr)_130px_150px_170px]
                    border-b
                    border-[#ccd6e2]
                  "
                >

                  <div className="min-w-0 px-5 py-5">

                    <p
                      className="
                        break-words
                        font-bold
                        text-[#18283f]
                      "
                    >
                      {item.productName || "-"}
                    </p>

                    {item.productSpec && (
                      <p
                        className="
                          mt-2
                          whitespace-pre-wrap
                          break-words
                          text-xs
                          leading-6
                          text-[#718096]
                        "
                      >
                        {item.productSpec}
                      </p>
                    )}

                  </div>

                  <div
                    className="
                      border-l
                      border-[#ccd6e2]
                      px-5
                      py-5
                      text-center
                      text-[#334155]
                    "
                  >
                    {Number(
                      item.quantity || 0
                    ).toLocaleString("ko-KR")}
                  </div>

                  <div
                    className="
                      border-l
                      border-[#ccd6e2]
                      px-5
                      py-5
                      text-right
                      text-[#334155]
                    "
                  >
                    {formatMoney(item.unitPrice)}
                  </div>

                  <div
                    className="
                      border-l
                      border-[#ccd6e2]
                      px-5
                      py-5
                      text-right
                      font-semibold
                      text-[#18283f]
                    "
                  >
                    {formatMoney(itemTotal)}
                  </div>

                </div>
              );
            })}

          </div>

          {/* ==================================================
              모바일
          ================================================== */}

          <div className="sm:hidden">

            {displayItems.map((item, index) => {

              const itemTotal =
                Number(item.quantity || 0) *
                Number(item.unitPrice || 0);

              return (
                <div
                  key={item.id ?? index}
                  className="
                    border-b
                    border-[#ccd6e2]
                  "
                >

                  <div
                    className="
                      bg-[#f5f7fa]
                      px-4
                      py-3
                    "
                  >

                    <span
                      className="
                        text-xs
                        font-bold
                        tracking-wide
                        text-[#526b8b]
                      "
                    >
                      품목 {index + 1}
                    </span>

                  </div>

                  <div
                    className="
                      space-y-4
                      px-4
                      py-5
                    "
                  >

                    {/* 제품명 */}

                    <div>

                      <p className="text-xs text-[#718096]">
                        제품명
                      </p>

                      <p
                        className="
                          mt-1
                          break-words
                          font-bold
                          text-[#18283f]
                        "
                      >
                        {item.productName || "-"}
                      </p>

                    </div>

                    {/* 제품 상세 설명 */}

                    {item.productSpec && (
                      <div>

                        <p className="text-xs text-[#718096]">
                          제품 상세 설명
                        </p>

                        <p
                          className="
                            mt-1
                            whitespace-pre-wrap
                            break-words
                            text-sm
                            leading-6
                            text-[#334155]
                          "
                        >
                          {item.productSpec}
                        </p>

                      </div>
                    )}

                    {/* 수량 / 단가 */}

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-3
                      "
                    >

                      <div
                        className="
                          min-w-0
                          rounded-lg
                          bg-[#f8fafc]
                          px-3
                          py-3
                        "
                      >

                        <p className="text-xs text-[#718096]">
                          수량
                        </p>

                        <p
                          className="
                            mt-1
                            break-words
                            font-semibold
                            text-[#18283f]
                          "
                        >
                          {Number(
                            item.quantity || 0
                          ).toLocaleString("ko-KR")}
                        </p>

                      </div>

                      <div
                        className="
                          min-w-0
                          rounded-lg
                          bg-[#f8fafc]
                          px-3
                          py-3
                        "
                      >

                        <p className="text-xs text-[#718096]">
                          단가
                        </p>

                        <p
                          className="
                            mt-1
                            break-words
                            text-sm
                            font-semibold
                            text-[#18283f]
                          "
                        >
                          {formatMoney(item.unitPrice)}
                        </p>

                      </div>

                    </div>

                    {/* 품목 금액 */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        border-t
                        border-[#e2e8f0]
                        pt-4
                      "
                    >

                      <span className="shrink-0 text-xs text-[#718096]">
                        품목 금액
                      </span>

                      <span
                        className="
                          break-words
                          text-right
                          font-bold
                          text-[#18283f]
                        "
                      >
                        {formatMoney(itemTotal)}
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* ==================================================
            총 계약금액
        ================================================== */}

        <div
          className="
            mt-5
            flex
            flex-col
            items-start
            justify-between
            gap-2
            border-t-[2px]
            border-[#18283f]
            bg-[#f5f7fa]
            px-4
            py-5
            sm:flex-row
            sm:items-center
            sm:gap-4
            sm:px-6
          "
        >

          <div>

            <p className="text-sm font-semibold text-[#526b8b]">
              총 계약 금액
            </p>

            <p className="mt-1 text-xs text-[#94a3b8]">
              전체 계약품목 금액 합계
            </p>

          </div>

          <p
            className="
              break-words
              text-xl
              font-black
              text-[#101827]
              sm:text-2xl
            "
          >
            {formatMoney(finalTotal)}
          </p>

        </div>

        {/* ==================================================
            납품 정보
        ================================================== */}

        <div
          className="
            mt-7
            overflow-hidden
            border
            border-[#ccd6e2]
            sm:mt-8
          "
        >

          <div
            className="
              grid
              grid-cols-[88px_minmax(0,1fr)]
              border-b
              border-[#ccd6e2]
              sm:grid-cols-[110px_1fr]
            "
          >

            <div
              className="
                bg-[#f5f7fa]
                px-3
                py-4
                text-xs
                font-bold
                text-[#334155]
                sm:px-4
                sm:text-sm
              "
            >
              납품 일자
            </div>

            <div
              className="
                min-w-0
                break-words
                px-3
                py-4
                text-xs
                text-[#334155]
                sm:px-4
                sm:text-sm
              "
            >
              {formatDate(deliveryDate)}
            </div>

          </div>

          <div
            className="
              grid
              grid-cols-[88px_minmax(0,1fr)]
              sm:grid-cols-[110px_1fr]
            "
          >

            <div
              className="
                bg-[#f5f7fa]
                px-3
                py-4
                text-xs
                font-bold
                text-[#334155]
                sm:px-4
                sm:text-sm
              "
            >
              납품 장소
            </div>

            <div
              className="
                min-w-0
                break-words
                px-3
                py-4
                text-xs
                text-[#334155]
                sm:px-4
                sm:text-sm
              "
            >
              {deliveryAddress || "-"}
            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          SIGNATURE
      ================================================== */}

      <section
        className="
          border-t
          border-[#e2e8f0]
          px-5
          pb-10
          pt-9
          sm:px-12
          sm:pb-12
          sm:pt-10
        "
      >

        <div className="mb-5">

          <h3
            className="
              text-lg
              font-bold
              text-[#101827]
              sm:text-xl
            "
          >
            전자서명
          </h3>

          <p
            className="
              mt-2
              break-keep
              text-xs
              leading-6
              text-[#718096]
              sm:text-sm
            "
          >
            계약내용과 계약조건을 확인한 후 전자서명을 진행해주세요.
          </p>

        </div>

        <div
          className="
            rounded-2xl
            border
            border-[#dbe2ea]
            bg-[#f8fafc]
            p-4
            sm:p-7
          "
        >

          {signature ? (
            <div>

              <p
                className="
                  mb-3
                  text-sm
                  font-semibold
                  text-[#526b8b]
                "
              >
                계약상대자 전자서명
              </p>

              <div
                className="
                  flex
                  min-h-[130px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#dbe2ea]
                  bg-white
                  p-4
                  sm:min-h-[150px]
                  sm:p-5
                "
              >

                <img
                  src={signature}
                  alt="전자서명"
                  className="
                    max-h-[110px]
                    max-w-full
                    object-contain
                    sm:max-h-[120px]
                  "
                />

              </div>

            </div>
          ) : (
            <div
              className="
                flex
                min-h-[120px]
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-[#cbd5e1]
                bg-white
                px-4
                text-center
                text-xs
                leading-5
                text-[#94a3b8]
                sm:min-h-[130px]
                sm:text-sm
              "
            >
              아직 전자서명이 등록되지 않았습니다.
            </div>
          )}

        </div>

      </section>

      {/* ==================================================
          CONFIRMATION
      ================================================== */}

      {!completed && (
        <section
          className="
            px-5
            pb-10
            sm:px-12
            sm:pb-12
          "
        >

          <div
            className="
              space-y-4
              rounded-2xl
              border
              border-[#dbe2ea]
              bg-white
              p-4
              sm:space-y-3
              sm:p-7
            "
          >

            <label
              className="
                flex
                cursor-pointer
                items-start
                gap-3
              "
            >

              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) =>
                  onAgreementChange(
                    e.target.checked
                  )
                }
                className="
                  mt-1
                  h-5
                  w-5
                  shrink-0
                  cursor-pointer
                  accent-[#18283f]
                "
              />

              <span
                className="
                  break-keep
                  text-xs
                  leading-6
                  text-[#334155]
                  sm:text-sm
                "
              >
                본 계약서의 계약내용을 확인하였으며, 기재된 품목·수량·금액·납품조건을 확인하였습니다.
              </span>

            </label>

            <label
              className="
                flex
                cursor-pointer
                items-start
                gap-3
              "
            >

              <input
                type="checkbox"
                checked={specialChecked}
                onChange={(e) =>
                  onSpecialChange(
                    e.target.checked
                  )
                }
                className="
                  mt-1
                  h-5
                  w-5
                  shrink-0
                  cursor-pointer
                  accent-[#18283f]
                "
              />

              <span
                className="
                  break-keep
                  text-xs
                  leading-6
                  text-[#334155]
                  sm:text-sm
                "
              >
                계약조건 및 특약사항을 모두 확인하였으며 이에 동의합니다.
              </span>

            </label>

          </div>

          {/* 버튼 */}

          <div
            className="
              mt-5
              flex
              flex-col
              gap-3
              sm:flex-row
            "
          >

            <button
              type="button"
              onClick={onSign}
              className="
                min-h-[54px]
                flex-1
                rounded-xl
                border
                border-[#18283f]
                bg-white
                px-5
                py-4
                text-sm
                font-bold
                text-[#18283f]
                transition
                hover:bg-[#f5f7fa]
                sm:text-base
              "
            >
              {signature
                ? "전자서명 다시하기"
                : "전자서명하기"}
            </button>

            <button
              type="button"
              onClick={onComplete}
              className="
                min-h-[54px]
                flex-1
                rounded-xl
                bg-[#18283f]
                px-5
                py-4
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#263a57]
                sm:text-base
              "
            >
              전자계약 완료
            </button>

          </div>

        </section>
      )}

      {/* ==================================================
          COMPLETED
      ================================================== */}

      {completed && (
        <section
          className="
            border-t
            border-[#e2e8f0]
            px-5
            py-9
            text-center
            sm:px-12
            sm:py-10
          "
        >

          <div
            className="
              mx-auto
              max-w-xl
              rounded-2xl
              border
              border-[#cbd5e1]
              bg-[#f8fafc]
              px-5
              py-7
            "
          >

            <p
              className="
                text-base
                font-bold
                text-[#18283f]
                sm:text-lg
              "
            >
              전자계약이 완료되었습니다.
            </p>

            <p
              className="
                mt-2
                break-keep
                text-xs
                leading-6
                text-[#64748b]
                sm:text-sm
              "
            >
              본 계약서는 전자서명이 완료된 계약문서입니다.
            </p>

          </div>

        </section>
      )}

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer
        className="
          border-t
          border-[#e2e8f0]
          px-5
          py-6
          text-center
          sm:px-12
          sm:py-7
        "
      >

        <p
          className="
            text-[9px]
            tracking-[0.2em]
            text-[#94a3b8]
            sm:text-[10px]
            sm:tracking-[0.25em]
          "
        >
          OFFICIAL ELECTRONIC DOCUMENT
        </p>

        <p
          className="
            mt-2
            text-[10px]
            text-[#94a3b8]
            sm:text-xs
          "
        >
          제25보병사단 전자계약 시스템
        </p>

      </footer>

    </div>
  );
}