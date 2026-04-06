import React, { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Hàm kiểm tra vị trí cuộn
  const toggleVisibility = () => {
    // Nếu cuộn xuống hơn 300px, hiện nút, ngược lại ẩn nút
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Hàm kéo lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Hiệu ứng cuộn mượt mà
    });
  };

  useEffect(() => {
    // Lắng nghe sự kiện cuộn
    window.addEventListener("scroll", toggleVisibility);
    // Hủy lắng nghe khi component bị hủy
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button onClick={scrollToTop} title="Go to Top">
          ↑ {/* Biểu tượng mũi tên đi lên */}
        </button>
      )}
    </div>
  );
}
