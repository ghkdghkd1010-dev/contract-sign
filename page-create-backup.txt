"use client";

import { useState } from "react";

export default function NewContractPage() {
  const [company, setCompany] = useState("");
  const [companyBusinessNumber, setCompanyBusinessNumber] = useState("");

  const [contractor, setContractor] = useState("");
  const [contractorBusinessNumber, setContractorBusinessNumber] =
    useState("");

  const [productName, setProductName] = useState("");
  const [productSpec, setProductSpec] = useState("");

  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const totalAmount =
    Number(quantity || 0) * Number(unitPrice || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company || !contractor || !productName) {
      alert("계약기관, 계약상대자, 제품명은 필수 입력사항입니다.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("수량을 입력해주세요.");
      return;
    }

    if (!unitPrice || Number(unitPrice) < 0) {
      alert("단가를 입력해주세요.");
      return;
    }

    if (!deliveryDate) {
      alert("납품일자를 입력해주세요.");
      return;
    }

    if (!deliveryAddress) {
      alert("납품장소를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const contractText = `
물품 납품 계약서

제1조 (목적)
본 계약은 계약기관(이하 "갑"이라 한다)이 계약상대자(이하 "을"이라 한다)에게 본 계약서에 명시된 물품의 납품을 요청하고, 을이 해당 물품을 납품함에 있어 필요한 사항을 정함을 목적으로 한다.

제2조 (계약 당사자)
① 갑은 본 계약서에 기재된 계약기관을 말한다.
② 을은 본 계약서에 기재된 계약상대자를 말한다.
③ 갑과 을은 본 계약의 내용을 확인하고 이에 따른 계약상 의무를 성실히 이행하여야 한다.

제3조 (계약물품)
① 을은 갑이 요청한 다음의 물품을 계약조건에 따라 납품하여야 한다.
② 계약물품의 품목명, 상세설명, 수량, 단가 및 계약금액은 본 계약서의 계약내용에 따른다.
③ 을은 계약서에 기재된 물품과 동일한 품질 및 조건의 물품을 납품하여야 한다.

제4조 (계약금액)
① 총 계약금액은 ${totalAmount.toLocaleString("ko-KR")}원으로 한다.
② 계약금액에는 본 계약물품의 납품에 필요한 제반 비용을 포함하는 것으로 한다.
③ 별도의 합의가 없는 한 계약금액은 본 계약서에 기재된 금액을 기준으로 한다.

제5조 (납품)
① 을은 계약서에 기재된 납품일자까지 계약물품을 지정된 납품장소에 납품하여야 한다.
② 을은 납품 과정에서 물품의 훼손 또는 분실이 발생하지 않도록 필요한 조치를 하여야 한다.
③ 납품일자 또는 납품장소를 변경할 필요가 있는 경우에는 갑과 사전에 협의하여야 한다.

제6조 (검수)
① 갑은 을이 납품한 물품에 대하여 계약내용 및 물품의 상태 등을 확인할 수 있다.
② 납품물품이 계약내용과 다르거나 품질상 문제가 있는 경우 갑은 을에게 해당 물품의 교환 또는 보완을 요구할 수 있다.
③ 을은 갑의 검수 결과에 따라 필요한 조치를 성실히 이행하여야 한다.

제7조 (대금 지급)
① 갑은 납품물품에 대한 검수가 완료된 후 계약금액을 지급하는 것을 원칙으로 한다.
② 대금 지급에 필요한 절차 및 서류가 있는 경우 을은 이에 협조하여야 한다.

제8조 (계약내용의 변경)
① 계약 당사자는 상호 협의에 따라 계약내용의 일부를 변경할 수 있다.
② 계약내용을 변경하는 경우 변경된 내용은 별도의 합의 또는 전자문서 등을 통해 확인할 수 있다.
③ 계약 체결 후 일방적인 계약내용 변경은 원칙적으로 허용하지 않는다.

제9조 (계약상 의무)
① 갑과 을은 본 계약의 내용을 성실히 이행하여야 한다.
② 을은 계약물품의 납품과 관련하여 허위 또는 부정한 방법을 사용하여서는 아니 된다.
③ 을은 납품과 관련하여 갑에게 제출하는 자료 및 정보가 사실과 다르지 않도록 하여야 한다.

제10조 (특약사항)
① 본 계약서에 별도로 명시된 내용이 있는 경우 해당 내용은 본 계약의 조건으로 적용한다.
② 본 계약서에 명시되지 않은 사항은 갑과 을의 상호 협의에 따른다.
③ 계약 당사자는 본 계약의 내용을 충분히 확인한 후 전자서명을 진행하여야 한다.

제11조 (계약의 성립)
① 본 계약은 계약상대자인 을이 계약내용 및 계약조건을 확인하고 전자서명을 완료함으로써 체결된다.
② 을은 전자서명 전에 계약물품, 수량, 계약금액, 납품조건 및 계약조건을 충분히 확인하여야 한다.
③ 전자서명이 완료된 계약내용은 계약 당사자가 확인할 수 있는 전자문서로 관리한다.

[계약 물품]

품목명: ${productName}

제품 상세설명:
${productSpec || "-"}

수량: ${quantity}개

단가: ${Number(unitPrice).toLocaleString("ko-KR")}원

총 계약금액: ${totalAmount.toLocaleString("ko-KR")}원

납품일자: ${deliveryDate}

납품장소: ${deliveryAddress}
      `.trim();

      const response = await fetch("/api/contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          companyBusinessNumber,

          contractor,
          contractorBusinessNumber,

          productName,
          productSpec,

          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
          totalPrice: totalAmount,

          deliveryDate,
          deliveryAddress,

          contract_text: contractText,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "계약 생성에 실패했습니다."
        );
      }

      if (!data.public_token) {
        throw new Error("계약 토큰을 받지 못했습니다.");
      }

      const contractUrl =
        `${window.location.origin}/contract/${data.public_token}`;

      alert(
        `전자계약서가 생성되었습니다.\n\n계약서 링크:\n${contractUrl}`
      );

      window.location.href =
        `/contract/${data.public_token}`;
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "계약 생성 중 오류가 발생했습니다."
      );

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1000px] rounded-3xl bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-12">

        {/* 제목 */}
        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-[#526b8b]">
            ELECTRONIC CONTRACT SYSTEM
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#101827] sm:text-4xl">
            물품 납품 계약서 생성
          </h1>

          <p className="mt-3 text-sm text-[#718096] sm:text-base">
            계약 정보를 입력하여 계약상대자에게 전달할 전자계약서를 생성합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* =====================================================
              계약기관
          ===================================================== */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#18283f]" />

              <h2 className="text-xl font-bold text-[#101827] sm:text-2xl">
                계약기관(갑)
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="기관명"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
              />

              <input
                type="text"
                placeholder="사업자등록번호"
                value={companyBusinessNumber}
                onChange={(e) =>
                  setCompanyBusinessNumber(e.target.value)
                }
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
              />
            </div>
          </section>

          {/* =====================================================
              계약상대자
          ===================================================== */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#18283f]" />

              <h2 className="text-xl font-bold text-[#101827] sm:text-2xl">
                계약상대자(을)
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="업체명"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
              />

              <input
                type="text"
                placeholder="사업자등록번호"
                value={contractorBusinessNumber}
                onChange={(e) =>
                  setContractorBusinessNumber(e.target.value)
                }
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
              />
            </div>
          </section>

          {/* =====================================================
              물품 정보
          ===================================================== */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#18283f]" />

              <h2 className="text-xl font-bold text-[#101827] sm:text-2xl">
                계약 물품
              </h2>
            </div>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="제품명"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
              />

              <textarea
                placeholder={`제품 상세설명을 입력하세요.

예:
- 상판 재질 및 크기
- 프레임 재질
- 색상
- 제조사
- 모델명
- 기타 납품 조건`}
                value={productSpec}
                onChange={(e) => setProductSpec(e.target.value)}
                rows={7}
                className="w-full resize-none rounded-xl border border-[#cfd6df] px-5 py-4 text-base leading-7 outline-none transition focus:border-[#18283f]"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#475569]">
                    수량
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="수량"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(e.target.value)
                    }
                    className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#475569]">
                    단가
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="단가"
                    value={unitPrice}
                    onChange={(e) =>
                      setUnitPrice(e.target.value)
                    }
                    className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
                  />
                </div>

              </div>

              {/* 총 계약금액 */}
              <div className="rounded-xl border border-[#dbe2ea] bg-[#f7f9fb] px-5 py-5">
                <p className="text-sm text-[#718096]">
                  총 계약금액
                </p>

                <p className="mt-1 text-2xl font-bold text-[#18283f]">
                  {totalAmount.toLocaleString("ko-KR")}원
                </p>

                <p className="mt-1 text-xs text-[#94a3b8]">
                  수량 × 단가
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              납품 정보
          ===================================================== */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#18283f]" />

              <h2 className="text-xl font-bold text-[#101827] sm:text-2xl">
                납품 정보
              </h2>
            </div>

            <div className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#475569]">
                  납품일자
                </label>

                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) =>
                    setDeliveryDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#475569]">
                  납품장소
                </label>

                <input
                  type="text"
                  placeholder="납품장소"
                  value={deliveryAddress}
                  onChange={(e) =>
                    setDeliveryAddress(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-base outline-none transition focus:border-[#18283f]"
                />
              </div>

            </div>
          </section>

          {/* =====================================================
              계약조건 안내
          ===================================================== */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#18283f]" />

              <h2 className="text-xl font-bold text-[#101827] sm:text-2xl">
                계약조건
              </h2>
            </div>

            <div className="rounded-2xl border border-[#dbe2ea] bg-[#f8fafc] p-5 sm:p-7">

              <div className="space-y-4 text-sm leading-7 text-[#475569]">

                <div>
                  <strong className="text-[#18283f]">
                    제1조 (목적)
                  </strong>
                  <p>
                    계약기관과 계약상대자 간 물품 납품 및 계약 이행에 필요한 사항을 정합니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제2조 (계약물품)
                  </strong>
                  <p>
                    계약상대자는 계약서에 기재된 물품 및 상세조건에 따라 물품을 납품하여야 합니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제3조 (납품)
                  </strong>
                  <p>
                    계약상대자는 지정된 납품일자 및 납품장소에 계약물품을 납품하여야 합니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제4조 (검수)
                  </strong>
                  <p>
                    계약기관은 납품된 물품의 수량, 상태 및 계약조건의 충족 여부를 확인할 수 있습니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제5조 (대금 지급)
                  </strong>
                  <p>
                    계약금액은 납품 및 검수가 완료된 후 지급하는 것을 원칙으로 합니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제6조 (계약내용 변경)
                  </strong>
                  <p>
                    계약내용을 변경할 필요가 있는 경우 계약 당사자의 상호 협의에 따라 변경할 수 있습니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제7조 (계약상 의무)
                  </strong>
                  <p>
                    계약 당사자는 본 계약의 내용을 성실히 이행하여야 합니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제8조 (특약사항)
                  </strong>
                  <p>
                    본 계약서에 별도로 기재된 사항이 있는 경우 해당 내용은 계약조건의 일부로 적용됩니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제9조 (계약의 성립)
                  </strong>
                  <p>
                    계약상대자가 계약내용 및 계약조건을 확인하고 전자서명을 완료함으로써 계약이 체결됩니다.
                  </p>
                </div>

                <div>
                  <strong className="text-[#18283f]">
                    제10조 (기타)
                  </strong>
                  <p>
                    본 계약서에 정하지 않은 사항은 계약 당사자의 상호 협의에 따릅니다.
                  </p>
                </div>

              </div>

              <div className="mt-6 border-t border-[#dbe2ea] pt-5">
                <p className="text-xs leading-6 text-[#64748b]">
                  ※ 실제 계약서에는 위 계약조건과 함께 입력된 계약물품,
                  수량, 계약금액, 납품조건 등의 내용이 포함됩니다.
                </p>
              </div>

            </div>
          </section>

          {/* =====================================================
              생성 버튼
          ===================================================== */}
          <div className="border-t border-[#e2e8f0] pt-8">

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#18283f] py-5 text-lg font-bold text-white transition hover:bg-[#263a57] disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
            >
              {loading
                ? "전자계약서 생성 중..."
                : "전자계약서 생성"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#94a3b8]">
              생성된 계약서는 계약상대자에게 전달하여 내용을 확인한 후
              전자서명을 받을 수 있습니다.
            </p>

          </div>

        </form>
      </div>
    </main>
  );
}