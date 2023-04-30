import { Button, Text, useToasts } from '@geist-ui/core';
import { AiOutlineEdit, FaTrash } from 'react-icons/all';
import { css } from '@emotion/react';
import { Time } from '@/typings/time.type';
import { FetchError, useApi } from '@hooks/useApi';
import { useCallback } from 'react';
import moment from 'moment';

type TimeCardProps = {
  time: Time;
  hasChanged: (timeUuid: string) => void;
};

export const TimeCard = ({ time, hasChanged }: TimeCardProps) => {
  const { setToast } = useToasts();
  const { times: { apiDeleteTime } } = useApi();

  const dateFormat = new Intl.DateTimeFormat('fr', { dateStyle: 'medium', timeStyle: 'medium' });
  const dateFrom = new Date(time.startingTime * 1000);
  const dateTo = new Date((time.startingTime + time.duration) * 1000);

  const deleteTime = useCallback(() => {
    if (!time.uuid) return;
    apiDeleteTime(time.uuid)
        .then(() => setToast({
          type: 'success',
          text: `Temps du projet "${time.project}" d'un durée de ${time.duration / 60} minutes supprimé avec succès`,
        }))
        .then(() => time.uuid && hasChanged(time.uuid))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }));
  }, [time.uuid]);

  return (
      <div css={cardCss}>
        <div css={contentCss}>
          <h3>{time.project}</h3>
          {time.description !== ''
              ? (<div>{time.description}</div>)
              : <Text type={'secondary'} margin={0}>Pas de description...</Text>}
        </div>

        <div css={footerCss}>
          <div css={datesCss}>{dateFormat.formatRange(dateFrom, dateTo)}</div>
          <div css={datesCss}>Durée&nbsp;: <i>{moment.duration(time.duration, 'seconds').humanize()}</i></div>
          <div css={actionsCss}>
            <Button type={'error'}
                    auto scale={1 / 2}
                    font={'12px'}
                    icon={<FaTrash/>}
                    onClick={deleteTime}
            >Supprimer</Button>
            <Button type={'success'}
                    auto scale={1 / 2}
                    font={'12px'}
                    icon={<AiOutlineEdit/>}
            >Modifier</Button>
          </div>
        </div>
      </div>);
};

const cardCss = css`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 400px;
  min-width: 300px;
  font-weight: normal;

  .content {
    flex: 1;
  }
`;

const contentCss = css`
  min-height: 125px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  text-align: justify;
`;

const footerCss = css`
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;
  border-top: 1px solid #ccc;
`;

const datesCss = css`
  font-weight: lighter;
`;

const actionsCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;
