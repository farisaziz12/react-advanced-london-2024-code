import { FakerStructure } from "@/types";

export const getBirthdaysByMonth = (data: FakerStructure[]) =>
  data.reduce((acc: Record<number, number>, individual) => {
    const month = new Date(individual.dateOfBirth).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

export const mapChartData = (birthdayCountsByMonth: Record<number, number>) => {
  return Object.keys(birthdayCountsByMonth).map((month: string) => ({
    month: new Date(0, Number(month)).toLocaleString("default", { month: "long" }),
    birthdays: birthdayCountsByMonth[Number(month)],
  }));
};
