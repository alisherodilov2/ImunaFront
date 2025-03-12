import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartTypeSelectorProps {
  data: any;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ data }) => {
    type ChartType = 'line' | 'bar' | 'pie' | 'radialBar';

    const [chartType, setChartType] = useState<ChartType>('line');

  // Grafik sozlamalari (configuration)
  interface ChartOptions {
    chart: {
      id: string;
    };
    xaxis: {
      categories: any;
    };
    title: {
      text: string;
      align: "center" | "left" | "right" | undefined;
    };
  }
  
  const chartOptions: ChartOptions = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: data.categories,
    },
    title: {
      text: `Grafik turi: ${chartType}`,
      align: "center",
    },
  };

  // Grafik turlari
  const chartTypes = {
    line: {
      type: 'line',
      series: [{ name: 'Data', data: data.values }],
    },
    bar: {
      type: 'bar',
      series: [{ name: 'Data', data: data.values }],
    },
    pie: {
      type: 'pie',
      series: data.values,
      labels: data.categories,
    },
    radialBar: {
      type: 'radialBar',
      series: data.values,
    },
  } as any;

  // Grafikni yangilash uchun chart turlari o'zgartirilganida
  const handleChartTypeChange = (type: string) => {
    setChartType(type as ChartType);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleChartTypeChange('line')}>Chiziqli Grafik</button>
        <button onClick={() => handleChartTypeChange('bar')}>Ustunli Grafik</button>
        <button onClick={() => handleChartTypeChange('pie')}>Aylanishli Grafik</button>
        <button onClick={() => handleChartTypeChange('radialBar')}>Radial Bar Grafik</button>
      </div>

      <ReactApexChart
        options={chartOptions}
        series={chartTypes[chartType].series}
        type={chartTypes[chartType].type}
        height={350}
      />
    </div>
  );
};

export default ChartTypeSelector;
