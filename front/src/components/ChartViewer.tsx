import React, { useState } from 'react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function ApexChart(props) {
    const series = [
        {
            name: 'xx',
            data: props.data,
        },
    ]
    const options = {
        chart: {
            height: 200,
            type: 'line',
            zoom: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            type: 'datetime',
            // range: 2700000,
            // min: now,
        },
        stroke: {
            width: 2,
            curve: 'smooth',
        },
        colors: ['#210124'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: true,
                gradientToColors: ['#DB162F'],
                opacityFrom: 1,
                opacityTo: 1,
                type: 'vertical',
                stops: [0, 30],
            },
        },
    }

    return (
        <div id="chart">
            <Chart options={options} series={series} type="line" height={200} />
        </div>
    )
}
