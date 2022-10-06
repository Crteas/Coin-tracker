import { useQuery } from "react-query";
import {
  Switch,
  Route,
  useLocation,
  useParams,
  Link,
  useRouteMatch,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "./api";
import Chart from "./Chart";
import Price from "./Price";
interface RouteParams {
  coinId: string;
}

const Container = styled.div`
  padding: 0px 10px;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;
const Loader = styled.div`
  text-align: center;
`;

const Taps = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 10px 0;
  gap: 10px;
`;

const Tap = styled.span<{ isActive: boolean }>`
  text-align: center;
  background-color: #2b2f3a;
  border-radius: 8px;
  color: ${(props) => (props.isActive ? props.theme.accentColor : null)};
  background-color: ${(props) => props.theme.tapColor};
  a {
    display: block;
    padding: 8px 0;
  }
`;

const CoinWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1.2fr 1.8fr;
  height: 85px;
  width: 100%;
  background-color: ${(props) => props.theme.tapColor};
  border-radius: 10px;
  font-size: 18px;
`;

const CoinInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  &:nth-child(even) {
    font-size: 23px;
    color: ${(props) => props.theme.accentColor};
  }
`;

const CoinDesc = styled.div`
  font-size: 18px;
  padding: 20px 2px;
`;

const BackBtn = styled.button`
  border-radius: 20px;
  border: none;
  background-color: ${(prop) => prop.theme.tapColor};
  color: ${(prop) => prop.theme.accentColor};
  a {
    display: block;
    padding: 10px;
  }
`;

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
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

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 5000,
    }
  );

  const loading = infoLoading && tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>Coin tracker</title>
      </Helmet>
      <BackBtn>
        <Link to={"/"}>Back to list</Link>
      </BackBtn>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <CoinWrapper>
            <CoinInfo>RANK:</CoinInfo>
            <CoinInfo>{tickersData?.rank}</CoinInfo>
            <CoinInfo>SYMBOL:</CoinInfo>
            <CoinInfo>{tickersData?.symbol}</CoinInfo>
            <CoinInfo>OPEN SOURCE:</CoinInfo>
            <CoinInfo>{String(infoData?.open_source).toUpperCase()}</CoinInfo>
          </CoinWrapper>
          <CoinDesc>{infoData?.description}</CoinDesc>
          <CoinWrapper>
            <CoinInfo>TOTAL SUPLY</CoinInfo>
            <CoinInfo>{tickersData?.total_supply}</CoinInfo>
            <CoinInfo>MAX SUPPLY</CoinInfo>
            <CoinInfo>{tickersData?.max_supply}</CoinInfo>
            <CoinInfo>PRICE</CoinInfo>
            <CoinInfo>{tickersData?.quotes.USD.ath_price?.toFixed(2)}</CoinInfo>
          </CoinWrapper>
          <Taps>
            <Tap isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tap>
            <Tap isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tap>
          </Taps>

          <Switch>
            <Route path={`/:coinId/price`}>
              <Price />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
