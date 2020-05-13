<template>
  <div
    class="bg-dark text-light font-weight-light d-flex justify-content-between align-items-center px-4 py-2"
  >
    <small>
      <b-link
        @click="
          openExternal('https://github.com/Quentin-Lamotte/Flyff-Admin-Tool')
        "
        class="d-flex align-items-center"
      >
        <b-avatar
          src="/images/icons/icons8-creative-commons.svg"
          variant="transparent"
          square
        />
        {{ $t('components.footer.copyright') }}
      </b-link>
    </small>
    <small>
      {{ $t('components.footer.signature') }} |
      <b-link
        @click="
          openExternal(
            'https://github.com/Quentin-Lamotte/Flyff-Admin-Tool/blob/master/LICENSE.md'
          )
        "
      >
        {{ $t('components.footer.githubLink') }}
      </b-link>
    </small>
    <small>{{ appVersion }} ({{ appMode }})</small>
  </div>
</template>

<style scoped>
div {
  box-shadow: 0 -0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>

<script>
import { remote, shell } from 'electron';

export default {
  name: 'Footer',
  computed: {
    appVersion: () => remote.app.getVersion(),
    appMode: () => process.env.NODE_ENV,
  },
  methods: {
    openExternal: shell.openExternal,
  },
};
</script>
