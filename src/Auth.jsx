import { useEffect, useState } from "react";
import { writeCollection } from "./stayoraData";

function Auth({
  mode,
  onClose,
  onChangeMode,
  onAuthSuccess,
}) {
  const [screen, setScreen] = useState(mode);

  // LOGIN
  const [loginValue, setLoginValue] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // REGISTER
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // FORGOT / OTP
  const [forgotValue, setForgotValue] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [verification, setVerification] = useState(null);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    setScreen(mode);
    setErrors({});
    setMessage("");
  }, [mode]);

  function getAccounts() {
    try {
      const saved = localStorage.getItem("stayoraAccounts");

      if (!saved) {
        return [];
      }

      const accounts = JSON.parse(saved);

      return Array.isArray(accounts) ? accounts : [];
    } catch {
      return [];
    }
  }

  function saveAccounts(accounts) {
    return writeCollection("stayoraAccounts", accounts);
  }

  function clearMessages() {
    setErrors({});
    setMessage("");
  }

  function switchMode(nextMode) {
    clearMessages();
    setOtp("");
    setVerification(null);
    setScreen(nextMode);
    onChangeMode(nextMode);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^0\d{9}$/.test(value);
  }

  function generateOtp() {
    return String(
      Math.floor(100000 + Math.random() * 900000)
    );
  }

  function startVerification(account, purpose) {
    const code = generateOtp();

    const verificationData = {
      accountId: account.id,
      email: account.email,
      code,
      purpose,
      target: account.email,
    };

    setVerification(verificationData);
    setOtp("");
    setErrors({});
    setMessage("");

    setScreen("verify");
  }

  // =========================
  // LOGIN
  // =========================

  function handleLogin(event) {
    event.preventDefault();

    clearMessages();

    const newErrors = {};

    if (!loginValue.trim()) {
      newErrors.loginValue =
        "Vui lòng nhập email hoặc số điện thoại.";
    }

    if (!loginPassword) {
      newErrors.loginPassword =
        "Vui lòng nhập mật khẩu.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const accounts = getAccounts();

    const value = loginValue.trim().toLowerCase();

    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() === value ||
        item.phone === loginValue.trim()
    );

    if (!account) {
      setErrors({
        loginValue:
          "Email hoặc số điện thoại chưa được đăng ký.",
      });

      return;
    }

    if (account.password !== loginPassword) {
      setErrors({
        loginPassword:
          "Mật khẩu không chính xác.",
      });

      return;
    }

    // Tài khoản cũ từ phiên bản trước chưa có trường này
    // nên xem như đã xác minh.
    const alreadyVerified =
      account.emailVerified !== false;

    if (!alreadyVerified) {
      startVerification(account, "login");
      return;
    }

    const currentUser = {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      role: account.role || "customer",
      emailVerified: true,
    };

    localStorage.setItem(
      "stayoraCurrentUser",
      JSON.stringify(currentUser)
    );

    onAuthSuccess(currentUser);
  }

  // =========================
  // REGISTER
  // =========================

  function handleRegister(event) {
    event.preventDefault();

    clearMessages();

    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName =
        "Vui lòng nhập họ và tên.";
    }

    if (!registerEmail.trim()) {
      newErrors.registerEmail =
        "Vui lòng nhập email.";
    } else if (!isValidEmail(registerEmail.trim())) {
      newErrors.registerEmail =
        "Email không đúng định dạng.";
    }

    if (!registerPhone.trim()) {
      newErrors.registerPhone =
        "Vui lòng nhập số điện thoại.";
    } else if (!isValidPhone(registerPhone.trim())) {
      newErrors.registerPhone =
        "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.";
    }

    if (!registerPassword) {
      newErrors.registerPassword =
        "Vui lòng tạo mật khẩu.";
    } else if (registerPassword.length < 8) {
      newErrors.registerPassword =
        "Mật khẩu phải có ít nhất 8 ký tự.";
    } else if (!/[A-Za-z]/.test(registerPassword)) {
      newErrors.registerPassword =
        "Mật khẩu phải có ít nhất 1 chữ cái.";
    } else if (!/\d/.test(registerPassword)) {
      newErrors.registerPassword =
        "Mật khẩu phải có ít nhất 1 chữ số.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Vui lòng xác nhận mật khẩu.";
    } else if (confirmPassword !== registerPassword) {
      newErrors.confirmPassword =
        "Mật khẩu xác nhận không khớp.";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms =
        "Bạn cần đồng ý với điều khoản sử dụng.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const accounts = getAccounts();

    const normalizedEmail =
      registerEmail.trim().toLowerCase();

    const normalizedPhone =
      registerPhone.trim();

    const emailExists = accounts.some(
      (account) =>
        account.email.toLowerCase() === normalizedEmail
    );

    const phoneExists = accounts.some(
      (account) =>
        account.phone === normalizedPhone
    );

    if (emailExists) {
      setErrors({
        registerEmail:
          "Email này đã được đăng ký.",
      });

      return;
    }

    if (phoneExists) {
      setErrors({
        registerPhone:
          "Số điện thoại này đã được đăng ký.",
      });

      return;
    }

    const newAccount = {
      id: Date.now(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: registerPassword,

      // Người dùng tự đăng ký luôn là customer.
      // Owner/admin phải được cấp quyền từ hệ thống.
      role: "customer",

      emailVerified: false,
    };

    accounts.push(newAccount);

    if (!saveAccounts(accounts)) {
      setMessage("Không thể lưu tài khoản. Vui lòng thử lại.");
      return;
    }

    // Sau đăng ký → xác minh email bằng OTP
    startVerification(newAccount, "register");
  }

  // =========================
  // VERIFY OTP
  // =========================

  function handleVerify(event) {
    event.preventDefault();

    setErrors({});
    setMessage("");

    if (!otp.trim()) {
      setErrors({
        otp: "Vui lòng nhập mã OTP.",
      });

      return;
    }

    if (otp.trim() !== verification?.code) {
      setErrors({
        otp: "Mã OTP không chính xác.",
      });

      return;
    }

    const accounts = getAccounts();

    const accountIndex = accounts.findIndex(
      (account) =>
        account.id === verification.accountId
    );

    if (accountIndex === -1) {
      setErrors({
        otp: "Không tìm thấy tài khoản.",
      });

      return;
    }

    const account = accounts[accountIndex];

    // Xác minh email
    account.emailVerified = true;

    accounts[accountIndex] = account;

    if (!saveAccounts(accounts)) {
      setErrors({ otp: "Không thể xác minh tài khoản. Vui lòng thử lại." });
      return;
    }

    // Login sau khi xác minh
    if (
      verification.purpose === "register" ||
      verification.purpose === "login"
    ) {
      const currentUser = {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        phone: account.phone,
        role: account.role || "customer",
        emailVerified: true,
      };

      localStorage.setItem(
        "stayoraCurrentUser",
        JSON.stringify(currentUser)
      );

      onAuthSuccess(currentUser);
      return;
    }

    // Forgot password
    if (verification.purpose === "forgot") {
      setScreen("resetPassword");
      setOtp("");
      setMessage(
        "Xác minh thành công. Hãy tạo mật khẩu mới."
      );
    }
  }

  // =========================
  // RESEND OTP
  // =========================

  function resendOtp() {
    if (!verification) {
      return;
    }

    const newCode = generateOtp();

    setVerification({
      ...verification,
      code: newCode,
    });

    setOtp("");
    setErrors({});

    setMessage(
      "Mã OTP mới đã được tạo."
    );
  }

  // =========================
  // FORGOT PASSWORD
  // =========================

  function handleForgot(event) {
    event.preventDefault();

    clearMessages();

    if (!forgotValue.trim()) {
      setErrors({
        forgotValue:
          "Vui lòng nhập email hoặc số điện thoại.",
      });

      return;
    }

    const accounts = getAccounts();

    const value = forgotValue.trim().toLowerCase();

    const account = accounts.find(
      (item) =>
        item.email.toLowerCase() === value ||
        item.phone === forgotValue.trim()
    );

    if (!account) {
      setErrors({
        forgotValue:
          "Không tìm thấy tài khoản phù hợp.",
      });

      return;
    }

    startVerification(account, "forgot");
  }

  // =========================
  // RESET PASSWORD
  // =========================

  function handleResetPassword(event) {
    event.preventDefault();

    setErrors({});
    setMessage("");

    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword =
        "Vui lòng nhập mật khẩu mới.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword =
        "Mật khẩu phải có ít nhất 8 ký tự.";
    } else if (!/[A-Za-z]/.test(newPassword)) {
      newErrors.newPassword =
        "Mật khẩu phải có ít nhất 1 chữ cái.";
    } else if (!/\d/.test(newPassword)) {
      newErrors.newPassword =
        "Mật khẩu phải có ít nhất 1 chữ số.";
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword =
        "Vui lòng xác nhận mật khẩu.";
    } else if (
      confirmNewPassword !== newPassword
    ) {
      newErrors.confirmNewPassword =
        "Mật khẩu xác nhận không khớp.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const accounts = getAccounts();

    const accountIndex = accounts.findIndex(
      (account) =>
        account.id === verification?.accountId
    );

    if (accountIndex === -1) {
      setErrors({
        newPassword:
          "Không tìm thấy tài khoản.",
      });

      return;
    }

    accounts[accountIndex].password =
      newPassword;

    if (!saveAccounts(accounts)) {
      setPasswordError("Không thể cập nhật mật khẩu. Vui lòng thử lại.");
      return;
    }

    setMessage(
      "Mật khẩu đã được thay đổi thành công."
    );

    setTimeout(() => {
      setNewPassword("");
      setConfirmNewPassword("");
      setForgotValue("");
      setVerification(null);
      setScreen("login");
      onChangeMode("login");
    }, 700);
  }

  // =========================
  // COMMON STYLE
  // =========================

  const inputStyle = (error = false) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "10px",
    border: error
      ? "1px solid #c62828"
      : "1px solid #d8d8d8",
    outline: "none",
    fontSize: "14px",
    color: "#222",
    background: "#fff",
  });

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#222",
  };

  function ErrorText({ value }) {
    if (!value) return null;

    return (
      <div
        style={{
          marginTop: "6px",
          color: "#c62828",
          fontSize: "12px",
          lineHeight: "1.4",
        }}
      >
        {value}
      </div>
    );
  }

  const primaryButton = {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#111",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  };

  // =========================
  // LOGIN
  // =========================

  function renderLogin() {
    return (
      <>
        <div style={{ marginBottom: "23px" }}>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "27px",
              lineHeight: "1.2",
              color: "#151515",
            }}
          >
            Chào mừng trở lại
          </h2>

          <p
            style={{
              margin: 0,
              color: "#777",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Đăng nhập để tiếp tục hành trình
            cùng STAYORA.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "17px" }}>
            <label style={labelStyle}>
              Email hoặc số điện thoại *
            </label>

            <input
              type="text"
              value={loginValue}
              onChange={(e) =>
                setLoginValue(e.target.value)
              }
              placeholder="Nhập email hoặc số điện thoại"
              style={inputStyle(
                Boolean(errors.loginValue)
              )}
            />

            <ErrorText value={errors.loginValue} />
          </div>

          <div style={{ marginBottom: "11px" }}>
            <label style={labelStyle}>
              Mật khẩu *
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={
                  showLoginPassword
                    ? "text"
                    : "password"
                }
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                placeholder="Nhập mật khẩu"
                style={{
                  ...inputStyle(
                    Boolean(errors.loginPassword)
                  ),
                  paddingRight: "58px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowLoginPassword(
                    !showLoginPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#555",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {showLoginPassword
                  ? "Ẩn"
                  : "Hiện"}
              </button>
            </div>

            <ErrorText value={errors.loginPassword} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                switchMode("forgot")
              }
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                color: "#333",
                fontSize: "12px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            style={primaryButton}
          >
            Đăng nhập
          </button>
        </form>

        <div
          style={{
            marginTop: "22px",
            textAlign: "center",
            color: "#777",
            fontSize: "13px",
          }}
        >
          Chưa có tài khoản?

          <button
            type="button"
            onClick={() =>
              switchMode("register")
            }
            style={{
              marginLeft: "5px",
              border: "none",
              background: "transparent",
              textDecoration: "underline",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Đăng ký ngay
          </button>
        </div>
      </>
    );
  }

  // =========================
  // REGISTER
  // =========================

  function renderRegister() {
    return (
      <>
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "27px",
              color: "#151515",
            }}
          >
            Tạo tài khoản STAYORA
          </h2>

          <p
            style={{
              margin: 0,
              color: "#777",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Tạo tài khoản để quản lý đặt phòng
            và lưu lại những nơi yêu thích.
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>
              Họ và tên *
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Nguyễn Văn A"
              style={inputStyle(
                Boolean(errors.fullName)
              )}
            />

            <ErrorText value={errors.fullName} />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>
              Email *
            </label>

            <input
              type="email"
              value={registerEmail}
              onChange={(e) =>
                setRegisterEmail(e.target.value)
              }
              placeholder="you@example.com"
              style={inputStyle(
                Boolean(errors.registerEmail)
              )}
            />

            <ErrorText
              value={errors.registerEmail}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>
              Số điện thoại *
            </label>

            <input
              type="tel"
              value={registerPhone}
              onChange={(e) =>
                setRegisterPhone(e.target.value)
              }
              placeholder="0901234567"
              style={inputStyle(
                Boolean(errors.registerPhone)
              )}
            />

            <ErrorText
              value={errors.registerPhone}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>
              Mật khẩu *
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={
                  showRegisterPassword
                    ? "text"
                    : "password"
                }
                value={registerPassword}
                onChange={(e) =>
                  setRegisterPassword(
                    e.target.value
                  )
                }
                placeholder="Ít nhất 8 ký tự"
                style={{
                  ...inputStyle(
                    Boolean(
                      errors.registerPassword
                    )
                  ),
                  paddingRight: "58px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowRegisterPassword(
                    !showRegisterPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {showRegisterPassword
                  ? "Ẩn"
                  : "Hiện"}
              </button>
            </div>

            <small
              style={{
                display: "block",
                marginTop: "5px",
                color: "#777",
                fontSize: "11px",
              }}
            >
              Tối thiểu 8 ký tự, gồm chữ cái
              và số.
            </small>

            <ErrorText
              value={errors.registerPassword}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>
              Xác nhận mật khẩu *
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Nhập lại mật khẩu"
                style={{
                  ...inputStyle(
                    Boolean(
                      errors.confirmPassword
                    )
                  ),
                  paddingRight: "58px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {showConfirmPassword
                  ? "Ẩn"
                  : "Hiện"}
              </button>
            </div>

            <ErrorText
              value={errors.confirmPassword}
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              color: "#555",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) =>
                setAgreeTerms(e.target.checked)
              }
              style={{ marginTop: "3px" }}
            />

            <span>
              Tôi đồng ý với{" "}
              <strong>Điều khoản sử dụng</strong>{" "}
              và{" "}
              <strong>Chính sách bảo mật</strong>{" "}
              của STAYORA.
            </span>
          </label>

          <ErrorText value={errors.agreeTerms} />

          <button
            type="submit"
            style={{
              ...primaryButton,
              marginTop: "17px",
            }}
          >
            Tạo tài khoản
          </button>
        </form>

        <div
          style={{
            marginTop: "19px",
            textAlign: "center",
            color: "#777",
            fontSize: "13px",
          }}
        >
          Đã có tài khoản?

          <button
            type="button"
            onClick={() =>
              switchMode("login")
            }
            style={{
              marginLeft: "5px",
              border: "none",
              background: "transparent",
              textDecoration: "underline",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Đăng nhập
          </button>
        </div>
      </>
    );
  }

  // =========================
  // FORGOT
  // =========================

  function renderForgot() {
    return (
      <>
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "27px",
              color: "#151515",
            }}
          >
            Quên mật khẩu?
          </h2>

          <p
            style={{
              margin: 0,
              color: "#777",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Nhập email hoặc số điện thoại đã đăng
            ký để nhận mã xác minh.
          </p>
        </div>

        <form onSubmit={handleForgot}>
          <div style={{ marginBottom: "17px" }}>
            <label style={labelStyle}>
              Email hoặc số điện thoại *
            </label>

            <input
              type="text"
              value={forgotValue}
              onChange={(e) =>
                setForgotValue(e.target.value)
              }
              placeholder="Nhập email hoặc số điện thoại"
              style={inputStyle(
                Boolean(errors.forgotValue)
              )}
            />

            <ErrorText
              value={errors.forgotValue}
            />
          </div>

          <button
            type="submit"
            style={primaryButton}
          >
            Gửi mã xác minh
          </button>

          <button
            type="button"
            onClick={() =>
              switchMode("login")
            }
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "12px",
              border: "none",
              background: "transparent",
              color: "#555",
              cursor: "pointer",
            }}
          >
            ← Quay lại đăng nhập
          </button>
        </form>
      </>
    );
  }

  // =========================
  // VERIFY OTP
  // =========================

  function renderVerify() {
    return (
      <>
        <div style={{ marginBottom: "22px" }}>
          <div
            style={{
              width: "54px",
              height: "54px",
              marginBottom: "15px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#111",
              color: "#fff",
              fontSize: "23px",
              fontWeight: "700",
            }}
          >
            ✓
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "27px",
              color: "#151515",
            }}
          >
            Xác minh email
          </h2>

          <p
            style={{
              margin: 0,
              color: "#777",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Nhập mã 6 số đã được gửi đến:
            <br />
            <strong style={{ color: "#222" }}>
              {verification?.target}
            </strong>
          </p>
        </div>

        <div
          style={{
            marginBottom: "17px",
            padding: "13px",
            borderRadius: "9px",
            background: "#f4f4f4",
            color: "#555",
            fontSize: "12px",
            lineHeight: "1.5",
          }}
        >
          <strong>Mã OTP demo:</strong>{" "}
          {verification?.code}
          <br />
          Khi có backend thật, dòng này sẽ không
          được hiển thị; mã sẽ được gửi qua email.
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: "17px" }}>
            <label style={labelStyle}>
              Mã xác minh *
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="Nhập 6 số"
              style={{
                ...inputStyle(Boolean(errors.otp)),
                textAlign: "center",
                letterSpacing: "6px",
                fontSize: "20px",
                fontWeight: "700",
              }}
            />

            <ErrorText value={errors.otp} />
          </div>

          <button
            type="submit"
            style={primaryButton}
          >
            Xác minh
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "14px",
              color: "#555",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={resendOtp}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "11px",
            border: "none",
            background: "transparent",
            color: "#222",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Gửi lại mã
        </button>
      </>
    );
  }

  // =========================
  // RESET PASSWORD
  // =========================

  function renderResetPassword() {
    return (
      <>
        <div style={{ marginBottom: "22px" }}>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "27px",
              color: "#151515",
            }}
          >
            Tạo mật khẩu mới
          </h2>

          <p
            style={{
              margin: 0,
              color: "#777",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Mật khẩu mới phải có ít nhất 8 ký tự,
            gồm chữ cái và số.
          </p>
        </div>

        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>
              Mật khẩu mới *
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Nhập mật khẩu mới"
                style={{
                  ...inputStyle(
                    Boolean(errors.newPassword)
                  ),
                  paddingRight: "58px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {showNewPassword
                  ? "Ẩn"
                  : "Hiện"}
              </button>
            </div>

            <ErrorText
              value={errors.newPassword}
            />
          </div>

          <div style={{ marginBottom: "17px" }}>
            <label style={labelStyle}>
              Xác nhận mật khẩu mới *
            </label>

            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) =>
                setConfirmNewPassword(
                  e.target.value
                )
              }
              placeholder="Nhập lại mật khẩu mới"
              style={inputStyle(
                Boolean(
                  errors.confirmNewPassword
                )
              )}
            />

            <ErrorText
              value={errors.confirmNewPassword}
            />
          </div>

          {message && (
            <div
              style={{
                marginBottom: "15px",
                padding: "12px",
                borderRadius: "9px",
                background: "#f3f3f3",
                color: "#555",
                fontSize: "12px",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            style={primaryButton}
          >
            Đổi mật khẩu
          </button>
        </form>
      </>
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "34px 36px 30px",
          boxSizing: "border-box",
          background: "#fff",
          borderRadius: "18px",
          position: "relative",
          boxShadow:
            "0 24px 70px rgba(0,0,0,0.25)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "17px",
            width: "36px",
            height: "36px",
            border: "none",
            borderRadius: "50%",
            background: "#f4f4f4",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "22px",
            fontWeight: "800",
            letterSpacing: "1px",
          }}
        >
          ✦ STAYORA
        </div>

        {screen !== "forgot" &&
          screen !== "verify" &&
          screen !== "resetPassword" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom: "1px solid #e5e5e5",
                marginBottom: "27px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  switchMode("login")
                }
                style={{
                  padding: "13px",
                  border: "none",
                  borderBottom:
                    screen === "login"
                      ? "2px solid #111"
                      : "2px solid transparent",
                  background: "transparent",
                  color:
                    screen === "login"
                      ? "#111"
                      : "#777",
                  fontWeight:
                    screen === "login"
                      ? "700"
                      : "600",
                  cursor: "pointer",
                }}
              >
                Đăng nhập
              </button>

              <button
                type="button"
                onClick={() =>
                  switchMode("register")
                }
                style={{
                  padding: "13px",
                  border: "none",
                  borderBottom:
                    screen === "register"
                      ? "2px solid #111"
                      : "2px solid transparent",
                  background: "transparent",
                  color:
                    screen === "register"
                      ? "#111"
                      : "#777",
                  fontWeight:
                    screen === "register"
                      ? "700"
                      : "600",
                  cursor: "pointer",
                }}
              >
                Đăng ký
              </button>
            </div>
          )}

        {screen === "login" && renderLogin()}

        {screen === "register" &&
          renderRegister()}

        {screen === "forgot" &&
          renderForgot()}

        {screen === "verify" &&
          renderVerify()}

        {screen === "resetPassword" &&
          renderResetPassword()}
      </div>
    </div>
  );
}

export default Auth;