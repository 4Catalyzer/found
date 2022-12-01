import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import React from 'react';

import styles from './index.module.css';

export default () => {
  const logoUrl = useBaseUrl('img/f-logo-empty.svg');
  return (
    // @ts-ignore
    <Layout wrapperClassName={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <h1>Found</h1>

          <p>client-side routing without limits for React</p>
          <div>
            <Link to="docs/getting-started/quick-start">Docs</Link>
          </div>
        </div>
        <img src={logoUrl} width="200" alt="found logo" />
      </div>
    </Layout>
  );
};
