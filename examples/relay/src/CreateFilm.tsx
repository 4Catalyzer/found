import React, { useEffect, useRef, useState } from 'react';
import { graphql, useMutation } from 'react-relay/hooks';
import { ConnectionHandler } from 'relay-runtime';

interface Props {}

function CreateFilm(props: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [mutate, isLoading] = useMutation(graphql`
    mutation CreateFilmMutation($input: CreateFilmInput!) {
      createFilm(input: $input) {
        film {
          id
          title
          episodeID
        }
      }
    }
  `);

  useEffect(() => {
    if (showModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [showModal]);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Create Film</button>
      <dialog
        ref={ref}
        className="fixed w-80 z-50  bg-slate-200 backdrop:bg-black/25"
      >
        <form
          onSubmit={async (e) => {
            const input = Object.fromEntries(new FormData(e.currentTarget));

            e.preventDefault();

            mutate({
              variables: { input },
              updater(store) {
                const root = store.getRoot();
                const allFilms = ConnectionHandler.getConnection(
                  root,
                  'Root_allFilms',
                );

                const payload = store.getRootField('createFilm');
                const node = payload!.getLinkedRecord('film');

                const edge = ConnectionHandler.createEdge(
                  store,
                  allFilms!,
                  node!,
                  'FilmEdge',
                );

                ConnectionHandler.insertEdgeBefore(allFilms!, edge);
              },
              onCompleted() {
                setShowModal(false);
              },
            });
          }}
        >
          <input name="title" />
          <input name="episodeID" type="number" />
          <button>Save</button>
        </form>
      </dialog>
    </>
  );
}

export default CreateFilm;
