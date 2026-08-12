"use client";

import { useState } from "react";

export default function HomePage() {
  const [company, setCompany] = useState("");
  const [companyBusinessNumber, setCompanyBusinessNumber] = useState("");

  const [contractor, setContractor] = useState("");
  const [contractorBusinessNumber, setContractorBusinessNumber] = useState("");

  const [productName, setProductName] = useState("");
  const [productSpec, setProductSpec] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const totalPrice =
    Number(quantity || 0) * Number(unitPrice || 0);

  const formatNumber = (value: number) => {
    return value.toLocaleString("ko-KR");
  };

  const createContract = async () => {
    if (!company || !contractor || !productName) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    setLoading(true);

    const contractText = `
물품공급 계약

계약기관
${company}

계약상대자
${contractor}

계약 대상
${productName}

품목 상세정보
${productSpec}

수량
${quantity}

단가
${formatNumber(Number(unitPrice || 0))}원

총 계약금액
${formatNumber(totalPrice)}원

납품일자
${deliveryDate}

납품장소
${deliveryAddress}
`.trim();

    try {
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
          quantity,
          unitPrice,
          deliveryDate,
          deliveryAddress,
          contract_text: contractText,
          status: "pending",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "계약문서 생성에 실패했습니다.");
        return;
      }

      if (!result.public_token) {
        alert("계약 토큰이 생성되지 않았습니다.");
        return;
      }

      const contractUrl =
        `${window.location.origin}/contract/${result.public_token}`;

      alert(`계약문서가 생성되었습니다.\n\n${contractUrl}`);

      window.location.href =
        `/contract/${result.public_token}`;
    } catch (error) {
      console.error("계약 생성 오류:", error);
      alert("계약문서 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f5f8] px-4 py-8 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-[1000px] overflow-hidden bg-white shadow-sm">

        <header className="border-b-[3px] border-[#18283f] px-8 py-6 sm:px-10">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[3px] border-[#18283f]">

                <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#18283f]">

                  <span className="text-[18px] font-bold text-[#18283f]">
                    37
                  </span>

                </div>

              </div>

              <div>

                <div className="text-[10px] tracking-[3px] text-[#64748b]">
                  REPUBLIC OF KOREA
                </div>

                <div className="mt-1 text-[19px] font-bold text-[#111827]">
                  제37보병사단
                </div>

              </div>

            </div>

            <div className="text-right">

              <div className="text-[12px] tracking-[1px] text-[#52657f]">
                ELECTRONIC CONTRACT
              </div>

              <div className="mt-1 text-[13px] text-[#64748b]">
                전자계약 시스템
              </div>

            </div>

          </div>

        </header>

        <section className="px-8 pb-8 pt-10 sm:px-12">

          <div className="text-center">

            <div className="text-[11px] font-semibold tracking-[5px] text-[#64748b]">
              OFFICIAL ELECTRONIC DOCUMENT
            </div>

            <h1 className="mt-4 text-[32px] font-bold tracking-[5px] text-[#111827]">
              계약문서 작성
            </h1>

            <div className="mx-auto mt-5 h-[3px] w-[55px] bg-[#18283f]" />

          </div>

        </section>

        <section className="px-8 pb-12 sm:px-12">

          <div className="mb-10">

            <div className="mb-3 flex items-end justify-between border-b-2 border-[#18283f] pb-3">

              <h2 className="text-[18px] font-bold text-[#111827]">
                계약기관
              </h2>

              <span className="text-[10px] tracking-[2px] text-[#94a3b8]">
                CONTRACTING AUTHORITY
              </span>

            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="기관 / 회사명"
                className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
              />

              <input
                value={companyBusinessNumber}
                onChange={(e) =>
                  setCompanyBusinessNumber(e.target.value)
                }
                placeholder="사업자등록번호"
                className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
              />

            </div>

          </div>

          <div className="mb-10">

            <div className="mb-3 flex items-end justify-between border-b-2 border-[#18283f] pb-3">

              <h2 className="text-[18px] font-bold text-[#111827]">
                계약상대자
              </h2>

              <span className="text-[10px] tracking-[2px] text-[#94a3b8]">
                CONTRACTOR
              </span>

            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <input
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                placeholder="업체명 / 상호명"
                className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
              />

              <input
                value={contractorBusinessNumber}
                onChange={(e) =>
                  setContractorBusinessNumber(e.target.value)
                }
                placeholder="사업자등록번호"
                className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
              />

            </div>

          </div>

          <div className="mb-10">

            <div className="mb-3 flex items-end justify-between border-b-2 border-[#18283f] pb-3">

              <h2 className="text-[18px] font-bold text-[#111827]">
                계약 대상
              </h2>

              <span className="text-[10px] tracking-[2px] text-[#94a3b8]">
                CONTRACT SUBJECT
              </span>

            </div>

            <div className="space-y-3">

              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="품목명"
                className="h-[54px] w-full border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
              />

              <div className="grid gap-3 sm:grid-cols-3">

                <input
                  value={productSpec}
                  onChange={(e) => setProductSpec(e.target.value)}
                  placeholder="품목 상세정보"
                  className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
                />

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="수량"
                  className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
                />

                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="단가"
                  className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
                />

              </div>

              <div className="mt-4 flex items-center justify-between border border-[#cbd5e1] bg-[#f8fafc] px-5 py-4">

                <span className="text-[13px] text-[#64748b]">
                  총 계약금액
                </span>

                <span className="text-[21px] font-bold text-[#18283f]">
                  {formatNumber(totalPrice)}원
                </span>

              </div>

            </div>

          </div>

          <div className="mb-10">

            <div className="mb-3 flex items-end justify-between border-b-2 border-[#18283f] pb-3">

              <h2 className="text-[18px] font-bold text-[#111827]">
                납품 정보
              </h2>

              <span className="text-[10px] tracking-[2px] text-[#94a3b8]">
                DELIVERY INFORMATION
              </span>

            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
              />

              <input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="납품 장소"
                className="h-[54px] border border-[#cbd5e1] px-4 text-[14px] outline-none transition focus:border-[#18283f]"
              />

            </div>

          </div>

          <button
            type="button"
            onClick={createContract}
            disabled={loading}
            className="w-full bg-[#18283f] py-4 text-[15px] font-semibold tracking-[1px] text-white transition hover:bg-[#263a57] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "문서 생성 중..." : "계약문서 생성"}
          </button>

        </section>

        <footer className="border-t border-[#cbd5e1] px-8 py-5 sm:px-12">

          <div className="flex flex-col gap-2 text-[10px] text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">

            <span>
              전자계약 시스템을 통해 작성되는 공식 전자문서입니다.
            </span>

            <span className="tracking-[2px]">
              ELECTRONIC DOCUMENT
            </span>

          </div>

        </footer>

      </div>

    </main>
  );
}