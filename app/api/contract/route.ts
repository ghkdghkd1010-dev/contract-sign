import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ContractItemInput = {
  id?: number;
  productName?: string;
  productSpec?: string;
  quantity?: number;
  unitPrice?: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      company,
      companyBusinessNumber,

      contractor,
      contractorBusinessNumber,

      items,

      deliveryDate,
      deliveryAddress,

      contract_text,
      status,
    } = body;

    // =========================================================
    // 기본 검증
    // =========================================================

    if (!company || !contractor) {
      return NextResponse.json(
        {
          error:
            "계약기관과 계약상대자는 필수 입력사항입니다.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error:
            "계약 물품을 최소 1개 이상 입력해주세요.",
        },
        { status: 400 }
      );
    }

    if (!deliveryDate) {
      return NextResponse.json(
        {
          error: "납품일자를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    if (!deliveryAddress) {
      return NextResponse.json(
        {
          error: "납품장소를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 여러 품목 데이터 정리
    // =========================================================

    const normalizedItems = (
      items as ContractItemInput[]
    ).map((item, index) => {
      const quantity = Number(item.quantity ?? 0);
      const unitPrice = Number(item.unitPrice ?? 0);

      // 제품명 검사
      if (!item.productName?.trim()) {
        throw new Error(
          `${index + 1}번째 품목의 제품명이 없습니다.`
        );
      }

      // 수량 검사
      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(
          `${index + 1}번째 품목의 수량이 올바르지 않습니다.`
        );
      }

      // 단가 검사
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error(
          `${index + 1}번째 품목의 단가가 올바르지 않습니다.`
        );
      }

      return {
        id:
          typeof item.id === "number"
            ? item.id
            : index + 1,

        productName:
          item.productName.trim(),

        productSpec:
          item.productSpec?.trim() || "",

        quantity,

        unitPrice,
      };
    });

    // =========================================================
    // 전체 계약금액 계산
    //
    // 예:
    // 품목1 = 100 × 10,000 = 1,000,000
    // 품목2 = 50 × 20,000 = 1,000,000
    //
    // 총 계약금액 = 2,000,000
    // =========================================================

    const totalPrice =
      normalizedItems.reduce(
        (sum, item) => {
          return (
            sum +
            item.quantity * item.unitPrice
          );
        },
        0
      );

    // =========================================================
    // 기존 단일 품목 컬럼과의 호환
    //
    // 기존 ContractView가 아직 단일 품목 컬럼을
    // 사용하는 경우를 대비해서 첫 번째 품목을 저장한다.
    // =========================================================

    const firstItem =
      normalizedItems[0];

    // =========================================================
    // 계약서 저장
    // =========================================================

    const { data, error } = await supabase
      .from("contract")
      .insert({
        // 계약기관
        company,

        // 사업자등록번호
        company_business:
          companyBusinessNumber?.trim() || null,

        // 계약상대자
        contractor,

        // 사업자등록번호
        contractor_business:
          contractorBusinessNumber?.trim() || null,

        // =====================================================
        // 여러 품목 전체
        // JSONB 컬럼에 배열 형태로 저장
        // =====================================================

        items: normalizedItems,

        // =====================================================
        // 기존 단일 품목 컬럼
        // 기존 DB / 기존 화면과의 호환용
        // =====================================================

        product_name:
          firstItem?.productName || null,

        product_spec:
          firstItem?.productSpec || null,

        quantity:
          firstItem?.quantity ?? null,

        unit_price:
          firstItem?.unitPrice ?? null,

        // =====================================================
        // 전체 품목의 합계
        // =====================================================

        total_price:
          totalPrice,

        // =====================================================
        // 납품 정보
        // =====================================================

        delivery_date:
          deliveryDate || null,

        delivery_address:
          deliveryAddress || null,

        // =====================================================
        // 계약 조건
        // =====================================================

        contract_text:
          contract_text || "",

        // =====================================================
        // 상태
        // =====================================================

        status:
          status || "pending",

        // =====================================================
        // 공개 계약서 토큰
        // =====================================================

        public_token:
          crypto.randomUUID(),
      })
      .select("*")
      .single();

    // =========================================================
    // Supabase 저장 오류
    // =========================================================

    if (error) {
      console.error(
        "SUPABASE CONTRACT INSERT ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            "계약서 생성에 실패했습니다.",

          detail:
            error.message,

          code:
            error.code || null,

          hint:
            error.hint || null,
        },
        { status: 500 }
      );
    }

    // =========================================================
    // 정상 생성
    // =========================================================

    return NextResponse.json({
      success: true,

      id:
        data.id,

      public_token:
        data.public_token,

      total_price:
        totalPrice,

      items:
        normalizedItems,
    });
  } catch (error) {
    console.error(
      "계약 생성 오류:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "계약 생성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}