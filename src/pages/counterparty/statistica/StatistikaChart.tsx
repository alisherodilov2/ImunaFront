

import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { ReducerType } from '../../../interface/interface';

const StatistikaChart = ({
    foiz = 0,
    range = '#20E647',
    gradient= false
}: {
    foiz?: number,
    range?: string,
    gradient?:boolean
}) => {
    const { statisticaData } = useSelector((state: ReducerType) => state.StatisticaReducer);

    const value = foiz?.toFixed(2) as any; // Fallback to 0 if undefined
    const maxValue = 100; // Set this to the maximum range of your speedometer
    const series = [value>0  ?  ((value / maxValue) * 100).toFixed(2) : 0] as any; 
    const chartType: 'radialBar' = 'radialBar';
    const colorGradient = (foiz: any) => {
        if (foiz <= 25) {
            return '#ff3e1d'
        }
        if (foiz <= 50) {
            return '#ffab00'
        }
        if(foiz==100){
            
            return '#71dd37'
        }
      
            return '#696cff'
        
    }
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
            colors: [gradient? colorGradient(series) :  range],
        },
        labels: [''],
    };
  // Convert the value to percentage
    return <Chart options={options} series={series} type="radialBar" style={{ width: '100%', height: '100%' }} />
};

export default StatistikaChart;
