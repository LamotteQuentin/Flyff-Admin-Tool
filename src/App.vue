<template>
  <div id="app">
    <MenuComponent />
    <transition name="fade" mode="out-in">
      <router-view id="router-view" />
    </transition>
    <FooterComponent />
  </div>
</template>

<script>
import MenuComponent from '@/components/Menu';
import FooterComponent from '@/components/Footer';

export default {
  components: {
    MenuComponent,
    FooterComponent
  }
};
</script>

<style lang="scss">
$primary: teal;

@import '~bootstrap';
@import '~bootstrap-vue';

#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

#router-view {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
