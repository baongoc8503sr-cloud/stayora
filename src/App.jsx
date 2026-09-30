import { useState } from 'react'
import './App.css'
import SearchResults from "./SearchResults";
import StayDetail from "./StayDetail";
function App() {
 const [area, setArea] = useState('')
const [checkIn, setCheckIn] = useState('')
const [checkOut, setCheckOut] = useState('')
const [guests, setGuests] = useState('2 khách')
const [showResults, setShowResults] = useState(false)
const [showDetail, setShowDetail] = useState(false)
 function handleSearch() {
  if (!area) {
    alert("Vui lòng chọn khu vực tại Đà Lạt");
    return;
  }

  setShowResults(true);
}

 if (showDetail) {
  return <StayDetail />;
}

if (showResults) {
  return (
  <SearchResults
  area={area}
  checkIn={checkIn}
  checkOut={checkOut}
  guests={guests}
  onViewDetail={() => setShowDetail(true)}
/>
  );
}
  return (
    <div className="app">

      {/* HEADER */}
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
          <button className="login-btn">
            Đăng nhập
          </button>

          <button className="signup-btn">
            Đăng ký
          </button>
        </div>

      </header>


      {/* MAIN */}
      <main>

        {/* HERO */}
        <section className="hero" id="home">

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
                className="search-btn"
                onClick={handleSearch}
              >
                Tìm phòng
              </button>

            </div>

          </div>

        </section>


        {/* FEATURED STAYS */}
        <section className="section" id="explore">

          <div className="section-heading">

            <div>
              <p className="section-label">
                ĐƯỢC YÊU THÍCH
              </p>

              <h2>
                Chỗ nghỉ nổi bật
              </h2>
            </div>

            <button className="view-all">
              Xem tất cả →
            </button>

          </div>


          <div className="hotel-grid">


            {/* HOTEL 1 */}
            <div className="hotel-card">

              <div className="hotel-image hotel-1">

                <span className="favorite">
                  ♡
                </span>

                <span className="hotel-tag">
                  Nổi bật
                </span>

              </div>

              <div className="hotel-info">

                <div className="hotel-title">

                  <h3>
                    The Pine House
                  </h3>

                  <span>
                    ⭐ 4.9
                  </span>

                </div>

                <p>
                  📍 Trại Mát, Đà Lạt
                </p>

                <div className="hotel-price">

                  <strong>
                    850.000đ
                  </strong>

                  <span>
                    / đêm
                  </span>

                </div>

              </div>

            </div>


            {/* HOTEL 2 */}
            <div className="hotel-card">

              <div className="hotel-image hotel-2">

                <span className="favorite">
                  ♡
                </span>

              </div>

              <div className="hotel-info">

                <div className="hotel-title">

                  <h3>
                    Mây Đà Lạt Homestay
                  </h3>

                  <span>
                    ⭐ 4.8
                  </span>

                </div>

                <p>
                  📍 Phường 4, Đà Lạt
                </p>

                <div className="hotel-price">

                  <strong>
                    690.000đ
                  </strong>

                  <span>
                    / đêm
                  </span>

                </div>

              </div>

            </div>


            {/* HOTEL 3 */}
            <div className="hotel-card">

              <div className="hotel-image hotel-3">

                <span className="favorite">
                  ♡
                </span>

              </div>

              <div className="hotel-info">

                <div className="hotel-title">

                  <h3>
                    The Hill Villa
                  </h3>

                  <span>
                    ⭐ 4.9
                  </span>

                </div>

                <p>
                  📍 Tà Nung, Đà Lạt
                </p>

                <div className="hotel-price">

                  <strong>
                    1.450.000đ
                  </strong>

                  <span>
                    / đêm
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* EXPLORE DALAT */}
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

            <button className="dark-btn">
              Khám phá Đà Lạt →
            </button>

          </div>

        </section>


        {/* POPULAR AREAS */}
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
                <h3>Trung tâm Đà Lạt</h3>
                <p>Gần chợ • Hồ Xuân Hương</p>
              </div>
            </div>

            <div className="area-card area-trai-mat">
              <div>
                <h3>Trại Mát</h3>
                <p>Rừng thông • Yên bình</p>
              </div>
            </div>

            <div className="area-card area-ta-nung">
              <div>
                <h3>Tà Nung</h3>
                <p>Thiên nhiên • Nghỉ dưỡng</p>
              </div>
            </div>

          </div>

        </section>


        {/* WHY STAYORA */}
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


        {/* FOOTER */}
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

    </div>
  )
}

export default App