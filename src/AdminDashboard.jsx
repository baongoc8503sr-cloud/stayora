import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";
import { initialStays } from "./StayCatalog";
import { getCollection, getStayCatalog, writeCollection } from "./stayoraData";

const navigation = [
  { id: "overview", label: "Tổng quan", icon: "▦" },
  { id: "stays", label: "Homestay", icon: "⌂" },
  { id: "users", label: "Người dùng", icon: "♙" },
  { id: "bookings", label: "Đặt phòng", icon: "▣" },
  { id: "revenue", label: "Doanh thu", icon: "▥" },
  { id: "settings", label: "Cài đặt", icon: "⚙" },
];

const currency = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;

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
    console.error("Không thể đọc cài đặt quản trị:", error);
    return defaultSettings;
  }
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function AdminWorkspace({ onExit }) {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stays, setStays] = useState(() => getStayCatalog(initialStays));
  const [users, setUsers] = useState(() => getCollection("stayoraAccounts"));
  const [bookings, setBookings] = useState(() => getCollection("stayoraBookings"));
  const [settings, setSettings] = useState(readSettings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [stayDialog, setStayDialog] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const refreshData = (event) => {
      if (event.type === "storage" && event.key && !event.key.startsWith("stayora")) return;
      setStays(getStayCatalog(initialStays));
      setUsers(getCollection("stayoraAccounts"));
      setBookings(getCollection("stayoraBookings"));
    };

    window.addEventListener("storage", refreshData);
    window.addEventListener("stayora-data-changed", refreshData);
    return () => {
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("stayora-data-changed", refreshData);
    };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const activeStays = stays.filter((stay) => stay.isActive !== false);
  const todayBookings = bookings.filter((booking) => booking.createdAt?.slice(0, 10) === today);
  const monthRevenue = bookings
    .filter(
      (booking) =>
        booking.createdAt?.slice(0, 7) === currentMonth &&
        ["Đã xác nhận", "Hoàn tất"].includes(booking.status)
    )
    .reduce((total, booking) => total + Number(booking.totalPrice || 0), 0);

  const filteredStays = useMemo(
    () =>
      stays.filter((stay) => {
        const matchesSearch = `${stay.name} ${stay.area} ${stay.owner}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "Tất cả" ||
          (statusFilter === "Đang hoạt động" && stay.isActive !== false) ||
          (statusFilter === "Tạm ẩn" && stay.isActive === false);
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
          (statusFilter === "Tất cả" || booking.status === statusFilter)
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
      if (month && ["Đã xác nhận", "Hoàn tất"].includes(booking.status)) {
        month.amount += Number(booking.totalPrice || 0);
      }
    });
    return months;
  }, [bookings]);

  const saveCollection = (key, value, setter, message) => {
    if (writeCollection(key, value)) {
      setter(value);
      setToast(message);
    } else {
      setToast("Không thể lưu thay đổi. Vui lòng kiểm tra bộ nhớ trình duyệt.");
    }
  };

  const saveStays = (next) => {
    const visibleCatalogIds = new Set(next.map((stay) => String(stay.id)));
    const deletedIds = initialStays
      .map((stay) => String(stay.id))
      .filter((id) => !visibleCatalogIds.has(id));
    if (!writeCollection("stayoraDeletedStayIds", deletedIds)) {
      setToast("Không thể cập nhật danh sách chỗ nghỉ.");
      return;
    }
    saveCollection("stayoraManagedStays", next, setStays, "Đã cập nhật danh sách chỗ nghỉ.");
  };

  const changePage = (page) => {
    setActivePage(page);
    setSearch("");
    setStatusFilter("Tất cả");
    setSidebarOpen(false);
  };

  const updateBookingStatus = (booking, status) => {
    const next = bookings.map((item) =>
      item.bookingCode === booking.bookingCode ? { ...item, status } : item
    );
    saveCollection("stayoraBookings", next, setBookings, "Đã cập nhật trạng thái đặt phòng.");
  };

  const updateUserRole = (user, role) => {
    const next = users.map((item) =>
      String(item.id) === String(user.id) ? { ...item, role } : item
    );
    saveCollection("stayoraAccounts", next, setUsers, "Đã cập nhật quyền người dùng.");
  };

  const saveStay = (form) => {
    const next = stayDialog.mode === "edit"
      ? stays.map((stay) => (String(stay.id) === String(form.id) ? form : stay))
      : [...stays, {
          ...form,
          id: `stay-${Date.now()}`,
          ratingBase: Number(form.rating || 0),
          reviewsBase: 0,
          reviews: 0,
          isActive: true,
        }];
    saveStays(next);
    setStayDialog(null);
  };

  const pageTitle = navigation.find((item) => item.id === activePage)?.label || "Tổng quan";

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <a className="admin-brand" href="/admin" aria-label="Stayora Admin">
          <span className="admin-brand-mark">⌂</span>
          <span>
            <strong>Stayora</strong>
            <small>Quản trị viên</small>
          </span>
        </a>
        <div className="admin-profile">
          <span className="admin-avatar">TIÊN</span>
          <span><strong>Quản trị viên</strong><small>Quản lý hệ thống</small></span>
        </div>
        <nav className="admin-nav" aria-label="Điều hướng quản trị">
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
          <button className="admin-exit" onClick={onExit} type="button">
            <span>↩</span> Đăng xuất
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="admin-backdrop"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            aria-label="Mở menu"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            ☰
          </button>
          <div className="admin-breadcrumb"><span>Stayora</span><b>/</b>{pageTitle}</div>
          <div className="admin-topbar-right">
            <span className="admin-live"><i /> Hệ thống hoạt động</span>
            <span className="admin-top-avatar">TIÊN</span>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">STAYORA · ĐÀ LẠT</p>
              <h1>{activePage === "overview" ? "Tổng quan hệ thống" : pageTitle}</h1>
              <p className="admin-subtitle">
                {activePage === "overview"
                  ? "Chào mừng trở lại! Đây là tình hình hoạt động của bạn."
                  : `Theo dõi và quản lý ${pageTitle.toLowerCase()} của Stayora.`}
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
                if (window.confirm(`Xóa "${stay.name}" khỏi danh sách chỗ nghỉ?`)) {
                  saveStays(stays.filter((item) => String(item.id) !== String(stay.id)));
                }
              }}
            />
          )}

          {activePage === "users" && (
            <UsersPage
              users={filteredUsers}
              allUsers={users}
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
                if (writeCollection("stayoraAdminSettings", next)) {
                  setSettings(next);
                  setToast("Đã lưu cài đặt hệ thống.");
                } else {
                  setToast("Không thể lưu cài đặt. Vui lòng thử lại.");
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
      {toast && <div className="admin-toast" role="status">✓ {toast}</div>}
    </div>
  );
}

function Overview({ stays, users, bookings, todayBookings, activeStays, monthRevenue, monthlyRevenue, onNavigate }) {
  const totalReviews = stays.reduce((total, stay) => total + Number(stay.reviews || 0), 0);
  const hostCount = users.filter((user) => user.role === "host").length;
  const customerCount = users.filter((user) => (user.role || "customer") === "customer").length;
  const adminCount = users.filter((user) => user.role === "admin").length;
  const userBreakdown = [
    `${customerCount} khách`,
    `${hostCount} chủ nhà`,
    ...(adminCount ? [`${adminCount} quản trị viên`] : []),
  ].join(" · ");
  const metrics = [
    { icon: "⌂", value: stays.length, label: "Tổng homestay", note: `${activeStays.length} đang hoạt động`, tone: "green", page: "stays" },
    { icon: "♙", value: users.length.toLocaleString("vi-VN"), label: "Tổng người dùng", note: userBreakdown, tone: "purple", page: "users" },
    { icon: "▣", value: todayBookings.length, label: "Đặt phòng hôm nay", note: `${bookings.length} đơn tất cả`, tone: "orange", page: "bookings" },
    { icon: "↗", value: currency(monthRevenue), label: "Doanh thu tháng này", note: "Đơn đã xác nhận hoặc hoàn tất", tone: "orange", page: "revenue" },
    { icon: "✓", value: `${activeStays.length}/${stays.length}`, label: "Đang hoạt động", note: "Chỗ nghỉ hiển thị", tone: "green", page: "stays" },
    { icon: "★", value: totalReviews.toLocaleString("vi-VN"), label: "Tổng lượt đánh giá", note: "Tổng trên các chỗ nghỉ", tone: "yellow", page: "stays" },
  ];
  const maxRevenue = Math.max(1, ...monthlyRevenue.map((month) => month.amount));

  return (
    <>
      <section className="admin-metric-grid" aria-label="Chỉ số hệ thống">
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
            <div><h2>Doanh thu</h2><p>Tổng quan 6 tháng gần nhất</p></div>
            <button className="admin-text-button" onClick={() => onNavigate("revenue")} type="button">
              Chi tiết <span>→</span>
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
            <div><h2>Đặt phòng gần đây</h2><p>Cập nhật mới nhất</p></div>
            <button className="admin-text-button" onClick={() => onNavigate("bookings")} type="button">
              Tất cả <span>→</span>
            </button>
          </div>
          {bookings.length ? (
            <div className="admin-activity-list">
              {[...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map((booking) => (
                <div className="admin-activity-item" key={booking.bookingCode}>
                  <span className="admin-activity-dot" />
                  <div><strong>{booking.customer?.name || "Khách hàng"}</strong><p>{booking.stay?.name || "Chỗ nghỉ"} · {formatDate(booking.createdAt)}</p></div>
                  <b>{currency(booking.totalPrice)}</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-small"><span>▣</span><strong>Chưa có đặt phòng</strong><p>Đơn đặt phòng mới sẽ xuất hiện tại đây.</p></div>
          )}
        </div>
      </section>

      <section className="admin-panel admin-top-stays">
        <div className="admin-panel-heading">
          <div><h2>Homestay nổi bật</h2><p>Các chỗ nghỉ được đánh giá cao</p></div>
          <button className="admin-text-button" onClick={() => onNavigate("stays")} type="button">
            Quản lý homestay <span>→</span>
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Chỗ nghỉ</th><th>Khu vực</th><th>Chủ nhà</th><th>Phòng</th><th>Đánh giá</th><th>Giá / đêm</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {[...stays].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 5).map((stay) => (
                <tr key={stay.id}>
                  <td><div className="admin-property-cell"><img src={stay.image} alt="" /><strong>{stay.name}</strong></div></td>
                  <td>{stay.area}</td><td>{stay.owner || "—"}</td><td>{stay.rooms?.length || 0}</td>
                  <td><span className="admin-rating">★ {Number(stay.rating || 0).toFixed(1)}</span></td>
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
        <span>⌕</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} />
      </label>
      {filter}
    </div>
  );
}

function StaysPage({ stays, total, search, setSearch, statusFilter, setStatusFilter, onAdd, onEdit, onToggle, onDelete }) {
  return (
    <>
      <div className="admin-summary-row"><p><strong>{total}</strong> chỗ nghỉ trong hệ thống</p><button className="admin-primary-button" onClick={onAdd} type="button"><span>＋</span> Thêm chỗ nghỉ</button></div>
      <PageToolbar
        search={search}
        setSearch={setSearch}
        placeholder="Tìm tên chỗ nghỉ, khu vực, chủ nhà..."
        filter={<select className="admin-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Tất cả</option><option>Đang hoạt động</option><option>Tạm ẩn</option></select>}
      />
      <div className="admin-panel admin-list-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Chỗ nghỉ</th><th>Khu vực</th><th>Loại</th><th>Chủ nhà</th><th>Giá / đêm</th><th>Đánh giá</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {stays.map((stay) => (
                <tr key={stay.id}>
                  <td><div className="admin-property-cell"><img src={stay.image} alt="" /><strong>{stay.name}</strong></div></td>
                  <td>{stay.area}</td><td>{stay.type}</td><td>{stay.owner || "—"}</td>
                  <td>{currency(stay.price)}</td><td><span className="admin-rating">★ {Number(stay.rating || 0).toFixed(1)}</span></td>
                  <td><StatusBadge active={stay.isActive !== false} /></td>
                  <td><div className="admin-row-actions">
                    <button aria-label={`Sửa ${stay.name}`} title="Chỉnh sửa" onClick={() => onEdit(stay)} type="button">✎</button>
                    <button aria-label={stay.isActive === false ? "Hiện chỗ nghỉ" : "Ẩn chỗ nghỉ"} title={stay.isActive === false ? "Hiện" : "Ẩn"} onClick={() => onToggle(stay)} type="button">{stay.isActive === false ? "◉" : "⊘"}</button>
                    <button className="danger" aria-label={`Xóa ${stay.name}`} title="Xóa" onClick={() => onDelete(stay)} type="button">⌫</button>
                  </div></td>
                </tr>
              ))}
              {!stays.length && <EmptyRow columns={8} message="Không tìm thấy chỗ nghỉ phù hợp." />}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function UsersPage({ users, allUsers, total, search, setSearch, onRoleChange }) {
  const demoCustomers = allUsers.filter((user) => user.isDemo && !user.isDemoHost).length;
  const demoHosts = allUsers.filter((user) => user.isDemoHost && user.role === "host").length;
  return (
    <>
      <div className="admin-summary-row"><p><strong>{total}</strong> tài khoản</p><span className="admin-readonly-note">Gồm {demoCustomers} khách mẫu, {demoHosts} chủ nhà mẫu và người dùng đăng ký trên Stayora</span></div>
      <PageToolbar search={search} setSearch={setSearch} placeholder="Tìm tên, email hoặc số điện thoại..." />
      <div className="admin-panel admin-list-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Người dùng</th><th>Số điện thoại</th><th>Chỗ nghỉ quản lý</th><th>Ngày tham gia</th><th>Xác thực email</th><th>Vai trò</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><div className="admin-user-cell"><span>{(user.fullName || "U").trim().charAt(0).toUpperCase()}</span><div><strong>{user.fullName || "Chưa cập nhật"}{user.isDemo && <small className="admin-demo-tag"> · Demo</small>}</strong><small>{user.email || "—"}</small></div></div></td>
                  <td>{user.phone || "—"}</td><td>{user.isDemoHost ? user.hostedStayName : "—"}</td><td>{formatDate(user.createdAt || user.id)}</td>
                  <td><StatusBadge active={user.emailVerified !== false} label={user.emailVerified === false ? "Chưa xác thực" : "Đã xác thực"} /></td>
                  <td><select className="admin-role-select" aria-label={`Vai trò ${user.fullName || user.email}`} value={user.role || "customer"} onChange={(event) => onRoleChange(user, event.target.value)}><option value="customer">Khách hàng</option><option value="host">Chủ nhà</option><option value="admin">Quản trị viên</option></select></td>
                </tr>
              ))}
              {!users.length && <EmptyRow columns={6} message={search ? "Không tìm thấy người dùng phù hợp." : "Chưa có tài khoản nào. Người dùng đăng ký trên Stayora sẽ xuất hiện tại đây."} />}
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
      <div className="admin-summary-row"><p><strong>{total}</strong> đơn đặt phòng</p><span className="admin-readonly-note">Thay đổi trạng thái sẽ đồng bộ với lịch sử của khách</span></div>
      <PageToolbar
        search={search}
        setSearch={setSearch}
        placeholder="Tìm mã đơn, khách hàng hoặc chỗ nghỉ..."
        filter={<select className="admin-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Tất cả</option><option>Chờ xác nhận</option><option>Đã xác nhận</option><option>Hoàn tất</option><option>Đã hủy</option></select>}
      />
      <div className="admin-panel admin-list-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Mã đặt phòng</th><th>Khách hàng</th><th>Chỗ nghỉ</th><th>Thời gian</th><th>Tổng tiền</th><th>Ngày đặt</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {[...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((booking, index) => (
                <tr key={booking.bookingCode || index}>
                  <td><strong className="admin-booking-code">{booking.bookingCode || `STY-${index + 1}`}</strong></td>
                  <td><strong>{booking.customer?.name || "Khách hàng"}</strong><small className="admin-cell-secondary">{booking.customer?.phone || booking.customer?.email || ""}</small></td>
                  <td>{booking.stay?.name || "Chỗ nghỉ"}<small className="admin-cell-secondary">{booking.selectedRoom || ""}</small></td>
                  <td>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</td>
                  <td><strong>{currency(booking.totalPrice)}</strong></td><td>{formatDate(booking.createdAt)}</td>
                  <td><select className={`admin-status-select ${statusClass(booking.status)}`} aria-label={`Trạng thái đơn ${booking.bookingCode}`} value={booking.status || "Chờ xác nhận"} onChange={(event) => onStatusChange(booking, event.target.value)}><option>Chờ xác nhận</option><option>Đã xác nhận</option><option>Hoàn tất</option><option>Đã hủy</option></select></td>
                </tr>
              ))}
              {!bookings.length && <EmptyRow columns={7} message={search ? "Không tìm thấy đơn đặt phòng phù hợp." : "Chưa có đơn đặt phòng. Đơn mới sẽ tự động hiển thị tại đây."} />}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function RevenuePage({ bookings, revenue, monthlyRevenue }) {
  const completed = bookings.filter((booking) => ["Đã xác nhận", "Hoàn tất"].includes(booking.status));
  const average = completed.length
    ? completed.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0) / completed.length
    : 0;
  const maxRevenue = Math.max(1, ...monthlyRevenue.map((month) => month.amount));
  return (
    <>
      <div className="admin-revenue-cards">
        <div className="admin-panel admin-revenue-card"><span>DOANH THU THÁNG NÀY</span><strong>{currency(revenue)}</strong><small>Tính từ các đơn chưa bị hủy</small></div>
        <div className="admin-panel admin-revenue-card"><span>ĐƠN HỢP LỆ</span><strong>{completed.length}</strong><small>Đơn đã xác nhận hoặc hoàn tất</small></div>
        <div className="admin-panel admin-revenue-card"><span>GIÁ TRỊ TRUNG BÌNH</span><strong>{currency(average)}</strong><small>Trên mỗi đơn hợp lệ</small></div>
      </div>
      <div className="admin-panel admin-revenue-chart-panel">
        <div className="admin-panel-heading"><div><h2>Biểu đồ doanh thu</h2><p>Doanh thu ghi nhận theo tháng, 6 tháng gần nhất</p></div><span className="admin-chart-legend"><i /> Doanh thu</span></div>
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
        <div className="admin-panel-heading"><div><h2>Đối soát đơn hàng</h2><p>Chi tiết các khoản doanh thu phát sinh</p></div></div>
        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>Mã đặt phòng</th><th>Khách hàng</th><th>Chỗ nghỉ</th><th>Ngày đặt</th><th>Trạng thái</th><th>Doanh thu</th></tr></thead>
          <tbody>{bookings.filter((booking) => ["Đã xác nhận", "Hoàn tất"].includes(booking.status)).map((booking, index) => (
            <tr key={booking.bookingCode || index}><td><strong className="admin-booking-code">{booking.bookingCode || `STY-${index + 1}`}</strong></td><td>{booking.customer?.name || "Khách hàng"}</td><td>{booking.stay?.name || "Chỗ nghỉ"}</td><td>{formatDate(booking.createdAt)}</td><td><StatusBadge active label={booking.status || "Đã xác nhận"} /></td><td><strong>{currency(booking.totalPrice)}</strong></td></tr>
          ))}{!completed.length && <EmptyRow columns={6} message="Chưa có doanh thu để đối soát." />}</tbody>
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
        <div className="admin-panel-heading"><div><h2>Thông tin hệ thống</h2><p>Thông tin liên hệ hiển thị trên Stayora</p></div></div>
        <label className="admin-field"><span>Tên thương hiệu</span><input required value={draft.brandName} onChange={(event) => update("brandName", event.target.value)} /></label>
        <label className="admin-field"><span>Email hỗ trợ</span><input required type="email" value={draft.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} /></label>
        <label className="admin-field"><span>Số điện thoại hỗ trợ</span><input required value={draft.contactPhone} onChange={(event) => update("contactPhone", event.target.value)} /></label>
      </section>
      <section className="admin-panel admin-settings-panel">
        <div className="admin-panel-heading"><div><h2>Thông báo</h2><p>Tùy chỉnh cách nhận thông tin đơn mới</p></div></div>
        <label className="admin-toggle-setting"><span><strong>Thông báo đặt phòng mới</strong><small>Nhận thông báo khi có đơn mới trên hệ thống</small></span><input type="checkbox" checked={draft.bookingNotifications} onChange={(event) => update("bookingNotifications", event.target.checked)} /></label>
        <div className="admin-settings-note"><span>i</span><p>Các thay đổi được lưu trong trình duyệt này và áp dụng ngay cho phiên quản trị.</p></div>
      </section>
      <div className="admin-settings-actions"><button className="admin-primary-button" type="submit">Lưu cài đặt</button></div>
    </form>
  );
}

function StayDialog({ mode, stay, onClose, onSave }) {
  const [form, setForm] = useState(() => stay || {
    name: "",
    area: "Trung tâm Đà Lạt",
    type: "Homestay",
    price: "",
    rating: "5",
    image: "",
    owner: "",
    rooms: ["Phòng Standard"],
    amenities: ["WiFi"],
    isActive: true,
  });
  const [error, setError] = useState("");
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.owner.trim() || !Number(form.price) || !form.area.trim()) {
      setError("Vui lòng nhập đầy đủ tên, chủ nhà, khu vực và giá hợp lệ.");
      return;
    }
    onSave({ ...form, price: Number(form.price), rating: Number(form.rating || 0) });
  };
  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="admin-modal" onSubmit={submit}>
        <div className="admin-modal-heading"><div><p className="admin-eyebrow">QUẢN LÝ CHỖ NGHỈ</p><h2>{mode === "edit" ? "Chỉnh sửa homestay" : "Thêm chỗ nghỉ mới"}</h2></div><button aria-label="Đóng" onClick={onClose} type="button">×</button></div>
        <div className="admin-modal-grid">
          <label className="admin-field"><span>Tên chỗ nghỉ *</span><input autoFocus value={form.name} onChange={(event) => update("name", event.target.value)} /></label>
          <label className="admin-field"><span>Chủ nhà *</span><input value={form.owner || ""} onChange={(event) => update("owner", event.target.value)} /></label>
          <label className="admin-field"><span>Khu vực *</span><select value={form.area} onChange={(event) => update("area", event.target.value)}><option>Trung tâm Đà Lạt</option><option>Hồ Xuân Hương</option><option>Chợ Đà Lạt</option><option>Trại Mát</option><option>Tà Nung</option></select></label>
          <label className="admin-field"><span>Loại chỗ nghỉ</span><select value={form.type} onChange={(event) => update("type", event.target.value)}><option>Homestay</option><option>Villa</option><option>Khách sạn</option></select></label>
          <label className="admin-field"><span>Giá mỗi đêm (VNĐ) *</span><input min="1" type="number" value={form.price} onChange={(event) => update("price", event.target.value)} /></label>
          <label className="admin-field"><span>Đánh giá</span><input min="0" max="5" step="0.1" type="number" value={form.rating} onChange={(event) => update("rating", event.target.value)} /></label>
          <label className="admin-field admin-field-full"><span>Ảnh đại diện (URL)</span><input type="url" value={form.image || ""} onChange={(event) => update("image", event.target.value)} placeholder="https://..." /></label>
        </div>
        {error && <p className="admin-form-error" role="alert">{error}</p>}
        <div className="admin-modal-actions"><button className="admin-secondary-button" onClick={onClose} type="button">Hủy</button><button className="admin-primary-button" type="submit">{mode === "edit" ? "Lưu thay đổi" : "Thêm chỗ nghỉ"}</button></div>
      </form>
    </div>
  );
}

function StatusBadge({ active, label }) {
  return <span className={`admin-badge ${active ? "success" : "muted"}`}><i />{label || (active ? "Đang hoạt động" : "Tạm ẩn")}</span>;
}

function EmptyRow({ columns, message }) {
  return <tr><td className="admin-empty-row" colSpan={columns}><span>⌕</span><strong>{message}</strong></td></tr>;
}

function statusClass(status = "") {
  if (status === "Đã xác nhận") return "confirmed";
  if (status === "Hoàn tất") return "completed";
  if (status === "Đã hủy") return "cancelled";
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
      setError("Chưa cấu hình tài khoản quản trị. Vui lòng kiểm tra file .env.local.");
      setSubmitting(false);
      return;
    }

    if (
      email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
      password !== adminPassword
    ) {
      setError("Email hoặc mật khẩu không chính xác.");
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
          <span>⌂</span>
          <strong>Stayora</strong>
        </a>
        <p className="admin-eyebrow">KHU VỰC QUẢN TRỊ</p>
        <h1>Chào mừng trở lại</h1>
        <p className="admin-login-subtitle">Đăng nhập để tiếp tục quản lý hệ thống Stayora.</p>
        <form onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Email quản trị</span>
            <input
              autoComplete="username"
              autoFocus
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Nhập email quản trị"
              required
              type="email"
              value={email}
            />
          </label>
          <label className="admin-field">
            <span>Mật khẩu</span>
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
              required
              type="password"
              value={password}
            />
          </label>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button className="admin-primary-button admin-login-submit" disabled={submitting} type="submit">
            {submitting ? "Đang xác thực..." : "Đăng nhập quản trị"}
          </button>
        </form>
        <p className="admin-login-footnote"><span>▣</span> Chỉ tài khoản quản trị được cấp quyền mới có thể truy cập.</p>
      </section>
      <span className="admin-login-copyright">© {new Date().getFullYear()} Stayora · Đà Lạt</span>
    </main>
  );
}

export default AdminDashboard;
