import useRouter from 'found/useRouter';
import * as React from 'react';

interface Props {
  foo?: boolean;
}

function ComponentUsingRouter(_props: Props) {
  const { match, router } = useRouter();

  return (
    <div>
      {match.location.pathname}, {router}
    </div>
  );
}

export { ComponentUsingRouter };
