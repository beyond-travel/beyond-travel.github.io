import * as React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Faker as faker } from '@faker-js/faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// export const 

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// export 

export default function BarChart({
    title = 'Titel',
    labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    dataSets = [[10, 23, 34, 10, 23], [10, 23, 34, 10, 23], [10, 23, 34, 10, 23], [10, 23, 34, 10, 23]] }) {

    const heightOfChart = labels.length * 40 + 100
    const options = {
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },

        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: '',
            },
        },
    };

    const data = {
        labels,
        datasets: dataSets,
        // [
        //     {
        //         label: 'Morning',
        //         data: dataSets[0],
        //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
        //     },
        //     {
        //         label: 'Noon',
        //         data: dataSets[1],
        //         backgroundColor: 'rgba(53, 162, 235, 0.5)',
        //     },
        //     {
        //         label: 'Evening',
        //         data: dataSets[2],
        //         backgroundColor: 'rgb(75, 192, 192)',
        //     },
        //     {
        //         label: 'Night',
        //         data: dataSets[3],
        //         backgroundColor: 'rgba(153, 102, 255, 0.2)',
        //     },
        // ]


    };

    return <Bar options={options} data={data}
        height={heightOfChart}
        width={500}
        responsive={true}

        redraw={true} />;
}