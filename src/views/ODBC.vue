<template>
  <b-container>
    <h1 class="display-1">ODBC Helper</h1>

    <b-row>
      <b-col>
        <h1 class="display-3">1. Search</h1>
        <p class="lead">
          Start by providing keywords to filter out the ODBC driver or
          datasource names you're looking for.
        </p>

        <hr />

        <b-form-input
          v-model="filter"
          placeholder="Filter out driver or datasource names"
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <h1 class="display-3">2. Verify your drivers</h1>
        <p class="lead">
          Make sure that the driver needed by your server's ODBC requirements is
          installed on your system. If not, you can install it via a Microsoft
          SQL Server bundle or as a standalone, directly from Micrososft.
        </p>
        <b-button
          @click="
            openExternal(
              'https://docs.microsoft.com/en-us/sql/connect/odbc/windows/release-notes-odbc-sql-server-windows'
            )
          "
          variant="primary"
          block
        >
          <b-icon icon="download" /> Microsoft's ODBC drivers download page
        </b-button>

        <hr />

        <b-list-group v-if="filteredDrivers">
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
        <p v-else>No ODBC driver was found on your system.</p>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <h1 class="display-3">3. Verify your DSNs</h1>
        <p class="lead">
          Make sure that the DSNs required by your server's ODBC connections are
          listed here. You can test them individually to check that they work.
          Note that the tests are ran using the same user that launched the FAT
          app so Windows-based authentication won't work if you're not aiming
          the same user!
        </p>
        <b-button
          @click="openExternal('https://www.connectionstrings.com/sql-server/')"
          variant="primary"
          block
        >
          <b-icon icon="book" /> Learn more about connection strings
        </b-button>

        <hr />

        <b-list-group v-if="filteredDatasources">
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
                <b-icon icon="plug" /> Test connection
              </b-button>
              <b-button
                @click="copyConnectionString(datasource)"
                variant="outline-secondary"
              >
                <b-icon icon="link" /> Copy connection string
              </b-button>
            </b-button-group>
          </b-list-group-item>
        </b-list-group>
        <p v-else>No DSN was found on your system.</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { shell } from 'electron';
import PowerShell from 'node-powershell';
const ps = new PowerShell({
  executionPolicy: 'Bypass',
  noProfile: true
});

export default {
  name: 'ODBC',
  data() {
    return {
      filter: '',
      datasources: [],
      drivers: []
    };
  },
  computed: {
    filteredDrivers() {
      return this.drivers.filter(
        driver =>
          driver.Name &&
          driver.Name.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    filteredDatasources() {
      return this.datasources.filter(
        datasource =>
          (datasource.Name &&
            datasource.Name.toLowerCase().includes(
              this.filter.toLowerCase()
            )) ||
          (datasource.DriverName &&
            datasource.DriverName.toLowerCase().includes(
              this.filter.toLowerCase()
            ))
      );
    }
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
        datasource => datasource.DriverName === driver.Name
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
          `Connection to "${datasource.Name}" was successful.`
        );
      } catch (error) {
        ps.addCommand('$connection.Close()');
        await ps.invoke();

        this.$bvModal.msgBoxOk(
          `Connection to "${datasource.Name}" has failed.`
        );
      }
    }
  },
  async created() {
    await this.refresh();
  }
};
</script>
