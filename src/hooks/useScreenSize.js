import React from "react";
import { useState } from "react";

const canUseDOM = () => {
  if (
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  ) {
    return true;
  } else {
    return false;
  }
};

const useSafeLayoutEffect = canUseDOM()
  ? React.useLayoutEffect
  : React.useEffect;

const useScreenSize = () => {
  const [matches, setMatches] = useState(false);
  const mql = window.matchMedia("(max-width: 480px)");

  const handler = (e) => {
    setMatches(mql.matches);
  };

  useSafeLayoutEffect(() => {
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return matches;
};

export default useScreenSize;
