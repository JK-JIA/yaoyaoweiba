export default function Footer() {
  return (
    <footer className="mt-16 border-t border-amber-100 bg-white">
      <div className="container-main py-8 text-sm text-stone-600">
        <p className="font-semibold text-stone-700">摇摇尾巴 Pet Supplies</p>
        <p className="mt-2">安心喂养，舒适陪伴，精选品质。</p>
        <p className="mt-3">Copyright © {new Date().getFullYear()} 摇摇尾巴. All rights reserved.</p>
      </div>
    </footer>
  );
}
