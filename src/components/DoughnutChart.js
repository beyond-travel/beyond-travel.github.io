import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = ['#FFD1DC',
    '#FFB6C1',
    '#FFDAC1',
    '#FFE6B3',
    '#E6C3FF',
    '#C1D1FF',
    '#AEEEEE',
    '#B2F1E0',
    '#FFDAB9',
    '#FFB6C1',
    '#D1FFC1',
    '#B9C1FF',
    '#F1CBFF',
    '#FFD1C1',
    '#FFE0B3',
    '#C1E1FF',
    '#D1FFE1',
    '#E1C1FF',
    '#C1FFE8',
    '#E6B3FF',]

const darkerColors = [
    '#FFB7C6',
    '#FF9AA7',
    '#FFB28A',
    '#FFC897',
    '#D4A0FF',
    '#A7B6FF',
    '#97A1A1',
    '#A5E2D2',
    '#FFB28B',
    '#FF9AA7',
    '#A7FF9A',
    '#8B97FF',
    '#DAA5FF',
    '#FFB7A7',
    '#FFC089',
    '#A7C5FF',
    '#B2FFC5',
    '#C5A7FF',
    '#9AFFD3',
    '#D2A7FF',
]

export default function DoughnutChart({ labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], data = [12, 19, 3, 5, 2, 3] }) {
    const circleHeight = labels.length * 40 + 500
    const dataSet = {
        labels,
        datasets: [
            {
                label: '# of People',
                data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: darkerColors.slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    };
    return <Doughnut data={dataSet} maintainAspectRatio={false} height={circleHeight} redraw={true} />;
}




// export default function BarChart({
//     title = 'Titel',
//     labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//     dataSets = [[10, 23, 34, 10, 23], [10, 23, 34, 10, 23], [10, 23, 34, 10, 23], [10, 23, 34, 10, 23]] }) {

//     const heightOfChart = labels.length * 40 + 100
//     const options = {
//         indexAxis: 'y',
//         elements: {
//             bar: {
//                 borderWidth: 2,
//             },
//         },
//         scales: {
//             x: {
//                 stacked: true,
//             },
//             y: {
//                 stacked: true,
//             },
//         },

//         plugins: {
//             legend: {
//                 position: 'right',
//             },
//             title: {
//                 display: true,
//                 text: 'Chart.js Horizontal Bar Chart',
//             },
//         },
//     };

//     const data = {
//         labels,
//         datasets: dataSets,
//         // [
//         //     {
//         //         label: 'Morning',
//         //         data: dataSets[0],
//         //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         //     },
//         //     {
//         //         label: 'Noon',
//         //         data: dataSets[1],
//         //         backgroundColor: 'rgba(53, 162, 235, 0.5)',
//         //     },
//         //     {
//         //         label: 'Evening',
//         //         data: dataSets[2],
//         //         backgroundColor: 'rgb(75, 192, 192)',
//         //     },
//         //     {
//         //         label: 'Night',
//         //         data: dataSets[3],
//         //         backgroundColor: 'rgba(153, 102, 255, 0.2)',
//         //     },
//         // ]


//     };
//     console.log('labels ----', labels)
//     return <Bar options={options} data={data}
//         height={heightOfChart}
//         responsive={true}
//         maintainAspectRatio={false}
//         redraw={true} />;
// }