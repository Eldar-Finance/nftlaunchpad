import type { PropsWithChildren } from 'react';
import { WithClassnameType } from '@/types';
import Link from 'next/link';

interface MxLinkPropsType extends PropsWithChildren, WithClassnameType {
  to: string;
}

export const MxLink = ({
  to,
  children,
  className = 'inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-transparent text-white  ml-2 mr-0'
}: MxLinkPropsType) => {
  return (
    <Link href={to} className={className}>
      {children}
    </Link>
  );
};
