import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const mobile = useMediaQuery({ query: "(max-width: 768px)" });
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);
  return isMobile;
}
