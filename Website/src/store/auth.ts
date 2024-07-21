import { ref } from "vue";
import type { URL } from "shorten-url-api/built/models";
import { fetch } from ".";

interface Password {
  valid: boolean;
  value: string;
  hashed: string | null;
}

const password = ref<Password>({
  valid: false,
  value: "",
  hashed: null,
});

async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

async function auth(): Promise<URL[] | null> {
  const hashed = await sha256(password.value.value);
  const shorteneds = await fetch<URL[]>("/url/", hashed);

  if (shorteneds.status !== 200) {
    if (shorteneds.status === 401) {
      alert("Mauvais mot de passe.");
      password.value.valid = false;
      password.value.hashed = null;
    }

    return null;
  }

  password.value.valid = true;
  password.value.hashed = hashed;
  password.value.value = "";

  return shorteneds.data;
}

export { password, auth };
