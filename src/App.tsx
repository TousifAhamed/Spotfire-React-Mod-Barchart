import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";

interface AppProps {
    mod: Spotfire.Mod;
    dataView: Spotfire.DataView;
    windowSize: Spotfire.Size;
}

const App: React.FC<AppProps> = ({ mod, dataView, windowSize }) => {
    const [chartData, setChartData] = useState<{ x: string; y: number; color: string; colorValue: string; isMarked: boolean; rowRef: Spotfire.DataViewRow }[]>([]);
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            async function logDataView(dataView: Spotfire.DataView) {
                const axes = await dataView.axes();
                console.log("Axes:", axes.map(axis => axis.name).join(","));
                const rows = await dataView.allRows();
                if (!rows) return;
                rows.forEach(row => {
                    console.log(
                        axes.map(axis => {
                            if (axis.isCategorical) {
                                return row.categorical(axis.name).formattedValue();
                            }
                            return row.continuous(axis.name).value();
                        }).join(",")
                    );
                });
            }
            await logDataView(dataView);

            const axes = await dataView.axes();
            const rows = await dataView.allRows();
            if (!rows) {
                setChartData([]);
                return;
            }
            const xAxis = axes.find(axis => axis.name === "X");
            const yAxis = axes.find(axis => axis.name === "Y");
            const colorAxis = axes.find(axis => axis.name === "Color");
            const data = rows.map(row => {
                const x = xAxis && xAxis.isCategorical
                    ? row.categorical(xAxis.name).formattedValue()
                    : xAxis && row.continuous(xAxis.name).value();
                const y = yAxis && yAxis.isCategorical
                    ? row.categorical(yAxis.name).formattedValue()
                    : yAxis && row.continuous(yAxis.name).value();
                let color = "#3399FF";
                let colorValue = "";
                if (colorAxis) {
                    const colorVal = row.color();
                    if (colorVal && colorVal.hexCode) color = colorVal.hexCode;
                    if (colorAxis.isCategorical) {
                        colorValue = row.categorical(colorAxis.name).formattedValue();
                    } else {
                        const val = row.continuous(colorAxis.name).value();
                        colorValue = val == null ? "" : String(val);
                    }
                }
                const isMarked = row.isMarked && row.isMarked();
                if (typeof x === "string" && typeof y === "number" && !isNaN(y)) {
                    return { x, y, color, colorValue, isMarked, rowRef: row };
                }
                return null;
            }).filter(Boolean) as { x: string; y: number; color: string; colorValue: string; isMarked: boolean; rowRef: Spotfire.DataViewRow }[];
            setChartData(data);
        };
        fetchData();
    }, [dataView]);

    useEffect(() => {
        if (chartData.length > 0 && chartRef.current) {
            const chart = echarts.init(chartRef.current);
            chart.setOption({
                xAxis: { type: "category", data: chartData.map(d => d.x) },
                yAxis: { type: "value" },
                tooltip: {
                    trigger: "item",
                    formatter: (params: any) => {
                        const d = chartData[params.dataIndex];
                        return `${d.x}<br/>Value: ${d.y}<br/>Color: ${d.colorValue}`;
                    }
                },
                series: [{
                    type: "bar",
                    data: chartData.map(d => ({
                        value: d.y,
                        itemStyle: {
                            color: d.color,
                            opacity: d.isMarked ? 1 : 0.5,
                            borderColor: d.isMarked ? "#000" : undefined,
                            borderWidth: d.isMarked ? 2 : 0
                        }
                    })),
                    emphasis: {
                        itemStyle: {
                            borderColor: "#FF9900",
                            borderWidth: 3
                        }
                    }
                }]
            });
            chart.on("click", (params: any) => {
                const d = chartData[params.dataIndex];
                if (d && d.rowRef && d.rowRef.mark) {
                    d.rowRef.mark("ToggleOrAdd");
                }
            });
            // Resize chart when window or container size changes
            const handleResize = () => {
                chart.resize();
            };
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
                chart.dispose();
            };
        }
    }, [chartData, mod, windowSize]);

    return (
        <div style={{ width: windowSize.width, height: windowSize.height }}>
            <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
};

export default App;