import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApexOptions } from "apexcharts"
import Chart from 'react-apexcharts'

interface IOverallSalesAnalytics {
    series:ApexAxisChartSeries | ApexNonAxisChartSeries,
    options?: ApexOptions,
    title: string,
    subtitle: string
}

const OverallSalesAnalytics = ({ series, options, title, subtitle}: IOverallSalesAnalytics) => {
  return (
    <div className="col-span-2 w-full">
        <Card className="w-full shadow-md">
            <CardContent className="w-full h-max">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{subtitle}</CardDescription>
                </CardHeader>
                <Chart series={series} type="area" options={{
                    series,
                   chart:{
                    type: "area",
                   },
                   dataLabels:{
                    enabled: true
                   },
                   fill:{
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops:[0,100]
                    }
                   },
                   ...options 
                }}
                width={"100%"}
                height={300}
                />
            </CardContent>
        </Card>
    </div>
  )
}

export default OverallSalesAnalytics