const defaultHostNames = [
  "Nguyễn Minh Anh", "Trần Ngọc Mai", "Lê Hoàng Nam", "Phạm Thu Hà",
  "Đỗ Quốc Bảo", "Vũ Thanh Tùng", "Đặng Khánh Linh", "Bùi Gia Huy",
  "Hoàng Phương Thảo", "Hồ Tuấn Kiệt", "Nguyễn Thanh Vy", "Trần Đức Minh",
  "Lê Bảo Ngọc", "Phạm Quang Hưng", "Đỗ Mỹ Linh", "Vũ Anh Khoa",
];

export const initialStays = [
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
  ].map((stay, index) => ({
    ...stay,
    owner: stay.owner || defaultHostNames[index],
  }));
