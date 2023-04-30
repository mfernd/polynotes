import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Grid, useToasts } from '@geist-ui/core';
import { DateRangePicker } from 'rsuite';
import { DateRange } from 'rsuite/DateRangePicker';
import { frFR } from 'rsuite/locales';
import { css } from '@emotion/react';
import moment from 'moment/moment';
import { FetchError, useApi } from '@hooks/useApi';
import { Time } from '@/typings/time.type';
import { TimeCard } from '@components/time-tracker/TimeCard';
import { Card } from '@components/ui/Card';
import { FiRefreshCcw } from 'react-icons/all';

export const ListModePage = () => {
  const { setToast } = useToasts();
  const { times: { apiGetTimesFromRange } } = useApi();
  const [times, setTimes] = useState<Time[]>([]);

  const [dates, setDates] = useState<[Date, Date]>([
    moment().startOf('isoWeek').toDate(),
    moment().endOf('isoWeek').toDate(),
  ]);

  const fetchTimesFromRange = useCallback(([weekStart, weekEnd]: [Date, Date]) => {
    return apiGetTimesFromRange(weekStart, weekEnd)
        .then((times) => setTimes(times))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
  }, [setTimes]);

  useEffect(() => {
    fetchTimesFromRange(dates);
  }, [dates]);

  // DateRangePicker onChange handler
  const onRangeChange = useCallback((dateRange: DateRange | null) => {
    if (null === dateRange) return;
    setDates(dateRange);
    fetchTimesFromRange(dateRange);
  }, []);

  return (
      <div css={containerCss}>
        <div>
          <h2>Sélectionnez une date</h2>
          <DateRangePicker isoWeek cleanable={false}
                           format={'dd LLL. yyyy'}
                           locale={frFR.DateRangePicker}
                           value={dates}
                           onChange={onRangeChange}/>
        </div>

        <div>
          <div css={yourTimesHeadingCss}>
            <Badge.Anchor>
              <Badge type={'success'}>{times.length}</Badge>
              <h2>Vos temps</h2>
            </Badge.Anchor>
            <Button type={'default'}
                    title={'Rafraîchir'}
                    auto scale={1 / 3}
                    font={'12px'} onClick={() => fetchTimesFromRange(dates)}>
              <FiRefreshCcw/>
            </Button>
          </div>
          {times.length > 0
              ? (
                  <Grid.Container gap={3} justify={'flex-start'} height={'100%'}>
                    {times.map((time, i) => (
                        <Grid key={i}><TimeCard time={time} hasChanged={() => fetchTimesFromRange(dates)}/></Grid>))}
                  </Grid.Container>)
              : (
                  <Card cardContentCss={noPagesCss}>
                    <span css={css`font-size: 2.5rem;`}>⛱</span>
                    <div css={css`flex: 1;`}>Vous n'avez rien créé dans cet interval de dates.</div>
                  </Card>)}
        </div>
      </div>
  );
};

const containerCss = css`
  margin-top: 1rem;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 3rem;

  h2 {
	  font-size: 1.75rem;
  }
`;

const yourTimesHeadingCss = css`
  display: flex;
  align-items: baseline;
  gap: 2rem;
`;

const noPagesCss = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
  padding: 0;
`;
