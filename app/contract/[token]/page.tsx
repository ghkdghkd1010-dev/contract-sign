"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import ContractView from "@/components/ContractView";
import SignatureModal from "@/components/SignatureModal";

type ContractData = {
  id: number;

  company: string;
  contractor: string;

  contract_text: string;

  signature: string | null;
  status: string;

  company_business?: string | null;
  contractor_business?: string | null;

  product_name?: string | null;
  product_spec?: string | null;

  quantity?: number | null;
  unit_price?: number | null;
  total_price?: number | null;

  delivery_date?: string | null;
  delivery_address?: string | null;
};

export default function ContractTokenPage() {
  const params = useParams();

  const token = params.token as string;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [contractor, setContractor] = useState("");

  const [companyBusinessNumber, setCompanyBusinessNumber] =
    useState("");

  const [contractorBusinessNumber, setContractorBusinessNumber] =
    useState("");

  const [contractText, setContractText] = useState("");

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [quantity, setQuantity] = useState<number | null>(null);
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [signature, setSignature] = useState("");
  const [completed, setCompleted] = useState(false);

  // 계약내용 확인
  const [agreementChecked, setAgreementChecked] = useState(false);

  // 계약조건 및 특약사항 확인
  const [specialChecked, setSpecialChecked] = useState(false);

  useEffect(() => {
    if (!token) return;

    loadContract();
  }, [token]);

  const loadContract = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/contract/${token}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "계약서를 불러오지 못했습니다."
        );
      }

      const data: ContractData = result;

      setCompany(data.company || "");
      setContractor(data.contractor || "");

      setCompanyBusinessNumber(
        data.company_business || ""
      );

      setContractorBusinessNumber(
        data.contractor_business || ""
      );

      setContractText(data.contract_text || "");

      setProductName(data.product_name || "");

      // DB의 product_spec을
      // 화면에서는 "제품 상세설명"으로 표시
      setProductDescription(data.product_spec || "");

      setQuantity(data.quantity ?? null);
      setUnitPrice(data.unit_price ?? null);
      setTotalPrice(data.total_price ?? null);

      setDeliveryDate(data.delivery_date ?? null);
      setDeliveryAddress(data.delivery_address || "");

      setSignature(data.signature || "");
      setCompleted(data.status === "completed");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "계약서를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 서명 저장
  const handleSave = (image: string) => {
    setSignature(image);
    setOpen(false);
  };

  // 계약 완료
  const handleComplete = async () => {
    // 두 가지 확인사항을 모두 체크했는지 확인
    if (!agreementChecked || !specialChecked) {
      alert(
        "계약내용과 계약조건 및 특약사항을 모두 확인해주세요."
      );
      return;
    }

    // 서명 확인
    if (!signature) {
      alert("먼저 전자서명을 해주세요.");
      return;
    }

    // 이미 완료된 계약인지 확인
    if (completed) {
      alert("이미 완료된 계약입니다.");
      return;
    }

    try {
      const contractId = await getContractId();

      const { error } = await supabase
        .from("contract")
        .update({
          signature,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", contractId);

      if (error) {
        console.error("계약 완료 저장 오류:", error);
        alert(error.message);
        return;
      }

      await loadContract();

      alert("전자계약이 완료되었습니다.");
    } catch (error) {
      console.error("계약 완료 처리 오류:", error);

      alert(
        error instanceof Error
          ? error.message
          : "계약 완료 처리 중 오류가 발생했습니다."
      );
    }
  };

  // public_token으로 계약 내부 ID 확인
  const getContractId = async () => {
    const response = await fetch(`/api/contract/${token}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data?.id) {
      throw new Error("계약 정보를 확인할 수 없습니다.");
    }

    return data.id;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-5">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">
            계약서를 불러오는 중입니다.
          </div>

          <div className="mt-2 text-sm text-gray-500">
            잠시만 기다려주세요.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f5f8] px-3 py-5 sm:px-4 sm:py-8">
      <ContractView
        company={company}
        companyBusinessNumber={companyBusinessNumber}
        contractor={contractor}
        contractorBusinessNumber={contractorBusinessNumber}
        contractText={contractText}
        productName={productName}
        productDescription={productDescription}
        quantity={quantity}
        unitPrice={unitPrice}
        totalPrice={totalPrice}
        deliveryDate={deliveryDate}
        deliveryAddress={deliveryAddress}
        signature={signature}
        completed={completed}
        agreementChecked={agreementChecked}
        specialChecked={specialChecked}
        onAgreementChange={setAgreementChecked}
        onSpecialChange={setSpecialChecked}
        onSign={() => setOpen(true)}
        onComplete={handleComplete}
      />

      {!completed && (
        <SignatureModal
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}