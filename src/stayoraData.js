const DEMO_USER_COUNT = 100;
const DEMO_DATA_VERSION = "v1";

function readArray(key) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Không thể đọc dữ liệu ${key}:`, error);
    return [];
  }
}

export function writeCollection(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("stayora-data-changed", { detail: { key } }));
    return true;
  } catch (error) {
    console.error(`Không thể lưu dữ liệu ${key}:`, error);
    return false;
  }
}

export function ensureDemoData(stays) {
  const accounts = readArray("stayoraAccounts");
  const existingDemoUsers = new Set(
    accounts.filter((user) => user.isDemo).map((user) => String(user.id))
  );
  const demoUsers = createDemoUsers();
  const missingUsers = demoUsers.filter((user) => !existingDemoUsers.has(String(user.id)));
  const demoHosts = createDemoHosts(stays);
  const existingHostIds = new Set(
    accounts
      .filter((user) => demoHosts.some((host) => String(host.id) === String(user.id)))
      .map((user) => String(user.id))
  );
  const missingHosts = demoHosts.filter((host) => !existingHostIds.has(String(host.id)));
  const accountsWithHostRoles = accounts.map((account) => {
    const host = demoHosts.find((item) => String(item.id) === String(account.id));
    if (!host) return account;
    if (
      account.role === "host" &&
      account.isDemo === true &&
      account.isDemoHost === true &&
      account.fullName === host.fullName &&
      String(account.hostedStayId) === String(host.hostedStayId) &&
      account.hostedStayName === host.hostedStayName
    ) {
      return account;
    }
    return {
      ...account,
      fullName: host.fullName,
      role: "host",
      isDemo: true,
      isDemoHost: true,
      hostedStayId: host.hostedStayId,
      hostedStayName: host.hostedStayName,
    };
  });
  const allAccounts = [
    ...accountsWithHostRoles,
    ...missingUsers.filter(
      (user) => !accounts.some((account) => String(account.id) === String(user.id))
    ),
    ...missingHosts.filter(
      (host) => !accounts.some((account) => String(account.id) === String(host.id))
    ),
  ];
  const hostAccountChanges = accountsWithHostRoles.some((account, index) => account !== accounts[index]);
  if (missingUsers.length || missingHosts.length || hostAccountChanges) {
    writeCollection("stayoraAccounts", allAccounts);
  }

  let savedStays = readArray("stayoraManagedStays");
  const deletedStayIds = new Set(
    readArray("stayoraDeletedStayIds").map(String)
  );
  let staysChanged = false;
  if (!savedStays.length) {
    savedStays = stays
      .filter((stay) => !deletedStayIds.has(String(stay.id)))
      .map(withRatingBaseline);
    staysChanged = true;
  } else {
    const existingIds = new Set(savedStays.map((stay) => String(stay.id)));
    const missingStays = stays
      .filter((stay) => !existingIds.has(String(stay.id)) && !deletedStayIds.has(String(stay.id)))
      .map(withRatingBaseline);
    if (missingStays.length) {
      savedStays = [...savedStays, ...missingStays];
      staysChanged = true;
    }
  }
  const hostsByStayId = new Map(demoHosts.map((host) => [String(host.hostedStayId), host]));
  const staysWithOwners = savedStays.map((stay) => {
    const host = hostsByStayId.get(String(stay.id));
    return host && !stay.owner ? { ...stay, owner: host.fullName } : stay;
  });
  if (staysWithOwners.some((stay, index) => stay !== savedStays[index])) {
    savedStays = staysWithOwners;
    staysChanged = true;
  }
  if (staysChanged) writeCollection("stayoraManagedStays", savedStays);

  const bookings = readArray("stayoraBookings");
  const demoBookings = bookings.filter((booking) => booking.isDemo);
  if (demoBookings.length < DEMO_USER_COUNT) {
    const seeded = createDemoBookings(stays);
    const existingCodes = new Set(bookings.map((booking) => booking.bookingCode));
    writeCollection("stayoraBookings", [
      ...bookings,
      ...seeded.filter((booking) => !existingCodes.has(booking.bookingCode)),
    ]);
  }

  const reviews = readArray("stayoraReviews");
  const demoReviews = reviews.filter((review) => review.isDemo);
  if (demoReviews.length < 60) {
    const existingIds = new Set(reviews.map((review) => review.id));
    writeCollection("stayoraReviews", [
      ...reviews,
      ...createDemoReviews(stays).filter((review) => !existingIds.has(review.id)),
    ]);
  }

  if (localStorage.getItem("stayoraDemoDataVersion") !== DEMO_DATA_VERSION) {
    try {
      localStorage.setItem("stayoraDemoDataVersion", DEMO_DATA_VERSION);
    } catch (error) {
      console.error("Không thể lưu phiên bản dữ liệu demo:", error);
    }
  }
}

export function getStayCatalog(baseStays) {
  const savedStays = readArray("stayoraManagedStays");
  const savedById = new Map(savedStays.map((stay) => [String(stay.id), stay]));
  const deletedStayIds = new Set(readArray("stayoraDeletedStayIds").map(String));
  const baseIds = new Set(baseStays.map((stay) => String(stay.id)));
  const stays = [
    ...baseStays.filter((stay) => !deletedStayIds.has(String(stay.id))).map((stay) => ({
      ...withRatingBaseline(stay),
      ...savedById.get(String(stay.id)),
    })),
    ...savedStays.filter(
      (stay) => !baseIds.has(String(stay.id)) && !deletedStayIds.has(String(stay.id))
    ),
  ];
  const reviewsByStay = new Map();
  readArray("stayoraReviews").forEach((review) => {
    const key = String(review.stayId);
    reviewsByStay.set(key, [...(reviewsByStay.get(key) || []), review]);
  });

  return stays.map((stay) => {
    const reviews = reviewsByStay.get(String(stay.id)) || [];
    const reviewCount = Number(stay.reviewsBase ?? stay.reviews ?? 0);
    const baseRating = Number(stay.ratingBase ?? stay.rating ?? 0);
    const totalReviews = reviewCount + reviews.length;
    const totalRating =
      baseRating * reviewCount +
      reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return {
      ...stay,
      reviews: totalReviews,
      rating: totalReviews ? Number((totalRating / totalReviews).toFixed(1)) : 0,
    };
  });
}

export function getCollection(key) {
  return readArray(key);
}

function withRatingBaseline(stay) {
  return {
    ...stay,
    ratingBase: Number(stay.ratingBase ?? stay.rating ?? 0),
    reviewsBase: Number(stay.reviewsBase ?? stay.reviews ?? 0),
  };
}

function createDemoUsers() {
  const firstNames = [
    "Minh Anh", "Ngọc Mai", "Hoàng Nam", "Thu Hà", "Quốc Bảo",
    "Thanh Tùng", "Khánh Linh", "Gia Huy", "Phương Thảo", "Tuấn Kiệt",
  ];
  const familyNames = [
    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ",
  ];
  return Array.from({ length: DEMO_USER_COUNT }, (_, index) => {
    const number = String(index + 1).padStart(3, "0");
    return {
      id: `demo-user-${number}`,
      fullName: `${familyNames[index % familyNames.length]} ${firstNames[index % firstNames.length]} ${number}`,
      email: `khach${number}@example.test`,
      phone: `09${String(10000000 + index).padStart(8, "0")}`,
      role: "customer",
      emailVerified: true,
      isDemo: true,
      createdAt: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
    };
  });
}

function createDemoHosts(stays) {
  return stays.map((stay, index) => {
    const number = String(index + 1).padStart(3, "0");
    return {
      id: `demo-host-${String(stay.id)}`,
      fullName: stay.name,
      email: `chunha${number}@example.test`,
      phone: `08${String(20000000 + index).padStart(8, "0")}`,
      role: "host",
      emailVerified: true,
      isDemo: true,
      isDemoHost: true,
      hostedStayId: stay.id,
      hostedStayName: stay.name,
      createdAt: new Date(Date.now() - (index + 1) * 7 * 86400000).toISOString(),
    };
  });
}

function createDemoBookings(stays) {
  const now = new Date();
  const users = createDemoUsers();
  return Array.from({ length: DEMO_USER_COUNT }, (_, index) => {
    const userNumber = index + 1;
    const stay = stays[index % stays.length];
    const status =
      userNumber % 20 === 0
        ? "Đã hủy"
        : userNumber % 10 === 0
          ? "Chờ xác nhận"
          : userNumber <= 60
            ? "Hoàn tất"
            : "Đã xác nhận";
    const created = new Date(now);
    if (userNumber > 5) {
      created.setMonth(created.getMonth() - ((userNumber - 5) % 6));
      created.setDate(1 + (userNumber % 25));
    }
    const checkIn = new Date(created);
    checkIn.setDate(checkIn.getDate() + (status === "Hoàn tất" ? -12 : 7));
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2);
    const nights = 2;

    return {
      bookingCode: `DEMO${String(userNumber).padStart(6, "0")}`,
      userId: `demo-user-${String(userNumber).padStart(3, "0")}`,
      stay: {
        id: stay.id,
        name: stay.name,
        area: stay.area,
        image: stay.image,
        rating: stay.rating,
      },
      selectedRoom: stay.rooms?.[0] || "Phòng Standard",
      checkIn: checkIn.toISOString().slice(0, 10),
      checkOut: checkOut.toISOString().slice(0, 10),
      nights,
      guests: 2,
      customer: {
        name: users[index].fullName,
        email: users[index].email,
        phone: users[index].phone,
      },
      totalPrice: Number(stay.price) * nights,
      status,
      createdAt: created.toISOString(),
      isDemo: true,
    };
  });
}

function createDemoReviews(stays) {
  const users = createDemoUsers();
  return Array.from({ length: 60 }, (_, index) => {
    const stay = stays[index % stays.length];
    const user = users[index];
    return {
      id: `demo-review-${String(index + 1).padStart(3, "0")}`,
      stayId: stay.id,
      stayName: stay.name,
      userId: user.id,
      author: user.fullName,
      rating: 4 + (index % 2),
      comment: [
        "Chỗ nghỉ sạch sẽ, đúng như mô tả và chủ nhà hỗ trợ rất nhiệt tình.",
        "Không gian đẹp, yên tĩnh; mình sẽ quay lại trong chuyến đi Đà Lạt tới.",
        "Vị trí thuận tiện, phòng thoải mái và trải nghiệm rất đáng tiền.",
      ][index % 3],
      createdAt: new Date(Date.now() - (index + 1) * 3600000).toISOString(),
      isDemo: true,
    };
  });
}
