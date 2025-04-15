import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts"
import "./css/grafico.css";

const data = [
  { name: "Alimentação", valor: 600 },
  { name: "Transporte", valor: 300 },
  { name: "Lazer", valor: 200 },
  { name: "Educação", valor: 400 },
  { name: "Outros", valor: 100 },
]

const COLORS = ["#1a6b3d", "#388e3c", "#66bb6a", "#a5d6a7", "#c8e6c9"]

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{payload[0].payload.name}</p>
        <p className="value">R$ {payload[0].value}</p>
      </div>
    )
  }
  return null
}

function CardGastoCategoria() {
  const total = data.reduce((sum, item) => sum + item.valor, 0)

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">Gastos por Categoria</h3>
      <p className="chart-subtitle">Total no mês: <span className="total-value">R$ {total.toFixed(2)}</span></p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#444" />
          <YAxis stroke="#444" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f5f5" }} />
          <Bar dataKey="valor" radius={[10, 10, 0, 0]} barSize={50}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CardGastoCategoria
