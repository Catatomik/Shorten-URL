<template>
  <div>
    <div v-if="password.valid" class="m-10 flex space-x-4">
      <div class="flex-auto bg-blue-300 bg-opacity-30 rounded-md p-2">
        <h1 class="font-sans font-semibold text-xl text-center mb-2">Liste des raccourcis ({{ shorteneds.length }})</h1>
        <div class="flex space-x-4">
          <div class="flex-auto">
            <select size=15 class="w-max mr-5 inline-block" style="color: black;" @change="updateSelected"
              v-model="selectedDisplay">
              <option v-for="url of shorteneds" v-bind:key="url" :value="url">{{ url.shortened }}</option>
            </select>
          </div>
          <div class="flex-auto rounded-md bg-blue-300 text-gray-800 p-2">
            <div class="flex-auto my-2">URL personnalisé : <a target="_blank" class="underline"
                :href="selectedDisplay.shortened">{{ selectedDisplay.shortened }}</a></div>
            <div class="flex-auto my-2">URL cible : <a target="_blank" class="underline" :href="selectedDisplay.dest">{{
              selectedDisplay.dest
            }}</a></div>
            <button type="button" class="px-2 shadow-md rounded-md bg-red-300 my-2"
              :disabled="!selectedDisplay.shortened" @click="removeShortened">Supprimer</button>
            <div v-if="selectedDisplay.stats" class="flex-auto my-2">Nombre de clics : {{
              selectedDisplay.stats.length
            }}</div>
            <div v-if="selectedDisplay.stats" class="flex-auto my-2">Nombre de clics des dernières 24h : {{
              selectedDisplay.stats.filter(s => s.date >= Date.now() - 24 * 3600 * 1000).length
            }}</div>
            <button v-if="selectedDisplay.stats?.length" type="button" class="px-2 shadow-md rounded-md bg-red-200 my-2"
              :disabled="!selectedDisplay.shortened" @click="resetStatsSelected">Réinitialiser</button>
          </div>
        </div>
      </div>
      <div class="flex-auto bg-green-300 bg-opacity-30 rounded-md p-2">
        <h1 class="font-sans font-semibold text-xl text-center mb-2">Ajouter un raccourci</h1>
        <div class="block">
          <div class="my-2">URL personnalisé : <input type="text" size=15 class="rounded-sm px-1 text-dark-800"
              v-model="addShort" /></div>
          <div class="my-2">URL cible : <input type="text" size=70 class="rounded-sm px-1 text-dark" v-model="addUrl" />
          </div>
          <button type="button" class="px-2 shadow-md rounded-md bg-green-700" :disabled="adding"
            @click="addShortened">Valider</button>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <div class="rounded-md bg-blue-300 text-gray-800 p-5">
        <div class="block">
          <div class="my-2">Mot de passe : <input type="password" size=15 class="rounded-sm px-1 text-dark-800"
              v-model="password.value" @keyup.enter="fetch" /></div>
          <button type="button" class="px-2 shadow-md rounded-md bg-opacity-50 bg-blue-700" :disabled="password.valid"
            @click="fetch">Valider</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { API, sha256 } from '../store'

export default {
  name: "ManagePanel",
  setup() {

    let shorteneds = ref([])

    let addShort = ref('')
    let addUrl = ref('')

    let selectedDisplay = ref('')
    let adding = ref(false)

    async function fetch() {

      shorteneds.value = (await API.get('/url/', {
        params: {
          password: password.value.hashed || await sha256(password.value.value)
        }
      })).data

      if (shorteneds.value.status == 401) {
        alert('Mauvais mot de passe.')
        password.value.valid = false
      } else if (!password.value.valid) {
        password.value.hashed = await sha256(password.value.value)
        password.value.valid = true
      }

    }

    async function addShortened() {

      adding.value = true

      const r = await API.post(`/url/${addShort.value}`, { dest: addUrl.value, password: password.value.hashed })
      if (r.status == 200) {
        addShort.value = ""
        addUrl.value = ""
        fetch()
      } else {
        alert(`Erreur lors de l'ajout : ${r.data.error}`)
      }
      adding.value = false

    }

    async function removeShortened() {

      try {
        await API.delete(`/url/${selectedDisplay.value.shortened}`, {
          params: {
            password: password.value.hashed
          }
        })
        selectedDisplay.value = ''
        fetch()
      } catch (e) {
        alert(`Erreur lors de la suppression : ${e}`)
      }

    }

    let password = ref({
      valid: false,
      value: "",
      hashed: null
    })

    async function updateSelected() {

      selectedDisplay.value.stats = (await API.get(`/stats/${selectedDisplay.value.shortened}`, {
        params: {
          password: password.value.hashed
        }
      })).data

    }

    async function resetStatsSelected() {

      try {
        await API.delete(`/stats/${selectedDisplay.value.shortened}`, {
          params: {
            password: password.value.hashed
          }
        })
        updateSelected()
      } catch (e) {
        alert(`Erreur lors de la réinitialisation : ${e}`)
      }

    }

    return {
      shorteneds,
      addShort,
      addUrl,
      selectedDisplay,
      addShortened,
      removeShortened,
      adding,
      password,
      fetch,
      updateSelected,
      resetStatsSelected,
    }
  }
}
</script>

<style>
@import url("https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css");

html,
body {
  background-color: #2F3136 !important;
  color: #EAEAEA !important;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input,
select,
textarea {
  color: #000000;
}

textarea:focus,
input:focus {
  color: #000000;
}
</style>