import Image from "next/image";
import { Inter } from "next/font/google";
import { QueryClient, useQuery } from "@tanstack/react-query";
import {
  Container,
  Grid,
  Paper,
  Text,
  Title,
  Loader,
  Center,
  Button,
} from "@mantine/core";
import { createPrefetch } from "../utils/prefetch";
import BirthdayBarChart from "@/components/BirthdaysBarChart";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const QUERY_KEY = "faker";
const QUANTITY = 5;

const View = () => {
  const { data, isFetching } = useQuery({
    queryKey: [QUERY_KEY, QUANTITY],
    staleTime: 60_000,
    queryFn: async () => {
      const res = await fetch(`/api/faker?quantity=${QUANTITY}`);
      return res.json();
    },
  });

  if (isFetching)
    return (
      <Container size="lg" style={{ minHeight: "100vh" }} p="xl">
        <Center>
          <Loader variant="dots" />
        </Center>
      </Container>
    );

  return (
    <Container size="lg" style={{ minHeight: "100vh" }} p="xl">
      <Text ta="center" size="xl" style={{ marginBottom: "24px" }}>
        <strong>Individuals:</strong> {data?.data.length ?? 0}
      </Text>

      <BirthdayBarChart data={data.chartData} />
    </Container>
  );
};

export default function Home() {
  const [shouldShow, setShouldShow] = useState(true);

  return (
    <Container size="lg" style={{ minHeight: "100vh" }} p="xl">
      <Center>
        <Button onClick={() => setShouldShow((prevState) => !prevState)}>
          {shouldShow ? "Hide" : "Show"}
        </Button>
      </Center>
      {shouldShow && <View />}
    </Container>
  );
}

export const getServerSideProps = async () => {
  const prefetch = createPrefetch(new QueryClient(), 2_000);

  await prefetch.optionalQuery([QUERY_KEY, QUANTITY], async () => {
    const res = await fetch(`http://localhost:3000/api/faker?quantity=${QUANTITY}`);
    const json = await res.json();

    return json;
  });

  const dehydratedState = prefetch.dehydrate();

  return {
    props: {
      dehydratedState,
    },
  };
};
