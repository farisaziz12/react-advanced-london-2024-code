// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChartData, FakerStructure } from "@/types";
import { getBirthdaysByMonth, mapChartData } from "@/utils/dataMappers";
import { fakerStructure, objectToQueryString } from "@/utils/faker";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      data: FakerStructure[];
      chartData: ChartData[];
      total: number;
    }
  | {
      message: string;
    };

export const getFakeData = async (
  quantity?: number,
  signal?: AbortSignal
): Promise<FakerStructure[]> => {
  const responses = await Promise.allSettled(
    Array.from({ length: quantity ?? 5 }, (_, i) =>
      fetch(
        `https://fakerapi.it/api/v1/custom?_quantity=1000&${objectToQueryString(
          fakerStructure
        )}`,
        { signal }
      ).then((res) => res.json())
    )
  );

  // Check if any of the promises were rejected and throw an error
  const rejectedResponse = responses.find(
    (response) => response.status === "rejected"
  ) as PromiseRejectedResult | undefined;

  if (rejectedResponse && !(rejectedResponse.reason instanceof DOMException)) {
    throw new Error("One or more requests failed.");
  }

  // Filter out the successful responses
  const successfulResponses = responses.filter(
    (response): response is PromiseFulfilledResult<{ data: any }> =>
      response.status === "fulfilled"
  );
  // Get the data from the successful responses
  const successfulResponsesData = successfulResponses.map(
    (response) => response.value.data
    );
  // Flatten the data
  const flattenedData = successfulResponsesData.flat();

  // Return the data
  return flattenedData;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    // reject all requests that are not GET
    if (req.method !== "GET") {
      res.status(405).json({ message: "Method Not Allowed" });
      return;
    }

    // get the data

    const data = await getFakeData(Number(req.query.quantity));

    const birthdayCountsByMonth = getBirthdaysByMonth(data);
    const chartData = mapChartData(birthdayCountsByMonth);

    res.status(200).json({ total: data.length, data, chartData });
  } catch (error) {
    console.error(error);
  }
}
