import { useState, useRef, useEffect } from "react";

const caseModesMap = {
  original: (str) => str,
  lower: (str) => str?.toLowerCase?.() ?? "",
  upper: (str) => str?.toUpperCase?.() ?? "",
  snake: (str) =>
    str
      ?.normalize?.("NFD")
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/\s+/g, "_")
      .replace(/[^\w]/g, "")
      .toLowerCase?.() ?? "",
  camel: (str) =>
    str
      ?.toLowerCase?.()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) ?? "",
  capitalize: (str) =>
    str && str.length > 0
      ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      : "",
  title: (str) =>
    str
      ?.toLowerCase?.()
      .replace(
        /([^\s]+)/g,
        (word) => word.charAt(0).toLocaleUpperCase("es-MX") + word.slice(1)
      ) ?? "",
};

const defaultCaseModes = [
  "original",
  "lower",
  "upper",
  "snake",
  "camel",
  "capitalize",
  "title",
];

export const useStringCase = (
  items,
  getString = (item) => item.name,
  caseModes = defaultCaseModes
) => {
  const [caseMode, setCaseMode] = useState(caseModes[0]);
  const originalItemsRef = useRef(items.map(getString));

  useEffect(() => {
    originalItemsRef.current = items.map(getString);
    // Do not reset caseMode here, so cycling works as expected
  }, [items, getString]);

  const changeCase = (mode) => {
    const fn = caseModesMap[mode] || ((str) => str);
    return items.map((item, i) => {
      let name = getString(item);
      name = fn(originalItemsRef.current[i]);
      return { ...item, name };
    });
  };

  const cycleCaseMode = () => {
    const idx = caseModes.indexOf(caseMode);
    const nextMode = caseModes[(idx + 1) % caseModes.length];
    setCaseMode(nextMode);
    return changeCase(nextMode);
  };

  return [caseMode, changeCase, cycleCaseMode, caseModesMap];
};

export { caseModesMap };
