import { useState } from "react";
import Booking from "./Booking";

function FloatingNavButton({
  direction,
  onClick,
  disabled = false,
}) {
  const isLeft = direction === "left";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? "Quay lại" : "Đi tới"}
      style={{
        position: "fixed",
        top: "50%",
        [isLeft ? "left" : "right"]: "24px",
        transform: "translateY(-50%)",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        border: "1px solid #e5e5e5",
        background: "#fff",
        color: "#111",
        fontSize: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.35 : 1,
        zIndex: 9999,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform =
            "translateY(-50%) scale(1.08)";

          e.currentTarget.style.boxShadow =
            "0 12px 30px rgba(0, 0, 0, 0.18)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(-50%) scale(1)";

        e.currentTarget.style.boxShadow =
          "0 8px 25px rgba(0, 0, 0, 0.12)";
      }}
    >
      {isLeft ? "←" : "→"}
    </button>
  );
}

function StayDetail({
  stay,
  onBack,
  currentUser,
  onAuthSuccess,
}) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  // Nếu không có dữ liệu chỗ nghỉ
  if (!stay) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>Không tìm thấy chỗ nghỉ</h2>

        <button
          type="button"
          onClick={onBack}
          style={{
            marginTop: "20px",
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  // Khi người dùng chọn phòng
  function handleSelectRoom(roomName) {
    setSelectedRoom(roomName);
    setShowBooking(true);
  }

  // =========================
  // TRANG BOOKING
  // =========================
  if (showBooking) {
    return (
      <>
        {/* Nút quay lại trang chi tiết */}
        <FloatingNavButton
          direction="left"
          onClick={() => setShowBooking(false)}
        />

        {/* Nút đi tới - hiện tại chưa có lịch sử forward */}
        <FloatingNavButton
          direction="right"
          onClick={() => {}}
          disabled
        />

        <Booking
        stay={stay}
        selectedRoom={selectedRoom}
        onBack={() => setShowBooking(false)}
        currentUser={currentUser}
        onAuthSuccess={onAuthSuccess}
      />
      </>
    );
  }

  // =========================
  // TRANG CHI TIẾT
  // =========================
  return (
    <>
      {/* NÚT ĐIỀU HƯỚNG TRÁI */}
      <FloatingNavButton
        direction="left"
        onClick={onBack}
      />

      {/* NÚT ĐIỀU HƯỚNG PHẢI */}
      <FloatingNavButton
        direction="right"
        onClick={() => {}}
        disabled
      />

      <div className="stay-detail-page">

        {/* =========================
            NÚT QUAY LẠI CŨ
        ========================= */}
        <button
          type="button"
          onClick={onBack}
          style={{
            margin: "20px",
            padding: "10px 18px",
            border: "1px solid #222",
            borderRadius: "8px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          ← Quay lại danh sách
        </button>

        {/* =========================
            ẢNH CHỖ NGHỈ
        ========================= */}
        <div className="stay-detail-image">
          <img
            src={stay.image}
            alt={stay.name}
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* =========================
            THÔNG TIN CHỖ NGHỈ
        ========================= */}
        <div className="stay-detail-content">

          <span>{stay.type}</span>

          <h1>{stay.name}</h1>

          <p>
            📍 {stay.area}
          </p>

          <p>
            ⭐ {stay.rating} ({stay.reviews} đánh giá)
          </p>

          <p>
            Khám phá không gian lưu trú tại{" "}
            {stay.name}, mang đến trải nghiệm phù hợp
            cho chuyến đi của bạn tại Đà Lạt.
          </p>

          {/* =========================
              TIỆN NGHI
          ========================= */}
          <div>
            <h2>Tiện nghi</h2>

            <div>
              {stay.amenities?.map((amenity) => (
                <span
                  key={amenity}
                  style={{
                    display: "inline-block",
                    marginRight: "10px",
                    marginBottom: "10px",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* =========================
              CHỌN PHÒNG
          ========================= */}
          <div
            style={{
              marginTop: "30px",
            }}
          >
            <h2>Chọn phòng</h2>

            <div>
              {stay.rooms?.map((room) => {
                let roomPrice = stay.price;

                if (room === "Phòng Deluxe View Đồi") {
                  roomPrice = stay.price + 200000;
                }

                if (room === "Phòng Family") {
                  roomPrice = stay.price + 550000;
                }

                if (room === "Villa nguyên căn") {
                  roomPrice = stay.price;
                }

                return (
                  <div
                    key={room}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "20px",
                      padding: "20px",
                      marginBottom: "15px",
                      border: "1px solid #ddd",
                      borderRadius: "12px",
                    }}
                  >
                    <div>
                      <h3>{room}</h3>

                      <p>
                        {new Intl.NumberFormat(
                          "vi-VN"
                        ).format(roomPrice)}
                        đ / đêm
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectRoom(room)
                      }
                      style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#111",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Chọn phòng
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StayDetail;