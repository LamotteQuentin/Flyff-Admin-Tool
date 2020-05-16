<template>
  <div>
    <b-container fluid>
      <h1>{{ $t('views.odbc.title') }}</h1>

      <b-row class="my-2">
        <b-col>
          <h3>{{ $t('views.odbc.sections.filter.title') }}</h3>
          <p class="lead">{{ $t('views.odbc.sections.filter.subtitle') }}</p>

          <hr />

          <b-form-input
            v-model="filter"
            placeholder="Filter out driver or datasource names"
          />
        </b-col>
      </b-row>

      <b-row class="my-2">
        <b-col>
          <h3>{{ $t('views.odbc.sections.drivers.title') }}</h3>
          <p class="lead">{{ $t('views.odbc.sections.drivers.subtitle') }}</p>
          <b-button
            @click="
              openExternal(
                'https://docs.microsoft.com/en-us/sql/connect/odbc/windows/release-notes-odbc-sql-server-windows'
              )
            "
            variant="primary"
            block
          >
            <b-icon icon="download" />
            {{ $t('views.odbc.sections.drivers.downloadButton') }}
          </b-button>

          <hr />

          <b-list-group v-if="filteredDrivers.length">
            <b-list-group-item
              v-for="(driver, id) in filteredDrivers"
              v-bind:key="id"
              :variant="isDriverUsed(driver) ? '' : 'secondary'"
              class="flex-column align-items-start"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ driver.Name }}</h5>
                <small>{{ driver.Platform }}</small>
              </div>

              <small>{{ driver.Attribute.Setup }}</small>
            </b-list-group-item>
          </b-list-group>
          <p v-else>
            <b-icon icon="exclamation-triangle" variant="danger" />
            {{ $t('views.odbc.sections.drivers.empty') }}
          </p>
        </b-col>
      </b-row>

      <b-row class="my-2">
        <b-col>
          <h3>{{ $t('views.odbc.sections.dataSourceNames.title') }}</h3>
          <p class="lead">
            {{ $t('views.odbc.sections.dataSourceNames.subtitle') }}
          </p>
          <b-button
            @click="
              openExternal('https://www.connectionstrings.com/sql-server/')
            "
            variant="primary"
            block
          >
            <b-icon icon="book" />
            {{ $t('views.odbc.sections.dataSourceNames.documentationButton') }}
          </b-button>

          <hr />

          <b-list-group v-if="filteredDatasources.length">
            <b-list-group-item
              v-for="(datasource, id) in filteredDatasources"
              v-bind:key="id"
              class="flex-column align-items-start"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ datasource.Name }}</h5>
                <small>{{ datasource.Platform }}</small>
              </div>

              <p class="mb-1">
                <code>{{ getConnectionString(datasource) }}</code>
              </p>

              <small>{{ datasource.DriverName }}</small>

              <hr />

              <b-button-group size="sm" class="w-100">
                <b-button
                  @click="testConnection(datasource)"
                  variant="outline-primary"
                >
                  <b-icon icon="plug" />
                  {{ $t('views.odbc.sections.dataSourceNames.testButton') }}
                </b-button>
                <b-button
                  @click="copyConnectionString(datasource)"
                  variant="outline-secondary"
                >
                  <b-icon icon="link" />
                  {{ $t('views.odbc.sections.dataSourceNames.copyButton') }}
                </b-button>
              </b-button-group>
            </b-list-group-item>
          </b-list-group>
          <p v-else>
            <b-icon icon="exclamation-triangle" variant="danger" />
            {{ $t('views.odbc.sections.dataSourceNames.empty') }}
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { shell } from 'electron';
import PowerShell from 'node-powershell';
const ps = new PowerShell({
  executionPolicy: 'Bypass',
  noProfile: true,
});

export default {
  name: 'ODBC',
  data() {
    return {
      filter: '',
      datasources: [],
      drivers: [],
    };
  },
  computed: {
    filteredDrivers() {
      return this.drivers.filter(
        (driver) =>
          driver.Name &&
          driver.Name.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    filteredDatasources() {
      return this.datasources.filter(
        (datasource) =>
          (datasource.Name &&
            datasource.Name.toLowerCase().includes(
              this.filter.toLowerCase()
            )) ||
          (datasource.DriverName &&
            datasource.DriverName.toLowerCase().includes(
              this.filter.toLowerCase()
            ))
      );
    },
  },
  methods: {
    openExternal: shell.openExternal,
    async refresh() {
      try {
        ps.addCommand('Get-OdbcDriver | ConvertTo-Json');
        this.drivers = JSON.parse(await ps.invoke());

        ps.addCommand('Get-OdbcDsn | ConvertTo-Json');
        this.datasources = JSON.parse(await ps.invoke());
      } catch (error) {
        console.error(error);
      }
    },
    getConnectionString(datasource) {
      let connectionString = `Driver={${datasource.DriverName}}`;

      for (const attribute in datasource.Attribute) {
        connectionString += `;${attribute}=${datasource.Attribute[attribute]}`;
      }

      return connectionString;
    },
    copyConnectionString(datasource) {
      this.$copyText(this.getConnectionString(datasource));
    },
    isDriverUsed(driver) {
      return this.datasources.find(
        (datasource) => datasource.DriverName === driver.Name
      );
    },
    async testConnection(datasource) {
      ps.addCommand('$connection = New-Object System.Data.Odbc.OdbcConnection');
      ps.addCommand(
        `$connection.ConnectionString = "${this.getConnectionString(
          datasource
        )}"`
      );

      try {
        ps.addCommand('$connection.Open()');
        await ps.invoke();

        this.$bvModal.msgBoxOk(
          this.$t('views.odbc.notifications.testSucceeded.message', [
            datasource.Name,
          ]),
          {
            title: this.$t('views.odbc.notifications.testSucceeded.title'),
          }
        );
      } catch (error) {
        ps.addCommand('$connection.Close()');
        await ps.invoke();

        this.$bvModal.msgBoxOk(
          this.$t('views.odbc.notifications.testFailed.message', [
            datasource.Name,
          ]),
          {
            title: this.$t('views.odbc.notifications.testFailed.title'),
          }
        );
      }
    },
  },
  async created() {
    await this.refresh();
  },
};
</script>
