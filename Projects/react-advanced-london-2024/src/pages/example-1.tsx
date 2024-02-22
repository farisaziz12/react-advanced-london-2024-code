import { Inter } from "next/font/google";
import { Container, Text, Loader, Center, Button } from "@mantine/core";
import { useFetchData } from "@/utils/hooks/useFetchData";
import BirthdayBarChart from "@/components/BirthdaysBarChart";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const QUANTITY = 5;

const View = () => {
  const { data, isLoading, error } = useFetchData(async ({ signal, setData }) => {
    const response = await fetch(`/api/faker?quantity=${QUANTITY}`, { signal });
    if (!response.ok) throw new Error("Network response was not ok");
    const result = await response.json();
    setData(result);
  });

  if (isLoading)
    return (
      <Container size="lg" style={{ minHeight: "100vh" }} p="xl">
        <Center>
          <Loader variant="dots" />
        </Center>
      </Container>
    );

  if (error)
    return (
      <Container size="lg" style={{ minHeight: "100vh" }} p="xl">
        <Center>Error: {error.message}</Center>
      </Container>
    );

  return (
    <Container size="lg" style={{ minHeight: "100vh" }} p="xl">
      <Text ta="center" size="xl" style={{ marginBottom: "24px" }}>
        <strong>Individuals:</strong> {data?.data.length}
      </Text>

      <BirthdayBarChart data={data?.chartData ?? []} />
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
