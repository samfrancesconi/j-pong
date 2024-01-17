<template>

  <canvas id="game"></canvas>
  
</template>

<script>
  import { onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  export default {
    setup : () => {
      const play = onMounted(()=>{
       
       const route = useRoute();

       const currentGame = route.params.id;

       import(`../games/${currentGame}/Game.js`)
        .then((Game) => {
            new Game.default();
        });
      });

      return {
        play,
      }
    }
  }

</script>


<style>
  body, html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0
  }
  #game {
    width: 500px;
    height: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border: solid 1px black;
    background-image: url('/images/pio/lake.jpeg');
    background-size: cover;
    border-radius: 10px;
  }
</style>