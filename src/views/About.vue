<template>
  <b-container>
    <h1 class="display-1">{{ $t('views.about.title') }}</h1>

    <hr />

    <b-list-group>
      <b-list-group-item
        v-for="(property, id) in properties"
        v-bind:key="id"
        class="d-flex align-items-center"
      >
        <b-avatar
          :src="property.icon"
          variant="transparent"
          square
          class="mr-3"
        />
        <span class="mr-auto">
          {{ property.name }}: <strong>{{ property.value }}</strong>
        </span>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import Vue from 'vue';
import os from 'os';
import { remote } from 'electron';

export default {
  name: 'About',
  computed: {
    properties() {
      return [
        {
          icon: '/images/icons/icons8-falcon.svg',
          name: this.$t('views.about.properties.appVersion'),
          value: remote.app.getVersion()
        },
        {
          icon: '/images/icons/icons8-code.svg',
          name: this.$t('views.about.properties.appMode'),
          value: process.env.NODE_ENV
        },
        {
          icon: '/images/icons/icons8-vue-js.svg',
          name: this.$t('views.about.properties.vueVersion'),
          value: Vue.version
        },
        {
          icon: '/images/icons/icons8-nodejs.svg',
          name: this.$t('views.about.properties.nodeVersion'),
          value: process.versions.node
        },
        {
          icon: '/images/icons/icons8-chromium.svg',
          name: this.$t('views.about.properties.chromiumVersion'),
          value: process.versions.chrome
        },
        {
          icon: '/images/icons/V8_JavaScript_engine_logo_2.svg',
          name: this.$t('views.about.properties.v8Version'),
          value: process.versions.v8
        },
        {
          icon: '/images/icons/icons8-security-ssl.svg',
          name: this.$t('views.about.properties.openSslVersion'),
          value: process.versions.openssl
        },
        {
          icon: '/images/icons/icons8-processor.svg',
          name: this.$t('views.about.properties.cpuArchitecture'),
          value: os.arch()
        },
        {
          icon: '/images/icons/icons8-computer.svg',
          name: this.$t('views.about.properties.platform'),
          value: os.platform()
        },
        {
          icon: '/images/icons/icons8-informatics.svg',
          name: this.$t('views.about.properties.endianness'),
          value: os.endianness()
        }
      ];
    }
  }
};
</script>
