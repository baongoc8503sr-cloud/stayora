import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const initialStays = [
  {
    id: 1,
    name: "The Pine House",
    area: "Trung t├óm ─É├á Lß║ít",
    type: "Homestay",
    price: 650000,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "B├úi ─æß╗ù xe", "Ban c├┤ng"],
    rooms: ["Ph├▓ng Standard", "Ph├▓ng Deluxe View ─Éß╗ôi", "Ph├▓ng Family"],
    owner: "Nguyß╗àn Minh Anh",
    isActive: true,
  },
  {
    id: 2,
    name: "M├óy ─É├á Lß║ít Homestay",
    area: "Trß║íi M├ít",
    type: "Homestay",
    price: 520000,
    rating: 4.8,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "Bß╗»a s├íng", "Ban c├┤ng"],
    rooms: ["Ph├▓ng Standard", "Ph├▓ng Deluxe"],
    owner: "Trß║ºn Ngß╗ìc Mai",
    isActive: true,
  },
  {
    id: 3,
    name: "The Hill Villa",
    area: "T├á Nung",
    type: "Villa",
    price: 1200000,
    rating: 4.9,
    reviews: 74,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "Hß╗ô b╞íi", "B├úi ─æß╗ù xe"],
    rooms: ["Ph├▓ng Deluxe View ─Éß╗ôi", "Ph├▓ng Family", "Villa nguy├¬n c─ân"],
    owner: "L├¬ Ho├áng Nam",
    isActive: true,
  },
  {
    id: 4,
    name: "An Nhi├¬n House",
    area: "Hß╗ô Xu├ón H╞░╞íng",
    type: "Homestay",
    price: 780000,
    rating: 4.7,
    reviews: 82,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "Bß╗»a s├íng", "B├úi ─æß╗ù xe"],
    rooms: ["Ph├▓ng Standard", "Ph├▓ng Deluxe"],
    owner: "Phß║ím Thu H├á",
    isActive: true,
  },
  {
    id: 5,
    name: "Lß║╖ng House ─É├á Lß║ít",
    area: "Chß╗ú ─É├á Lß║ít",
    type: "Kh├ích sß║ín",
    price: 890000,
    rating: 4.8,
    reviews: 113,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "Bß╗»a s├íng", "Lß╗à t├ón 24/7"],
    rooms: ["Ph├▓ng Standard", "Ph├▓ng Deluxe", "Ph├▓ng Family"],
    owner: "─Éß╗ù Quß╗æc Bß║úo",
    isActive: true,
  },
  {
    id: 6,
    name: "Forest View Villa",
    area: "T├á Nung",
    type: "Villa",
    price: 1450000,
    rating: 5,
    reviews: 51,
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
    amenities: ["WiFi", "Hß╗ô b╞íi", "Ban c├┤ng"],
    rooms: ["Ph├▓ng Deluxe View ─Éß╗ôi", "Ph├▓ng Family", "Villa nguy├¬n c─ân"],
    owner: "V┼⌐ Thanh T├╣ng",
    isActive: true,
  },
];

const navigation = [
  { id: "overview", label: "Tß╗òng quan", icon: "Γûª" },
  { id: "stays", label: "Homestay", icon: "Γîé" },
  { id: "users", label: "Ng╞░ß╗¥i d├╣ng", icon: "ΓÖÖ" },
  { id: "bookings", label: "─Éß║╖t ph├▓ng", icon: "Γûú" },
  { id: "revenue", label: "Doanh thu", icon: "ΓûÑ" },
  { id: "settings", label: "C├ái ─æß║╖t", icon: "ΓÜÖ" },
];

