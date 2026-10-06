import React, { useEffect, useState } from "react";
import MyBookings from "./MyBookings.jsx";

function BookingConfirmation({
  stay,
  fullName,
  phone,
  email,
  selectedRoom,
  checkIn,
  checkOut,
  guests,
  nights,
  totalPrice,
  note,
  currentUser,
}) {
  const [showBookings, setShowBookings] = useState(false);

  const [bookingCode] = useState(() => {
    return "STY" + Math.floor(100000 + Math.random() * 900000);
  });

  useEffect(() => {
    const oldBookings = JSON.parse(
      localStorage.getItem("stayoraBookings") || "[]"
    );

    const newBooking = {
      bookingCode,

      // Thông tin chỗ nghỉ được chọn
      stay: stay
        ? {
            id: stay.id,
            name: stay.name,
            area: stay.area,
            location: stay.location,
            image: stay.image,
            type: stay.type,
          }
        : null,

      // Thông tin khách hàng
      fullName,
      phone,
      email,

      // Thông tin đặt phòng
      selectedRoom,
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice,
      note,

      status: "Đã xác nhận",
    };

    const alreadyExists = oldBookings.some(
      (booking) => booking.bookingCode === bookingCode
    );

    if (!alreadyExists) {
      localStorage.setItem(
        "stayoraBookings",
        JSON.stringify([newBooking, ...oldBookings])
      );
    }
  }, [
    bookingCode,
    stay,
    fullName,
    phone,
    email,
    selectedRoom,
    checkIn,
    checkOut,
    guests,
    nights,
    totalPrice,
    note,
  ]);

  function formatPrice(price) {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  }

  // Nếu booking cũ không có stay thì vẫn hiển thị thông tin cũ
  const stayName = stay?.name || "The Pine House";
  const stayLocation =
    stay?.area || stay?.location || "Trung tâm Đà Lạt";

    if (showBookings) {
      return (
        <MyBookings
          currentUser={currentUser}
          onBack={() => setShowBookings(false)}
        />
      );
    }

  return (
    <div className="confirmation-page">
      <header className="search-header">
        <div className="search-logo">✦ STAYORA</div>

        <nav>
          <span>Trang chủ</span>
          <span>Khám phá</span>
          <span>Đặt phòng của tôi</span>
          <span>♡ Yêu thích</span>
        </nav>

        <div className="header-actions">
          <button>Đăng nhập</button>
          <button>Đăng ký</button>
        </div>
      </header>

      <main className="confirmation-container">
        <div className="confirmation-success">
          <div className="success-icon">✓</div>

          <p className="eyebrow">STAYORA · ĐÀ LẠT</p>

          <h1>Đặt phòng thành công!</h1>

          <p>
            Cảm ơn <strong>{fullName}</strong>. Đặt phòng của bạn đã được
            ghi nhận.
          </p>
        </div>

        <div className="confirmation-card">
          <div className="confirmation-code">
            <span>Mã đặt phòng</span>
            <strong>{bookingCode}</strong>
          </div>

          {/* THÔNG TIN CHỖ NGHỈ */}
          <div className="confirmation-section">
            <h2>Thông tin chỗ nghỉ</h2>

            <div className="confirmation-row">
              <span>Chỗ nghỉ</span>
              <strong>{stayName}</strong>
            </div>

            <div className="confirmation-row">
              <span>Địa điểm</span>
              <strong>{stayLocation}</strong>
            </div>

            <div className="confirmation-row">
              <span>Phòng</span>
              <strong>{selectedRoom}</strong>
            </div>
          </div>

          {/* THÔNG TIN LƯU TRÚ */}
          <div className="confirmation-section">
            <h2>Thông tin lưu trú</h2>

            <div className="confirmation-row">
              <span>Nhận phòng</span>
              <strong>{checkIn}</strong>
            </div>

            <div className="confirmation-row">
              <span>Trả phòng</span>
              <strong>{checkOut}</strong>
            </div>

            <div className="confirmation-row">
              <span>Số đêm</span>
              <strong>{nights} đêm</strong>
            </div>

            <div className="confirmation-row">
              <span>Số khách</span>
              <strong>{guests} khách</strong>
            </div>
          </div>

          {/* THÔNG TIN KHÁCH HÀNG */}
          <div className="confirmation-section">
            <h2>Thông tin khách hàng</h2>

            <div className="confirmation-row">
              <span>Họ và tên</span>
              <strong>{fullName}</strong>
            </div>

            <div className="confirmation-row">
              <span>Số điện thoại</span>
              <strong>{phone}</strong>
            </div>

            <div className="confirmation-row">
              <span>Email</span>
              <strong>{email}</strong>
            </div>
          </div>

          {/* TỔNG TIỀN */}
          <div className="confirmation-total">
            <span>Tổng thanh toán</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            className="confirm-booking-button"
            onClick={() => setShowBookings(true)}
          >
            Xem đặt phòng của tôi
          </button>

          <button
            className="back-home-button"
            onClick={() => window.location.reload()}
          >
            Về trang chủ
          </button>
        </div>
      </main>
    </div>
  );
}

export default BookingConfirmation;