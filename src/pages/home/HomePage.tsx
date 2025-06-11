import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import { useAuthStore } from "../../store/authStore";
import { Bar } from "react-chartjs-2";
import ToggleSwitch from "../../components/ToggleSwitch";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartOptions } from "chart.js";
import FitbitLoginButton from "../../components/FitbitLoginButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface SleepData {
  sleep_id: number;
  sleep_date: string;
  total_sleep_minutes: number;
  sleep_score: number;
}

type DataType = "sleep_time" | "sleep_score";

async function fetchRecentSleepData(
  email: string,
  token: string | null
): Promise<SleepData[]> {
  const response = await fetch(
    "https://2r3hmaxnj4.execute-api.eu-north-1.amazonaws.com/data/threerecent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    }
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(data.body || "수면 데이터 조회에 실패했습니다.");
  }

  return data;
}

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDataType, setSelectedDataType] =
    useState<DataType>("sleep_time");
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const loadSleepData = async () => {
      if (!user?.email) return;

      try {
        setIsLoading(true);
        const data = await fetchRecentSleepData(user.email, token);
        setSleepData(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSleepData();
  }, [user?.email]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const chartData = {
    labels: sleepData.map((data) => formatDate(data.sleep_date)),
    datasets: [
      {
        label:
          selectedDataType === "sleep_time" ? "수면 시간 (분)" : "수면 점수",
        data: sleepData.map((data) =>
          selectedDataType === "sleep_time"
            ? data.total_sleep_minutes
            : data.sleep_score
        ),
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return selectedDataType === "sleep_time"
              ? "rgba(81, 168, 222, 0.6)"
              : "rgba(153, 102, 255, 0.6)";
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "#223A61");
          gradient.addColorStop(
            1,
            selectedDataType === "sleep_time"
              ? "rgba(81, 168, 222, 0.6)"
              : "rgba(153, 102, 255, 0.6)"
          );
          return gradient;
        },
        borderColor:
          selectedDataType === "sleep_time"
            ? "rgb(81, 168, 222)"
            : "rgba(153, 102, 255, 1)",
        borderWidth: 0,
        borderRadius: 20,
        barPercentage: 0.3,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    layout: {
      padding: {
        left: 0,
        right: 40,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text:
          selectedDataType === "sleep_time" ? "수면 시간 (분)" : "수면 점수",
        color: "white",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw as number;
            return selectedDataType === "sleep_time"
              ? `${value}분`
              : `${value}점`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "black",
        anchor: "end",
        align: "top",
        formatter: function (value: number) {
          return selectedDataType === "sleep_time"
            ? `${value}분`
            : `${value}점`;
        },
        font: {
          weight: "bold",
          size: 12,
        },
        padding: {
          top: 4,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: "white",
          callback: function (value) {
            if (selectedDataType === "sleep_score") {
              return `${value}점`;
            }
            return `${value}분`;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        border: {
          display: false,
        },
        min: selectedDataType === "sleep_score" ? 0 : undefined,
        max: selectedDataType === "sleep_score" ? 100 : undefined,
      },
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#223A61" }}>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <img src="/hamburger.svg" alt="메뉴" className="w-6 h-6" />
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/sleepkeeperLogo.png"
              alt="Sleep Keeper Logo"
              className="w-12 h-12"
            />
          </div>

          <div className="flex items-center">
            <FitbitLoginButton />
          </div>
        </div>
      </header>

      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-16 px-4">
        <div className="flex flex-row items-center mt-6">
          <img
            src="/sleepface.svg"
            alt="Sleep Face"
            className="w-12 h-12 mr-2"
          />
          <h1 className="text-xl font-bold">
            <span
              className={
                selectedDataType === "sleep_time"
                  ? "text-[rgb(81,168,222)]"
                  : "text-[rgb(153,102,255)]"
              }
            >
              {user?.name}
            </span>
            <span className="text-white text-lg">님의 숙면을 지켜드려요!</span>
          </h1>
        </div>

        <div className="mt-8 max-w-xl mx-auto">
          <h2 className="text-white text-base font-semibold text-center mb-4">
            최근 3일의 수면 데이터
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {isLoading ? (
              <p className="text-gray-500 text-center">
                수면 데이터를 불러오는 중...
              </p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : sleepData.length === 0 ? (
              <p className="text-gray-500 text-center">
                조회할 수면 데이터가 없습니다
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <ToggleSwitch
                    isOn={selectedDataType === "sleep_score"}
                    onChange={() =>
                      setSelectedDataType((prev) =>
                        prev === "sleep_time" ? "sleep_score" : "sleep_time"
                      )
                    }
                    leftLabel="수면 시간"
                    rightLabel="수면 점수"
                  />
                </div>
                <div className="w-full max-w-2xl h-[250px] flex justify-center items-center">
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="mt-4 w-full max-w-2xl mx-auto">
                  <table className="w-full text-center border-t ">
                    <thead>
                      <tr className="text-gray-700 text-sm">
                        <th className="text-xs py-2">날짜</th>
                        <th className="text-xs py-2">수면 시간 (분)</th>
                        <th className="text-xs py-2">수면 점수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sleepData.map((data) => (
                        <tr
                          key={data.sleep_id}
                          className="border-t text-gray-700"
                        >
                          <td className="text-xs py-2">
                            {formatDate(data.sleep_date)}
                          </td>
                          <td className="text-xs py-2">
                            {data.total_sleep_minutes}분
                          </td>
                          <td className="text-xs py-2">{data.sleep_score}점</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
