import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts";

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
  const { isLoading, data } = useQuery<IHistory[]>(["chlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  return (
    <h1>
      {isLoading ? (
        "LoadingChart.."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "Hello",
              data: data?.map((price) => Number(price.close)) ?? [],
            },
          ]}
          options={{
            xaxis: {
              categories: data?.map((date) =>
                new Date(date.time_close).getMinutes()
              ),
            },
            theme: {
              mode: "dark",
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
