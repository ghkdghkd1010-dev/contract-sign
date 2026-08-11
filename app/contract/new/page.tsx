"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewContractPage() {
  const router = useRouter();

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

  const totalAmount =
    Number(quantity || 0) * Number(unitPrice || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company || !contractor || !productName) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const contractText = `
물품공급계약서

1. 계약 요청자
기관/회사명: ${company}
사업자등록번호: ${companyBusinessNumber}

2. 계약 상대방
업체명: ${contractor}
사업자등록번호: ${contractorBusinessNumber || "-"}

3. 물품 정보
품목명: ${productName}
품목 상세정보: ${productSpec}
수량: ${quantity}
단가: ${unitPrice}원
총 계약금액: ${totalAmount.toLocaleString()}원

4. 납품 정보
납품일자: ${deliveryDate}
납품장소: ${deliveryAddress}

위 계약 내용을 확인하고 양 당사자는 본 계약에 동의합니다.
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
          quantity,
          unitPrice,
          deliveryDate,
          deliveryAddress,
          contract_text: contractText,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "계약 생성에 실패했습니다.");
      }

      if (!data.id) {
        throw new Error("계약 ID를 받지 못했습니다.");
      }

      alert(
        `전자계약서가 생성되었습니다.\n\n상대방에게 보낼 링크:\nhttps://electronic-contract.co.kr/contract/${data.id}`
      );

      router.push(`/contract/${data.id}`);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "계약 생성 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] py-10 px-4">
      <div className="mx-auto max-w-[1000px] rounded-3xl bg-white px-10 py-12 shadow-sm">
        <div className="mb-12">
          <p className="mb-3 text-sm tracking-[0.3em] text-[#526b8b]">
            ELECTRONIC CONTRACT
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[#101827]">
            물품공급 계약서 생성
          </h1>

          <p className="mt-3 text-base text-[#718096]">
            계약 정보를 입력하면 전자계약서가 생성됩니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* 계약 요청자 */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#101827]" />
              <h2 className="text-2xl font-bold text-[#101827]">
                계약 요청자
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="기관/회사명"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
              />

              <input
                type="text"
                placeholder="사업자등록번호"
                value={companyBusinessNumber}
                onChange={(e) =>
                  setCompanyBusinessNumber(e.target.value)
                }
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
              />
            </div>
          </section>

          {/* 계약 상대방 */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#101827]" />
              <h2 className="text-2xl font-bold text-[#101827]">
                계약 상대방
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="업체명"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
              />

              <input
                type="text"
                placeholder="사업자등록번호 (선택)"
                value={contractorBusinessNumber}
                onChange={(e) =>
                  setContractorBusinessNumber(e.target.value)
                }
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
              />
            </div>
          </section>

          {/* 물품 정보 */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#101827]" />
              <h2 className="text-2xl font-bold text-[#101827]">
                물품 정보
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="품목명"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
              />

              <textarea
                placeholder="품목 상세정보"
                value={productSpec}
                onChange={(e) => setProductSpec(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="number"
                  placeholder="수량"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
                />

                <input
                  type="number"
                  placeholder="단가"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
                />
              </div>

              {totalAmount > 0 && (
                <div className="rounded-xl bg-[#f4f6f8] px-5 py-5">
                  <p className="text-sm text-[#718096]">
                    총 계약금액
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#101827]">
                    {totalAmount.toLocaleString()}원
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 납품 정보 */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-9 w-1 bg-[#101827]" />
              <h2 className="text-2xl font-bold text-[#101827]">
                납품 정보
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
              />

              <input
                type="text"
                placeholder="납품장소"
                value={deliveryAddress}
                onChange={(e) =>
                  setDeliveryAddress(e.target.value)
                }
                className="w-full rounded-xl border border-[#cfd6df] px-5 py-4 text-lg outline-none transition focus:border-[#1d5eff]"
              />
            </div>
          </section>

          {/* 생성 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2161ff] py-5 text-2xl font-bold text-white transition hover:bg-[#164ed8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "계약서 생성 중..." : "계약 생성"}
          </button>
        </form>
      </div>
    </main>
  );
}