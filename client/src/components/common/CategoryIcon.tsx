"use client";

import React from "react";
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Zap,
  TrendingUp,
  Award,
  GraduationCap,
  HeartPulse,
  LineChart,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";

interface CategoryIconProps {
  name?: string;
  icon?: string;
  type?: string;
  className?: string;
  size?: number;
}

export function getCategoryLucideIcon(categoryNameOrIcon?: string): LucideIcon {
  const str = (categoryNameOrIcon || "").toLowerCase();

  if (str.includes("food") || str.includes("ăn") || str.includes("dining") || str.includes("🍲") || str.includes("cafe") || str.includes("cà phê")) {
    return UtensilsCrossed;
  }
  if (str.includes("transport") || str.includes("di chuyển") || str.includes("xăng") || str.includes("xe") || str.includes("🚗") || str.includes("grab")) {
    return Car;
  }
  if (str.includes("shop") || str.includes("mua") || str.includes("sắm") || str.includes("🛍️")) {
    return ShoppingBag;
  }
  if (str.includes("entertain") || str.includes("giải trí") || str.includes("du lịch") || str.includes("phim") || str.includes("🎬")) {
    return Film;
  }
  if (str.includes("utilit") || str.includes("hóa đơn") || str.includes("tiện ích") || str.includes("điện") || str.includes("nước") || str.includes("⚡")) {
    return Zap;
  }
  if (str.includes("salary") || str.includes("lương") || str.includes("thu nhập") || str.includes("income") || str.includes("💵") || str.includes("💰")) {
    return TrendingUp;
  }
  if (str.includes("thưởng") || str.includes("bonus") || str.includes("quà") || str.includes("gift") || str.includes("🎁")) {
    return Award;
  }
  if (str.includes("học") || str.includes("education") || str.includes("sách") || str.includes("book")) {
    return GraduationCap;
  }
  if (str.includes("y tế") || str.includes("sức khỏe") || str.includes("health") || str.includes("thuốc")) {
    return HeartPulse;
  }
  if (str.includes("đầu tư") || str.includes("invest") || str.includes("crypto") || str.includes("chứng khoán") || str.includes("📈")) {
    return LineChart;
  }

  return Layers;
}

export default function CategoryIcon({
  name,
  icon,
  className = "w-4 h-4",
  size,
}: CategoryIconProps) {
  const IconComponent = getCategoryLucideIcon(name || icon);
  return <IconComponent className={className} size={size} strokeWidth={1.8} />;
}
