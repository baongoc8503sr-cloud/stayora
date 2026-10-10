import { useState } from "react";
import { writeCollection } from "./stayoraData";

function AccountCenter({
  user,
  onClose,
  onUpdateUser,
}) {
  const [activeTab, setActiveTab] = useState("profile");

  const [fullName, setFullName] = useState(
    user?.fullName || ""
  );

  const [phone, setPhone] = useState(
    user?.phone || ""
  );

  const [profileMessage, setProfileMessage] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const role = user?.role || "customer";

  const roleInfo = {
    customer: {
      label: "Khách hàng",
      description:
        "Tìm kiếm, yêu thích và đặt phòng.",
    },

    owner: {
      label: "Chủ chỗ nghỉ",
      description:
        "Quản lý chỗ nghỉ, phòng và booking.",
    },

    host: {
      label: "Chủ chỗ nghỉ",
      description:
        "Quản lý chỗ nghỉ, phòng và booking.",
    },

    admin: {
      label: "Quản trị viên",
      description:
        "Quản lý toàn bộ hệ thống STAYORA.",
    },
  };

  function getAccounts() {
    try {
      return JSON.parse(
        localStorage.getItem("stayoraAccounts") || "[]"
      );
    } catch {
      return [];
    }
  }

  function saveAccounts(accounts) {
    return writeCollection("stayoraAccounts", accounts);
  }

  function handleProfileSave(event) {
    event.preventDefault();

    if (!fullName.trim()) {
      setProfileMessage(
        "Họ và tên không được để trống."
      );
      return;
    }

    if (!/^0\d{9}$/.test(phone.trim())) {
      setProfileMessage(
        "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0."
      );
      return;
    }

    const accounts = getAccounts();

    const accountIndex = accounts.findIndex(
      (account) =>
        account.id === user.id
    );

    if (accountIndex === -1) {
      setProfileMessage(
        "Không tìm thấy tài khoản."
      );
      return;
    }

    const phoneExists = accounts.some(
      (account) =>
        account.phone === phone.trim() &&
        account.id !== user.id
    );

    if (phoneExists) {
      setProfileMessage(
        "Số điện thoại này đã được sử dụng."
      );
      return;
    }

    accounts[accountIndex].fullName =
      fullName.trim();

    accounts[accountIndex].phone =
      phone.trim();

    if (!saveAccounts(accounts)) {
      setProfileMessage("Không thể lưu thông tin cá nhân. Vui lòng thử lại.");
      return;
    }

    const updatedUser = {
      ...user,
      fullName: fullName.trim(),
      phone: phone.trim(),
    };

    localStorage.setItem(
      "stayoraCurrentUser",
      JSON.stringify(updatedUser)
    );

    onUpdateUser(updatedUser);

    setProfileMessage(
      "Thông tin cá nhân đã được cập nhật."
    );
  }

  function handlePasswordChange(event) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError(
        "Vui lòng nhập mật khẩu hiện tại."
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        "Vui lòng nhập mật khẩu mới."
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "Mật khẩu mới phải có ít nhất 8 ký tự."
      );
      return;
    }

    if (!/[A-Za-z]/.test(newPassword)) {
      setPasswordError(
        "Mật khẩu mới phải có chữ cái."
      );
      return;
    }

    if (!/\d/.test(newPassword)) {
      setPasswordError(
        "Mật khẩu mới phải có số."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "Mật khẩu xác nhận không khớp."
      );
      return;
    }

    const accounts = getAccounts();

    const accountIndex = accounts.findIndex(
      (account) =>
        account.id === user.id
    );

    if (accountIndex === -1) {
      setPasswordError(
        "Không tìm thấy tài khoản."
      );
      return;
    }

    if (
      accounts[accountIndex].password !==
      currentPassword
    ) {
      setPasswordError(
        "Mật khẩu hiện tại không chính xác."
      );
      return;
    }

    accounts[accountIndex].password =
      newPassword;

    if (!saveAccounts(accounts)) {
      setPasswordError("Không thể cập nhật mật khẩu. Vui lòng thử lại.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordMessage(
      "Mật khẩu đã được thay đổi thành công."
    );
  }

  function getFavorites() {
    try {
      return JSON.parse(
        localStorage.getItem("stayoraFavorites") || "[]"
      );
    } catch {
      return [];
    }
  }

  const favorites = getFavorites();

  function removeFavorite(id) {
    const updated = favorites.filter(
      (item) => item.id !== id
    );

    localStorage.setItem(
      "stayoraFavorites",
      JSON.stringify(updated)
    );

    setActiveTab("favorites");
  }

  function formatPrice(value) {
    return Number(value).toLocaleString("vi-VN") + "đ";
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(0,0,0,0.52)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          width: "100%",
          maxWidth: "850px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "18px",
          boxShadow:
            "0 24px 70px rgba(0,0,0,0.25)",
        }}
      >
        {/* TOP */}
        <div
          style={{
            padding: "28px 30px 20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 5px",
                fontSize: "11px",
                letterSpacing: "1.5px",
                fontWeight: "700",
                color: "#777",
              }}
            >
              STAYORA · TÀI KHOẢN
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "25px",
                color: "#151515",
              }}
            >
              Xin chào, {user.fullName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "38px",
              height: "38px",
              border: "none",
              borderRadius: "50%",
              background: "#f4f4f4",
              fontSize: "23px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "210px 1fr",
            minHeight: "480px",
          }}
        >
          {/* SIDEBAR */}
          <div
            style={{
              borderRight: "1px solid #eee",
              padding: "22px 14px",
              background: "#fafafa",
            }}
          >
            {[
              ["profile", "Hồ sơ cá nhân"],
              ["password", "Đổi mật khẩu"],
              ["favorites", "Yêu thích"],
              ["permissions", "Quyền truy cập"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setActiveTab(key)
                }
                style={{
                  width: "100%",
                  padding: "12px 13px",
                  marginBottom: "5px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    activeTab === key
                      ? "#111"
                      : "transparent",
                  color:
                    activeTab === key
                      ? "#fff"
                      : "#555",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight:
                    activeTab === key
                      ? "700"
                      : "500",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div style={{ padding: "30px" }}>
            {/* PROFILE */}
            {activeTab === "profile" && (
              <>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "21px",
                  }}
                >
                  Hồ sơ cá nhân
                </h3>

                <p
                  style={{
                    margin: "0 0 24px",
                    color: "#777",
                    fontSize: "13px",
                  }}
                >
                  Cập nhật thông tin cá nhân của bạn.
                </p>

                <form
                  onSubmit={handleProfileSave}
                >
                  <div style={{ marginBottom: "17px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      Họ và tên
                    </label>

                    <input
                      value={fullName}
                      onChange={(e) =>
                        setFullName(
                          e.target.value
                        )
                      }
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px",
                        border:
                          "1px solid #d8d8d8",
                        borderRadius: "9px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "17px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      Email
                    </label>

                    <input
                      value={user.email}
                      disabled
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px",
                        border:
                          "1px solid #e2e2e2",
                        borderRadius: "9px",
                        background: "#f5f5f5",
                        color: "#777",
                      }}
                    />

                    <small
                      style={{
                        display: "block",
                        marginTop: "5px",
                        color: "#888",
                        fontSize: "11px",
                      }}
                    >
                      Email dùng để đăng nhập và xác minh
                      tài khoản.
                    </small>
                  </div>

                  <div style={{ marginBottom: "17px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      Số điện thoại
                    </label>

                    <input
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px",
                        border:
                          "1px solid #d8d8d8",
                        borderRadius: "9px",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "13px 20px",
                      border: "none",
                      borderRadius: "9px",
                      background: "#111",
                      color: "#fff",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Lưu thay đổi
                  </button>

                  {profileMessage && (
                    <p
                      style={{
                        marginTop: "13px",
                        color: "#555",
                        fontSize: "12px",
                      }}
                    >
                      {profileMessage}
                    </p>
                  )}
                </form>
              </>
            )}

            {/* PASSWORD */}
            {activeTab === "password" && (
              <>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "21px",
                  }}
                >
                  Đổi mật khẩu
                </h3>

                <p
                  style={{
                    margin: "0 0 24px",
                    color: "#777",
                    fontSize: "13px",
                  }}
                >
                  Tạo mật khẩu mới để bảo vệ tài khoản.
                </p>

                <form
                  onSubmit={
                    handlePasswordChange
                  }
                >
                  <input
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "13px",
                      border:
                        "1px solid #d8d8d8",
                      borderRadius: "9px",
                      marginBottom: "12px",
                    }}
                  />

                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "13px",
                      border:
                        "1px solid #d8d8d8",
                      borderRadius: "9px",
                      marginBottom: "12px",
                    }}
                  />

                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "13px",
                      border:
                        "1px solid #d8d8d8",
                      borderRadius: "9px",
                      marginBottom: "15px",
                    }}
                  />

                  {passwordError && (
                    <p
                      style={{
                        margin: "0 0 13px",
                        color: "#c62828",
                        fontSize: "12px",
                      }}
                    >
                      {passwordError}
                    </p>
                  )}

                  {passwordMessage && (
                    <p
                      style={{
                        margin: "0 0 13px",
                        color: "#2e7d32",
                        fontSize: "12px",
                      }}
                    >
                      {passwordMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    style={{
                      padding: "13px 20px",
                      border: "none",
                      borderRadius: "9px",
                      background: "#111",
                      color: "#fff",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Đổi mật khẩu
                  </button>
                </form>
              </>
            )}

            {/* FAVORITES */}
            {activeTab === "favorites" && (
              <>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "21px",
                  }}
                >
                  Chỗ nghỉ yêu thích
                </h3>

                <p
                  style={{
                    margin: "0 0 24px",
                    color: "#777",
                    fontSize: "13px",
                  }}
                >
                  Những nơi bạn đã lưu trên STAYORA.
                </p>

                {favorites.length === 0 ? (
                  <div
                    style={{
                      padding: "45px 20px",
                      textAlign: "center",
                      background: "#fafafa",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "35px",
                        marginBottom: "10px",
                      }}
                    >
                      ♡
                    </div>

                    <h4
                      style={{
                        margin: "0 0 7px",
                      }}
                    >
                      Chưa có chỗ nghỉ yêu thích
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        color: "#777",
                        fontSize: "12px",
                      }}
                    >
                      Hãy bấm biểu tượng ♡ trên chỗ
                      nghỉ bạn thích.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                    }}
                  >
                    {favorites.map((stay) => (
                      <div
                        key={stay.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "15px",
                          padding: "15px",
                          border:
                            "1px solid #eee",
                          borderRadius: "11px",
                        }}
                      >
                        <div>
                          <strong>
                            {stay.name}
                          </strong>

                          <div
                            style={{
                              marginTop: "4px",
                              color: "#777",
                              fontSize: "12px",
                            }}
                          >
                            📍 {stay.location}
                          </div>

                          <div
                            style={{
                              marginTop: "4px",
                              fontSize: "12px",
                            }}
                          >
                            ⭐ {stay.rating} ·{" "}
                            {formatPrice(stay.price)}
                            / đêm
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFavorite(
                              stay.id
                            )
                          }
                          style={{
                            border: "none",
                            background:
                              "transparent",
                            color: "#c62828",
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                        >
                          ♥
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* PERMISSIONS */}
            {activeTab === "permissions" && (
              <>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "21px",
                  }}
                >
                  Quyền tài khoản
                </h3>

                <p
                  style={{
                    margin: "0 0 20px",
                    color: "#777",
                    fontSize: "13px",
                  }}
                >
                  Vai trò của bạn quyết định những chức
                  năng được phép sử dụng.
                </p>

                <div
                  style={{
                    padding: "17px",
                    borderRadius: "11px",
                    background: "#f5f5f5",
                    marginBottom: "20px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 5px",
                      color: "#777",
                      fontSize: "11px",
                      letterSpacing: "1px",
                      fontWeight: "700",
                    }}
                  >
                    VAI TRÒ HIỆN TẠI
                  </p>

                  <strong
                    style={{
                      fontSize: "19px",
                    }}
                  >
                    {roleInfo[role]?.label ||
                      "Khách hàng"}
                  </strong>

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    {roleInfo[role]?.description}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      padding: "14px",
                      border:
                        "1px solid #eee",
                      borderRadius: "10px",
                    }}
                  >
                    <strong>
                      Khách hàng
                    </strong>

                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "#777",
                        fontSize: "12px",
                      }}
                    >
                      Tìm chỗ nghỉ · Yêu thích · Đặt
                      phòng · Theo dõi booking
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "14px",
                      border:
                        "1px solid #eee",
                      borderRadius: "10px",
                    }}
                  >
                    <strong>
                      Chủ chỗ nghỉ
                    </strong>

                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "#777",
                        fontSize: "12px",
                      }}
                    >
                      Quản lý chỗ nghỉ · Phòng · Booking
                      · Doanh thu
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "14px",
                      border:
                        "1px solid #eee",
                      borderRadius: "10px",
                    }}
                  >
                    <strong>
                      Quản trị viên
                    </strong>

                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "#777",
                        fontSize: "12px",
                      }}
                    >
                      Quản lý người dùng · Chủ chỗ nghỉ ·
                      Nội dung · Toàn hệ thống
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountCenter;