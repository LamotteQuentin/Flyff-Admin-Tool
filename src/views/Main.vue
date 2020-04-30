<template>
  <b-container>
    <b-jumbotron
      header="Flyff Admin Tool"
      :lead="$t('views.main.subtitle')"
      class="text-center"
    >
      <p>{{ $t('views.main.description') }}</p>
      <b-button variant="primary" block to="/odbc">
        {{ $t('views.odbc.title') }}
      </b-button>
    </b-jumbotron>
  </b-container>
</template>

<script>
export default {
  name: 'Main'
};
</script>
