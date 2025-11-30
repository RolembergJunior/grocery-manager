import { atom } from "jotai";
import type { Profile } from "@/app/type";
import { getUserProfile } from "@/services/profile";

export const profileAtom = atom<Profile | null>(null);

export const fetchProfileData = atom(null, async (_get, set) => {
  try {
    const profile = await getUserProfile();

    set(profileAtom, profile);
  } catch (error) {
    console.error("Falha ao buscar o perfil do usuário", error);
  }
});
