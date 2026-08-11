import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    console.log("조회할 token:", token);

    if (!token) {
      return NextResponse.json(
        { error: "계약 토큰이 없습니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contract")
      .select("*")
      .eq("public_token", token)
      .maybeSingle();

    console.log("Supabase 조회 결과:", data);
    console.log("Supabase 조회 오류:", error);

    if (error) {
      return NextResponse.json(
        {
          error: "계약서 조회 중 오류가 발생했습니다.",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "계약서를 찾을 수 없습니다.",
          token,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("계약서 조회 예외:", error);

    return NextResponse.json(
      { error: "계약서 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}