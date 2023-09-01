import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AutoComplete, Modal, Text, Textarea, useModal, useToasts } from '@geist-ui/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { FetchError, useApi } from '@hooks/useApi';
import { DateRangePicker } from 'rsuite';
import moment from 'moment';
import { Time } from '@/typings/time.type';

type TimeFormProps = {
  time?: Time;
  isVisible: boolean;
  onClosing: () => void;
};

export const TimeForm = (props: TimeFormProps) => {
  const { setVisible, bindings } = useModal(props.isVisible);
  const { setToast } = useToasts();
  const { times: { apiUpsertTime, apiAllProjects } } = useApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      project: props.time?.project ?? '',
      description: props.time?.description ?? '',
    },
  });
  const [dates, setDates] = useState<[Date, Date]>([
    props.time
        ? moment.unix(props.time.startingTime).toDate()
        : new Date(),
    props.time
        ? moment.unix(props.time.startingTime).add(props.time.duration, 'seconds').toDate()
        : moment().add(1, 'hours').toDate(),
  ]);

  // All projects for autocomplete
  const [allProjects, setAllProjects] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    apiAllProjects()
        .then(({ projects }) => projects.map((project) => ({ label: project, value: project })))
        .then((projects) => setAllProjects(projects))
        .catch(({ error }: FetchError) => setToast({ type: 'warning', text: error }));
  }, [setAllProjects]);

  // Autocomplete search handler
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const searchHandler = useCallback((currentValue: string) => {
    if (!currentValue) return setOptions(allProjects);
    setOptions(allProjects.filter(project => project.label.includes(currentValue)));
  }, [options]);

  const onSubmit: SubmitHandler<FieldValues> = useCallback((data) => {
    const dateFrom = moment(dates[0]);
    const dateTo = moment(dates[1]);

    apiUpsertTime({
      uuid: props.time?.uuid,
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
        <Modal.Title>{props.time ? `Temps du projet "${props.time.project}"` : 'Créer un temps'}</Modal.Title>
        <Modal.Content>
          <form css={formCss}>
            <label>
              <div>Nom du projet</div>
              <Controller control={control}
                          name={'project'}
                          rules={{ maxLength: 32 }}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                              <AutoComplete options={options}
                                            clearable
                                            onChange={onChange}
                                            onSearch={searchHandler}
                                            onBlur={onBlur}
                                            value={value}
                                            ref={ref}/>
                          )}/>
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
                        placeholder={'Quoi de neuf ?'}
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
        <Modal.Action onClick={handleSubmit(onSubmit)}>{props.time ? 'Sauvegarder' : 'Créer'}</Modal.Action>
      </Modal>
  );
};

const formCss = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input,
  textarea {
	  font-weight: normal;
  }
`;
