import useMatch from './useMatch';

export default function useParams() {
  return useMatch().params;
}
