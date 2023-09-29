<template>
    <h1 class="text-center">THE SANDBOX</h1>
    <div class="flex flex-col items-center">
        <img class="w-1/2 rounded-full" src="images/sand.png">
        <br>
        <button class="bg-[#F7DEA4] p-2" @click="goTo()">Pio</button>
    </div>
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