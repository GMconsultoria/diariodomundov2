"use client";

import AdSenseUnit from "./AdSenseUnit";

interface AdSpaceProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrapper de conveniência para AdSenseUnit.
 * Use este componente quando quiser um ad com margem vertical padrão.
 */
export default function AdSpace({
  slot,
  format = "auto",
  className = "",
  style,
}: AdSpaceProps) {
  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
      <AdSenseUnit
        slot={slot}
        format={format}
        style={style || { display: "block", minWidth: "250px", minHeight: "100px" }}
      />
    </div>
  );
}
