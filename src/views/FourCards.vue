<template>
    <div>
        <div class="grid grid-rows-2 grid-flow-col w-full mx-auto sm:w-[80vw] lg:w-[60vw]" :key="componentKey">
            <vue-flip
                v-for="card, index in state.cards" 
                :key="index"
                class="mx-auto cursor-pointer" 
                :height="state.cardSize.height" 
                :width="state.cardSize.width"
                v-model="card.isClicked"
                @click="flip(index)"
            >
                <template v-slot:front>
                    <img class="w-[90%] mx-auto" :src="card.front">
                </template>

                <template v-slot:back>
                    <img class="w-[90%] mx-auto" 
                        v-if="state.cardRenderer == null || state.cardRenderer == 'renderLooser'" 
                        :src="card.back">
                </template>
            </vue-flip>
        </div>
    </div>
</template>

<script>
    //mettere apposto la X
    import { reactive, watch, onMounted, ref } from 'vue'
    import { VueFlip } from 'vue-flip';
    

    export default {
        components: {
            'vue-flip': VueFlip
        },
        setup : () => {
            const componentKey = ref(0)

            const state = reactive({
                modal: {
                    isOpened: false,
                    isWinner: false 
                },
                cardRenderer : null,
                cardSize : {
                    width:'190px',
                    height:'245px'
                },
                cards: [
                    {
                        front: '/images/sand.png',
                        back: '/images/sand.png',
                        isClicked: false,
                    },
                    {
                        front: '/images/sand.png',
                        back: '/images/sand.png',
                        isClicked: false,
                    },
                    {
                        front: '/images/sand.png',
                        back: '/images/sand.png',
                        isClicked: false,
                    },
                    {
                        front: '/images/sand.png',
                        back: '/images/sand.png',
                        isClicked: false,
                    }
                ]
            });

            const flip = (index) => {
                console.log('Carta ' + index + ' girata');
                state.cards[index].isClicked = true;  
            };


            const checkBreakpoints = () => {
                if(window.innerWidth < 768) {
                    state.cardSize.width = '190px';
                    state.cardSize.height = '245px';
                }

                if(window.innerWidth >= 768 && window.innerWidth <= 1280)  {
                    state.cardSize.width = '288px';
                    state.cardSize.height = '380px';
                }

                if(window.innerWidth > 1280) {
                    state.cardSize.width = '400px';
                    state.cardSize.height = '512px';
                }

                componentKey.value++
            }

            onMounted(()=>{
               

                checkBreakpoints();

                window.addEventListener('resize', () => checkBreakpoints());
            }) 


            return {
                componentKey,
                state,
                flip,
                checkBreakpoints,
            }
        }
    }
</script>