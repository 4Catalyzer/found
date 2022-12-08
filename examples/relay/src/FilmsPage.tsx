import React from 'react';
import { graphql } from 'relay-runtime';

import { usePreloadedQuery } from 'react-relay/hooks';
import { Link } from 'found';
import { FilmsPageQuery } from './__generated__/FilmsPageQuery.graphql';
import CreateFilm from './CreateFilm';

const query = graphql`
  query FilmsPageQuery {
    allFilms(first: 1000000) @connection(key: "Root_allFilms") {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

function FilmsPage({ data: queryReference, children }) {
  const data = usePreloadedQuery<FilmsPageQuery>(
    FilmsPage.query,
    queryReference,
  );

  return (
    <div className="grid grid-cols-12">
      <aside className="col-span-2 flex flex-col">
        {data?.allFilms.edges.map((edge) => (
          <Link to={`/films/${edge!.node.id}`} className="w-full py-1 px-3">
            {edge!.node.title}
          </Link>
        ))}
        <CreateFilm />
      </aside>
      <div>{children}</div>
    </div>
  );
}

FilmsPage.query = query;

export default FilmsPage;
