import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Kéo thanh cuộn lên vị trí x: 0, y: 0 một cách mượt mà
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Dùng "instant" để lên ngay lập tức, hoặc đổi thành "smooth" nếu thích cuộn từ từ
    });
  }, [pathname]);

  return null; // Component này chạy ngầm, không hiển thị gì ra màn hình cả
}
