import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { isAdminAuthed, setAdminAuthed, setAdminSecret, verifyAdminPassword } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminAuthed()) {
      router.replace("/admin/products");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (verifyAdminPassword(password)) {
      setAdminSecret(password);
      setAdminAuthed(true);
      router.push("/admin/products");
      return;
    }
    setError("密码错误，请重试。");
  };

  return (
    <>
      <Head>
        <title>管理员登录 | 摇摇尾巴</title>
      </Head>
      <section className="container-main py-12">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">管理员登录</h1>
          <p className="mt-2 text-sm text-stone-600">
            默认密码：yaoyaoweiba123。本地可用环境变量 NEXT_PUBLIC_ADMIN_PASSWORD 修改；Docker 构建时需与后端 ADMIN_PASSWORD 一致。
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border p-2"
              placeholder="请输入管理员密码"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="w-full rounded-full bg-brand-500 py-2 font-semibold text-white">
              登录
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
