import { useMemo, useState } from "react";
import "./Booking.css";
import Auth from "./Auth.jsx";
import { getCollection, writeCollection } from "./stayoraData";

export default function Booking({
  stay,
  selectedRoom,
  onBack,
  currentUser,
  onAuthSuccess,
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const [payment, setPayment] = useState("hotel");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  // =========================
  // THÔNG TIN PHÒNG
  // =========================

  const getRoomPrice = () => {
  let roomPrice = stay.price;

  if (selectedRoom === "Phòng Deluxe View Đồi") {
    roomPrice = stay.price + 200000;
  }

  if (selectedRoom === "Phòng Family") {
    roomPrice = stay.price + 550000;
  }

  if (selectedRoom === "Villa nguyên căn") {
    roomPrice = stay.price;
  }

  return roomPrice;
};

const room = {
  name: stay.name,
  location: stay.area,
  type: selectedRoom,
  price: getRoomPrice(),
  rating: stay.rating,
  image: stay.image,
};

  // =========================
  // THÔNG TIN TÀI KHOẢN
  // =========================

  const bank = {
    bankId: "MB",
    accountNumber: "0123456789",
    accountName: "STAYORA",
  };

  // =========================
  // TÍNH SỐ ĐÊM
  // =========================

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end - start;

    const result = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return result > 0 ? result : 0;
  }, [checkIn, checkOut]);

  // =========================
  // TỔNG TIỀN
  // =========================

  const total = nights * room.price;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // =========================
  // QR THANH TOÁN
  // =========================

  const qrContent = `STAYORA ${customer.name || "KHACH"} ${
    bookingCode || "BOOKING"
  }`;

