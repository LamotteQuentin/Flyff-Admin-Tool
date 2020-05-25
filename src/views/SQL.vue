<template>
  <div>
    <b-container fluid>
      <h1>{{ $t('views.sql.title') }}</h1>

      <b-card :title="$t('views.sql.sections.connection.title')" class="my-2">
        <b-form @submit.prevent="connect">
          <b-form-group label="ODBC connection string">
            <b-input-group>
              <b-form-input
                v-model="connectionString"
                placeholder="Driver={SQL Server Native Client 11.0};Database=ACCOUNT_DBF;Server=.\\SQLExpress;Trusted_Connection=Yes"
              />
              <b-input-group-append>
                <b-button type="submit" variant="primary" block>
                  <b-icon icon="link" />
                  {{ $t('views.sql.sections.connection.connectButton') }}
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>

          <b-alert variant="success" :show="canQuery">
            <b-icon icon="check" />
            {{ $t('views.sql.sections.connection.connectionSuccess') }}
          </b-alert>

          <b-alert :show="Boolean(connectionError)" variant="danger">
            <b-icon icon="exclamation-triangle" />
            {{
              $t('views.sql.sections.connection.connectionError', [
                connectionError,
              ])
            }}
          </b-alert>
        </b-form>
      </b-card>

      <b-card :title="$t('views.sql.sections.query.title')" class="my-2">
        <b-form @submit.prevent="query">
          <b-form-group :disabled="!canQuery">
            <b-form-group :label="$t('views.sql.sections.query.languageLabel')">
              <b-form-select v-model="language" :options="languages" />
            </b-form-group>

            <b-row>
              <b-col>
                <b-form-group
                  :label="$t('views.sql.sections.query.statementLabel')"
                >
                  <b-form-textarea
                    v-model="request"
                    rows="3"
                    max-rows="8"
                    placeholder="SELECT * FROM dbo.ACCOUNT_TBL"
                  />
                </b-form-group>
              </b-col>

              <b-col>
                <b-form-group
                  :label="$t('views.sql.sections.query.prettyStatementLabel')"
                >
                  <prism :language="language" :code="request" class="my-0" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-alert :show="Boolean(requestError)" variant="danger">
              <b-icon icon="exclamation-triangle" />
              {{ $t('views.sql.sections.query.requestError', [requestError]) }}
            </b-alert>

            <b-button type="submit" variant="primary" block>
              <b-icon icon="lightning" />
              {{ $t('views.sql.sections.query.executeButton') }}
            </b-button>
          </b-form-group>
        </b-form>
      </b-card>

      <b-card v-if="result" class="my-2">
        <b-table :items="result" borderless />
      </b-card>
    </b-container>
  </div>
</template>

<script>
import odbc from 'odbc';

export default {
  data() {
    return {
      connectionString: '',
      connection: null,
      connectionError: null,
      language: 'sql',
      languages: [
        { value: 'jqvqscript', text: 'JavaScript' },
        { value: 'json', text: 'JSON' },
        { value: 'jsonp', text: 'JSONP' },
        { value: 'json5', text: 'JSON5' },
        { value: 'powerquery', text: 'PowerQuery' },
        { value: 'sql', text: 'SQL' },
        { value: 'xquery', text: 'XQuery' },
      ],
      request: '',
      requestError: null,
      result: null,
    };
  },
  computed: {
    canQuery() {
      return Boolean(this.connection);
    },
  },
  methods: {
    async connect() {
      try {
        this.connectionError = null;
        this.connection = await odbc.connect(this.connectionString);
      } catch (error) {
        console.error(error);
        this.connection = null;
        this.connectionError = error;
      }
    },
    async query() {
      try {
        this.requestError = null;
        this.result = await this.connection.query(this.request);
      } catch (error) {
        console.error(error);
        this.requestError = error;
      }
    },
  },
};
</script>
