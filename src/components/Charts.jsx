import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
);
 
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];



export const BarChart = ({ horizontal = false , data1 , data2 , title1, title2 , bgColor1, bgColor2, labels = months }) =>{
   
    const options = {
        responsive: true,
        indexAxis: horizontal? "y" : "x",
        plugins: {
          legend: {
            display: false,
            position: 'top' 
              },
          title: {
            display: true,
          },
        },   
        scales: {
            x: {
                beginAtZero: true,
                grid:{
                    display: false,
                }
            },
            y: {
             grid:{
                    display: false,
                }            },
          },
      };
      
       const data = {
        labels,
        datasets: [
          {
            label: title1,
            data: data1,
            backgroundColor: bgColor1,
          },
          {
            label: title2,
            data: data2,
            backgroundColor: bgColor2,
          },
        ],
      };

    return <Bar options={options} data={data} />;
}


export const LineChart = ({ data, title, bgColor, borderColor, labels = months}) =>{
    console.log(bgColor)
    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
              },
          title: {
            display: true,
          },
        },   
        scales: {
            x: {
                beginAtZero: true,
                grid:{
                    display: false,
                }
            },
            y: {
             grid:{
                    display: false,
                }            },
          },
      };
      
       const Linedata = {
        labels,
        datasets: [
          {
            fill: true,
            label: title,
            data: data,
            backgroundColor: bgColor,
            borderColor,
          },
        ],
      };

    return <Line options={options} data={Linedata} />;
}


export const DoughnutChart = ({ data, bgColor, labels, cutout = '50%', legend = true, offset = 0 }) => {
  const doughnutData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: bgColor,
        borderWidth: 0,
        offset,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: `${cutout}%`,
    plugins: {
      legend: {
        display: legend,
        position: 'bottom',
        labels:{
          padding: 40,
        }
      },
    
    },
  };

  return <Doughnut data={doughnutData} options={options} />;
};


export const PieChart = ({ data, bgColor, labels, offset = 0 }) => {
  const PieChartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: bgColor,
        borderWidth: 1,
        offset,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    
    },
  };

  return <Pie data={PieChartData} options={options} />;
};