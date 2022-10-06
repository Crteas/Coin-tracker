import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";

interface ChartProps {
  coinId: string;
}
interface IHistory {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

function Chart({ coinId }: ChartProps) {
  const isDark = useRecoilValue(isDarkAtom);

  const { isLoading, data } = useQuery<IHistory[]>(["chlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );

  const chartData = data?.map((item) => [
    item.time_close,
    [
      Number(item.open),
      Number(item.high),
      Number(item.low),
      Number(item.close),
    ],
  ]) as [];

  return (
    <h1>
      {isLoading ? (
        "LoadingChart.."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: chartData,
            },
          ]}
          options={{
            xaxis: {
              type: "datetime",
            },
            theme: {
              mode: isDark ? "dark" : "light",
            },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            chart: { height: 500, width: 500 },
          }}
        />
      )}
    </h1>
  );
}

export default Chart;
