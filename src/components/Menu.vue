<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow">
    <b-navbar-brand to="/">FAT</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/odbc">ODBC</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/about">
          <b-icon icon="question" />
        </b-nav-item>
        <b-nav-item>
          <b-icon @click="minimizeWindow()" icon="dash" variant="warning" />
        </b-nav-item>
        <b-nav-item>
          <b-icon
            @click="toggleMaximizeWindow()"
            :icon="maximizeIcon"
            variant="success"
          />
        </b-nav-item>
        <b-nav-item>
          <b-icon @click="closeWindow()" icon="x" variant="danger" />
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { remote } from 'electron';

export default {
  data() {
    return {
      isWindowMaximized: remote.getCurrentWindow().isMaximized()
    };
  },
  computed: {
    maximizeIcon() {
      return this.isWindowMaximized
        ? 'arrows-angle-contract'
        : 'arrows-angle-expand';
    }
  },
  methods: {
    minimizeWindow: function() {
      remote.getCurrentWindow().minimize();
    },
    toggleMaximizeWindow: function() {
      let currentWindow = remote.getCurrentWindow();
      currentWindow.isMaximized()
        ? currentWindow.unmaximize()
        : currentWindow.maximize();
      this.isWindowMaximized = currentWindow.isMaximized();
    },
    closeWindow: function() {
      remote.getCurrentWindow().close();
    }
  }
};
</script>

<style scoped>
nav.navbar {
  -webkit-app-region: drag;
}
nav.navbar a {
  -webkit-app-region: no-drag;
}
</style>
