<script setup lang="ts">
import { ref } from "vue";
import type { Stat, URL } from "shorten-url-api/built/models";
import { API, fetch } from "@/store";
import { password } from "@/store/auth";
import type { AxiosResponse } from "axios";

const props = defineProps<{
  shorteneds: URL[];
}>()

const shorteneds = ref<URL[]>(props.shorteneds);

const newShort = ref("");
const newURL = ref("");
const adding = ref(false);

const selectedShortenedURL = ref<null | (URL & { stats?: Stat[] })>(null);

async function addShortenedURL() {
  adding.value = true;

  let res: AxiosResponse<void> | null = null;

  try {
    res = (
      await API.post<void>(`/url/${newShort.value}`, {
        dest: newURL.value,
        password: password.value.hashed,
      })
    );
  } catch (err) { console.error(err); }

  if (res && res.status === 200) {
    newShort.value = "";
    newURL.value = "";

    fetch<URL[]>('/url/').then((res) => {
      if (res.status === 200) shorteneds.value = res.data;
    });
  } else
    alert(
      `Erreur lors de l'ajout : ${res ? ("error" in res ? res.error : res.status) : "Impossible d'effectuer la requête."
      }`,
    );


  adding.value = false;
}

async function removeShortenedURL() {
  if (!selectedShortenedURL.value) return;

  try {
    await API.delete(`/url/${selectedShortenedURL.value.shortened}`, {
      params: {
        password: password.value.hashed,
      },
    });

    selectedShortenedURL.value = null;
    fetch<URL[]>('/url/').then((res) => {
      if (res && res.status === 200) shorteneds.value = res.data;
    });
  } catch (err) {
    alert(`Erreur lors de la suppression : ${err}`);
  }
}

async function refreshSelected() {
  if (!selectedShortenedURL.value) return;

  const stats = (
    await API.get<Stat[]>(`/stats/${selectedShortenedURL.value.shortened}`, {
      params: {
        password: password.value.hashed,
      },
    })
  );

  if (stats.status === 200) selectedShortenedURL.value.stats = stats.data;
}

async function resetStatsSelected() {
  if (!selectedShortenedURL.value) return;

  try {
    await API.delete(`/stats/${selectedShortenedURL.value.shortened}`, {
      params: {
        password: password.value.hashed,
      },
    });

    refreshSelected();
  } catch (err) {
    alert(`Erreur lors de la réinitialisation : ${err}`);
  }
}
</script>

<template>
  <div>
    <div v-if="password.valid" class="m-10 flex space-x-4">
      <div class="flex-auto bg-blue-300 bg-opacity-30 rounded-md p-2">
        <h1 class="font-sans font-semibold text-xl text-center mb-2">
          Liste des raccourcis ({{ shorteneds.length }})
        </h1>
        <div class="flex space-x-4">
          <div class="flex-auto">
            <select
v-model="selectedShortenedURL" size="15" class="w-max mr-5 inline-block" style="color: black"
              @change="refreshSelected">
              <option v-for="url of shorteneds" :key="url.shortened" :value="url">{{ url.shortened }}</option>
            </select>
          </div>
          <div v-if="selectedShortenedURL" class="flex-auto rounded-md bg-blue-300 text-gray-800 p-2">
            <div class="flex-auto my-2">
              URL personnalisé :
              <a target="_blank" class="underline" :href="selectedShortenedURL.shortened">{{
                selectedShortenedURL.shortened
              }}</a>
            </div>
            <div class="flex-auto my-2">
              URL cible :
              <a target="_blank" class="underline" :href="selectedShortenedURL.dest">{{
                selectedShortenedURL.dest
              }}</a>
            </div>
            <button
type="button" class="px-2 shadow-md rounded-md bg-red-300 my-2"
              :disabled="!selectedShortenedURL.shortened" @click="removeShortenedURL">
              Supprimer
            </button>
            <div v-if="selectedShortenedURL.stats" class="flex-auto my-2">
              Nombre de clics : {{ selectedShortenedURL.stats.length }}
            </div>
            <div v-if="selectedShortenedURL.stats" class="flex-auto my-2">
              Nombre de clics des dernières 24h :
              {{ selectedShortenedURL.stats.filter((s) => s.date >= Date.now() - 24 * 3600 * 1000).length }}
            </div>
            <button
v-if="selectedShortenedURL.stats?.length" type="button"
              class="px-2 shadow-md rounded-md bg-red-200 my-2" :disabled="!selectedShortenedURL.shortened"
              @click="resetStatsSelected">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
      <div class="flex-auto bg-green-300 bg-opacity-30 rounded-md p-2">
        <h1 class="font-sans font-semibold text-xl text-center mb-2">Ajouter un raccourci</h1>
        <div class="block">
          <div class="my-2">
            URL personnalisé :
            <input v-model="newShort" type="text" size="15" class="rounded-sm px-1 text-dark-800" />
          </div>
          <div class="my-2">
            URL cible : <input v-model="newURL" type="text" size="70" class="rounded-sm px-1 text-dark" />
          </div>
          <button
type="button" class="px-2 shadow-md rounded-md bg-green-700" :disabled="adding"
            @click="addShortenedURL">
            Valider
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../style.css";

html,
body {
  @apply bg-slate-800;
  @apply text-slate-200;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input,
select,
textarea {
  @apply text-black;
}

textarea:focus,
input:focus {
  @apply text-black;
}
</style>
