import React from 'react';
import { graphql } from 'relay-runtime';

import { usePreloadedQuery } from 'react-relay/hooks';
import { FilmPageQuery } from './__generated__/FilmPageQuery.graphql';

const query = graphql`
  query FilmPageQuery($filmId: ID) {
    film(id: $filmId) {
      title
      episodeID
    }
  }
`;

function FilmPage({ data: queryReference }) {
  const { film } = usePreloadedQuery<FilmPageQuery>(
    FilmPage.query,
    queryReference,
  );

  return <h1>{film?.title}</h1>;
}

FilmPage.query = query;

export default FilmPage;
