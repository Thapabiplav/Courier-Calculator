import React, { useState } from "react";
import ratesData from "./data/rates.json";

export default function RateCalculatorForm() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [selectedKg, setSelectedKg] = useState("");
  const [total, setTotal] = useState(null);
  const [ratePerKg, setRatePerKg] = useState(null);

  // NEW: store breakdown text
  const [formulaLabel, setFormulaLabel] = useState("");
  const [formulaDetails, setFormulaDetails] = useState("");

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

  const allKgValues = Array.from({ length: 90 }, (_, i) => (i + 1) * 0.5);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setTotal(null);
    setFormulaLabel("");
    setFormulaDetails("");
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

    let rpk = kg <= 9.5 ? getSmallRate(kg) : getBulkRate(kg);
    if (!rpk) {
      setTotal(null);
      return;
    }

    setRatePerKg(rpk);

    let finalAmount = 0;
    let breakdown = "";

    // ---------------------------
    // SPECIAL CASE 1: India & Hong Kong (<10 KG)
    // ---------------------------
    if (kg < 10 && (serviceType === "india" || serviceType === "hong_kong")) {
      finalAmount = rpk * kg + kg * 200 + 750;
      setFormulaLabel("Formula Used (India / Hong Kong Below 10 KG):");
      breakdown = `(${rpk} × ${kg}) + (${kg} × 200) + 750`;
    }
    // ---------------------------
    // SPECIAL CASE 2: Malaysia <= 4.5 KG
    // ---------------------------
    else if (serviceType === "malaysia" && kg <= 4.5) {
      finalAmount = rpk * kg + kg * 200 + 750;
      setFormulaLabel("Formula Used (Malaysia ≤ 4.5 KG):");
      breakdown = `(${rpk} × ${kg}) + (${kg} × 200) + 750`;
    }
    // ---------------------------
    // NORMAL CASE (<10 KG)
    // ---------------------------
    else if (kg < 10) {
      finalAmount = rpk + kg * 200 + 750;
      setFormulaLabel("Formula Used (Normal Case Below 10 KG):");
      breakdown = `${rpk} + (${kg} × 200) + 750`;
    }
    // ---------------------------
    // BULK CASE
    // ---------------------------
    else {
      finalAmount = rpk * kg + kg * 200 + 750;
      setFormulaLabel("Formula Used (10 KG & Above):");
      breakdown = `(${rpk} × ${kg}) + (${kg} × 200) + 750`;
    }

    setFormulaDetails(breakdown);
    setTotal(Math.round(finalAmount));
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

      {/* FULL BREAKDOWN */}
      {total !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded border">
          <h3 className="font-bold text-lg mb-2">Calculation Breakdown:</h3>

          <p>
            Rate per KG: <b>{ratePerKg}</b>
          </p>
          <p>
            Qty: <b>{selectedKg}</b>
          </p>

          <p>
            Our Cost calculation: <b>{selectedKg} *200= {selectedKg *200}</b>
          </p>

          <p>Packaging Charge: <b> 750</b>

          </p>

          <hr className="my-2" />

          <p className="font-semibold text-blue-700">{formulaLabel}</p>

          <p className="font-mono bg-white p-2 rounded border mt-1">
            {formulaDetails}
          </p>

          <hr className="my-2" />

          <p className="font-bold text-blue-700 text-lg">
            Final Total = {total}
          </p>
        </div>
      )}
    </div>
  );
}
