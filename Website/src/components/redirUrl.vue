<template>
    <div>{{ error }}</div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { API } from '../store'

export default {
    name: "redirUrl",
    setup() {

        const error = ref('')
        const route = useRoute()

        API.get(`/url/${route.params.url}`)
            .then(r => {
                r = r.data[0]
                if (!r?.dest) error.value = "Unknow shortcut..."
                else {
                    API.post(`/stats/${route.params.url}`)
                    window.location = r.dest
                }
            })
            .catch(e => {
                error.value = e
            })

        return {
            error
        }

    }
}
</script>