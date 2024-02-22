import React from "react";
import dynamic from "next/dynamic";
import { ChartData } from "@/types";

const Column = dynamic(() => import("@ant-design/charts").then((mod) => mod.Column), {
  ssr: false,
});

function BirthdayBarChart({ data }: { data: ChartData[] }) {
  const config = {
    data,
    yField: "birthdays",
    xField: "month",
    seriesField: "month",
    legend: {
      position: "top-left",
    },
  };

  return <Column {...config} />;
}

export default BirthdayBarChart;
