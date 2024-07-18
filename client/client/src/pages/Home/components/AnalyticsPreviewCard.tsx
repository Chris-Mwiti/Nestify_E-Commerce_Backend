import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApexOptions } from "apexcharts";
import { MoveDownRight, MoveUpRight } from "lucide-react";
import Chart from "react-apexcharts";

export interface IAnalyticsProps {
  title: string;
  subtitle: string;
  analyticsReport: {
    status: "rise" | "fall";
    percentage: number;
  };
  series: ApexAxisChartSeries | ApexAxisChartSeries;
  options?: ApexOptions;
}

export const AnalyticsPreviewCard = ({
  series,
  options,
  title,
  subtitle,
  analyticsReport,
}: IAnalyticsProps) => {
  return (
    <Card className="
      sm:w-[350px]
      2xl:w-[500px]
    ">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3">
          <p className="text-4xl font-bold">{subtitle}</p>
          <span className="flex space-x-2">
            <span
              className={`size-7 flex items-center justify-center  rounded-full ${analyticsReport.status == "rise" ? "bg-green-300/10" : "bg-red-400/10"}`}>
              {analyticsReport.status == "rise" ? (
                <MoveUpRight className="stroke-green-500 size-5" />
              ) : (
                <MoveDownRight className="stroke-red-500 size-5" />
              )}{" "}
            </span>
            <p className="text-lg">
              {analyticsReport.status == "rise"
                ? `${analyticsReport.percentage}% more than last week`
                : `${analyticsReport.percentage}% less than last week`}
            </p>
          </span>
        </div>
        <Chart
          type="line"
          series={series}
          options={{
            series,
            chart: {
              height: 250,
              type: "line",
              zoom: {
                enabled: false,
              },
              toolbar: {
                show: false,
              },
            },
            tooltip: {
              theme: "dark",
            },
            dataLabels: {
              enabled: false,
            },
            markers:{
                size: 3
            },
            stroke: {
              curve: "smooth",
            },
            grid: {
              show: false,
            },
            xaxis: {
              labels: {
                show: false,
              },
              categories: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
            },
            yaxis: {
              labels: {
                show: false,
              },
            },
            ...options,
          }}
          width={"100%"}
          height={100}
        />
      </CardContent>
    </Card>
  );
};
