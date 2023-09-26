<template>
    <button @click="goTo()">Pio</button>
</template>

<script>

    import { useRouter } from 'vue-router'

    export default {
        setup() {

            const router = useRouter();

            const goTo = () => {
                router.push('/pio');
            } 

            return {
                goTo
            }
        }
    }

</script>