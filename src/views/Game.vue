<template>
  <canvas id="game"></canvas>
</template>

<script>
  import {onMounted} from 'vue'
  import game from '../games/pio/Game.js'


  export default {
    setup : () => {
      const play = onMounted(()=>{
        game();
      });

      return {
        play
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
  }
</style>