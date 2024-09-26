'use client';
import { useEffect, useState } from 'react';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import moment from 'moment';
import { Button } from '@/components/Button';
import { ContractAddress } from '@/components/ContractAddress';
import { Label } from '@/components/Label';
import { OutputContainer, PingPongOutput } from '@/components/OutputContainer';
import { getCountdownSeconds, setTimeRemaining } from '@/helpers';
import { useGetPendingTransactions, useSendPingPongTransaction } from '@/hooks';
import { SessionEnum } from '@/localConstants';
import { SignedTransactionType, WidgetProps, CypressEnums } from '@/types';
import { useGetTimeToPong, useGetPingAmount } from './hooks';

export const PingPongAbi = ({ callbackRoute }: WidgetProps) => {
  const { hasPendingTransactions } = useGetPendingTransactions();
  const getTimeToPong = useGetTimeToPong();
  const {
    sendPingTransactionFromAbi,
    sendPongTransactionFromAbi,
    transactionStatus
  } = useSendPingPongTransaction({
    type: SessionEnum.abiPingPongSessionId
  });
  const pingAmount = useGetPingAmount();

  const [stateTransactions, setStateTransactions] = useState<
    SignedTransactionType[] | null
  >(null);
  const [hasPing, setHasPing] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const setSecondsRemaining = async () => {
    const secondsRemaining = await getTimeToPong();
    const { canPing, timeRemaining } = setTimeRemaining(secondsRemaining);

    setHasPing(canPing);
    if (timeRemaining && timeRemaining >= 0) {
      setSecondsLeft(timeRemaining);
    }
  };

  const onSendPingTransaction = async () => {
    await sendPingTransactionFromAbi({ amount: pingAmount, callbackRoute });
  };

  const onSendPongTransaction = async () => {
    await sendPongTransactionFromAbi({ callbackRoute });
  };

  const timeRemaining = moment()
    .startOf('day')
    .seconds(secondsLeft ?? 0)
    .format('mm:ss');

  const pongAllowed = secondsLeft === 0;

  useEffect(() => {
    getCountdownSeconds({ secondsLeft, setSecondsLeft });
  }, [hasPing, secondsLeft]); // Added missing dependency

  useEffect(() => {
    if (transactionStatus.transactions) {
      setStateTransactions(transactionStatus.transactions);
    }
  }, [transactionStatus]);

  useEffect(() => {
    setSecondsRemaining(); // Ensure this function accepts an argument
  }, []); // Removed setSecondsRemaining from dependencies

  const isPingDisabled = !hasPing || hasPendingTransactions;
  const isPongDisabled = !pongAllowed || hasPing || hasPendingTransactions;
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-start gap-2'>
          <Button
            disabled={isPingDisabled}
            onClick={onSendPingTransaction}
            data-testid='btnPingAbi'
            data-cy={CypressEnums.transactionBtn}
            className='inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-blue-600 text-white hover:bg-blue-700 mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed'
          >
            <FontAwesomeIcon icon={faArrowUp} className='mr-1' />
            Ping
          </Button>

          <Button
            disabled={isPongDisabled}
            data-testid='btnPongAbi'
            data-cy={CypressEnums.transactionBtn}
            onClick={onSendPongTransaction}
            className='inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-blue-600 text-white hover:bg-blue-700 mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed'
          >
            <FontAwesomeIcon icon={faArrowDown} className='mr-1' />
            Pong
          </Button>
        </div>
      </div>

      <OutputContainer>
        {!stateTransactions && (
          <>
            <ContractAddress />
            {!pongAllowed && (
              <p>
                <Label>Time remaining: </Label>
                <span className='text-red-600'>{timeRemaining}</span> until able
                to pong
              </p>
            )}
          </>
        )}

        <PingPongOutput
          transactions={stateTransactions}
          pongAllowed={pongAllowed}
          timeRemaining={timeRemaining}
        />
      </OutputContainer>
    </div>
  );
};
