<template>
    <h1 class="text-center">THE SANDBOX</h1>
    <div class="flex flex-col items-center">
        <img class="w-1/2 rounded-full" src="/images/sand.png">
        <br>
        <button class="bg-[#F7DEA4] p-2" @click="goTo('/pio')">Pio</button>
        <button class="bg-[#F7DEA4] p-2" @click="goTo('/beer-pong')">Beer Pong</button>
        <button class="bg-[#F7DEA4] p-2" @click="goTo('/four-cards')">Four Cards</button>
    </div>
</template>

<script>

    import { useRouter } from 'vue-router'

    export default {
        setup() {

            const router = useRouter();

            const goTo = (path) => {
                router.push(path);
            } 

            return {
                goTo
            }
        }
    }

</script>