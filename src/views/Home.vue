<template>
    <div class="w-full flex flex-col items-center bg-[url('/images/chicks.jpg')] bg-contain bg-no-repeat bg-center">
        <div class="text-white">
           <h1 class="p-24 text-4xl"><strong>THE HEN POND</strong></h1> 
        </div>    
    </div>
    <div class="flex justify-evenly mt-24 text-white">
        <button class="bg-blue p-4 w-[200px]" @click="goTo('/pio')">PLAY PEEP</button>
        <button class="bg-blue p-4 w-[200px]" @click="goTo('/beer-pong')">PLAY BEER PONG</button>
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