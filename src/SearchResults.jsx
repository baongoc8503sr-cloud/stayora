import { useMemo, useState } from "react";
import FavoriteButton from "./FavoriteButton";

function SearchResults({
  area,
  checkIn,
  checkOut,
  guests,
  onViewDetail,
}) {
  const stays = [
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
      amenities: ["WiFi", "Bãi đỗ xe", "Ban công"],
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
      amenities: ["WiFi", "Bữa sáng", "Ban công"],
      rooms: ["Phòng Standard", "Phòng Deluxe"],
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
      amenities: ["WiFi", "Hồ bơi", "Bãi đỗ xe"],
      rooms: [
        "Phòng Deluxe View Đồi",
        "Phòng Family",
        "Villa nguyên căn",
      ],
    },
    {
      id: 4,
      name: "An Nhiên House",
      area: "Hồ Xuân Hương",
      type: "Homestay",
      price: 780000,
      rating: 4.7,
      reviews: 82,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
      amenities: ["WiFi", "Bữa sáng", "Bãi đỗ xe"],
      rooms: ["Phòng Standard", "Phòng Deluxe"],
    },
    {
      id: 5,
      name: "Lặng House Đà Lạt",
      area: "Chợ Đà Lạt",
      type: "Khách sạn",
      price: 890000,
      rating: 4.8,
      reviews: 113,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      amenities: ["WiFi", "Bữa sáng", "Lễ tân 24/7"],
      rooms: [
        "Phòng Standard",
        "Phòng Deluxe",
        "Phòng Family",
      ],
    },
    {
      id: 6,
      name: "Forest View Villa",
      area: "Tà Nung",
      type: "Villa",
      price: 1450000,
      rating: 5.0,
      reviews: 51,
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
      amenities: ["WiFi", "Hồ bơi", "Ban công"],
      rooms: [
        "Phòng Deluxe View Đồi",
        "Phòng Family",
        "Villa nguyên căn",
      ],
    },

{
  id: 9,
  name: "Mộc Nhiên Homestay",
  area: "Trung tâm Đà Lạt",
  type: "Homestay",
  price: 580000,
  rating: 4.7,
  reviews: 67,
  image:
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Ban công"],
  rooms: [
    "Phòng Standard",
    "Phòng Deluxe",
  ],
},

{
  id: 10,
  name: "Thung Lũng Xanh Villa",
  area: "Tà Nung",
  type: "Villa",
  price: 1350000,
  rating: 4.9,
  reviews: 89,
  image:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Hồ bơi", "Bãi đỗ xe"],
  rooms: [
    "Phòng Family",
    "Villa nguyên căn",
  ],
},

{
  id: 11,
  name: "Gió Thông House",
  area: "Trại Mát",
  type: "Homestay",
  price: 620000,
  rating: 4.8,
  reviews: 72,
  image:
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Bữa sáng", "Ban công"],
  rooms: [
    "Phòng Standard",
    "Phòng Deluxe",
  ],
},

{
  id: 12,
  name: "Nhà Gỗ Đồi Thông",
  area: "Trại Mát",
  type: "Homestay",
  price: 750000,
  rating: 4.9,
  reviews: 94,
  image:
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Bãi đỗ xe", "Ban công"],
  rooms: [
    "Phòng Standard",
    "Phòng Deluxe View Đồi",
  ],
},

{
  id: 13,
  name: "Lavender Garden Hotel",
  area: "Hồ Xuân Hương",
  type: "Khách sạn",
  price: 980000,
  rating: 4.6,
  reviews: 105,
  image:
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Bữa sáng", "Lễ tân 24/7"],
  rooms: [
    "Phòng Standard",
    "Phòng Deluxe",
    "Phòng Family",
  ],
},

{
  id: 14,
  name: "Mây Rừng Retreat",
  area: "Tà Nung",
  type: "Villa",
  price: 1750000,
  rating: 4.9,
  reviews: 63,
  image:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Hồ bơi", "Bãi đỗ xe"],
  rooms: [
    "Phòng Family",
    "Villa nguyên căn",
  ],
},

{
  id: 15,
  name: "Nhà Nhỏ Đà Lạt",
  area: "Chợ Đà Lạt",
  type: "Homestay",
  price: 490000,
  rating: 4.5,
  reviews: 48,
  image:
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Ban công"],
  rooms: [
    "Phòng Standard",
  ],
},

{
  id: 16,
  name: "Pine Hill Hotel",
  area: "Trung tâm Đà Lạt",
  type: "Khách sạn",
  price: 1100000,
  rating: 4.8,
  reviews: 126,
  image:
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Bữa sáng", "Lễ tân 24/7"],
  rooms: [
    "Phòng Standard",
    "Phòng Deluxe",
    "Phòng Family",
  ],
},

{
  id: 17,
  name: "An Mộc Villa",
  area: "Hồ Xuân Hương",
  type: "Villa",
  price: 1250000,
  rating: 4.7,
  reviews: 58,
  image:
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Bãi đỗ xe", "Ban công"],
  rooms: [
    "Phòng Deluxe View Đồi",
    "Phòng Family",
    "Villa nguyên căn",
  ],
},

{
  id: 18,
  name: "Đồi Mơ Homestay",
  area: "Chợ Đà Lạt",
  type: "Homestay",
  price: 680000,
  rating: 4.8,
  reviews: 81,
  image:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
  amenities: ["WiFi", "Bữa sáng", "Ban công"],
  rooms: [
    "Phòng Standard",
    "Phòng Deluxe",
  ],
},
  ];

  const amenityOptions = [
    "WiFi",
    "Bãi đỗ xe",
    "Bữa sáng",
    "Ban công",
    "Hồ bơi",
    "Lễ tân 24/7",
  ];

  function formatDate(date) {
    if (!date) {
      return "Chọn ngày";
    }

    return new Date(date).toLocaleDateString("vi-VN");
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price);
  }

  const [selectedArea, setSelectedArea] = useState(
    area || "Tất cả"
  );

  const [propertyType, setPropertyType] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState("Tất cả");
  const [ratingFilter, setRatingFilter] = useState("Tất cả");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");

  function toggleAmenity(amenity) {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  }

  const filteredStays = useMemo(() => {
    let result = stays.filter((stay) => {
      // Khu vực
      if (
        selectedArea !== "Tất cả" &&
        stay.area !== selectedArea
      ) {
        return false;
      }

      // Loại chỗ nghỉ
      if (
        propertyType !== "Tất cả" &&
        stay.type !== propertyType
      ) {
        return false;
      }

      // Giá
      if (priceRange === "under500" && stay.price >= 500000) {
        return false;
      }

      if (
        priceRange === "500-800" &&
        (stay.price < 500000 || stay.price > 800000)
      ) {
        return false;
      }

      if (
        priceRange === "800-1200" &&
        (stay.price <= 800000 || stay.price > 1200000)
      ) {
        return false;
      }

      if (
        priceRange === "over1200" &&
        stay.price <= 1200000
      ) {
        return false;
      }

      // Đánh giá
      if (
        ratingFilter !== "Tất cả" &&
        stay.rating < Number(ratingFilter)
      ) {
        return false;
      }

      // Tiện nghi
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((amenity) =>
          stay.amenities.includes(amenity)
        )
      ) {
        return false;
      }

      return true;
    });

    // Sắp xếp
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    selectedArea,
    propertyType,
    priceRange,
    ratingFilter,
    selectedAmenities,
    sortBy,
  ]);

  return (
    <div className="old-search-results-page">
      {/* ================= HEADER ================= */}
      <header className="old-results-header">
        <div className="old-results-logo">
          STAYORA
        </div>

        <nav className="old-results-nav">
          <span>Trang chủ</span>
          <span>Khám phá</span>
          <span>Đặt phòng của tôi</span>
          <span>♡ Yêu thích</span>
        </nav>
      </header>

      {/* ================= SEARCH BAR ================= */}
      <div className="old-search-bar">
        <div className="old-search-item">
          <span className="old-search-icon">📍</span>

          <div>
            <small>Khu vực</small>
            <strong>
              {selectedArea === "Tất cả"
                ? "Đà Lạt"
                : selectedArea}
            </strong>
          </div>
        </div>

        <div className="old-search-item">
          <span className="old-search-icon">🗓️</span>

          <div>
            <small>Nhận phòng</small>
            <strong>{formatDate(checkIn)}</strong>
          </div>
        </div>

        <div className="old-search-item">
          <span className="old-search-icon">🗓️</span>

          <div>
            <small>Trả phòng</small>
            <strong>{formatDate(checkOut)}</strong>
          </div>
        </div>

        <div className="old-search-item">
          <span className="old-search-icon">👤</span>

          <div>
            <small>Khách</small>
            <strong>{guests || "2 khách"}</strong>
          </div>
        </div>

        <button
          type="button"
          className="old-search-button"
        >
          Tìm phòng
        </button>
      </div>

      {/* ================= TITLE ================= */}
      <main className="old-results-container">
        <div className="old-results-title">
          <div>
            <p className="old-eyebrow">
              STAYORA · ĐÀ LẠT
            </p>

            <h1>Chỗ nghỉ tại Đà Lạt</h1>

            <p>
              Tìm thấy {filteredStays.length} chỗ nghỉ phù hợp với bạn
            </p>
          </div>

          <select
  className="old-sort-select"
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
>
  <option value="recommended">Đề xuất</option>
  <option value="price-low">Giá thấp đến cao</option>
  <option value="price-high">Giá cao đến thấp</option>
  <option value="rating">Đánh giá cao nhất</option>
</select>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="old-results-layout">

          {/* ================= FILTER ================= */}
          <aside className="old-filter-sidebar">
            <div className="old-filter-header">
              <h2>Bộ lọc</h2>

              <button
                type="button"
                onClick={() => {
                  setSelectedArea(area || "Tất cả");
                  setPropertyType("Tất cả");
                  setPriceRange("Tất cả");
                  setRatingFilter("Tất cả");
                  setSelectedAmenities([]);
                  setSortBy("recommended");
                }}
              >
                Xóa
              </button>
            </div>

            {/* KHU VỰC */}
            <div className="old-filter-group">
              <h3>Khu vực</h3>

              {[
                "Trung tâm Đà Lạt",
                "Hồ Xuân Hương",
                "Chợ Đà Lạt",
                "Trại Mát",
                "Tà Nung",
              ].map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={selectedArea === item}
                    onChange={() => {
                      setSelectedArea(
                        selectedArea === item
                          ? "Tất cả"
                          : item
                      );
                    }}
                  />

                  <span>{item}</span>
                </label>
              ))}
            </div>

            {/* LOẠI CHỖ NGHỈ */}
            <div className="old-filter-group">
              <h3>Loại chỗ nghỉ</h3>

              {[
                "Tất cả",
                "Homestay",
                "Villa",
                "Khách sạn",
              ].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="propertyType"
                    value={type}
                    checked={propertyType === type}
                    onChange={(e) =>
                      setPropertyType(e.target.value)
                    }
                  />

                  <span>{type}</span>
                </label>
              ))}
            </div>

            {/* MỨC GIÁ */}
            <div className="old-filter-group">
              <h3>Mức giá</h3>

              {[
                ["Tất cả", "Tất cả"],
                ["under500", "Dưới 500.000đ"],
                ["500-800", "500.000đ - 800.000đ"],
                [
                  "800-1200",
                  "Trên 800.000đ - 1.200.000đ",
                ],
                ["over1200", "Trên 1.200.000đ"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="priceRange"
                    value={value}
                    checked={priceRange === value}
                    onChange={(e) =>
                      setPriceRange(e.target.value)
                    }
                  />

                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* ĐÁNH GIÁ */}
            <div className="old-filter-group">
              <h3>Đánh giá</h3>

              {["Tất cả", "5", "4.5", "4", "3"].map(
                (rating) => (
                  <label key={rating}>
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={ratingFilter === rating}
                      onChange={(e) =>
                        setRatingFilter(e.target.value)
                      }
                    />

                    <span>
                      {rating === "Tất cả"
                        ? "Tất cả"
                        : `⭐ ${rating} trở lên`}
                    </span>
                  </label>
                )
              )}
            </div>

            {/* TIỆN NGHI */}
            <div className="old-filter-group">
              <h3>Tiện nghi</h3>

              {amenityOptions.map((amenity) => (
                <label key={amenity}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(
                      amenity
                    )}
                    onChange={() =>
                      toggleAmenity(amenity)
                    }
                  />

                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* ================= RESULT CARDS ================= */}
          <section className="old-results-content">
            {filteredStays.length === 0 ? (
              <div className="old-no-results">
                <h2>Không tìm thấy chỗ nghỉ</h2>

                <p>
                  Hãy thử thay đổi bộ lọc để xem thêm lựa chọn.
                </p>
              </div>
            ) : (
              <div className="old-results-grid">
                {filteredStays.map((stay) => (
                  <article
                    className="old-result-card"
                    key={stay.id}
                  >
                    {/* ẢNH */}
                    <div className="old-result-image">
                      <img
                        src={stay.image}
                        alt={stay.name}
                      />

                      <div className="old-result-type">
                        {stay.type}
                      </div>

                      <div className="old-favorite">
                        <FavoriteButton stay={stay} />
                      </div>
                    </div>

                    {/* THÔNG TIN */}
                    <div className="old-result-info">
                      <div className="old-result-name-row">
                        <h2>{stay.name}</h2>

                        <div className="old-rating">
                          ★ {stay.rating}
                        </div>
                      </div>

                      <p className="old-result-location">
                        📍 {stay.area}
                      </p>

                      <p className="old-review-count">
                        {stay.reviews} đánh giá
                      </p>

                      <div className="old-result-bottom">
                        <div className="old-result-price">
                          <strong>
                            {formatPrice(stay.price)}đ
                          </strong>

                          <span>/ đêm</span>
                        </div>

                        {/* GIỮ NGUYÊN LOGIC TRUYỀN STAY */}
                        <button
                          type="button"
                          className="old-view-detail-button"
                          onClick={() =>
                            onViewDetail(stay)
                          }
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ================= GIAO DIỆN ẢNH 1 ================= */}
      <style>{`
        .old-search-results-page {
          min-height: 100vh;
          background: #f8f7f3;
          color: #171717;
          font-family: Arial, Helvetica, sans-serif;
        }

        .old-results-header {
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #e9e6df;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 68px;
          box-sizing: border-box;
        }

        .old-results-logo {
          font-size: 27px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .old-results-nav {
          display: flex;
          align-items: center;
          gap: 32px;
          font-size: 14px;
          color: #262626;
        }

        .old-results-nav span {
          cursor: pointer;
        }

        .old-search-bar {
          width: calc(100% - 136px);
          max-width: 990px;
          min-height: 96px;
          margin: 28px auto 0;
          background: #ffffff;
          border: 1px solid #dedbd4;
          border-radius: 17px;
          display: flex;
          align-items: stretch;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .old-search-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 16px 24px;
          border-right: 1px solid #e6e2dc;
          min-width: 0;
        }

        .old-search-icon {
          font-size: 19px;
        }

        .old-search-item div {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }

        .old-search-item small {
          color: #9b9891;
          font-size: 11px;
        }

        .old-search-item strong {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .old-search-button {
          width: 116px;
          margin: 17px 11px;
          border: none;
          border-radius: 11px;
          background: #202020;
          color: white;
          font-weight: 700;
          cursor: pointer;
          font-size: 13px;
        }

        .old-results-container {
          width: calc(100% - 136px);
          max-width: 990px;
          margin: 45px auto 70px;
        }

        .old-results-title {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 27px;
        }

        .old-eyebrow {
          margin: 0 0 9px;
          font-size: 10px;
          letter-spacing: 3px;
          color: #8f8b84;
          font-weight: 700;
        }

        .old-results-title h1 {
          margin: 0;
          font-size: 31px;
          font-weight: 600;
          letter-spacing: -1px;
        }

        .old-results-title p:not(.old-eyebrow) {
          margin: 7px 0 0;
          color: #8b8882;
          font-size: 13px;
        }

        .old-sort-select {
          height: 41px;
          min-width: 158px;
          padding: 0 13px;
          background: white;
          border: 1px solid #d9d5ce;
          border-radius: 9px;
          font-size: 13px;
          color: #333;
          outline: none;
        }

        .old-results-layout {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 28px;
          align-items: start;
        }

        .old-filter-sidebar {
          background: #ffffff;
          border: 1px solid #dfdcd6;
          border-radius: 14px;
          padding: 21px 20px;
          box-sizing: border-box;
        }

        .old-filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid #e8e5df;
        }

        .old-filter-header h2 {
          margin: 0;
          font-size: 18px;
        }

        .old-filter-header button {
          border: none;
          background: transparent;
          color: #8b8882;
          font-size: 12px;
          cursor: pointer;
        }

        .old-filter-group {
          padding: 19px 0;
          border-bottom: 1px solid #ebe8e2;
        }

        .old-filter-group:last-child {
          border-bottom: none;
        }

        .old-filter-group h3 {
          margin: 0 0 15px;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
        }

        .old-filter-group label {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 11px 0;
          color: #68655f;
          font-size: 12px;
          line-height: 1.35;
          cursor: pointer;
        }

        .old-filter-group input {
          width: 15px;
          height: 15px;
          margin: 0;
          accent-color: #3e72e8;
          cursor: pointer;
          flex-shrink: 0;
        }

        .old-results-content {
          min-width: 0;
        }

        .old-results-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .old-result-card {
          background: #ffffff;
          border: 1px solid #dedbd5;
          border-radius: 15px;
          overflow: hidden;
          min-width: 0;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .old-result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
        }

        .old-result-image {
          height: 224px;
          position: relative;
          overflow: hidden;
          background: #eee;
        }

        .old-result-image > img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .old-result-type {
          position: absolute;
          left: 14px;
          bottom: 14px;
          background: rgba(255, 255, 255, 0.96);
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 600;
        }

        .old-favorite {
          position: absolute;
          right: 12px;
          top: 12px;
        }

        .old-favorite button {
          width: 37px !important;
          height: 37px !important;
        }

        .old-result-info {
          padding: 16px 16px 15px;
        }

        .old-result-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .old-result-name-row h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
        }

        .old-rating {
          flex-shrink: 0;
          font-size: 12px;
          font-weight: 600;
        }

        .old-result-location {
          margin: 8px 0 0;
          color: #77736d;
          font-size: 12px;
        }

        .old-review-count {
          margin: 21px 0 19px;
          text-align: center;
          color: #aaa69e;
          font-size: 11px;
        }

        .old-result-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .old-result-price {
          display: flex;
          align-items: baseline;
          gap: 3px;
        }

        .old-result-price strong {
          font-size: 15px;
        }

        .old-result-price span {
          font-size: 11px;
          color: #8e8a84;
        }

        .old-view-detail-button {
          height: 34px;
          padding: 0 14px;
          background: #ffffff;
          border: 1px solid #262626;
          border-radius: 8px;
          color: #222;
          font-size: 11px;
          cursor: pointer;
          white-space: nowrap;
        }

        .old-view-detail-button:hover {
          background: #222;
          color: white;
        }

        .old-no-results {
          background: white;
          border: 1px solid #dfdcd6;
          border-radius: 14px;
          padding: 60px 30px;
          text-align: center;
        }

        .old-no-results h2 {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .old-no-results p {
          margin: 0;
          color: #888;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .old-results-header {
            padding: 0 25px;
          }

          .old-results-nav {
            gap: 15px;
          }

          .old-search-bar,
          .old-results-container {
            width: calc(100% - 40px);
          }

          .old-results-layout {
            grid-template-columns: 190px minmax(0, 1fr);
          }

          .old-results-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .old-results-header {
            height: auto;
            padding: 20px;
            flex-direction: column;
            gap: 18px;
          }

          .old-results-nav {
            flex-wrap: wrap;
            justify-content: center;
          }

          .old-search-bar {
            width: calc(100% - 30px);
            flex-direction: column;
          }

          .old-search-item {
            border-right: none;
            border-bottom: 1px solid #e6e2dc;
          }

          .old-search-button {
            height: 45px;
            width: auto;
          }

          .old-results-container {
            width: calc(100% - 30px);
          }

          .old-results-title {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .old-results-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchResults;