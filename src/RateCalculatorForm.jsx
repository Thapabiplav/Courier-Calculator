import React, { useState } from "react";
import ratesData from "./data/rates.json";

export default function RateCalculatorForm() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [selectedKg, setSelectedKg] = useState("");
  const [total, setTotal] = useState(null);

  const [ratePerKg, setRatePerKg] = useState(null);

  const countryList = [
    "United Kingdom",
    "UAE",
    "Japan",
    "South Korea",
    "Australia",
    "Cyprus",
    "Hong Kong",
    "India",
    "USA",
    "Canada",
    "Malaysia",
    "New Zealand",
    "Saudi Arabia",
    "Qatar",
    "Kuwait",
    "Oman",
    "Bahrain",
    ...ratesData.europe_regions.europe_a,
    ...ratesData.europe_regions.europe_b,
    ...ratesData.europe_regions.europe_c,
  ];

  const allKgValues = Array.from({ length: 50 }, (_, i) => (i + 1) * 0.5);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setTotal(null);
    setRatePerKg(null);

    if (ratesData.europe_regions.europe_a.includes(country)) {
      setServiceType("europe_a");
    } else if (ratesData.europe_regions.europe_b.includes(country)) {
      setServiceType("europe_b");
    } else if (ratesData.europe_regions.europe_c.includes(country)) {
      setServiceType("europe_c");
    } else {
      const mapping = {
        "United Kingdom": "uk_express",
        UAE: "uae_semi",
        Japan: "japan_korea",
        "South Korea": "japan_korea",
        Australia: "australia_express",
        Cyprus: "cyprus_express",
        "Hong Kong": "hong_kong",
        India: "india",
        USA: "usa",
        Canada: "canada",
        Malaysia: "malaysia",
        "New Zealand": "new_zealand",
        "Saudi Arabia": "saudi_arabia",
        Qatar: "qatar_kuwait_oman_bahrain",
        Kuwait: "qatar_kuwait_oman_bahrain",
        Oman: "qatar_kuwait_oman_bahrain",
        Bahrain: "qatar_kuwait_oman_bahrain",
      };
      setServiceType(mapping[country] || "");
    }
  };

  const getSmallRate = (kg) => {
    const row = ratesData.rates_by_kg.find((item) => item.kg === kg);
    if (!row) return null;
    return row[serviceType] || null;
  };

  const getBulkRate = (kg) => {
    if (kg >= 10 && kg < 15)
      return ratesData.bulk_rates["10_plus"][serviceType];
    if (kg >= 15 && kg < 20)
      return ratesData.bulk_rates["15_plus"][serviceType];
    if (kg >= 20) return ratesData.bulk_rates["20_plus"][serviceType];
    return null;
  };

  const calculateTotal = () => {
    const kg = parseFloat(selectedKg);

    if (!kg || !serviceType) {
      setTotal(null);
      return;
    }

    let rpk = null;

    if (kg < 10 && serviceType === "india") {
      rpk = 750;
    } else if (kg < 10 && serviceType === "hong_kong") {
      rpk = 650;
    } else {
      if (kg <= 9.5) {
        rpk = getSmallRate(kg);
      } else {
        rpk = getBulkRate(kg);
      }
    }

    if (!rpk) {
      setTotal(null);
      return;
    }

    setRatePerKg(rpk);

    const totalPrice = rpk * kg + kg * 200 + 750;
    setTotal(Math.round(totalPrice));
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Rate Calculator</h2>

      {/* COUNTRY DROPDOWN */}
      <label className="block font-semibold mb-1">Select Country</label>
      <select
        value={selectedCountry}
        onChange={(e) => handleCountrySelect(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select Country</option>
        {countryList.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* KG DROPDOWN */}
      <label className="block font-semibold mb-1">Select KG</label>
      <select
        value={selectedKg}
        onChange={(e) => {
          setSelectedKg(e.target.value);
          setTotal(null);
        }}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select KG</option>
        {allKgValues.map((kg) => (
          <option key={kg} value={kg}>
            {kg} KG
          </option>
        ))}
      </select>

      <button
        onClick={calculateTotal}
        className="w-full bg-blue-600 text-white p-2 rounded font-bold"
      >
        Calculate
      </button>

      {/* TOTAL PRICE */}
      {total !== null && (
        <div className="mt-4 p-4 bg-gray-50 border rounded text-xl font-bold">
          Total Price: Rs. {total}
        </div>
      )}

      {/* 🔥 CALCULATION BREAKDOWN PART */}
      {total !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded border">
          <h3 className="font-bold text-lg mb-2">Calculation Breakdown:</h3>

          <p>
            Rate per KG: <b>{ratePerKg}</b>
          </p>
          <p>
            KG: <b>{selectedKg}</b>
          </p>

          <p className="mt-2">
            <b>Rate × KG:</b> {ratePerKg} × {selectedKg} ={" "}
            {ratePerKg * parseFloat(selectedKg)}
          </p>

          <p>
            <b>Typing Charge:</b> {selectedKg} × 200 ={" "}
            {parseFloat(selectedKg) * 200}
          </p>

          <p>
            <b>Packing Charge:</b> 750
          </p>

          <hr className="my-2" />

          <p className="font-bold">Total = (Rate × KG) + (KG × 200) + 750</p>

          <p className="font-bold text-blue-700 text-lg">
            Final Total = {total}
          </p>
        </div>
      )}
    </div>
  );
}
