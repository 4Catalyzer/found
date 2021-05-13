import useRouter from './useRouter';

export default function useMatch() {
  return useRouter().match;
}
