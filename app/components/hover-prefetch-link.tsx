'use client';

import Link from 'next/link';
import { useState, type ComponentProps } from 'react';

// A per-link prefetch for every card in a grid would wake the server once per card. Resolve this link's
// URL data (params) only once the user shows intent; until then 'auto' still prefetches the shared App Shell.
export default function HoverPrefetchLink(props: Omit<ComponentProps<typeof Link>, 'prefetch'>) {
  const [active, setActive] = useState(false);
  const activate = () => setActive(true);

  return (
    <Link
      {...props}
      prefetch={active ? true : 'auto'}
      onMouseEnter={(event) => {
        activate();
        props.onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        activate();
        props.onFocus?.(event);
      }}
      onTouchStart={(event) => {
        activate();
        props.onTouchStart?.(event);
      }}
    />
  );
}
