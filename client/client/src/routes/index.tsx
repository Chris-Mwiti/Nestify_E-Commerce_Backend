import { AnalyticsPreviewCard } from "@/pages/Home/components/AnalyticsPreviewCard";
import OverallSalesAnalytics from "@/pages/Home/components/OverallSalesAnalytics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="w-full h-full grid grid-cols-2 space-y-4">
      <div className="w-full grid grid-cols-3 col-span-2 gap-3">
        <AnalyticsPreviewCard
          series={[
            {
              name: "Product sales",
              data: [100, 20, 400, 300, 100, 80, 50],
            },
          ]}
          analyticsReport={{
            status: "rise",
            percentage: 0.6,
          }}
          title="Product Sales"
          subtitle="500"
        />
        <AnalyticsPreviewCard
          series={[
            {
              name: "Orders",
              data: [30, 20, 400, 10, 6, 80, 50],
            },
          ]}
          analyticsReport={{
            status: "fall",
            percentage: 0.6,
          }}
          title="Orders"
          subtitle="40"
          options={{
            colors: ["#7c3aed"],
          }}
        />
        <AnalyticsPreviewCard
          series={[
            {
              name: "Income",
              data: [1000, 1200, 600, 1800, 800, 500, 1100],
            },
          ]}
          analyticsReport={{
            status: "rise",
            percentage: 1.0,
          }}
          title="Income"
          subtitle="5,045"
          options={{
            colors: ["#4ade80"],
          }}
        />
      </div>
      {/* General Sales Report */}
      <OverallSalesAnalytics
        series={[
          {
            name: "Sales",
            data: [80, 100, 120, 45, 80, 80, 100],
          },
        ]}
        title="Sales"
        subtitle="Weekly sales of product"
        options={{
          grid: {
            borderColor: "#525252",
            strokeDashArray: 3,
          },
          tooltip: {
            theme: "dark",
          },
          markers: {
            size: 0,
          },
          xaxis: {
            categories: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
            labels: {
              style: {
                colors: "#d4d4d4",
                fontSize: "14px",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: "#d4d4d4",
                fontSize: "14px",
              },
            },
          },
        }}
      />
    </div>
  );
}
