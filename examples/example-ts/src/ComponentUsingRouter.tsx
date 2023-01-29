import useRouter from 'found/useRouter';
import * as React from 'react';

interface Props {
  foo?: boolean;
}

function ComponentUsingRouter(_props: Props) {
  const { match, router } = useRouter();

  console.log(router);
  return <div>Pathname: {match.location.pathname}</div>;
}

export { ComponentUsingRouter };
