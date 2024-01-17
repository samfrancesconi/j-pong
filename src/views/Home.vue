<template>
    <div class="flex flex-col items-center bg-[url('/images/sand.png')] bg-contain">
        <div class="text-white">
           <h1 class="p-24 text-4xl"><strong>THE HEN POND</strong></h1> 
        </div>    
    </div>
    <div class="flex justify-evenly mt-24 text-white">
        <!-- <button class="bg-blue p-4" @click="goTo('/four-cards')">FOUR CARDS</button> -->
        <!-- <button class="bg-blue p-4 w-[200px]" @click="goTo('/beer-pong')">BEER PONG</button> -->
        <button class="bg-blue p-4 w-[200px]" @click="goTo('/pio')">PIO</button>
        <button class="bg-blue p-4 w-[200px]">SHOOTER</button>
        <button class="bg-blue p-4 w-[200px]">CUPHEAD LIKE</button>
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