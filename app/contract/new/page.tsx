"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewContractPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    company: "",
    companyBusinessNumber: "",
    contractor: "",
    contractorBusinessNumber: "",
    productName: "",
    productSpec: "",
    quantity: "",
    unitPrice: "",
    deliveryDate: "",
    deliveryAddress: "",
  });

  const [loading, setLoading] = useState(false);

  const totalPrice =
    Number(form.quantity || 0) * Number(form.unitPrice || 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    if (
      !form.company ||
      !form.contractor ||
      !form.productName ||
      !form.quantity ||
      !form.unitPrice ||
      !form.deliveryDate ||
      !form.deliveryAddress
    ) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 1. 활성화된 계약서 템플릿 가져오기
      const { data: template, error: templateError } =
        await supabase
          .from("contract_template")
          .select("*")
          .eq("contract_type", "goods")
          .eq("is_active", true)
          .order("version", { ascending: false })
          .limit(1)
          .single();

      if (templateError || !template) {
        throw new Error(
          "계약서 템플릿을 불러오지 못했습니다."
        );
      }

      // 2. 계약서 공개용 랜덤 토큰 생성
      const publicToken = crypto.randomUUID();

      // 3. 템플릿 내용 가져오기
      let contractText = template.content;

      const replacements: Record<string, string> = {
        "{{company}}": form.company,

        "{{company_business_number}}":
          form.companyBusinessNumber || "-",

        "{{contractor}}": form.contractor,

        "{{contractor_business_number}}":
          form.contractorBusinessNumber || "-",

        "{{product_name}}": form.productName,

        "{{product_spec}}":
          form.productSpec || "-",

        "{{quantity}}":
          Number(form.quantity).toLocaleString(),

        "{{unit_price}}":
          Number(form.unitPrice).toLocaleString(),

        "{{total_price}}":
          totalPrice.toLocaleString(),

        "{{delivery_date}}":
          form.deliveryDate,

        "{{delivery_address}}":
          form.deliveryAddress,
      };

      Object.entries(replacements).forEach(
        ([key, value]) => {
          contractText = contractText.replaceAll(
            key,
            value
          );
        }
      );

      // 4. 계약서 DB 저장
      const { data: contract, error: contractError } =
        await supabase
          .from("contract")
          .insert({
            template_id: template.id,

            // 계약 당사자
            company: form.company,

            company_business_number:
              form.companyBusinessNumber || null,

            contractor: form.contractor,

            contractor_business_number:
              form.contractorBusinessNumber || null,

            // 물품
            product_name: form.productName,

            product_spec:
              form.productSpec || null,

            quantity: Number(form.quantity),

            unit_price: Number(form.unitPrice),

            total_price: totalPrice,

            // 납품
            delivery_date: form.deliveryDate,

            delivery_address:
              form.deliveryAddress,

            // 계약서 내용
            contract_text: contractText,

            // 계약 상태
            status: "pending",

            // 공개 링크용 랜덤 토큰
            public_token: publicToken,
          })
          .select("id, public_token")
          .single();

      if (contractError || !contract) {
        console.error(contractError);

        throw new Error(
          "계약서 생성에 실패했습니다."
        );
      }

      // 5. 실제 계약서 링크 생성
      const contractUrl =
        `${window.location.origin}/contract/${contract.public_token}`;

      // 6. 링크 클립보드 복사
      try {
        await navigator.clipboard.writeText(
          contractUrl
        );
      } catch {
        // 클립보드 복사가 차단된 경우에도 계약 생성은 정상 처리
      }

      // 7. 상대방에게 보낼 링크 표시
      const goToContract = confirm(
        `전자계약서가 생성되었습니다.\n\n` +
        `상대방에게 보낼 링크:\n\n` +
        `${contractUrl}\n\n` +
        `링크가 클립보드에 복사되었습니다.\n\n` +
        `확인 → 생성된 계약서 보기\n` +
        `취소 → 현재 화면에 남기`
      );

      if (goToContract) {
        router.push(
          `/contract/${contract.public_token}`
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "계약서 생성 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f5f8] py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium tracking-[0.15em] text-gray-500">
            ELECTRONIC CONTRACT
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            물품공급 계약서 생성
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            계약 정보를 입력하면 전자계약서가 생성됩니다.
          </p>
        </div>

        <div className="space-y-8">

          {/* 계약 요청자 */}
          <section>
            <h2 className="mb-4 border-l-4 border-gray-900 pl-3 text-lg font-bold">
              계약 요청자
            </h2>

            <div className="space-y-3">
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="기관/회사명"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

              <input
                name="companyBusinessNumber"
                value={form.companyBusinessNumber}
                onChange={handleChange}
                placeholder="사업자등록번호"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>
          </section>

          {/* 계약 상대방 */}
          <section>
            <h2 className="mb-4 border-l-4 border-gray-900 pl-3 text-lg font-bold">
              계약 상대방
            </h2>

            <div className="space-y-3">
              <input
                name="contractor"
                value={form.contractor}
                onChange={handleChange}
                placeholder="업체명"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

              <input
                name="contractorBusinessNumber"
                value={form.contractorBusinessNumber}
                onChange={handleChange}
                placeholder="사업자등록번호 (선택)"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>
          </section>

          {/* 물품 정보 */}
          <section>
            <h2 className="mb-4 border-l-4 border-gray-900 pl-3 text-lg font-bold">
              물품 정보
            </h2>

            <div className="space-y-3">
              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="품목명"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

              <input
                name="productSpec"
                value={form.productSpec}
                onChange={handleChange}
                placeholder="품목 상세정보"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                placeholder="수량"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

              <input
                name="unitPrice"
                type="number"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="단가"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

              <div className="rounded-xl bg-gray-50 px-5 py-4">
                <span className="text-sm text-gray-500">
                  총 계약금액
                </span>

                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {totalPrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </section>

          {/* 납품 정보 */}
          <section>
            <h2 className="mb-4 border-l-4 border-gray-900 pl-3 text-lg font-bold">
              납품 정보
            </h2>

            <div className="space-y-3">
              <input
                name="deliveryDate"
                type="date"
                value={form.deliveryDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

              <input
                name="deliveryAddress"
                value={form.deliveryAddress}
                onChange={handleChange}
                placeholder="납품 장소"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>
          </section>

          {/* 생성 버튼 */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 py-4 text-base font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "계약서 생성 중..."
              : "전자계약서 생성"}
          </button>

        </div>
      </div>
    </main>
  );
}