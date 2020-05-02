<template>
  <div id="app">
    <MenuComponent id="app-menu" />
    <transition name="fade" mode="out-in">
      <router-view id="app-content" class="py-4" />
    </transition>
    <FooterComponent id="app-footer" />
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
@import '@/assets/theme';

@import '~bootstrap';
@import '~bootstrap-vue';

#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}

#app-menu,
#app-footer {
  flex-shrink: 0;
}

#app-content {
  flex: 1 1 0;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
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
