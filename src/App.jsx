import { useEffect, useState } from "react";
import "./App.css";
import SearchResults from "./customer/SearchResults";
import StayDetail from "./customer/StayDetail";
import Auth from "./customer/Auth.jsx";
import AccountCenter from "./customer/AccountCenter.jsx";
import FavoriteButton from "./customer/FavoriteButton.jsx";
import MyBookings from "./customer/MyBookings.jsx";
// ======================================================
// DỮ LIỆU CHỖ NGHỈ NỔI BẬT
// DÙNG CHUNG VỚI SEARCHRESULTS
// ======================================================

const featuredStays = [
  {
    id: 1,
    name: "The Pine House",
    area: "Trung tâm Đà Lạt",
    type: "Homestay",
    price: 650000,
    rating: 4.9,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1000&q=80",
    amenities: [
      "WiFi",
      "Bãi đỗ xe",
      "Ban công",
    ],
    rooms: [
      "Phòng Standard",
      "Phòng Deluxe View Đồi",
      "Phòng Family",
    ],
  },

  {
    id: 2,
    name: "Mây Đà Lạt Homestay",
    area: "Trại Mát",
    type: "Homestay",
    price: 520000,
    rating: 4.8,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80",
    amenities: [
      "WiFi",
      "Bữa sáng",
      "Ban công",
    ],
    rooms: [
      "Phòng Standard",
      "Phòng Deluxe",
    ],
  },

  {
    id: 3,
    name: "The Hill Villa",
    area: "Tà Nung",
    type: "Villa",
    price: 1200000,
    rating: 4.9,
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
    amenities: [
      "WiFi",
      "Hồ bơi",
      "Bãi đỗ xe",
    ],
    rooms: [
      "Phòng Deluxe View Đồi",
      "Phòng Family",
      "Villa nguyên căn",
    ],
  },
];

