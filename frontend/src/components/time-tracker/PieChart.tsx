import BillboardJS, { IChart } from '@billboard.js/react';
import bb, { ChartOptions, pie } from 'billboard.js';
import { useEffect, useRef } from 'react';
import { css } from '@emotion/react';

type PieChartProps = {
  columnsData: [string, number][];
  formatLabel?: (value: number, ratio: number, id: string) => string,
};

export const PieChart = (props: PieChartProps) => {
  const chartComponent = useRef<IChart>(null);

  const options: ChartOptions = {
    data: {
      type: pie(),
      columns: props.columnsData,
    },
    pie: {
      padding: 3,
      label: {
        format: props.formatLabel,
        ratio: 1,
      },
    },
  };

  useEffect(() => {
    const chart = chartComponent.current?.instance;

    if (!chart) return;
    chart.load({ columns: props.columnsData });
  }, [props.columnsData]);

  return (
      <div css={chartCss}>
        <BillboardJS bb={bb}
                     ref={chartComponent}
                     options={options}
                     className={'bb'}/>
      </div>
  );
};

const chartCss = css`
  width: 500px;
`;
