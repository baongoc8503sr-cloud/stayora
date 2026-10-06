import { useState } from "react";

function FavoriteButton({ stay }) {
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("stayoraFavorites") || "[]"
      );

      return saved.some(
        (item) => item.id === stay.id
      );
    } catch {
      return false;
    }
  });

  function toggleFavorite(event) {
    event.stopPropagation();

    try {
      const saved = JSON.parse(
        localStorage.getItem("stayoraFavorites") || "[]"
      );

      const exists = saved.some(
        (item) => item.id === stay.id
      );

      let updated;

      if (exists) {
        updated = saved.filter(
          (item) => item.id !== stay.id
        );
        setIsFavorite(false);
      } else {
        updated = [...saved, stay];
        setIsFavorite(true);
      }

      localStorage.setItem(
        "stayoraFavorites",
        JSON.stringify(updated)
      );
    } catch {
      localStorage.setItem(
        "stayoraFavorites",
        JSON.stringify([stay])
      );

      setIsFavorite(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label={
        isFavorite
          ? "Bỏ yêu thích"
          : "Thêm vào yêu thích"
      }
      style={{
        width: "36px",
        height: "36px",
        border: "none",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.92)",
        color: isFavorite ? "#c62828" : "#222",
        fontSize: "20px",
        cursor: "pointer",
        transition: "0.2s ease",
      }}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}

export default FavoriteButton;