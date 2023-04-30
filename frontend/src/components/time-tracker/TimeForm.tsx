import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Modal, Text, Textarea, useModal, useToasts } from '@geist-ui/core';
import { useCallback, useState } from 'react';
import { css } from '@emotion/react';
import { FetchError, useApi } from '@hooks/useApi';
import { DateRangePicker } from 'rsuite';
import moment from 'moment';

type TimeFormProps = {
  isVisible: boolean;
  onClosing: () => void;
};

export const TimeForm = (props: TimeFormProps) => {
  const { setVisible, bindings } = useModal(props.isVisible);
  const { setToast } = useToasts();
  const { times: { apiUpsertTime } } = useApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [dates, setDates] = useState<[Date, Date]>([
    new Date(),
    moment().add(1, 'hours').toDate(),
  ]);

  const onSubmit: SubmitHandler<FieldValues> = useCallback((data) => {
    const dateFrom = moment(dates[0]);
    const dateTo = moment(dates[1]);

    apiUpsertTime({
      project: data.project ?? '',
      description: data.description ?? '',
      startingTime: dateFrom.unix(),
      duration: Math.abs(dateTo.diff(dateFrom, 'seconds')),
    })
        .then(() => setToast({
          type: 'success',
          text: `Un temps pour le projet "${data.project}" a été créé avec succès`,
        }))
        .catch(({ error }: FetchError) => setToast({ type: 'error', text: error }))
        .finally(props.onClosing);
  }, [dates]);

  const onCancel = useCallback(() => {
    setVisible(false);
    props.onClosing();
  }, []);

  return (
      <Modal {...bindings}>
        <Modal.Title>Créer un temps</Modal.Title>
        <Modal.Content>
          <form css={formCss}>
            <label>
              <div>Nom du projet</div>
              <Input width={'100%'}
                     {...register('project', { maxLength: 32 })}/>
              <Text small type={'error'}>
                {errors.project
                    ? <>Ce champ doit être inférieur à 32 caractères.</>
                    : <>&nbsp;</>}
              </Text>
            </label>

            <label>
              <div>Description de la tâche</div>
              <Textarea width={'100%'}
                        rows={4}
                        resize={'vertical'}
                        {...register('description', { maxLength: 280 })}/>
              <Text small type={'error'}>
                {errors.description
                    ? <>Ce champ doit être inférieur à 280 caractères.</>
                    : <>&nbsp;</>}
              </Text>
            </label>

            <label>
              <div>Durée de la tâche</div>
              <DateRangePicker isoWeek
                               value={dates} onChange={(dates) => dates && setDates(dates)}
                               placement={'auto'}
                               format="dd LLL. yyyy HH:mm:ss"
                               placeholder={'Sélectionnez la durée de votre tâche'}/>
            </label>
          </form>
        </Modal.Content>
        <Modal.Action passive onClick={onCancel}>Annuler</Modal.Action>
        <Modal.Action onClick={handleSubmit(onSubmit)}>Créer</Modal.Action>
      </Modal>
  );
};

const formCss = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;