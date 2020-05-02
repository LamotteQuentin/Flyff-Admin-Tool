<template>
  <div>
    <b-container>
      <b-jumbotron
        header="Flyff Admin Tool"
        :lead="$t('views.main.subtitle')"
        class="text-center shadow"
      >
        <b-carousel no-touch no-hover-pause>
          <b-carousel-slide v-for="(slide, id) in slides" v-bind:key="id">
            <template v-slot:img>
              <b-img class="mx-auto" height="200" :src="slide" />
            </template>
          </b-carousel-slide>
        </b-carousel>

        <p>{{ $t('views.main.description') }}</p>

        <b-button variant="primary" block to="/server">
          <b-icon icon="lightning" />
          {{ $t('views.server.title') }}
        </b-button>
        <b-button variant="primary" block to="/system">
          <b-icon icon="window" />
          {{ $t('views.system.title') }}
        </b-button>
        <b-button variant="primary" block to="/odbc">
          <b-icon icon="layers" />
          {{ $t('views.odbc.title') }}
        </b-button>
      </b-jumbotron>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data() {
    return {
      slides: [
        '/images/artworks/02ccfe3efde37806ab034b3d744add4d.png',
        '/images/artworks/092a59b65f45c4d88b2b9c78f53f99dd.png',
        '/images/artworks/0942c986f5f4ea6e983af8f91243995b.png',
        '/images/artworks/19a815793b06699d6585e5c6f426642f.png',
        '/images/artworks/1e1fb8f909f69d07071a6b980fe49492.png',
        '/images/artworks/2181f2490d261e1f64f9258c0ed1fa60.png',
        '/images/artworks/338715a0dd3e6bc181b15a07715cf379.png',
        '/images/artworks/48cab541922f8a624646a601ef039393.png',
        '/images/artworks/5667cb4df664ea5fbb89288b1205da1c.png',
        '/images/artworks/5c6be418fd8eb559e4f45645bc53ed74.png',
        '/images/artworks/5f81cc91fe354b5082b1ca17937c4aa3.png',
        '/images/artworks/99e642a50bf60a24ca6af6f45f729867.png',
        '/images/artworks/adf1926f07fedd8461b2c685bbb29490.png',
        '/images/artworks/b6e8610182fc3de5c52a2817fd2af9b3.png',
        '/images/artworks/c0c9c0db54016a178d163b4266570d31.png',
        '/images/artworks/cd4bb8b3d834e61fd648ba02d8085d98.png',
        '/images/artworks/e0efcbae9eecc91d5292a729b49521bf.png',
        '/images/artworks/f3eb6dd0d31656970ed7995b7b0d724c.png',
        '/images/artworks/f7095acef9cd3534faaf552baf7526d2.png'
      ]
    };
  },
  created() {
    this.slides.sort(function() {
      return 0.5 - Math.random();
    });
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/variables';

@-webkit-keyframes color-waves {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes color-waves {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

#app-content {
  background: linear-gradient(270deg, $primary, $secondary);
  background-size: 400% 400%;
  animation: color-waves 10s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
