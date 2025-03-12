

import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { ReducerType } from '../../../interface/interface';

const MuolajaChart = () => {
    const { statisticaData } = useSelector((state: ReducerType) => state.StatisticaReducer);

    const value = (statisticaData?.mulojagayozilgnlar ?? 0); // Fallback to 0 if undefined
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
                        fontSize: '1.5rem',
                        color: '#333',
                        offsetY: 70,
                    },
                    value: {
                        offsetY: -10,
                        fontSize:'3rem',
                        color: '#111',
                        formatter: (val: number) => `${val}%`,
                    },
                },
            },
        },
        fill: {
            colors: ['#20E647'],
        },
        labels: ['Muolajaga o`tish'],
    };
    // const series = [((value / maxValue) * 100).toFixed(2)];
    const series = [((value / maxValue) * 100)?.toFixed(2)] as any;  // Convert the value to percentage
    return <div className='main_chart'>
        <Chart options={options} series={series} type="radialBar"  style={{ height: '100%' }} />
    </div>
};

export default MuolajaChart;
