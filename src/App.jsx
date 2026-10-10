import { useEffect, useState } from "react";
import "./App.css";
import SearchResults from "./SearchResults";
import StayDetail from "./StayDetail";
import Auth from "./Auth.jsx";
import AccountCenter from "./AccountCenter.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import { initialStays } from "./StayCatalog";
import { ensureDemoData, getStayCatalog } from "./stayoraData";

function App() {
  const [homeStays, setHomeStays] = useState(() => {
    ensureDemoData(initialStays);
    return getStayCatalog(initialStays).filter((stay) => stay.isActive !== false);
  });
  const [selectedStay, setSelectedStay] = useState(null);
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.pathname.replace(/\/+$/, "") === "/admin"
  );

  useEffect(() => {
    const syncCatalog = (event) => {
      if (!event || event.type === "storage" || event.detail?.key === "stayoraManagedStays" || event.detail?.key === "stayoraReviews") {
        setHomeStays(getStayCatalog(initialStays).filter((stay) => stay.isActive !== false));
        setSelectedStay((current) => {
          if (!current) return current;
          return getStayCatalog(initialStays).find(
            (stay) => String(stay.id) === String(current.id)
          ) || current;
        });
      }
    };
    const syncRoute = () => {
      setIsAdmin(window.location.pathname.replace(/\/+$/, "") === "/admin");
    };

    window.addEventListener("popstate", syncRoute);
    window.addEventListener("storage", syncCatalog);
    window.addEventListener("stayora-data-changed", syncCatalog);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("storage", syncCatalog);
      window.removeEventListener("stayora-data-changed", syncCatalog);
    };
  }, []);

  // =========================
  // SEARCH
  // =========================
  const [area, setArea] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 khách");

  const [showResults, setShowResults] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // =========================
  // AUTH
  // =========================
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [showAccountCenter, setShowAccountCenter] = useState(false);

  // =========================
  // KIỂM TRA ĐĂNG NHẬP
  // =========================
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("stayoraCurrentUser");

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Không thể đọc thông tin tài khoản:", error);
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
    // Xóa khu vực đang chọn để SearchResults
    // hiển thị toàn bộ chỗ nghỉ
    setArea("");

    setShowDetail(false);
    setSelectedStay(null);
    setShowResults(true);
  }

  // =========================
  // XEM CHI TIẾT CHỖ NGHỈ
  // =========================
  function handleViewDetail(stay) {
    // Lưu đúng chỗ nghỉ người dùng vừa click
    setSelectedStay(stay);

    // Đóng trang kết quả
    setShowResults(false);

    // Mở trang chi tiết
    setShowDetail(true);
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

  if (isAdmin) {
    return (
      <AdminDashboard
        onExit={() => {
          localStorage.removeItem("stayoraCurrentUser");
          sessionStorage.removeItem("stayoraCurrentUser");
          setCurrentUser(null);
          setShowAccountCenter(false);
          window.history.pushState({}, "", "/");
          setIsAdmin(false);
        }}
      />
    );
  }

  // =========================
  // DETAIL PAGE
  // =========================
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

  // =========================
  // SEARCH RESULTS PAGE
  // =========================
  if (showResults) {
    return (
      <SearchResults
        area={area}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        stays={homeStays}
        onViewDetail={handleViewDetail}
      />
    );
  }

  // =========================
  // HOME PAGE
  // =========================
  return (
    <div className="app">
      {/* =========================
          HEADER
      ========================== */}
      <header className="header">
        <div className="logo">
          <span>✦</span>
          STAYORA
        </div>

        <nav className="nav">
          <a href="#home">Trang chủ</a>
          <a href="#explore">Khám phá</a>
          <a href="#booking">Đặt phòng của tôi</a>
          <a href="#favorite">♡ Yêu thích</a>
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
              onClick={() => setShowAccountCenter(true)}
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

      {/* =========================
          MAIN
      ========================== */}
      <main>
        {/* =========================
            HERO
        ========================== */}
        <section className="hero" id="home">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <p className="hero-small">STAYORA • ĐÀ LẠT</p>

            <h1>
              Tìm một nơi
              <br />
              <span>để yêu Đà Lạt.</span>
            </h1>

            <p className="hero-description">
              Khám phá những homestay và khách sạn được
              tuyển chọn tại Đà Lạt cho chuyến đi của bạn.
            </p>

            {/* SEARCH BOX */}
            <div className="search-box">
              <div className="search-item">
                <label>📍 KHU VỰC</label>

                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
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
                <label>📅 NHẬN PHÒNG</label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div className="search-item">
                <label>📅 TRẢ PHÒNG</label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <div className="search-item">
                <label>👤 KHÁCH</label>

                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
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

        {/* =========================
            FEATURED STAYS
        ========================== */}
        <section className="section" id="explore">
          <div className="section-heading">
            <div>
              <p className="section-label">
                ĐƯỢC YÊU THÍCH
              </p>

              <h2>Chỗ nghỉ nổi bật</h2>
              <p>{homeStays.length} chỗ nghỉ đang mở đặt phòng</p>
            </div>

            {/* CLICK XEM TẤT CẢ */}
            <button
              type="button"
              className="view-all"
              onClick={handleViewAll}
            >
              Xem tất cả →
            </button>
          </div>

          {/* TRANG CHỦ CHỈ HIỂN THỊ 3 CARD */}
          <div className="hotel-grid">
            {homeStays.slice(0, 3).map((stay, index) => (
              <article className="hotel-card" key={stay.id}>
                <div
                  className="hotel-image"
                  style={{ backgroundImage: `url("${stay.image}")` }}
                >
                  <FavoriteButton stay={stay} />
                  {index === 0 && <span className="hotel-tag">Nổi bật</span>}
                </div>
                <div className="hotel-info">
                  <div className="hotel-title">
                    <h3>{stay.name}</h3>
                    <span>⭐ {Number(stay.rating).toFixed(1)}</span>
                  </div>
                  <p>📍 {stay.area}, Đà Lạt</p>
                  <div className="hotel-price">
                    <strong>{new Intl.NumberFormat("vi-VN").format(stay.price)}đ</strong>
                    <span>/ đêm</span>
                  </div>
                  <button type="button" className="view-all" onClick={() => handleViewDetail(stay)}>
                    Xem chi tiết →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =========================
            EXPLORE DALAT
        ========================== */}
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
              Từ những con dốc phủ đầy hoa đến những căn
              homestay giữa rừng thông, hãy tìm một nơi
              khiến bạn muốn ở lại lâu hơn.
            </p>

            <button
              type="button"
              className="dark-btn"
            >
              Khám phá Đà Lạt →
            </button>
          </div>
        </section>

        {/* =========================
            POPULAR AREAS
        ========================== */}
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="section-label">
                KHU VỰC
              </p>

              <h2>Ở đâu tại Đà Lạt?</h2>
            </div>
          </div>

          <div className="area-grid">
            <div className="area-card area-center">
              <div>
                <h3>Trung tâm Đà Lạt</h3>

                <p>
                  Gần chợ • Hồ Xuân Hương
                </p>
              </div>
            </div>

            <div className="area-card area-trai-mat">
              <div>
                <h3>Trại Mát</h3>

                <p>
                  Rừng thông • Yên bình
                </p>
              </div>
            </div>

            <div className="area-card area-ta-nung">
              <div>
                <h3>Tà Nung</h3>

                <p>
                  Thiên nhiên • Nghỉ dưỡng
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            WHY STAYORA
        ========================== */}
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
              STAYORA giúp bạn tìm được nơi lưu trú phù hợp
              với cách bạn muốn trải nghiệm Đà Lạt.
            </p>

            <div className="features">
              <div className="feature">
                <div className="feature-icon">
                  01
                </div>

                <div>
                  <h3>Chọn đúng nơi</h3>

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
                  <h3>Thông tin rõ ràng</h3>

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
                  <h3>Đặt phòng dễ dàng</h3>

                  <p>
                    Hoàn tất đặt phòng
                    chỉ với vài bước.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FOOTER
        ========================== */}
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
              <h4>STAYORA</h4>

              <span>Về chúng tôi</span>

              <span>Điều khoản</span>

              <span>Chính sách bảo mật</span>
            </div>

            <div className="footer-column">
              <h4>HỖ TRỢ</h4>

              <span>Trung tâm trợ giúp</span>

              <span>Liên hệ</span>

              <span>Câu hỏi thường gặp</span>
            </div>

            <div className="footer-column">
              <h4>QUẢN LÝ</h4>
              <a href="/admin">Trang quản trị</a>
            </div>
          </div>

          <div className="copyright">
            © 2026 STAYORA. Nền tảng đặt phòng Đà Lạt.
          </div>
        </footer>
      </main>

      {/* =========================
          AUTH
      ========================== */}
      {showAuth && (
        <Auth
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onChangeMode={(mode) => setAuthMode(mode)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* =========================
          ACCOUNT CENTER
      ========================== */}
      {showAccountCenter && currentUser && (
        <AccountCenter
          user={currentUser}
          onClose={() => setShowAccountCenter(false)}
          onUpdateUser={(updatedUser) => {
            setCurrentUser(updatedUser);
          }}
        />
      )}
    </div>
  );
}

export default App;