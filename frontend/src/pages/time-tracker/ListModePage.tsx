import { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, useToasts } from '@geist-ui/core';
import { DateRangePicker } from 'rsuite';
import { DateRange } from 'rsuite/DateRangePicker';
import { frFR } from 'rsuite/locales';
import { css } from '@emotion/react';
import moment from 'moment/moment';
import { FetchError, useApi } from '@hooks/useApi';
import { Time } from '@/typings/time.type';
import { TimeCard } from '@components/ui/TimeCard';

export const ListModePage = () => {
  const { setToast } = useToasts();
  const { times: { apiGetTimesFromRange } } = useApi();
  const [times, setTimes] = useState<Time[]>([]);

  const week = useMemo(() => ({
    start: moment().startOf('isoWeek').toDate(),
    end: moment().endOf('isoWeek').toDate(),
  }), []);

  const fetchTimesFromRange = useCallback((weekStart: Date, weekEnd: Date) => {
    return apiGetTimesFromRange(weekStart, weekEnd)
        .then((times) => setTimes(times))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
  }, [setTimes]);

  useEffect(() => {
    fetchTimesFromRange(week.start, week.end);
  }, []);

  const onRangeChange = useCallback((range: DateRange | null) => {
    if (null === range) return;
    fetchTimesFromRange(range[0], range[1]);
  }, []);

  return (
      <div css={containerCss}>
        <div>
          <h2>Sélectionnez une date</h2>
          <DateRangePicker isoWeek cleanable={false}
                           format={'dd LLL. yyyy'}
                           locale={frFR.DateRangePicker}
                           defaultValue={[week.start, week.end]}
                           onChange={onRangeChange}/>
        </div>

        <div>
          <h2>Temps créés</h2>
          <Grid.Container gap={2} justify={'flex-start'} height={'100%'}>
            {times.map((time, i) => (
                <Grid>
                  <TimeCard key={i} time={time}/>
                </Grid>))}
          </Grid.Container>
        </div>
      </div>
  );
};

const containerCss = css`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 3rem;
  
  h2 {
    font-size: 1.75rem;
  }
`;
