

import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { ReducerType } from '../../../interface/interface';

const StatistikaChart = ({
    foiz = 0,
    range = '#20E647'
}: {
    foiz?: number,
    range?: string
}) => {
    const { statisticaData } = useSelector((state: ReducerType) => state.StatisticaReducer);

    const value = foiz as any; // Fallback to 0 if undefined
    const maxValue = 100; // Set this to the maximum range of your speedometer
    const chartType: 'radialBar' = 'radialBar';
    const options = {
        chart: {
            type: chartType,
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                track: {
                    background: '#e7e7e7',
                    strokeWidth: '97%',
                    margin: 5, // space between data and track
                },
                dataLabels: {
                    name: {
                        fontSize: '18px',
                        color: '#333',
                        offsetY: 70,
                    },
                    value: {
                        offsetY: -10,
                        fontSize: '18px',
                        color: '#111',
                        formatter: (val: number) => `${val}%`,
                    },
                },
            },
        },
        fill: {
            colors: [range],
        },
        labels: [''],
    };
    const series = [((value / maxValue) * 100)?.toFixed(2)] as any;  // Convert the value to percentage
    return <Chart options={options} series={series} type="radialBar" style={{ width: '100%', height: '100%' }} />
};

export default StatistikaChart;