function App() {
  // =========================
  // SEARCH
  // =========================

  const [area, setArea] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 khách");

  const [showResults, setShowResults] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Lưu đúng chỗ nghỉ người dùng vừa chọn
  const [selectedStay, setSelectedStay] = useState(null);

  // =========================
  // AUTH
  // =========================

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [showAccountCenter, setShowAccountCenter] =
    useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  // =========================
  // KIỂM TRA ĐĂNG NHẬP
  // =========================

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("stayoraCurrentUser");

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error(
        "Không thể đọc thông tin tài khoản:",
        error
      );

      localStorage.removeItem("stayoraCurrentUser");
    }
  }, []);

  // =========================
  // TÌM PHÒNG
  // =========================

  function handleSearch() {
    if (!area) {
      alert("Vui lòng chọn khu vực tại Đà Lạt");
      return;
    }

    setShowDetail(false);
    setSelectedStay(null);
    setShowResults(true);
  }

  // =========================
  // XEM TẤT CẢ CHỖ NGHỈ
  // =========================

  function handleViewAll() {
    setArea("");

    setShowDetail(false);
    setSelectedStay(null);
    setShowResults(true);
  }

  // =========================
  // XEM CHI TIẾT CHỖ NGHỈ
  // =========================

  function handleViewDetail(stay) {
    if (!stay) return;

    setSelectedStay(stay);
    setShowResults(false);
    setShowDetail(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // QUAY LẠI KẾT QUẢ
  // =========================

  function handleBackToResults() {
    setShowDetail(false);
    setShowResults(true);
  }

  // =========================
  // AUTH ACTIONS
  // =========================

  function openLogin() {
    setAuthMode("login");
    setShowAuth(true);
  }

  function openRegister() {
    setAuthMode("register");
    setShowAuth(true);
  }
  function handleOpenMyBookings() {
  if (!currentUser) {
    setAuthMode("login");
    setShowAuth(true);
    return;
  }

  setShowDetail(false);
  setShowResults(false);
  setShowAccountCenter(false);
  setShowMyBookings(true);
}
  function handleAuthSuccess(user) {
    setCurrentUser(user);
    setShowAuth(false);
  }

  function handleLogout() {
    localStorage.removeItem("stayoraCurrentUser");
    sessionStorage.removeItem("stayoraCurrentUser");

    setCurrentUser(null);

    alert("Bạn đã đăng xuất khỏi STAYORA.");
  }

  // ======================================================
  // DETAIL PAGE
  // ======================================================
  if (showMyBookings) {
  return (
    <MyBookings
      currentUser={currentUser}
      onBack={() => setShowMyBookings(false)}
    />
  );
}
  if (showDetail && selectedStay) {
    return (
      <StayDetail
        stay={selectedStay}
        onBack={handleBackToResults}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // ======================================================
  // SEARCH RESULTS PAGE
  // ======================================================

  if (showResults) {
    return (
      <SearchResults
        area={area}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        onViewDetail={handleViewDetail}
      />
    );
  }

  // ======================================================
  // HOME PAGE
  // ======================================================

  return (
    <div className="app">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="header">

        <div className="logo">
          <span>✦</span>
          STAYORA
        </div>

        <nav className="nav">
          <a href="#home">Trang chủ</a>

          <a href="#explore">
            Khám phá
          </a>

          <a
          href="#booking"
          onClick={(e) => {
            e.preventDefault();
            handleOpenMyBookings();
          }}
        >
          Đặt phòng của tôi
        </a>

          <a href="#favorite">
            ♡ Yêu thích
          </a>
        </nav>

        <div className="header-actions">

          {!currentUser ? (
            <>
              <button
                type="button"
                className="login-btn"
                onClick={openLogin}
              >
                Đăng nhập
              </button>

              <button
                type="button"
                className="signup-btn"
                onClick={openRegister}
              >
                Đăng ký
              </button>
            </>
          ) : (
            <div
              onClick={() =>
                setShowAccountCenter(true)
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >

              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "#111",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                {currentUser.fullName
                  ? currentUser.fullName
                      .trim()
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {currentUser.fullName}
              </span>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleLogout();
                }}
                style={{
                  padding: "9px 13px",
                  border: "1px solid #222",
                  borderRadius: "7px",
                  background: "#fff",
                  color: "#222",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Đăng xuất
              </button>

            </div>
          )}

        </div>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main>

        {/* ==================================================
            HERO
        ================================================== */}

        <section
          className="hero"
          id="home"
        >

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <p className="hero-small">
              STAYORA • ĐÀ LẠT
            </p>

            <h1>
              Tìm một nơi
              <br />
              <span>để yêu Đà Lạt.</span>
            </h1>

            <p className="hero-description">
              Khám phá những homestay và khách sạn
              được tuyển chọn tại Đà Lạt cho chuyến
              đi của bạn.
            </p>

            {/* SEARCH BOX */}

            <div className="search-box">

              <div className="search-item">

                <label>
                  📍 KHU VỰC
                </label>

                <select
                  value={area}
                  onChange={(e) =>
                    setArea(e.target.value)
                  }
                >
                  <option value="">
                    Bạn muốn ở khu vực nào?
                  </option>

                  <option value="Trung tâm Đà Lạt">
                    Trung tâm Đà Lạt
                  </option>

                  <option value="Hồ Xuân Hương">
                    Hồ Xuân Hương
                  </option>

                  <option value="Chợ Đà Lạt">
                    Chợ Đà Lạt
                  </option>

                  <option value="Trại Mát">
                    Trại Mát
                  </option>

                  <option value="Tà Nung">
                    Tà Nung
                  </option>
                </select>

              </div>

              <div className="search-item">

                <label>
                  📅 NHẬN PHÒNG
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) =>
                    setCheckIn(e.target.value)
                  }
                />

              </div>

              <div className="search-item">

                <label>
                  📅 TRẢ PHÒNG
                </label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) =>
                    setCheckOut(e.target.value)
                  }
                />

              </div>

              <div className="search-item">

                <label>
                  👤 KHÁCH
                </label>

                <select
                  value={guests}
                  onChange={(e) =>
                    setGuests(e.target.value)
                  }
                >
                  <option>1 khách</option>
                  <option>2 khách</option>
                  <option>3 khách</option>
                  <option>4 khách</option>
                  <option>5+ khách</option>
                </select>

              </div>

              <button
                type="button"
                className="search-btn"
                onClick={handleSearch}
              >
                Tìm phòng
              </button>

            </div>

          </div>
        </section>

        {/* ==================================================
            FEATURED STAYS
        ================================================== */}

        <section
          className="section"
          id="explore"
        >

          <div className="section-heading">

            <div>

              <p className="section-label">
                ĐƯỢC YÊU THÍCH
              </p>

              <h2>
                Chỗ nghỉ nổi bật
              </h2>

            </div>

            <button
              type="button"
              className="view-all"
              onClick={handleViewAll}
            >
              Xem tất cả →
            </button>

          </div>

          {/* ==================================================
              3 CARD TRANG CHỦ
              CHỈ NÚT "XEM CHI TIẾT" MỚI MỞ DETAIL
          ================================================== */}

          <div className="hotel-grid">

            {featuredStays.map((stay, index) => (

              <div
                className="hotel-card"
                key={stay.id}
              >

                {/* =========================
                    IMAGE
                ========================== */}

                <div
                  className={`hotel-image hotel-${index + 1}`}
                  style={{
                    backgroundImage: `url("${stay.image}")`,
                  }}
                >

                  {/* =========================
                      FAVORITE
                      NẰM GÓC TRÊN BÊN PHẢI
                  ========================== */}

                  <div
                    className="featured-favorite"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <FavoriteButton
                      stay={stay}
                    />
                  </div>

                </div>

                {/* =========================
                    INFO
                ========================== */}

                <div className="hotel-info">

                  <div className="hotel-title">

                    <h3>
                      {stay.name}
                    </h3>

                    <span>
                      ⭐ {stay.rating}
                    </span>

                  </div>

                  <p>
                    📍 {stay.area}
                  </p>

                  <div className="hotel-price">

                    <div>

                      <strong>
                        {new Intl.NumberFormat(
                          "vi-VN"
                        ).format(stay.price)}
                        đ
                      </strong>

                      <span>
                        / đêm
                      </span>

                    </div>

                    {/* =========================
                        CHỈ NÚT NÀY MỞ CHI TIẾT
                    ========================== */}

                    <button
                      type="button"
                      className="detail-btn"
                      onClick={() =>
                        handleViewDetail(stay)
                      }
                    >
                      Xem chi tiết
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* ==================================================
            EXPLORE DALAT
        ================================================== */}

        <section className="dalat-section">

          <div className="dalat-content">

            <p className="section-label">
              KHÁM PHÁ ĐÀ LẠT
            </p>

            <h2>
              Mỗi góc nhỏ
              <br />
              một câu chuyện.
            </h2>

            <p>
              Từ những con dốc phủ đầy hoa đến
              những căn homestay giữa rừng thông,
              hãy tìm một nơi khiến bạn muốn ở lại
              lâu hơn.
            </p>

            <button
              type="button"
              className="dark-btn"
            >
              Khám phá Đà Lạt →
            </button>

          </div>

        </section>

        {/* ==================================================
            POPULAR AREAS
        ================================================== */}

        <section className="section">

          <div className="section-heading">

            <div>

              <p className="section-label">
                KHU VỰC
              </p>

              <h2>
                Ở đâu tại Đà Lạt?
              </h2>

            </div>

          </div>

          <div className="area-grid">

            <div className="area-card area-center">

              <div>

                <h3>
                  Trung tâm Đà Lạt
                </h3>

                <p>
                  Gần chợ • Hồ Xuân Hương
                </p>

              </div>

            </div>

            <div className="area-card area-trai-mat">

              <div>

                <h3>
                  Trại Mát
                </h3>

                <p>
                  Rừng thông • Yên bình
                </p>

              </div>

            </div>

            <div className="area-card area-ta-nung">

              <div>

                <h3>
                  Tà Nung
                </h3>

                <p>
                  Thiên nhiên • Nghỉ dưỡng
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            WHY STAYORA
        ================================================== */}

        <section className="why-section">

          <div className="why-content">

            <p className="section-label">
              VÌ SAO STAYORA?
            </p>

            <h2>
              Không chỉ là
              <br />
              một chỗ để ở.
            </h2>

            <p className="why-description">
              STAYORA giúp bạn tìm được nơi lưu trú
              phù hợp với cách bạn muốn trải nghiệm
              Đà Lạt.
            </p>

            <div className="features">

              <div className="feature">

                <div className="feature-icon">
                  01
                </div>

                <div>

                  <h3>
                    Chọn đúng nơi
                  </h3>

                  <p>
                    Tìm kiếm theo khu vực,
                    mức giá và nhu cầu.
                  </p>

                </div>

              </div>

              <div className="feature">

                <div className="feature-icon">
                  02
                </div>

                <div>

                  <h3>
                    Thông tin rõ ràng
                  </h3>

                  <p>
                    Hình ảnh, tiện nghi,
                    giá và đánh giá minh bạch.
                  </p>

                </div>

              </div>

              <div className="feature">

                <div className="feature-icon">
                  03
                </div>

                <div>

                  <h3>
                    Đặt phòng dễ dàng
                  </h3>

                  <p>
                    Hoàn tất đặt phòng
                    chỉ với vài bước.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <footer className="footer">

          <div className="footer-top">

            <div>

              <div className="footer-logo">
                ✦ STAYORA
              </div>

              <p>
                Một nơi để ở.
                <br />
                Một lý do để trở lại Đà Lạt.
              </p>

            </div>

            <div className="footer-column">

              <h4>
                STAYORA
              </h4>

              <span>
                Về chúng tôi
              </span>

              <span>
                Điều khoản
              </span>

              <span>
                Chính sách bảo mật
              </span>

            </div>

            <div className="footer-column">

              <h4>
                HỖ TRỢ
              </h4>

              <span>
                Trung tâm trợ giúp
              </span>

              <span>
                Liên hệ
              </span>

              <span>
                Câu hỏi thường gặp
              </span>

            </div>

          </div>

          <div className="copyright">
            © 2026 STAYORA. Nền tảng đặt phòng Đà Lạt.
          </div>

        </footer>

      </main>

      {/* ==================================================
          AUTH
      ================================================== */}

      {showAuth && (
        <Auth
          mode={authMode}
          onClose={() =>
            setShowAuth(false)
          }
          onChangeMode={(mode) =>
            setAuthMode(mode)
          }
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* ==================================================
          ACCOUNT CENTER
      ================================================== */}

      {showAccountCenter &&
        currentUser && (
          <AccountCenter
            user={currentUser}
            onClose={() =>
              setShowAccountCenter(false)
            }
            onUpdateUser={(updatedUser) => {
              setCurrentUser(updatedUser);
            }}
          />
        )}

    </div>
  );
}

export default App;