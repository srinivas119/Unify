import styles from "../pages/Dashboard.module.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#24292F", // GitHub (official dark gray)
  "#FFA116", // LeetCode
  "#1F8ACB", // Codeforces
  "#5B4638", // CodeChef
  "#2F8D46", // GeeksforGeeks
];

const QuickStats = ({ codingScore }) => {
  return (
    <div className={styles.card}>
      <h2>Total Coding Score</h2>

      <h1>{codingScore.total}</h1>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={codingScore.platforms}
              dataKey="solved"
              nameKey="name"
              outerRadius={120}
              label
            >
              {codingScore.platforms.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuickStats;
