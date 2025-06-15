import { container, line } from "./CustomSpinner.module.css";

export default function CustomSpinner({ size = 30, color = "#1b71a7" }) {
  return (
    <div
      className={container}
      style={{ height: size, width: size, "--uib-color": color }}
    >
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
      <div className={line}></div>
    </div>
  );
}
