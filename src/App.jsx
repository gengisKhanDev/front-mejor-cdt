import React, { useState } from "react";
import axios from "axios";

function App() {
  const [monto, setMonto] = useState("");
  const [plazoEnDias, setPlazoEnDias] = useState("");
  const [banco, setBanco] = useState("Todos");
  const [resultados, setResultados] = useState(null);
  const [tipoResultado, setTipoResultado] = useState("");
  const [error, setError] = useState(null);

  const handleCalcularRoi = async () => {
    try {
      let response;
      if (banco === "Todos") {
        response = await axios.get(`https://calculadoraapi.onrender.com/calcular-roi-all`, {
          params: { monto, plazo_en_dias: plazoEnDias },
        });
        setResultados(Object.entries(response.data.resultados || {}));
        setTipoResultado("roi");
      } else {
        response = await axios.get(`https://calculadoraapi.onrender.com/calcular-roi`, {
          params: { monto, plazo_en_dias: plazoEnDias, banco },
        });
        setResultados(response.data);
        setTipoResultado("roi");
      }
      setError(null);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        typeof err.response.data.detail === "object"
      ) {
        const errorDetalles = err.response.data.detail.errores
          .map((error) => `- ${error}`)
          .join("\n");
        setError(`${err.response.data.detail.detalle}\n${errorDetalles}`);
      } else {
        setError(
          err.response?.data?.detail || "Error al procesar la solicitud"
        );
      }
      setResultados(null);
    }
  };

  const handleBuscarTasas = async () => {
    try {
      let response;
      if (banco === "Todos") {
        response = await axios.get(`https://calculadoraapi.onrender.com/buscar-tasas-all`, {
          params: { monto, plazo_en_dias: plazoEnDias },
        });
        setResultados(Object.entries(response.data.resultados || {}));
        setTipoResultado("tasa");
      } else {
        response = await axios.get(`https://calculadoraapi.onrender.com/buscar-tasas`, {
          params: { monto, plazo_en_dias: plazoEnDias, banco },
        });
        setResultados(response.data);
        setTipoResultado("tasa");
      }
      setError(null);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        typeof err.response.data.detail === "object"
      ) {
        const errorDetalles = err.response.data.detail.errores
          .map((error) => `- ${error}`)
          .join("\n");
        setError(`${err.response.data.detail.detalle}\n${errorDetalles}`);
      } else {
        setError(
          err.response?.data?.detail || "Error al procesar la solicitud"
        );
      }
      setResultados(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Calcular Retorno sobre la Inversión
      </h1>
      {/* Contenedor responsive */}
      <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4 space-y-4 lg:space-y-0">
        <div className="flex flex-col">
          <label htmlFor="monto" className="mb-1">Monto:</label>
          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="border p-2"
          />
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="plazoEnDias" className="mb-1">Plazo en días:</label>
          <input
            type="number"
            placeholder="Plazo en días"
            value={plazoEnDias}
            onChange={(e) => setPlazoEnDias(e.target.value)}
            className="border p-2"
          />
        </div>
  
        <div className="flex flex-col">
          <label htmlFor="banco" className="mb-1">Banco:</label>
          <select
            value={banco}
            onChange={(e) => setBanco(e.target.value)}
            className="border p-2"
          >
            <option value="Todos">Todos</option>
            {[...Array(23)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
  
        {/* Botones en una sola fila en pantallas grandes */}
        <div className="flex flex-row space-x-2">
          <button
            onClick={handleCalcularRoi}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Calcular ROI
          </button>
          <button
            onClick={handleBuscarTasas}
            className="bg-green-500 text-white p-2 rounded"
          >
            Buscar Tasas
          </button>
        </div>
      </div>
  
      {/* Renderización de mensajes de error */}
      {error && (
        <pre className="text-red-500 whitespace-pre-line">{error}</pre>
      )}
  
      {/* Renderización de tabla para "Todos" */}
      {resultados && banco === "Todos" && (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="px-4 py-2">Banco</th>
              <th className="px-4 py-2">
                {tipoResultado === "roi" ? "ROI (COP)" : "Tasa (%)"}
              </th>
            </tr>
          </thead>
          <tbody>
            {resultados.map(([banco, valor]) => (
              <tr key={banco}>
                <td className="border px-4 py-2">{banco}</td>
                <td className="border px-4 py-2">
                  {tipoResultado === "roi"
                    ? `$${parseFloat(valor).toFixed(2)} COP`
                    : `${parseFloat(valor).toFixed(2)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  
      {/* Renderización de mensaje para un banco específico */}
      {resultados && banco !== "Todos" && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-lg font-bold mb-2">Resultado:</h2>
          <p>
            {tipoResultado === "roi"
              ? `El banco ${resultados.banco} con el monto ${
                  resultados.monto
                } COP y un plazo de ${
                  resultados.plazo_en_dias
                } días tiene un ROI de $${parseFloat(resultados.roi).toFixed(
                  2
                )} COP.`
              : `El banco ${resultados.banco} con el monto ${
                  resultados.monto
                } COP y un plazo de ${
                  resultados.plazo_en_dias
                } días tiene una tasa de ${parseFloat(resultados.tasa).toFixed(
                  2
                )}%.`}
          </p>
        </div>
      )}
    </div>
  );  
}

export default App;
