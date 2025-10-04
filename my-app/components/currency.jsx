"use client";

import React, { useState, useRef, useEffect } from "react";

// Predefined list of countries and currencies
const currencyList = [
  { country: "United States", code: "USD", symbol: "$" },
  { country: "India", code: "INR", symbol: "₹" },
  { country: "Eurozone", code: "EUR", symbol: "€" },
  { country: "United Kingdom", code: "GBP", symbol: "£" },
  { country: "Japan", code: "JPY", symbol: "¥" },
  { country: "Canada", code: "CAD", symbol: "$" },
  { country: "Australia", code: "AUD", symbol: "$" },
  { country: "Switzerland", code: "CHF", symbol: "CHF" },
  { country: "China", code: "CNY", symbol: "¥" },
  { country: "Singapore", code: "SGD", symbol: "$" },
  // Add more as needed
];

const CurrencySelector = ({ onSelect }) => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!input) {
      setOptions([]);
      return;
    }
    const filtered = currencyList.filter(
      (c) =>
        c.country.toLowerCase().includes(input.toLowerCase()) ||
        c.code.toLowerCase().includes(input.toLowerCase())
    );
    setOptions(filtered);
  }, [input]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (currency) => {
    setInput(`${currency.country} (${currency.code})`);
    setShowDropdown(false);
    onSelect(currency);
  };

  return (
    <div className="relative w-2/4" ref={dropdownRef}>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowDropdown(true);
        }}
        placeholder="Select currency..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-md">
          {options.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          ) : (
            options.map((c) => (
              <li
                key={c.code}
                onClick={() => handleSelect(c)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {c.country} ({c.code}) — {c.symbol}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CurrencySelector;
