import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>关于我们 | 摇摇尾巴</title>
        <meta name="description" content="了解摇摇尾巴品牌故事、品质承诺与售后服务理念。" />
      </Head>
      <section className="container-main py-12">
        <h1 className="text-2xl font-bold sm:text-3xl">关于摇摇尾巴</h1>
        <div className="mt-6 space-y-4 rounded-2xl bg-white p-5 text-stone-700 shadow-sm sm:p-6">
          <p>
            摇摇尾巴是一家专注宠物犬生活用品的品牌，围绕“休息、喂养、奖励”三大场景，
            甄选高频刚需产品，帮助养宠家庭更轻松地照顾毛孩子。
          </p>
          <p>
            我们坚持品质优先，关注安全材质、适口性和实用体验，确保每一件商品都经得起日常使用。
          </p>
          <p>
            提供贴心售后服务和选品建议，陪伴每位宠主打造更健康、更温暖的宠物生活。
          </p>
        </div>
      </section>
    </>
  );
}
