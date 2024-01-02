import { ref } from "vue";
import { URL } from "shorten-url-api/built/routes/url";
import { ErrorResponse } from "shorten-url-api/built/routes/";
import { API } from ".";

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

async function fetch(): Promise<URL[] | null> {
  const shorteneds = (
    await API.get<URL[] | ErrorResponse>("/url/", {
      params: {
        password: password.value.hashed || (await sha256(password.value.value)),
      },
    })
  ).data;

  if ("error" in shorteneds) {
    if (shorteneds.status === 401) {
      alert("Mauvais mot de passe.");
      password.value.valid = false;
    }

    return null;
  }

  return shorteneds;
}

export { password, sha256, fetch };
