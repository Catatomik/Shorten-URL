<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { URL } from "shorten-url-api/built/routes/url";
import { ErrorResponse } from "shorten-url-api/built/routes";
import { API } from "../store";

const error = ref("");
const route = useRoute();

API.get<URL[] | ErrorResponse>(`/url/${route.params.url}`)
  .then((r) => {
    if ("error" in r.data) {
      error.value = `Error while treating request : ${JSON.stringify(r.data.error)}`;
      return;
    }

    const shortcut = r.data[0];

    if (!shortcut) error.value = "Unknown shortcut...";
    else {
      API.post(`/stats/${route.params.url}`);
      window.location.assign(shortcut.dest);
    }
  })
  .catch((e) => {
    error.value = e;
  });
</script>

<template>
  <div>{{ error }}</div>
</template>