const qrUrl =
  total > 0
    ? `https://img.vietqr.io/image/${bank.bankId}-${bank.accountNumber}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(
        qrContent
      )}&accountName=${encodeURIComponent(bank.accountName)}`
    : "";

  // =========================
  // NHẬP THÔNG TIN KHÁCH HÀNG
  // =========================

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // KIỂM TRA FORM
  // =========================

  const validateForm = () => {
    const newErrors = {};

    // Ngày nhận
    if (!checkIn) {
      newErrors.checkIn = "Vui lòng chọn ngày nhận phòng.";
    }

    // Ngày trả
    if (!checkOut) {
      newErrors.checkOut = "Vui lòng chọn ngày trả phòng.";
    }

    // Ngày trả phải sau ngày nhận
    if (
      checkIn &&
      checkOut &&
      new Date(checkOut) <= new Date(checkIn)
    ) {
      newErrors.checkOut =
        "Ngày trả phòng phải sau ngày nhận phòng.";
    }

    // Họ tên
    const name = customer.name.trim();

    if (!name) {
      newErrors.name = "Vui lòng nhập họ và tên.";
    } else if (name.split(/\s+/).length < 2) {
      newErrors.name = "Vui lòng nhập đầy đủ họ và tên.";
    } else if (!/^[A-Za-zÀ-ỹĐđ\s]+$/.test(name)) {
      newErrors.name =
        "Họ tên chỉ được chứa chữ cái.";
    }

    // Số điện thoại
    const phone = customer.phone.trim();

    if (!phone) {
      newErrors.phone =
        "Vui lòng nhập số điện thoại.";
    } else if (!/^0\d{9}$/.test(phone)) {
      newErrors.phone =
        "Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0.";
    }

    // Email
    const email = customer.email.trim();

    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      newErrors.email =
        "Email phải có định dạng @gmail.com.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // XÁC NHẬN ĐẶT PHÒNG
  // =========================

const handleSubmit = (e, authenticatedUser = currentUser) => {
  if (e) {
    e.preventDefault();
  }

  const valid = validateForm();

  if (!valid) {
    return;
  }

  // Nếu chưa đăng nhập → mở popup đăng nhập
  if (!authenticatedUser?.id) {
    setShowAuth(true);
    return;
  }

  const code =
    "STY" +
    Math.floor(100000 + Math.random() * 900000);

  const allBookings = getCollection("stayoraBookings");

  // Tạo booking mới
 const newBooking = {
  userId: authenticatedUser.id,

    bookingCode: code,

    stay: {
      id: stay.id,
      name: stay.name,
      area: stay.area,
      location: stay.location,
      image: stay.image,
      rating: stay.rating,
    },

    selectedRoom,

    checkIn,
    checkOut,

    nights,

    guests: Number(guests),

    customer: {
      ...customer,
    },

    payment,

    totalPrice: total,

    status: "Đã xác nhận",

    createdAt: new Date().toISOString(),
  };

  // Thêm booking mới vào danh sách
  const updatedBookings = [
    ...allBookings,
    newBooking,
  ];

  // Lưu lại localStorage
  if (!writeCollection("stayoraBookings", updatedBookings)) {
    setErrors((previous) => ({
      ...previous,
      submit: "Không thể lưu đặt phòng. Vui lòng thử lại.",
    }));
    return;
  }

  setBookingCode(code);
  setSuccess(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  // =========================
  // TRANG THÀNH CÔNG
  // =========================

  if (success) {
    return (
      <div className="success-page">
        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <div className="success-brand">
            STAYORA · ĐÀ LẠT
          </div>

          <h1>Đặt phòng thành công!</h1>

          <p className="success-text">
            Cảm ơn bạn đã lựa chọn Stayora.
            <br />
            Chúc bạn có một chuyến đi thật vui
            và nhiều trải nghiệm đáng nhớ tại Đà Lạt.
          </p>

          <div className="booking-code">
            <span>MÃ ĐẶT PHÒNG</span>
            <strong>{bookingCode}</strong>
          </div>

          <div className="success-info">

            <div>
              <span>Chỗ nghỉ</span>
              <strong>{room.name}</strong>
            </div>

            <div>
              <span>Loại phòng</span>
              <strong>{room.type}</strong>
            </div>

            <div>
              <span>Nhận phòng</span>
              <strong>
                {new Date(checkIn).toLocaleDateString("vi-VN")}
              </strong>
            </div>

            <div>
              <span>Trả phòng</span>
              <strong>
                {new Date(checkOut).toLocaleDateString("vi-VN")}
              </strong>
            </div>

            <div>
              <span>Số khách</span>
              <strong>{guests} khách</strong>
            </div>

            <div className="success-total">
              <span>Tổng thanh toán</span>
              <strong>{formatPrice(total)}</strong>
            </div>

          </div>

          {payment === "online" && (
            <div className="payment-success-note">
              <strong>
                💳 Phương thức: Chuyển khoản / QR
              </strong>

              <span>
                Vui lòng hoàn tất chuyển khoản theo
                thông tin thanh toán.
              </span>
            </div>
          )}

          <p className="thank-you">
            ✨ Cảm ơn bạn đã tin tưởng Stayora!
          </p>

          <button
            className="back-button"
            onClick={onBack}
          >
            Quay lại trang chủ 
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // TRANG BOOKING
  // =========================

  return (
    <div className="booking-page">

      <div className="booking-container">

        {/* HEADER */}

        <div className="booking-header">

          <div>
            <div className="brand-small">
              STAYORA · ĐÀ LẠT
            </div>

            <h1>Đặt phòng</h1>

            <p>
              Hoàn tất thông tin để xác nhận
              đặt phòng của bạn.
            </p>
          </div>

          <div className="safe-badge">
            🔒 Đặt phòng an toàn
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="booking-grid">

            {/* =====================
                BÊN TRÁI
            ===================== */}

            <div className="form-column">

              {/* THÔNG TIN LƯU TRÚ */}

              <section className="booking-section">

                <div className="section-title">

                  <span>01</span>

                  <div>
                    <h2>Thông tin lưu trú</h2>
                    <p>
                      Chọn thời gian và số lượng khách
                    </p>
                  </div>

                </div>

                <div className="two-columns">

                  <div className="field">

                    <label>
                      Nhận phòng
                      <b>*</b>
                    </label>

                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value);

                        setErrors((prev) => ({
                          ...prev,
                          checkIn: "",
                          checkOut: "",
                        }));
                      }}
                    />

                    {errors.checkIn && (
                      <small>{errors.checkIn}</small>
                    )}

                  </div>

                  <div className="field">

                    <label>
                      Trả phòng
                      <b>*</b>
                    </label>

                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => {
                        setCheckOut(e.target.value);

                        setErrors((prev) => ({
                          ...prev,
                          checkOut: "",
                        }));
                      }}
                    />

                    {errors.checkOut && (
                      <small>{errors.checkOut}</small>
                    )}

                  </div>

                </div>

                <div className="field">

                  <label>
                    Số khách
                    <b>*</b>
                  </label>

                  <select
                    value={guests}
                    onChange={(e) =>
                      setGuests(e.target.value)
                    }
                  >
                    <option value="1">
                      1 khách
                    </option>

                    <option value="2">
                      2 khách
                    </option>

                    <option value="3">
                      3 khách
                    </option>

                    <option value="4">
                      4 khách
                    </option>

                    <option value="5">
                      5 khách
                    </option>

                    <option value="6">
                      6 khách
                    </option>
                  </select>

                </div>

              </section>


              {/* THÔNG TIN KHÁCH */}

              <section className="booking-section">

                <div className="section-title">

                  <span>02</span>

                  <div>
                    <h2>Thông tin khách hàng</h2>
                    <p>
                      Các thông tin có dấu * là bắt buộc
                    </p>
                  </div>

                </div>

                <div className="field">

                  <label>
                    Họ và tên
                    <b>*</b>
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={customer.name}
                    onChange={handleCustomerChange}
                  />

                  {errors.name && (
                    <small>{errors.name}</small>
                  )}

                </div>

                <div className="two-columns">

                  <div className="field">

                    <label>
                      Số điện thoại
                      <b>*</b>
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      maxLength="10"
                      inputMode="numeric"
                      placeholder="0901234567"
                      value={customer.phone}
                      onChange={(e) => {
                        const number =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setCustomer((prev) => ({
                          ...prev,
                          phone: number,
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          phone: "",
                        }));
                      }}
                    />

                    {errors.phone && (
                      <small>{errors.phone}</small>
                    )}

                  </div>

                  <div className="field">

                    <label>
                      Email
                      <b>*</b>
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="you@gmail.com"
                      value={customer.email}
                      onChange={handleCustomerChange}
                    />

                    {errors.email && (
                      <small>{errors.email}</small>
                    )}

                  </div>

                </div>

                <div className="field">

                  <label>
                    Ghi chú
                    <span>Không bắt buộc</span>
                  </label>

                  <textarea
                    name="note"
                    rows="4"
                    placeholder="Ví dụ: Tôi muốn nhận phòng sớm..."
                    value={customer.note}
                    onChange={handleCustomerChange}
                  />

                </div>

              </section>


              {/* THANH TOÁN */}

              <section className="booking-section">

                <div className="section-title">

                  <span>03</span>

                  <div>
                    <h2>Phương thức thanh toán</h2>
                    <p>
                      Chọn phương thức phù hợp với bạn
                    </p>
                  </div>

                </div>

                <div className="payment-options">

                  <label
                    className={
                      payment === "hotel"
                        ? "payment-option active"
                        : "payment-option"
                    }
                  >

                    <input
                      type="radio"
                      name="payment"
                      value="hotel"
                      checked={payment === "hotel"}
                      onChange={(e) =>
                        setPayment(e.target.value)
                      }
                    />

                    <div className="payment-symbol">
                      🏨
                    </div>

                    <div>
                      <strong>
                        Thanh toán tại chỗ
                      </strong>

                      <span>
                        Thanh toán trực tiếp tại nơi nghỉ
                      </span>
                    </div>

                  </label>


                  <label
                    className={
                      payment === "online"
                        ? "payment-option active"
                        : "payment-option"
                    }
                  >

                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={payment === "online"}
                      onChange={(e) =>
                        setPayment(e.target.value)
                      }
                    />

                    <div className="payment-symbol">
                      💳
                    </div>

                    <div>
                      <strong>
                        Chuyển khoản / QR
                      </strong>

                      <span>
                        Quét mã QR để thanh toán
                      </span>
                    </div>

                  </label>

                </div>


                {/* QR */}

                {payment === "online" && (
                  <div className="qr-box">

                    <div className="qr-header">

                      <div>
                        <strong>
                          Thanh toán bằng QR
                        </strong>

                        <span>
                          Mở ứng dụng ngân hàng
                          và quét mã
                        </span>
                      </div>

                      <b>VIETQR</b>

                    </div>

                    {total > 0 ? (
                      <div className="qr-body">

                        <div className="qr-image">
                          <img
                            src={qrUrl}
                            alt="QR thanh toán"
                          />
                        </div>

                        <div className="bank-info">

                          <div>
                            <span>
                              Ngân hàng
                            </span>

                            <strong>
                              MB Bank
                            </strong>
                          </div>

                          <div>
                            <span>
                              Số tài khoản
                            </span>

                            <strong>
                              {bank.accountNumber}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Chủ tài khoản
                            </span>

                            <strong>
                              {bank.accountName}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Số tiền
                            </span>

                            <strong className="red-price">
                              {formatPrice(total)}
                            </strong>
                          </div>

                        </div>

                      </div>
                    ) : (
                      <div className="qr-empty">
                        Vui lòng chọn ngày nhận và trả
                        phòng để hiển thị mã QR.
                      </div>
                    )}

                    <div className="qr-note">
                      💡 Nội dung chuyển khoản được
                      tạo tự động. Vui lòng giữ nguyên
                      nội dung khi thanh toán.
                    </div>

                  </div>
                )}

              </section>

            </div>


            {/* =====================
                BÊN PHẢI
            ===================== */}

            <aside className="summary">

              <div className="summary-card">

                <img
                  className="room-image"
                  src={room.image}
                  alt={room.name}
                />

                <div className="summary-content">

                  <span className="location">
                    📍 {room.location}
                  </span>

                  <h3>{room.name}</h3>

                  <div className="room-row">

                    <span>{room.type}</span>

                    <span>
                      ★ {room.rating}
                    </span>

                  </div>

                  <div className="room-price">
                    <strong>
                      {formatPrice(room.price)}
                    </strong>

                    <span>/ đêm</span>
                  </div>

                  <div className="line"></div>


                  {/* THÔNG TIN BOOKING */}

                  <div className="summary-info">

                    <div>
                      <span>Nhận phòng</span>

                      <strong>
                        {checkIn
                          ? new Date(
                              checkIn
                            ).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Chưa chọn"}
                      </strong>
                    </div>

                    <div>
                      <span>Trả phòng</span>

                      <strong>
                        {checkOut
                          ? new Date(
                              checkOut
                            ).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Chưa chọn"}
                      </strong>
                    </div>

                    <div>
                      <span>Số khách</span>

                      <strong>
                        {guests} khách
                      </strong>
                    </div>

                  </div>

                  <div className="line"></div>


                  {/* GIÁ */}

                  <div className="price-list">

                    <div>
                      <span>
                        {formatPrice(room.price)} ×{" "}
                        {nights} đêm
                      </span>

                      <strong>
                        {formatPrice(total)}
                      </strong>
                    </div>

                    <div>
                      <span>Phí dịch vụ</span>

                      <strong>
                        Miễn phí
                      </strong>
                    </div>

                  </div>


                  <div className="total">

                    <div>
                      <span>Tổng cộng</span>

                      <small>
                        Đã bao gồm phí
                      </small>
                    </div>

                    <strong>
                      {formatPrice(total)}
                    </strong>

                  </div>


                  <button
                    type="submit"
                    className="confirm-button"
                  >
                    <span>
                      Xác nhận đặt phòng
                    </span>

                    <span>→</span>
                  </button>

                  <div className="secure-text">
                    🔒 Thông tin của bạn được bảo mật
                  </div>

                </div>

              </div>

            </aside>

          </div>
          {errors.submit && <p role="alert">{errors.submit}</p>}

        </form>
        {showAuth && (
  <Auth
    mode="login"
    onClose={() => setShowAuth(false)}
   onChangeMode={(mode) => {
  setAuthMode(mode);
}}
    onAuthSuccess={(user) => {
      setShowAuth(false);

      // Cập nhật currentUser ở App
      if (onAuthSuccess) {
        onAuthSuccess(user);
      }

      // Sau khi đăng nhập thành công,
      // tiếp tục hoàn tất booking luôn
      handleSubmit(null, user);
    }}
  />
)}
      </div>

    </div>
  );
}