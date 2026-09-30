import React from "react";

const stays = [
  {
    id: 1,
    name: "The Pine House",
    area: "Trung tâm Đà Lạt",
    type: "Homestay",
    price: "650.000đ",
    rating: "4.9",
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Mây Đà Lạt Homestay",
    area: "Trại Mát",
    type: "Homestay",
    price: "520.000đ",
    rating: "4.8",
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "The Hill Villa",
    area: "Tà Nung",
    type: "Villa",
    price: "1.200.000đ",
    rating: "4.9",
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "An Nhiên House",
    area: "Hồ Xuân Hương",
    type: "Homestay",
    price: "780.000đ",
    rating: "4.7",
    reviews: 82,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Lặng House Đà Lạt",
    area: "Chợ Đà Lạt",
    type: "Khách sạn",
    price: "890.000đ",
    rating: "4.8",
    reviews: 113,
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Forest View Villa",
    area: "Tà Nung",
    type: "Villa",
    price: "1.450.000đ",
    rating: "5.0",
    reviews: 51,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
  },
];

function SearchResults({
  area,
  checkIn,
  checkOut,
  guests,
  onViewDetail,
}) {
    function formatDate(date) {
  if (!date) return "Chọn ngày";

  return new Date(date + "T00:00:00").toLocaleDateString("vi-VN");
}
  return (
    <div className="search-page">
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

      {/* SEARCH BAR */}
      <section className="results-search">
        <div className="results-search-item">
          <span>📍</span>
          <div>
            <small>Khu vực</small>
            <strong>{area}</strong>
          </div>
        </div>

        <div className="results-search-item">
          <span>📅</span>
          <div>
            <small>Nhận phòng</small>
            <strong>{formatDate(checkIn)}</strong>
          </div>
        </div>

        <div className="results-search-item">
          <span>📅</span>
          <div>
            <small>Trả phòng</small>
            <strong>{formatDate(checkOut)}</strong>
          </div>
        </div>

        <div className="results-search-item">
          <span>👤</span>
          <div>
            <small>Khách</small>
            <strong>{guests}</strong>
          </div>
        </div>

        <button className="search-again">Tìm phòng</button>
      </section>

      {/* MAIN */}
      <main className="results-container">
        <div className="results-heading">
          <div>
            <p className="eyebrow">STAYORA · ĐÀ LẠT</p>
            <h1>Chỗ nghỉ tại Đà Lạt</h1>
            <p className="result-count">
              Tìm thấy {stays.length} chỗ nghỉ phù hợp với bạn
            </p>
          </div>

          <select className="sort-select">
            <option>Sắp xếp: Đề xuất</option>
            <option>Giá thấp đến cao</option>
            <option>Giá cao đến thấp</option>
            <option>Đánh giá cao nhất</option>
          </select>
        </div>

        <div className="results-layout">
          {/* FILTER */}
          <aside className="filter-box">
            <div className="filter-title">
              <h3>Bộ lọc</h3>
              <button>Xóa</button>
            </div>

            <div className="filter-group">
              <h4>Khu vực</h4>

              <label>
                <input type="checkbox" />
                Trung tâm Đà Lạt
              </label>

              <label>
                <input type="checkbox" />
                Hồ Xuân Hương
              </label>

              <label>
                <input type="checkbox" />
                Chợ Đà Lạt
              </label>

              <label>
                <input type="checkbox" />
                Trại Mát
              </label>

              <label>
                <input type="checkbox" />
                Tà Nung
              </label>
            </div>

            <div className="filter-group">
              <h4>Loại chỗ nghỉ</h4>

              <label>
                <input type="checkbox" />
                Homestay
              </label>

              <label>
                <input type="checkbox" />
                Khách sạn
              </label>

              <label>
                <input type="checkbox" />
                Villa
              </label>
            </div>

            <div className="filter-group">
              <h4>Tiện nghi</h4>

              <label>
                <input type="checkbox" />
                Wi-Fi miễn phí
              </label>

              <label>
                <input type="checkbox" />
                Bãi đỗ xe
              </label>

              <label>
                <input type="checkbox" />
                Bữa sáng
              </label>

              <label>
                <input type="checkbox" />
                View đẹp
              </label>
            </div>

            <div className="filter-group">
              <h4>Mức giá</h4>

              <div className="price-inputs">
                <input placeholder="Từ" />
                <span>—</span>
                <input placeholder="Đến" />
              </div>
            </div>
          </aside>

          {/* STAYS */}
          <section className="stay-grid">
            {stays.map((stay) => (
              <article className="stay-card" key={stay.id}>
                <div className="stay-image-wrapper">
                  <img src={stay.image} alt={stay.name} />

                  <button className="heart-button">♡</button>

                  <span className="stay-type">{stay.type}</span>
                </div>

                <div className="stay-info">
                  <div className="stay-top">
                    <div>
                      <h2>{stay.name}</h2>
                      <p className="stay-location">📍 {stay.area}</p>
                    </div>

                    <div className="rating">
                      ★ {stay.rating}
                    </div>
                  </div>

                  <p className="reviews">
                    {stay.reviews} đánh giá
                  </p>

                  <div className="stay-bottom">
                    <div>
                      <strong>{stay.price}</strong>
                      <span> / đêm</span>
                    </div>

                    <button
                    className="detail-button"
                    onClick={onViewDetail}
                    >
                    Xem chi tiết
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="results-footer">
        <div>
          <h2>STAYORA</h2>
          <p>
            Tìm một nơi thật đẹp để lưu giữ những ngày đáng nhớ ở Đà Lạt.
          </p>
        </div>

        <div>
          <h4>Khám phá</h4>
          <a href="#">Chỗ nghỉ</a>
          <a href="#">Khu vực</a>
          <a href="#">Ưu đãi</a>
        </div>

        <div>
          <h4>Hỗ trợ</h4>
          <a href="#">Trung tâm trợ giúp</a>
          <a href="#">Điều khoản</a>
          <a href="#">Chính sách</a>
        </div>
      </footer>
    </div>
  );
}

export default SearchResults;