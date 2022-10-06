import { fetchCoinTickers } from "./api";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const PricesContainer = styled.div`
  background-color: ${(prop) => prop.theme.tapColor};
  border-radius: 15px;
  padding: 15px;
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 20px;
`;
interface Idiv {
  fontColor: boolean;
}

const PriceChange = styled.div<Idiv>`
  color: ${(props) => (props.fontColor ? "blue" : "red")};
`;

interface RouteParams {
  coinId: string;
}
interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Price() {
  const { coinId } = useParams<RouteParams>();

  const {
    isLoading: tickersLoading,
    data: tickersData,
    isSuccess,
  } = useQuery<PriceData>(["tickers", coinId], () => fetchCoinTickers(coinId), {
    refetchInterval: 5000,
  });

  function negNum(value: number) {
    return value > 0 ? true : false;
  }
  if (isSuccess) {
    const {
      percent_change_15m,
      percent_change_30m,
      percent_change_1h,
      percent_change_6h,
      percent_change_12h,
      percent_change_24h,
      percent_change_7d,
      percent_change_30d,
    } = tickersData?.quotes.USD;

    return (
      <PricesContainer>
        {tickersLoading ? (
          "Loading"
        ) : (
          <>
            <PriceItem>
              <div>15분 :</div>
              <PriceChange fontColor={negNum(percent_change_15m)}>
                {percent_change_15m}
              </PriceChange>
            </PriceItem>
            <PriceItem>
              <div>30분 :</div>
              <PriceChange fontColor={negNum(percent_change_30m)}>
                {percent_change_30m}
              </PriceChange>
            </PriceItem>
            <PriceItem>
              <div>1시간전 :</div>
              <PriceChange fontColor={negNum(percent_change_1h)}>
                {percent_change_1h}
              </PriceChange>
            </PriceItem>
            <PriceItem>
              <div>6시간전 :</div>
              <PriceChange fontColor={negNum(percent_change_6h)}>
                {percent_change_6h}
              </PriceChange>
            </PriceItem>
            <PriceItem>
              <div>12시간전 :</div>
              <PriceChange fontColor={negNum(percent_change_12h)}>
                {percent_change_12h}
              </PriceChange>
            </PriceItem>
            <PriceItem>
              <div>24시간전 :</div>
              <PriceChange fontColor={negNum(percent_change_24h)}>
                {percent_change_24h}
              </PriceChange>
            </PriceItem>
            <PriceItem>
              <div>7일전 :</div>
              <PriceChange fontColor={negNum(percent_change_7d)}>
                {percent_change_7d}
              </PriceChange>
            </PriceItem>
            <PriceItem>
              <div>30일전 :</div>
              <PriceChange fontColor={negNum(percent_change_30d)}>
                {percent_change_30d}
              </PriceChange>
            </PriceItem>
          </>
        )}
      </PricesContainer>
    );
  } else {
    return <h1>Loading</h1>;
  }
}

export default Price;
