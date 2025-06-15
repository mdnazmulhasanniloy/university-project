import styles from "./CustomLoader.module.css";

export default function CustomLoader({
  className = "",
  outlineColor,
  innerOutlineColor,
  type = "default", // default | colorful
  variant = "default", // default | lg | md | sm
}) {
  const innerSize =
    variant === "default"
      ? "10px"
      : variant === "lg"
        ? "38px"
        : variant === "md"
          ? "16px"
          : "8px";
  const outerSize =
    variant === "default"
      ? "22px"
      : variant === "lg"
        ? "50px"
        : variant === "md"
          ? "20px"
          : "16px";

  return (
    <span
      style={{
        "--outline-color":
          type === "colorful" ? "var(--primary-orange)" : outlineColor,
        "--inner-outline-color":
          type === "colorful" ? "var(--primary-blue)" : innerOutlineColor,
        "--inner-size": innerSize,
        "--outer-size": outerSize,
      }}
      className={`${styles.loader} ${className}`}
    ></span>
  );
}
