import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface DataItem {
  name: string;
  count: number;
}

interface ChartProps {
  data: DataItem[];
}

const DumaloqChart: React.FC<ChartProps> = ({ data }) => {
  // Grafik uchun ma'lumotlar
  const chartData = {
    series: data.map(item => item?.count ?? 0), // 'count' qiymatlarini olish
    labels: data.map(item => item?.name),  // 'name' qiymatlarini olish
  };

  // Grafik sozlamalari (options)
  const chartOptions = {
    chart: {
      type: 'pie', // Grafik turini 'pie' (dumalovchi) qilib belgilash
      height: 350,
    },
    title: {
      text: '', // Grafik sarlavhasi
      align: 'center',
      style: {
        fontSize: '1rem', // Sarlavha font o'lchami
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
      },
    },
    labels: chartData.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
          },
        },
      },
    ],
    // X-axis label font size o'zgartirish
    plotOptions: {
      pie: {
        expandOnClick: false,
        customScale: 1.0,
      },
    },
    // Legend (afzalliklar) font o'lchami
    legend: {
      position: 'bottom',
      fontSize: '15px',
    },
  } as any;

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartData.series}
        type="pie"
        height={550}
      />
    </div>
  );
};

export default DumaloqChart;
