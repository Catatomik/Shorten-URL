<template>
  <div class="m-10 flex space-x-4">
    <div class="flex-auto bg-blue-300 bg-opacity-30 rounded-md p-2">
      <h1 class="font-sans font-semibold text-xl text-center mb-2">Liste des raccourcis ({{ shorteneds.length }})</h1>
      <div class="flex space-x-4">
        <div class="flex-auto">
          <select size=15 class="w-max mr-5 inline-block" style="color: black;" v-model="selectedDisplay">
            <option v-for="url of shorteneds" v-bind:key="url" :value="url">{{ url.shortened }}</option>
          </select>
        </div>
        <div class="flex-auto rounded-md bg-blue-300 text-gray-800 p-2">
          <div class="flex-auto my-2">URL personnalisé : <a target="_blank" class="underline" :href="selectedDisplay.shortened">{{ selectedDisplay.shortened }}</a></div>
          <div class="flex-auto my-2">URL cible : <a target="_blank" class="underline" :href="selectedDisplay.dest">{{ selectedDisplay.dest }}</a></div>
          <button type="button" class="px-2 shadow-md rounded-md bg-red-300" :disabled="adding" @click="removeShortened">Supprimer</button>
        </div>
      </div>
      </div>
    <div class="flex-auto bg-green-300 bg-opacity-30 rounded-md p-2">
      <h1 class="font-sans font-semibold text-xl text-center mb-2">Ajouter un raccourci</h1>
      <div class="block">
        <div class="my-2">URL personnalisé : <input type="text" size=15 class="rounded-sm px-1 text-dark-800" v-model="addShort"/></div>
        <div class="my-2">URL cible : <input type="text" size=70 class="rounded-sm px-1 text-dark" v-model="addUrl"/></div>
        <button type="button" class="px-2 shadow-md rounded-md bg-green-700" :disabled="adding" @click="addShortened">Valider</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { API } from '../store'

export default {
  name: "Manage",
  setup() {

    let shorteneds = ref([])

    let addShort = ref('')
    let addUrl = ref('')

    let selectedDisplay = ref('')
    let adding = ref(false)

    async function fetch() {

      shorteneds.value = (await API.get('/url/')).data

    }
    fetch()

    async function addShortened() {

      adding.value = true
      
      try {
        await API.post(`/url/${addShort.value}`, { dest: addUrl.value })
        addShort.value = ""
        addUrl.value = ""
        fetch()
      } catch(e) {
        alert(`Erreur lors de l'ajout : ${e}`)
      } finally {
        adding.value = false
      }
      
    }

    async function removeShortened() {

      try {
        await API.delete(`/url/${selectedDisplay.value.shortened}`)
        selectedDisplay.value = ''
        fetch()
      } catch(e) {
        alert(`Erreur lors de la suppression : ${e}`)
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
    }
  }
}
</script>

<style>
@import url("https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css");
input, select, textarea{
    color: #000000;
}

textarea:focus, input:focus {
    color: #000000;
}
</style>