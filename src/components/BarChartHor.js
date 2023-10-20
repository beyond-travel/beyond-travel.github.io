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

export default function BarChartHor({
    title = 'Titel',
    labels = ['Adult', 'Student', 'Senior'],
    dataSets = [[34, 10, 23], [10, 23, 23]] }) {
    console.log('dataSets --- ', dataSets)
    // const heightOfChart = labels.length * 40 + 100
    const options = {

        elements: {
            bar: {
                borderWidth: 2,
            },
        },

        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: ' ',
            },
        },
    };

    const data = {
        labels,
        datasets:
            [
                {
                    label: 'Caregivers',
                    data: dataSets[0],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Children',
                    data: dataSets[1],
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                // {
                //     label: 'Evening',
                //     data: dataSets[2],
                //     backgroundColor: 'rgb(75, 192, 192)',
                // },
                // {
                //     label: 'Night',
                //     data: dataSets[3],
                //     backgroundColor: 'rgba(153, 102, 255, 0.2)',
                // },
            ]


    };

    return <Bar options={options} data={data}
        height={400}
        width={500}
        responsive={true}
        maintainAspectRatio={false}
    />;
}