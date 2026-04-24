import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>联系我们 | 摇摇尾巴</title>
        <meta name="description" content="联系摇摇尾巴获取产品咨询、选购建议与售后支持。" />
      </Head>
      <section className="container-main py-12">
        <h1 className="text-2xl font-bold sm:text-3xl">联系我们</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold">咨询方式</h2>
            <ul className="mt-4 space-y-2 text-stone-700">
              <li>微信：yaoyaoweiba-pet（占位）</li>
              <li>钉钉：yaoyaoweiba-service（占位）</li>
              <li>电话：400-888-2026</li>
              <li>邮箱：hello@yaoyaoweiba.com</li>
              <li>服务时间：09:00 - 21:00</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold">温馨提示</h2>
            <p className="mt-4 text-stone-700">
              发送宠物年龄、体型、饮食偏好等信息，我们会为你推荐更合适的狗窝、狗粮和零食搭配。
            </p>
            <p className="mt-3 text-sm text-stone-500">
              微信与钉钉当前为占位联系方式，后续替换为真实账号即可。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
