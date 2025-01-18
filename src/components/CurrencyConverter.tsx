import { useEffect, useState } from "react";
import "../style/CurrencyConverter.css";

interface CurrencyConverterProps {
  url: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ url }) => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    fetchRate();
  }, [amount, fromCurrency, toCurrency]);

  const sendRequest = async (endpoint: string) => {
    try {
      setError("");
      const response = await fetch(endpoint);
      if (!response.ok) {
        setError("Wrong Request. Try again with other params.");
        return;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      setError("Service is unavailable. Try again later");
    }
  };

  const fetchCurrencies = async () => {
    const data = await sendRequest(`${url}/currencies`);
    console.log("fetchCurrencies=", data);
    setCurrencies(Object.keys(data));
  };

  const fetchRate = async () => {
    const data = await sendRequest(
      `${url}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    );
    setConvertedAmount(data.rates[toCurrency].toFixed(2));
    console.log("fetchRate=", data);
  };

  return (
    <div className="currency-converter-container">
      <h2 className="title">convertidor de divisas</h2>
      {error && <h2 className="error">{error}</h2>}
      <form className="currency-converter">
        <div>
          <label className="label">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="input"
          />
        </div>
        <div className="currencies">
          <div>
            <label>From:</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              required
              className="input"
            >
              {currencies.map((currency) => (
                <option value={currency} key={`from_${currency}`}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>To:</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              required
              className="input"
            >
              {currencies.map((currency) => (
                <option value={currency} key={`to_${currency}`}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="result">
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </h2>
      </form>
    </div>
  );
};

export default CurrencyConverter;
