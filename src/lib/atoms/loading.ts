import { atom } from "jotai";

export interface LoadingParams {
  isOpen: boolean;
  message: string;
}

export const loadingAtom = atom<LoadingParams>({
  isOpen: false,
  message: "Carregando...",
});
