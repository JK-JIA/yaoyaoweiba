import { Product } from "./types";

export const defaultProducts: Product[] = [
  {
    id: "1",
    slug: "cloud-comfy-bed",
    name: "云朵舒睡狗窝",
    category: "dog-bed",
    price: "¥199",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598133894008-61f719fdb18e?auto=format&fit=crop&w=1200&q=80"
    ],
    shortDescription: "加厚填充，包裹感强，适合中小型犬。",
    details: "采用亲肤短绒和高回弹填充，冬天保暖、夏季不闷。可拆洗外套设计，清洁维护更简单。",
    specs: ["S/M/L 三种尺寸", "可机洗外套", "防滑底布"],
    fitFor: "柯基、柴犬、比熊等中小型犬"
  },
  {
    id: "2",
    slug: "steel-slow-feed-bowl",
    name: "不锈钢慢食饭碗",
    category: "bowl",
    price: "¥79",
    image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "慢食结构减少狼吞虎咽，守护肠胃健康。",
    details: "304 不锈钢材质，耐摔耐磨。底部硅胶防滑圈，进食时不易位移，日常清洁方便。",
    specs: ["304 不锈钢", "防滑硅胶底圈", "550ml 容量"],
    fitFor: "所有犬型，尤其适合进食过快犬只"
  },
  {
    id: "3",
    slug: "balanced-adult-food",
    name: "成犬均衡狗粮",
    category: "dog-food",
    price: "¥239 / 2.5kg",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "高蛋白低敏配方，助力健康肌肉与毛发。",
    details: "鸡肉+糙米科学配比，添加益生元与鱼油，支持肠道健康与皮毛亮泽，适口性佳。",
    specs: ["粗蛋白 28%", "添加益生元", "不含人工色素"],
    fitFor: "1-7 岁成犬"
  },
  {
    id: "4",
    slug: "duck-training-treat",
    name: "鸭肉训练零食",
    category: "treat",
    price: "¥49",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "低脂高适口，小颗粒更适合训练奖励。",
    details: "选用优质鸭肉，低温烘焙保留肉香。小颗粒设计，携带方便，训练效率更高。",
    specs: ["150g/袋", "低脂配方", "便携密封袋"],
    fitFor: "幼犬及成犬训练场景"
  }
];