const currency = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}─æ`;

function readArray(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`Kh├┤ng thß╗â ─æß╗ìc dß╗» liß╗çu ${key}:`, error);
    return fallback;
  }
}

function readManagedStays() {
  const saved = readArray("stayoraManagedStays", null);
  if (!saved) return initialStays;
  const savedById = new Map(saved.map((stay) => [String(stay.id), stay]));
  const originalIds = new Set(initialStays.map((stay) => String(stay.id)));
  return [
    ...initialStays.map((stay) => ({
      ...stay,
      ...savedById.get(String(stay.id)),
    })),
    ...saved.filter((stay) => !originalIds.has(String(stay.id))),
  ];
}

const defaultSettings = {
  brandName: "Stayora",
  contactEmail: "hello@stayora.vn",
  contactPhone: "0263 355 6888",
  bookingNotifications: true,
};

function readSettings() {
  try {
    const saved = localStorage.getItem("stayoraAdminSettings");
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch (error) {
    console.error("Kh├┤ng thß╗â ─æß╗ìc c├ái ─æß║╖t quß║ún trß╗ï:", error);
    return defaultSettings;
  }
}

function formatDate(value) {
  if (!value) return "ΓÇö";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "ΓÇö"
    : date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function AdminWorkspace({ onExit }) {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stays, setStays] = useState(readManagedStays);
  const [users, setUsers] = useState(() => readArray("stayoraAccounts"));
  const [bookings, setBookings] = useState(() => readArray("stayoraBookings"));
  const [settings, setSettings] = useState(readSettings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tß║Ñt cß║ú");
  const [stayDialog, setStayDialog] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const activeStays = stays.filter((stay) => stay.isActive !== false);
  const todayBookings = bookings.filter((booking) => booking.createdAt?.slice(0, 10) === today);
  const monthRevenue = bookings
    .filter(
      (booking) =>
        booking.createdAt?.slice(0, 7) === currentMonth &&
        booking.status !== "─É├ú hß╗ºy"
    )
    .reduce((total, booking) => total + Number(booking.totalPrice || 0), 0);

  const filteredStays = useMemo(
    () =>
      stays.filter((stay) => {
        const matchesSearch = `${stay.name} ${stay.area} ${stay.owner}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "Tß║Ñt cß║ú" ||
          (statusFilter === "─Éang hoß║ít ─æß╗Öng" && stay.isActive !== false) ||
          (statusFilter === "Tß║ím ß║⌐n" && stay.isActive === false);
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter, stays]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.fullName || ""} ${user.email || ""} ${user.phone || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search, users]
  );

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const query = `${booking.bookingCode || ""} ${booking.customer?.name || ""} ${booking.stay?.name || ""}`
          .toLowerCase();
        return (
          query.includes(search.toLowerCase()) &&
          (statusFilter === "Tß║Ñt cß║ú" || booking.status === statusFilter)
        );
      }),
    [bookings, search, statusFilter]
  );

  const monthlyRevenue = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - (5 - index));
      return {
        key: date.toISOString().slice(0, 7),
        label: date.toLocaleDateString("vi-VN", { month: "short" }),
        amount: 0,
      };
    });
    bookings.forEach((booking) => {
      const month = months.find((item) => item.key === booking.createdAt?.slice(0, 7));
      if (month && booking.status !== "─É├ú hß╗ºy") {
        month.amount += Number(booking.totalPrice || 0);
      }
    });
    return months;
  }, [bookings]);

  const saveCollection = (key, value, setter, message) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setter(value);
      setToast(message);
    } catch (error) {
      console.error(`Kh├┤ng thß╗â l╞░u dß╗» liß╗çu ${key}:`, error);
      setToast("Kh├┤ng thß╗â l╞░u thay ─æß╗òi. Vui l├▓ng kiß╗âm tra bß╗Ö nhß╗¢ tr├¼nh duyß╗çt.");
    }
  };

  const saveStays = (next) =>
    saveCollection("stayoraManagedStays", next, setStays, "─É├ú cß║¡p nhß║¡t danh s├ích chß╗ù nghß╗ë.");

  const changePage = (page) => {
    setActivePage(page);
    setSearch("");
    setStatusFilter("Tß║Ñt cß║ú");
    setSidebarOpen(false);
  };

  const updateBookingStatus = (booking, status) => {
    const next = bookings.map((item) =>
      item.bookingCode === booking.bookingCode ? { ...item, status } : item
    );
    saveCollection("stayoraBookings", next, setBookings, "─É├ú cß║¡p nhß║¡t trß║íng th├íi ─æß║╖t ph├▓ng.");
  };

  const updateUserRole = (user, role) => {
    const next = users.map((item) =>
      String(item.id) === String(user.id) ? { ...item, role } : item
    );
    saveCollection("stayoraAccounts", next, setUsers, "─É├ú cß║¡p nhß║¡t quyß╗ün ng╞░ß╗¥i d├╣ng.");
  };

  const saveStay = (form) => {
    const next = stayDialog.mode === "edit"
      ? stays.map((stay) => (String(stay.id) === String(form.id) ? form : stay))
      : [...stays, { ...form, id: `stay-${Date.now()}`, reviews: 0, isActive: true }];
    saveStays(next);
    setStayDialog(null);
  };

  const pageTitle = navigation.find((item) => item.id === activePage)?.label || "Tß╗òng quan";
  const searchPlaceholder =
    activePage === "users"
      ? "T├¼m t├¬n, email hoß║╖c sß╗æ ─æiß╗çn thoß║íi..."
      : activePage === "bookings"
        ? "T├¼m m├ú ─æ╞ín, kh├ích hoß║╖c chß╗ù nghß╗ë..."
        : "T├¼m chß╗ù nghß╗ë, khu vß╗▒c...";

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <a className="admin-brand" href="/admin" aria-label="Stayora Admin">
          <span className="admin-brand-mark">Γîé</span>
          <span>
            <strong>Stayora</strong>
            <small>Quß║ún trß╗ï vi├¬n</small>
          </span>
        </a>
        <div className="admin-profile">
          <span className="admin-avatar">SA</span>
          <span><strong>Quß║ún trß╗ï vi├¬n</strong><small>Quß║ún l├╜ hß╗ç thß╗æng</small></span>
        </div>
        <nav className="admin-nav" aria-label="─Éiß╗üu h╞░ß╗¢ng quß║ún trß╗ï">
          <span className="admin-nav-caption">MENU</span>
          {navigation.map((item) => (
            <button
              className={`admin-nav-item${activePage === item.id ? " active" : ""}`}
              key={item.id}
              onClick={() => changePage(item.id)}
              type="button"
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "bookings" && bookings.length > 0 && (
                <span className="admin-nav-count">{bookings.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-help-card">
            <span>Γ£ª</span>
            <strong>Stayora Admin</strong>
            <small>Quß║ún l├╜ kß╗│ nghß╗ë, dß╗à d├áng h╞ín.</small>
          </div>
          <button className="admin-exit" onClick={onExit} type="button">
            <span>Γå⌐</span> Vß╗ü trang kh├ích
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="admin-backdrop"
          aria-label="─É├│ng menu"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            aria-label="Mß╗ƒ menu"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            Γÿ░
          </button>
          <div className="admin-breadcrumb"><span>Stayora</span><b>/</b>{pageTitle}</div>
          <div className="admin-topbar-right">
            <span className="admin-live"><i /> Hß╗ç thß╗æng hoß║ít ─æß╗Öng</span>
            <span className="admin-top-avatar">SA</span>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">STAYORA ┬╖ ─É├Ç Lß║áT</p>
              <h1>{activePage === "overview" ? "Tß╗òng quan hß╗ç thß╗æng" : pageTitle}</h1>
              <p className="admin-subtitle">
                {activePage === "overview"
                  ? "Ch├áo mß╗½ng trß╗ƒ lß║íi! ─É├óy l├á t├¼nh h├¼nh hoß║ít ─æß╗Öng cß╗ºa bß║ín."
                  : `Theo d├╡i v├á quß║ún l├╜ ${pageTitle.toLowerCase()} cß╗ºa Stayora.`}
              </p>
            </div>
            <span className="admin-date">{new Date().toLocaleDateString("vi-VN", {
              weekday: "long", day: "2-digit", month: "long", year: "numeric",
            })}</span>
          </div>

          {activePage === "overview" && (
            <Overview
              stays={stays}
              users={users}
              bookings={bookings}
              todayBookings={todayBookings}
              activeStays={activeStays}
              monthRevenue={monthRevenue}
              monthlyRevenue={monthlyRevenue}
              onNavigate={changePage}
            />
          )}

          {activePage === "stays" && (
            <StaysPage
              stays={filteredStays}
              total={stays.length}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onAdd={() => setStayDialog({ mode: "add" })}
              onEdit={(stay) => setStayDialog({ mode: "edit", stay })}
              onToggle={(stay) =>
                saveStays(stays.map((item) =>
                  String(item.id) === String(stay.id)
                    ? { ...item, isActive: item.isActive === false }
                    : item
                ))
              }
              onDelete={(stay) => {
                if (window.confirm(`X├│a "${stay.name}" khß╗Åi danh s├ích chß╗ù nghß╗ë?`)) {
                  saveStays(stays.filter((item) => String(item.id) !== String(stay.id)));
                }
              }}
            />
          )}

          {activePage === "users" && (
            <UsersPage
              users={filteredUsers}
              total={users.length}
              search={search}
              setSearch={setSearch}
              onRoleChange={updateUserRole}
            />
          )}

          {activePage === "bookings" && (
            <BookingsPage
              bookings={filteredBookings}
              total={bookings.length}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onStatusChange={updateBookingStatus}
            />
          )}

          {activePage === "revenue" && (
            <RevenuePage
              bookings={bookings}
              revenue={monthRevenue}
              monthlyRevenue={monthlyRevenue}
            />
          )}

          {activePage === "settings" && (
            <SettingsPage
              settings={settings}
              onSave={(next) => {
                try {
                  localStorage.setItem("stayoraAdminSettings", JSON.stringify(next));
                  setSettings(next);
                  setToast("─É├ú l╞░u c├ái ─æß║╖t hß╗ç thß╗æng.");
                } catch (error) {
                  console.error("Kh├┤ng thß╗â l╞░u c├ái ─æß║╖t quß║ún trß╗ï:", error);
                  setToast("Kh├┤ng thß╗â l╞░u c├ái ─æß║╖t. Vui l├▓ng thß╗¡ lß║íi.");
                }
              }}
            />
          )}
        </div>
      </main>

      {stayDialog && (
        <StayDialog
          mode={stayDialog.mode}
          stay={stayDialog.stay}
          onClose={() => setStayDialog(null)}
          onSave={saveStay}
        />
      )}
      {toast && <div className="admin-toast" role="status">Γ£ô {toast}</div>}
    </div>
  );
}

function Overview({ stays, users, bookings, todayBookings, activeStays, monthRevenue, monthlyRevenue, onNavigate }) {
  const averageRating = stays.length
    ? (stays.reduce((total, stay) => total + Number(stay.rating || 0), 0) / stays.length).toFixed(1)
    : "ΓÇö";
  const metrics = [
    { icon: "Γîé", value: stays.length, label: "Tß╗òng homestay", note: `${activeStays.length} ─æang hoß║ít ─æß╗Öng`, tone: "green", page: "stays" },
    { icon: "ΓÖÖ", value: users.length.toLocaleString("vi-VN"), label: "Tß╗òng ng╞░ß╗¥i d├╣ng", note: "T├ái khoß║ún ─æ├ú ─æ─âng k├╜", tone: "purple", page: "users" },
    { icon: "Γûú", value: todayBookings.length, label: "─Éß║╖t ph├▓ng h├┤m nay", note: `${bookings.length} ─æ╞ín tß║Ñt cß║ú`, tone: "orange", page: "bookings" },
    { icon: "Γåù", value: currency(monthRevenue), label: "Doanh thu th├íng n├áy", note: "─É╞ín ch╞░a bß╗ï hß╗ºy", tone: "orange", page: "revenue" },
    { icon: "Γ£ô", value: `${activeStays.length}/${stays.length}`, label: "─Éang hoß║ít ─æß╗Öng", note: "Chß╗ù nghß╗ë hiß╗ân thß╗ï", tone: "green", page: "stays" },
    { icon: "Γÿà", value: `${averageRating} Γÿà`, label: "─É├ính gi├í trung b├¼nh", note: "Tr├¬n tß║Ñt cß║ú chß╗ù nghß╗ë", tone: "yellow", page: "stays" },
  ];
  const maxRevenue = Math.max(1, ...monthlyRevenue.map((month) => month.amount));

  return (
    <>
      <section className="admin-metric-grid" aria-label="Chß╗ë sß╗æ hß╗ç thß╗æng">
        {metrics.map((metric) => (
          <button
            className="admin-metric-card"
            key={metric.label}
            onClick={() => onNavigate(metric.page)}
            type="button"
          >
            <span className={`admin-metric-icon ${metric.tone}`}>{metric.icon}</span>
            <strong className={metric.tone}>{metric.value}</strong>
            <span className="admin-metric-label">{metric.label}</span>
            <small>{metric.note}</small>
          </button>
        ))}
      </section>

      <section className="admin-overview-grid">
        <div className="admin-panel admin-chart-panel">
          <div className="admin-panel-heading">
            <div><h2>Doanh thu</h2><p>Tß╗òng quan 6 th├íng gß║ºn nhß║Ñt</p></div>
            <button className="admin-text-button" onClick={() => onNavigate("revenue")} type="button">
              Chi tiß║┐t <span>ΓåÆ</span>
            </button>
          </div>
          <div className="admin-chart">
            {monthlyRevenue.map((month) => (
              <div className="admin-chart-column" key={month.key}>
                <span className="admin-chart-value">
                  {month.amount ? `${(month.amount / 1000000).toFixed(1)}tr` : ""}
                </span>
                <div className="admin-chart-track">
                  <span style={{ height: `${Math.max(4, (month.amount / maxRevenue) * 100)}%` }} />
                </div>
                <small>{month.label}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-panel admin-activity-panel">
          <div className="admin-panel-heading">
            <div><h2>─Éß║╖t ph├▓ng gß║ºn ─æ├óy</h2><p>Cß║¡p nhß║¡t mß╗¢i nhß║Ñt</p></div>
            <button className="admin-text-button" onClick={() => onNavigate("bookings")} type="button">
              Tß║Ñt cß║ú <span>ΓåÆ</span>
            </button>
          </div>
          {bookings.length ? (
            <div className="admin-activity-list">
              {[...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map((booking) => (
                <div className="admin-activity-item" key={booking.bookingCode}>
                  <span className="admin-activity-dot" />
                  <div><strong>{booking.customer?.name || "Kh├ích h├áng"}</strong><p>{booking.stay?.name || "Chß╗ù nghß╗ë"} ┬╖ {formatDate(booking.createdAt)}</p></div>
                  <b>{currency(booking.totalPrice)}</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-small"><span>Γûú</span><strong>Ch╞░a c├│ ─æß║╖t ph├▓ng</strong><p>─É╞ín ─æß║╖t ph├▓ng mß╗¢i sß║╜ xuß║Ñt hiß╗çn tß║íi ─æ├óy.</p></div>
          )}
        </div>
      </section>

      <section className="admin-panel admin-top-stays">
        <div className="admin-panel-heading">
          <div><h2>Homestay nß╗òi bß║¡t</h2><p>C├íc chß╗ù nghß╗ë ─æ╞░ß╗úc ─æ├ính gi├í cao</p></div>
          <button className="admin-text-button" onClick={() => onNavigate("stays")} type="button">
            Quß║ún l├╜ homestay <span>ΓåÆ</span>
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Chß╗ù nghß╗ë</th><th>Khu vß╗▒c</th><th>Chß╗º nh├á</th><th>Ph├▓ng</th><th>─É├ính gi├í</th><th>Gi├í / ─æ├¬m</th><th>Trß║íng th├íi</th></tr></thead>
            <tbody>
              {[...stays].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 5).map((stay) => (
                <tr key={stay.id}>
                  <td><div className="admin-property-cell"><img src={stay.image} alt="" /><strong>{stay.name}</strong></div></td>
                  <td>{stay.area}</td><td>{stay.owner || "ΓÇö"}</td><td>{stay.rooms?.length || 0}</td>
                  <td><span className="admin-rating">Γÿà {Number(stay.rating || 0).toFixed(1)}</span></td>
                  <td>{currency(stay.price)}</td>
                  <td><StatusBadge active={stay.isActive !== false} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function PageToolbar({ search, setSearch, placeholder, filter }) {
  return (
    <div className="admin-toolbar">
      <label className="admin-search">
        <span>Γîò</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} />
      </label>
      {filter}
    </div>
  );
}

function StaysPage({ stays, total, search, setSearch, statusFilter, setStatusFilter, onAdd, onEdit, onToggle, onDelete }) {
  return (
    <>
      <div className="admin-summary-row"><p><strong>{total}</strong> chß╗ù nghß╗ë trong hß╗ç thß╗æng</p><button className="admin-primary-button" onClick={onAdd} type="button"><span>∩╝ï</span> Th├¬m chß╗ù nghß╗ë</button></div>
      <PageToolbar
        search={search}
        setSearch={setSearch}
        placeholder="T├¼m t├¬n chß╗ù nghß╗ë, khu vß╗▒c, chß╗º nh├á..."
        filter={<select className="admin-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Tß║Ñt cß║ú</option><option>─Éang hoß║ít ─æß╗Öng</option><option>Tß║ím ß║⌐n</option></select>}
      />
      <div className="admin-panel admin-list-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Chß╗ù nghß╗ë</th><th>Khu vß╗▒c</th><th>Loß║íi</th><th>Chß╗º nh├á</th><th>Gi├í / ─æ├¬m</th><th>─É├ính gi├í</th><th>Trß║íng th├íi</th><th>Thao t├íc</th></tr></thead>
            <tbody>
              {stays.map((stay) => (
                <tr key={stay.id}>
                  <td><div className="admin-property-cell"><img src={stay.image} alt="" /><strong>{stay.name}</strong></div></td>
                  <td>{stay.area}</td><td>{stay.type}</td><td>{stay.owner || "ΓÇö"}</td>
                  <td>{currency(stay.price)}</td><td><span className="admin-rating">Γÿà {Number(stay.rating || 0).toFixed(1)}</span></td>
                  <td><StatusBadge active={stay.isActive !== false} /></td>
                  <td><div className="admin-row-actions">
                    <button aria-label={`Sß╗¡a ${stay.name}`} title="Chß╗ënh sß╗¡a" onClick={() => onEdit(stay)} type="button">Γ£Ä</button>
                    <button aria-label={stay.isActive === false ? "Hiß╗çn chß╗ù nghß╗ë" : "ß║¿n chß╗ù nghß╗ë"} title={stay.isActive === false ? "Hiß╗çn" : "ß║¿n"} onClick={() => onToggle(stay)} type="button">{stay.isActive === false ? "Γùë" : "Γèÿ"}</button>
                    <button className="danger" aria-label={`X├│a ${stay.name}`} title="X├│a" onClick={() => onDelete(stay)} type="button">Γî½</button>
                  </div></td>
                </tr>
              ))}
              {!stays.length && <EmptyRow columns={8} message="Kh├┤ng t├¼m thß║Ñy chß╗ù nghß╗ë ph├╣ hß╗úp." />}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function UsersPage({ users, total, search, setSearch, onRoleChange }) {
  return (
    <>
      <div className="admin-summary-row"><p><strong>{total}</strong> t├ái khoß║ún ─æ├ú ─æ─âng k├╜</p><span className="admin-readonly-note">T├ái khoß║ún ─æ╞░ß╗úc tß║ío tß╗½ trang ─æ─âng k├╜ Stayora</span></div>
      <PageToolbar search={search} setSearch={setSearch} placeholder="T├¼m t├¬n, email hoß║╖c sß╗æ ─æiß╗çn thoß║íi..." />
      <div className="admin-panel admin-list-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Ng╞░ß╗¥i d├╣ng</th><th>Sß╗æ ─æiß╗çn thoß║íi</th><th>Ng├áy tham gia</th><th>X├íc thß╗▒c email</th><th>Vai tr├▓</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><div className="admin-user-cell"><span>{(user.fullName || "U").trim().charAt(0).toUpperCase()}</span><div><strong>{user.fullName || "Ch╞░a cß║¡p nhß║¡t"}</strong><small>{user.email || "ΓÇö"}</small></div></div></td>
                  <td>{user.phone || "ΓÇö"}</td><td>{formatDate(user.createdAt || user.id)}</td>
                  <td><StatusBadge active={user.emailVerified !== false} label={user.emailVerified === false ? "Ch╞░a x├íc thß╗▒c" : "─É├ú x├íc thß╗▒c"} /></td>
                  <td><select className="admin-role-select" aria-label={`Vai tr├▓ ${user.fullName || user.email}`} value={user.role || "customer"} onChange={(event) => onRoleChange(user, event.target.value)}><option value="customer">Kh├ích h├áng</option><option value="host">Chß╗º nh├á</option><option value="admin">Quß║ún trß╗ï vi├¬n</option></select></td>
                </tr>
              ))}
              {!users.length && <EmptyRow columns={5} message={search ? "Kh├┤ng t├¼m thß║Ñy ng╞░ß╗¥i d├╣ng ph├╣ hß╗úp." : "Ch╞░a c├│ t├ái khoß║ún n├áo. Ng╞░ß╗¥i d├╣ng ─æ─âng k├╜ tr├¬n Stayora sß║╜ xuß║Ñt hiß╗çn tß║íi ─æ├óy."} />}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function BookingsPage({ bookings, total, search, setSearch, statusFilter, setStatusFilter, onStatusChange }) {
  return (
    <>
      <div className="admin-summary-row"><p><strong>{total}</strong> ─æ╞ín ─æß║╖t ph├▓ng</p><span className="admin-readonly-note">Thay ─æß╗òi trß║íng th├íi sß║╜ ─æß╗ông bß╗Ö vß╗¢i lß╗ïch sß╗¡ cß╗ºa kh├ích</span></div>
      <PageToolbar
        search={search}
        setSearch={setSearch}
        placeholder="T├¼m m├ú ─æ╞ín, kh├ích h├áng hoß║╖c chß╗ù nghß╗ë..."
        filter={<select className="admin-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Tß║Ñt cß║ú</option><option>─É├ú x├íc nhß║¡n</option><option>Chß╗¥ x├íc nhß║¡n</option><option>─É├ú hß╗ºy</option></select>}
      />
      <div className="admin-panel admin-list-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>M├ú ─æß║╖t ph├▓ng</th><th>Kh├ích h├áng</th><th>Chß╗ù nghß╗ë</th><th>Thß╗¥i gian</th><th>Tß╗òng tiß╗ün</th><th>Ng├áy ─æß║╖t</th><th>Trß║íng th├íi</th></tr></thead>
            <tbody>
              {[...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((booking, index) => (
                <tr key={booking.bookingCode || index}>
                  <td><strong className="admin-booking-code">{booking.bookingCode || `STY-${index + 1}`}</strong></td>
                  <td><strong>{booking.customer?.name || "Kh├ích h├áng"}</strong><small className="admin-cell-secondary">{booking.customer?.phone || booking.customer?.email || ""}</small></td>
                  <td>{booking.stay?.name || "Chß╗ù nghß╗ë"}<small className="admin-cell-secondary">{booking.selectedRoom || ""}</small></td>
                  <td>{formatDate(booking.checkIn)} ΓÇô {formatDate(booking.checkOut)}</td>
                  <td><strong>{currency(booking.totalPrice)}</strong></td><td>{formatDate(booking.createdAt)}</td>
                  <td><select className={`admin-status-select ${statusClass(booking.status)}`} aria-label={`Trß║íng th├íi ─æ╞ín ${booking.bookingCode}`} value={booking.status || "Chß╗¥ x├íc nhß║¡n"} onChange={(event) => onStatusChange(booking, event.target.value)}><option>Chß╗¥ x├íc nhß║¡n</option><option>─É├ú x├íc nhß║¡n</option><option>─É├ú hß╗ºy</option></select></td>
                </tr>
              ))}
              {!bookings.length && <EmptyRow columns={7} message={search ? "Kh├┤ng t├¼m thß║Ñy ─æ╞ín ─æß║╖t ph├▓ng ph├╣ hß╗úp." : "Ch╞░a c├│ ─æ╞ín ─æß║╖t ph├▓ng. ─É╞ín mß╗¢i sß║╜ tß╗▒ ─æß╗Öng hiß╗ân thß╗ï tß║íi ─æ├óy."} />}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function RevenuePage({ bookings, revenue, monthlyRevenue }) {
  const completed = bookings.filter((booking) => booking.status !== "─É├ú hß╗ºy");
  const average = completed.length
    ? completed.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0) / completed.length
    : 0;
  const maxRevenue = Math.max(1, ...monthlyRevenue.map((month) => month.amount));
  return (
    <>
      <div className="admin-revenue-cards">
        <div className="admin-panel admin-revenue-card"><span>DOANH THU TH├üNG N├ÇY</span><strong>{currency(revenue)}</strong><small>T├¡nh tß╗½ c├íc ─æ╞ín ch╞░a bß╗ï hß╗ºy</small></div>
        <div className="admin-panel admin-revenue-card"><span>─É╞áN Hß╗óP Lß╗å</span><strong>{completed.length}</strong><small>Tß╗òng ─æ╞ín kh├┤ng ß╗ƒ trß║íng th├íi ─æ├ú hß╗ºy</small></div>
        <div className="admin-panel admin-revenue-card"><span>GI├ü TRß╗è TRUNG B├îNH</span><strong>{currency(average)}</strong><small>Tr├¬n mß╗ùi ─æ╞ín hß╗úp lß╗ç</small></div>
      </div>
      <div className="admin-panel admin-revenue-chart-panel">
        <div className="admin-panel-heading"><div><h2>Biß╗âu ─æß╗ô doanh thu</h2><p>Doanh thu ghi nhß║¡n theo th├íng, 6 th├íng gß║ºn nhß║Ñt</p></div><span className="admin-chart-legend"><i /> Doanh thu</span></div>
        <div className="admin-chart admin-large-chart">
          {monthlyRevenue.map((month) => (
            <div className="admin-chart-column" key={month.key}>
              <span className="admin-chart-value">{currency(month.amount)}</span>
              <div className="admin-chart-track"><span style={{ height: `${Math.max(3, (month.amount / maxRevenue) * 100)}%` }} /></div>
              <small>{month.label}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-panel admin-list-panel">
        <div className="admin-panel-heading"><div><h2>─Éß╗æi so├ít ─æ╞ín h├áng</h2><p>Chi tiß║┐t c├íc khoß║ún doanh thu ph├ít sinh</p></div></div>
        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>M├ú ─æß║╖t ph├▓ng</th><th>Kh├ích h├áng</th><th>Chß╗ù nghß╗ë</th><th>Ng├áy ─æß║╖t</th><th>Trß║íng th├íi</th><th>Doanh thu</th></tr></thead>
          <tbody>{bookings.filter((booking) => booking.status !== "─É├ú hß╗ºy").map((booking, index) => (
            <tr key={booking.bookingCode || index}><td><strong className="admin-booking-code">{booking.bookingCode || `STY-${index + 1}`}</strong></td><td>{booking.customer?.name || "Kh├ích h├áng"}</td><td>{booking.stay?.name || "Chß╗ù nghß╗ë"}</td><td>{formatDate(booking.createdAt)}</td><td><StatusBadge active label={booking.status || "─É├ú x├íc nhß║¡n"} /></td><td><strong>{currency(booking.totalPrice)}</strong></td></tr>
          ))}{!completed.length && <EmptyRow columns={6} message="Ch╞░a c├│ doanh thu ─æß╗â ─æß╗æi so├ít." />}</tbody>
        </table></div>
      </div>
    </>
  );
}

function SettingsPage({ settings, onSave }) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => setDraft(settings), [settings]);
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  return (
    <form className="admin-settings-layout" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
      <section className="admin-panel admin-settings-panel">
        <div className="admin-panel-heading"><div><h2>Th├┤ng tin hß╗ç thß╗æng</h2><p>Th├┤ng tin li├¬n hß╗ç hiß╗ân thß╗ï tr├¬n Stayora</p></div></div>
        <label className="admin-field"><span>T├¬n th╞░╞íng hiß╗çu</span><input required value={draft.brandName} onChange={(event) => update("brandName", event.target.value)} /></label>
        <label className="admin-field"><span>Email hß╗ù trß╗ú</span><input required type="email" value={draft.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} /></label>
        <label className="admin-field"><span>Sß╗æ ─æiß╗çn thoß║íi hß╗ù trß╗ú</span><input required value={draft.contactPhone} onChange={(event) => update("contactPhone", event.target.value)} /></label>
      </section>
      <section className="admin-panel admin-settings-panel">
        <div className="admin-panel-heading"><div><h2>Th├┤ng b├ío</h2><p>T├╣y chß╗ënh c├ích nhß║¡n th├┤ng tin ─æ╞ín mß╗¢i</p></div></div>
        <label className="admin-toggle-setting"><span><strong>Th├┤ng b├ío ─æß║╖t ph├▓ng mß╗¢i</strong><small>Nhß║¡n th├┤ng b├ío khi c├│ ─æ╞ín mß╗¢i tr├¬n hß╗ç thß╗æng</small></span><input type="checkbox" checked={draft.bookingNotifications} onChange={(event) => update("bookingNotifications", event.target.checked)} /></label>
        <div className="admin-settings-note"><span>i</span><p>C├íc thay ─æß╗òi ─æ╞░ß╗úc l╞░u trong tr├¼nh duyß╗çt n├áy v├á ├íp dß╗Ñng ngay cho phi├¬n quß║ún trß╗ï.</p></div>
      </section>
      <div className="admin-settings-actions"><button className="admin-primary-button" type="submit">L╞░u c├ái ─æß║╖t</button></div>
    </form>
  );
}

function StayDialog({ mode, stay, onClose, onSave }) {
  const [form, setForm] = useState(() => stay || {
    name: "",
    area: "Trung t├óm ─É├á Lß║ít",
    type: "Homestay",
    price: "",
    rating: "5",
    image: "",
    owner: "",
    rooms: ["Ph├▓ng Standard"],
    amenities: ["WiFi"],
    isActive: true,
  });
  const [error, setError] = useState("");
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.owner.trim() || !Number(form.price) || !form.area.trim()) {
      setError("Vui l├▓ng nhß║¡p ─æß║ºy ─æß╗º t├¬n, chß╗º nh├á, khu vß╗▒c v├á gi├í hß╗úp lß╗ç.");
      return;
    }
    onSave({ ...form, price: Number(form.price), rating: Number(form.rating || 0) });
  };
  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="admin-modal" onSubmit={submit}>
        <div className="admin-modal-heading"><div><p className="admin-eyebrow">QUß║óN L├¥ CHß╗û NGHß╗ê</p><h2>{mode === "edit" ? "Chß╗ënh sß╗¡a homestay" : "Th├¬m chß╗ù nghß╗ë mß╗¢i"}</h2></div><button aria-label="─É├│ng" onClick={onClose} type="button">├ù</button></div>
        <div className="admin-modal-grid">
          <label className="admin-field"><span>T├¬n chß╗ù nghß╗ë *</span><input autoFocus value={form.name} onChange={(event) => update("name", event.target.value)} /></label>
          <label className="admin-field"><span>Chß╗º nh├á *</span><input value={form.owner || ""} onChange={(event) => update("owner", event.target.value)} /></label>
          <label className="admin-field"><span>Khu vß╗▒c *</span><select value={form.area} onChange={(event) => update("area", event.target.value)}><option>Trung t├óm ─É├á Lß║ít</option><option>Hß╗ô Xu├ón H╞░╞íng</option><option>Chß╗ú ─É├á Lß║ít</option><option>Trß║íi M├ít</option><option>T├á Nung</option></select></label>
          <label className="admin-field"><span>Loß║íi chß╗ù nghß╗ë</span><select value={form.type} onChange={(event) => update("type", event.target.value)}><option>Homestay</option><option>Villa</option><option>Kh├ích sß║ín</option></select></label>
          <label className="admin-field"><span>Gi├í mß╗ùi ─æ├¬m (VN─É) *</span><input min="1" type="number" value={form.price} onChange={(event) => update("price", event.target.value)} /></label>
          <label className="admin-field"><span>─É├ính gi├í</span><input min="0" max="5" step="0.1" type="number" value={form.rating} onChange={(event) => update("rating", event.target.value)} /></label>
          <label className="admin-field admin-field-full"><span>ß║ónh ─æß║íi diß╗çn (URL)</span><input type="url" value={form.image || ""} onChange={(event) => update("image", event.target.value)} placeholder="https://..." /></label>
        </div>
        {error && <p className="admin-form-error" role="alert">{error}</p>}
        <div className="admin-modal-actions"><button className="admin-secondary-button" onClick={onClose} type="button">Hß╗ºy</button><button className="admin-primary-button" type="submit">{mode === "edit" ? "L╞░u thay ─æß╗òi" : "Th├¬m chß╗ù nghß╗ë"}</button></div>
      </form>
    </div>
  );
}

function StatusBadge({ active, label }) {
  return <span className={`admin-badge ${active ? "success" : "muted"}`}><i />{label || (active ? "─Éang hoß║ít ─æß╗Öng" : "Tß║ím ß║⌐n")}</span>;
}

function EmptyRow({ columns, message }) {
  return <tr><td className="admin-empty-row" colSpan={columns}><span>Γîò</span><strong>{message}</strong></td></tr>;
}

function statusClass(status = "") {
  if (status === "─É├ú x├íc nhß║¡n") return "confirmed";
  if (status === "─É├ú hß╗ºy") return "cancelled";
  return "pending";
}

function AdminDashboard({ onExit }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("stayoraAdminAuthenticated") === "true"
  );

  useEffect(() => {
    document.body.classList.add("admin-mode");
    return () => document.body.classList.remove("admin-mode");
  }, []);

  const handleExit = () => {
    sessionStorage.removeItem("stayoraAdminAuthenticated");
    setAuthenticated(false);
    onExit();
  };

  if (!authenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          sessionStorage.setItem("stayoraAdminAuthenticated", "true");
          setAuthenticated(true);
        }}
      />
    );
  }

  return <AdminWorkspace onExit={handleExit} />;
}

function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      setError("Ch╞░a cß║Ñu h├¼nh t├ái khoß║ún quß║ún trß╗ï. Vui l├▓ng kiß╗âm tra file .env.local.");
      setSubmitting(false);
      return;
    }

    if (
      email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
      password !== adminPassword
    ) {
      setError("Email hoß║╖c mß║¡t khß║⌐u kh├┤ng ch├¡nh x├íc.");
      setPassword("");
      setSubmitting(false);
      return;
    }

    onSuccess();
    setSubmitting(false);
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <a className="admin-login-brand" href="/admin">
          <span>Γîé</span>
          <strong>Stayora</strong>
        </a>
        <p className="admin-eyebrow">KHU Vß╗░C QUß║óN TRß╗è</p>
        <h1>Ch├áo mß╗½ng trß╗ƒ lß║íi</h1>
        <p className="admin-login-subtitle">─É─âng nhß║¡p ─æß╗â tiß║┐p tß╗Ñc quß║ún l├╜ hß╗ç thß╗æng Stayora.</p>
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Email quß║ún trß╗ï</span>
            <input
              autoComplete="username"
              autoFocus
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Nhß║¡p email quß║ún trß╗ï"
              required
              type="email"
              value={email}
            />
          </label>
          <label className="admin-field">
            <span>Mß║¡t khß║⌐u</span>
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhß║¡p mß║¡t khß║⌐u"
              required
              type="password"
              value={password}
            />
          </label>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button className="admin-primary-button admin-login-submit" disabled={submitting} type="submit">
            {submitting ? "─Éang x├íc thß╗▒c..." : "─É─âng nhß║¡p quß║ún trß╗ï"}
          </button>
        </form>
        <p className="admin-login-footnote"><span>Γûú</span> Chß╗ë t├ái khoß║ún quß║ún trß╗ï ─æ╞░ß╗úc cß║Ñp quyß╗ün mß╗¢i c├│ thß╗â truy cß║¡p.</p>
      </section>
      <span className="admin-login-copyright">┬⌐ {new Date().getFullYear()} Stayora ┬╖ ─É├á Lß║ít</span>
    </main>
  );
}

export default AdminDashboard;
