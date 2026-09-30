import React, { useState } from "react";

function StayDetail() {
  const [selectedRoom, setSelectedRoom] = useState("");
  return (
    <div className="detail-page">

      {/* HEADER */}
      <header className="search-header">
        <div className="search-logo">STAYORA</div>

        <nav>
          <a href="#">Trang chủ</a>
          <a href="#">Khám phá</a>
          <a href="#">Đặt phòng của tôi</a>
          <a href="#">♡ Yêu thích</a>
        </nav>
      </header>

      {/* CONTENT */}
      <main className="detail-container">

        <p className="detail-back">← Quay lại danh sách</p>

        <div className="detail-title">
          <div>
            <p className="eyebrow">STAYORA · ĐÀ LẠT</p>
            <h1>The Pine House</h1>
            <p>📍 Trung tâm Đà Lạt</p>
          </div>

          <div className="detail-rating">
            ★ 4.9
            <span> · 128 đánh giá</span>
          </div>
        </div>

        {/* IMAGE */}
        <div className="detail-image">
          <img
            src="https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1400&q=80"
            alt="The Pine House"
          />
        </div>

        {/* INFO */}
        <div className="detail-content">

          <section className="detail-main">

            <div className="detail-section">
              <h2>Về chỗ nghỉ</h2>
              <p>
                The Pine House là một homestay mang phong cách ấm áp,
                nằm giữa không gian yên bình của Đà Lạt. Chỗ nghỉ phù hợp
                cho những chuyến nghỉ dưỡng và khám phá thành phố.
              </p>
            </div>

            <div className="detail-section">
              <h2>Tiện nghi</h2>

              <div className="amenities">
                <span>✓ Wi-Fi miễn phí</span>
                <span>✓ Bãi đỗ xe</span>
                <span>✓ View đẹp</span>
                <span>✓ Máy lạnh</span>
                <span>✓ Nước uống</span>
                <span>✓ Không gian sân vườn</span>
              </div>
            </div>

            <div className="detail-section">
              <h2>Vị trí</h2>
              <p>
                📍 Trung tâm Đà Lạt · thuận tiện di chuyển đến
                Chợ Đà Lạt, Hồ Xuân Hương và các địa điểm nổi tiếng.
              </p>
            </div>

          </section>

          {/* ROOM SELECTION */}
          <aside className="booking-box">

            <div className="booking-price">
              <strong>Chọn phòng</strong>
            </div>

            <div className="room-option">
              <div>
                <h3>Phòng Standard</h3>
                <p>🛏️ 1 giường đôi · 👤 2 khách</p>
                <span>650.000đ / đêm</span>
              </div>

              <button
                className="booking-button"
                onClick={() => setSelectedRoom("Phòng Standard")}
                >
                Đặt phòng
             </button>
            </div>

            <div className="room-option">
              <div>
                <h3>Phòng Deluxe View Đồi</h3>
                <p>🛏️ 1 giường đôi · 👤 2 khách</p>
                <span>850.000đ / đêm</span>
              </div>

              <button
            className="booking-button"
            onClick={() => setSelectedRoom("Phòng Deluxe View Đồi")}
            >
            Đặt phòng
            </button>
            </div>

            <div className="room-option">
              <div>
                <h3>Phòng Family</h3>
                <p>🛏️ 2 giường đôi · 👤 4 khách</p>
                <span>1.200.000đ / đêm</span>
              </div>

              <button
                className="booking-button"
                onClick={() => setSelectedRoom("Phòng Family")}
                >
                Đặt phòng
             </button>
            </div>

          </aside>
          {selectedRoom && (
  <p className="selected-room">
    Bạn đã chọn: <strong>{selectedRoom}</strong>
  </p>
)}

        </div>

      </main>

    </div>
  );
}

export default StayDetail;