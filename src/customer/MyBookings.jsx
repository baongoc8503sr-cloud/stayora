import React from "react";
import "../MyBookings.css";

function MyBookings({ onBack, currentUser }) {
  // =========================
  // LẤY BOOKING
  // =========================

  let allBookings = [];

  try {
    const savedBookings = localStorage.getItem(
      "stayoraBookings"
    );

    allBookings = savedBookings
      ? JSON.parse(savedBookings)
      : [];

    if (!Array.isArray(allBookings)) {
      allBookings = [];
    }
  } catch (error) {
    console.error(
      "Không thể đọc danh sách đặt phòng:",
      error
    );

    allBookings = [];
  }

  // =========================
  // CHỈ LẤY BOOKING CỦA USER HIỆN TẠI
  // =========================

  const bookings = currentUser?.id
    ? allBookings.filter(
        (booking) =>
          String(booking.userId) ===
          String(currentUser.id)
      )
    : [];

  // =========================
  // FORMAT GIÁ
  // =========================

  function formatPrice(price) {
    return (
      Number(price || 0).toLocaleString("vi-VN") +
      "đ"
    );
  }

  // =========================
  // FORMAT NGÀY
  // =========================

  function formatDate(date) {
    if (!date) return "Chưa có";

    return new Date(
      date + "T00:00:00"
    ).toLocaleDateString("vi-VN");
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="my-bookings-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="search-header">

        <div className="search-logo">
          ✦ STAYORA
        </div>

        <nav>
          <span>Trang chủ</span>
          <span>Khám phá</span>
          <span>Đặt phòng của tôi</span>
          <span>♡ Yêu thích</span>
        </nav>

        <div className="header-actions">

          {currentUser ? (
            <span>
              Xin chào,{" "}
              <strong>
                {currentUser.fullName}
              </strong>
            </span>
          ) : (
            <>
              <button>Đăng nhập</button>
              <button>Đăng ký</button>
            </>
          )}

        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="my-bookings-container">

        <button
          className="booking-back-button"
          onClick={onBack}
        >
          ← Quay lại
        </button>

        {/* =========================
            TITLE
        ========================= */}

        <div className="my-bookings-title">

          <p className="eyebrow">
            STAYORA · ĐÀ LẠT
          </p>

          <h1>
            Đặt phòng của tôi
          </h1>

          <p>
            Quản lý và xem lại những đặt phòng
            của bạn.
          </p>

        </div>

        {/* =========================
            EMPTY
        ========================= */}

        {bookings.length === 0 ? (

          <div className="empty-bookings">

            <div className="empty-icon">
              ⌂
            </div>

            <h2>
              Bạn chưa có đặt phòng nào
            </h2>

            <p>
              Những đặt phòng của bạn sẽ xuất hiện
              ở đây sau khi hoàn tất đặt phòng.
            </p>

            <button
              className="confirm-booking-button"
              onClick={onBack}
            >
              Khám phá chỗ nghỉ
            </button>

          </div>

        ) : (

          /* =========================
             BOOKING LIST
          ========================= */

          <div className="bookings-list">

            {bookings.map((booking) => {

              const stayName =
                booking.stay?.name ||
                "The Pine House";

              const stayLocation =
                booking.stay?.area ||
                booking.stay?.location ||
                "Trung tâm Đà Lạt";

              return (
                <div
                  className="booking-history-card"
                  key={booking.bookingCode}
                >

                  {/* =========================
                      BOOKING CODE
                  ========================= */}

                  <div className="booking-history-top">

                    <div>

                      <p className="eyebrow">
                        MÃ ĐẶT PHÒNG
                      </p>

                      <h2>
                        {booking.bookingCode}
                      </h2>

                    </div>

                  </div>

                  {/* =========================
                      MAIN BOOKING
                  ========================= */}

                  <div className="booking-history-main">

                    {/* ẢNH + CHỖ NGHỈ */}

                    <div className="booking-stay-section">

                      <div className="booking-stay-image">

                        {booking.stay?.image ? (
                          <img
                            src={booking.stay.image}
                            alt={stayName}
                          />
                        ) : (
                          <div className="booking-image-placeholder">
                            ⌂
                          </div>
                        )}

                      </div>

                      <div className="booking-stay-info">

                        <p className="history-label">
                          Chỗ nghỉ
                        </p>

                        <strong>
                          {stayName}
                        </strong>

                        <span>
                          📍 {stayLocation}
                        </span>

                      </div>

                    </div>

                    {/* PHÒNG */}

                    <div className="booking-info-item">

                      <p className="history-label">
                        Phòng
                      </p>

                      <strong>
                        {booking.selectedRoom ||
                          "Chưa có thông tin"}
                      </strong>

                    </div>

                    {/* THỜI GIAN */}

                    <div className="booking-info-item">

                      <p className="history-label">
                        Thời gian lưu trú
                      </p>

                      <strong>
                        {formatDate(
                          booking.checkIn
                        )}{" "}
                        →{" "}
                        {formatDate(
                          booking.checkOut
                        )}
                      </strong>

                      <span>
                        {booking.nights || 0} đêm
                      </span>

                    </div>

                    {/* SỐ KHÁCH */}

                    <div className="booking-info-item">

                      <p className="history-label">
                        Số khách
                      </p>

                      <strong>
                        {booking.guests || 0} khách
                      </strong>

                    </div>

                    {/* TỔNG TIỀN */}

                    <div className="booking-price-section">

                      <p className="history-label">
                        Tổng tiền
                      </p>

                      <strong className="history-price">
                        {formatPrice(
                          booking.totalPrice
                        )}
                      </strong>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </main>

    </div>
  );
}

export default MyBookings;