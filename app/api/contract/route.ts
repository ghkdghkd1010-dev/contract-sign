import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
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
      contract_text,
      status,
    } = body;

    if (!company || !contractor || !productName) {
      return NextResponse.json(
        { error: "필수 항목을 입력해주세요." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contract")
      .insert({
        company,
        company_business_number: companyBusinessNumber || null,
        contractor,
        contractor_business_number: contractorBusinessNumber || null,
        product_name: productName,
        product_spec: productSpec || null,
        quantity: quantity || null,
        unit_price: unitPrice || null,
        delivery_date: deliveryDate || null,
        delivery_address: deliveryAddress || null,
        contract_text,
        status: status || "pending",
      })
      .select("id, public_token")
      .single();

    if (error) {
      console.error("Supabase INSERT ERROR:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data?.public_token) {
      return NextResponse.json(
        { error: "계약 토큰이 생성되지 않았습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      public_token: data.public_token,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "계약 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}