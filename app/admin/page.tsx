"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);

        if (newSession) {
          loadContracts();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);

    if (session) {
      loadContracts();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError(
        "이메일과 비밀번호를 입력해주세요."
      );
      return;
    }

    setLoading(true);
    setLoginError("");

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setLoginError(
        "이메일 또는 비밀번호가 올바르지 않습니다."
      );

      setLoading(false);
      return;
    }

    setSession(data.session);

    await loadContracts();

    setLoading(false);
  };

  const loadContracts = async () => {
    const { data, error } = await supabase
      .from("contract")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setContracts(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setSession(null);
    setContracts([]);
  };

  // 로그인 전
  if (!session) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">

          <div className="mb-8">

            <p className="text-xs font-semibold tracking-[0.2em] text-gray-400">
              ELECTRONIC CONTRACT SYSTEM
            </p>

            <h1 className="mt-2 text-2xl font-bold">
              관리자 로그인
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              계약 관리 페이지입니다.
            </p>

          </div>

          <div className="space-y-4">

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="관리자 이메일"
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="관리자 비밀번호"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />

            {loginError && (
              <p className="text-sm text-red-600">
                {loginError}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-lg bg-black py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "로그인 중..."
                : "관리자 로그인"}
            </button>

          </div>

        </div>

      </main>
    );
  }

  // 로그인 후
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gray-400">
              ELECTRONIC CONTRACT SYSTEM
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              계약 관리
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold"
          >
            로그아웃
          </button>

        </div>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow">

          <h2 className="text-lg font-bold">
            계약 생성
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            새로운 전자계약서를 생성합니다.
          </p>

          <a
            href="/contract/create"
            className="mt-4 inline-block rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            계약서 생성하기
          </a>

        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <div className="border-b px-6 py-5">

            <h2 className="font-bold">
              계약 목록
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              총 {contracts.length}건
            </p>

          </div>

          {contracts.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              등록된 계약서가 없습니다.
            </div>

          ) : (

            <div className="divide-y">

              {contracts.map((contract) => (

                <div
                  key={contract.id}
                  className="flex items-center justify-between px-6 py-5"
                >

                  <div>

                    <div className="font-semibold">
                      {contract.product_name}
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      {contract.company}
                      {" → "}
                      {contract.contractor}
                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                      계약금액{" "}
                      {Number(
                        contract.total_price || 0
                      ).toLocaleString()}
                      원
                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <span
                      className={
                        contract.status === "completed"
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                          : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700"
                      }
                    >
                      {contract.status === "completed"
                        ? "계약 완료"
                        : "서명 대기"}
                    </span>

                    {contract.public_token && (
                      <button
                        onClick={() =>
                          window.open(
                            `/contract/${contract.public_token}`,
                            "_blank"
                          )
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold"
                      >
                        계약서 열람
                      </button>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}