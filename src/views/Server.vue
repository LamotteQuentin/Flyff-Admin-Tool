<template>
  <div>
    <b-sidebar
      id="workflow"
      width="25%"
      bg-variant="dark"
      no-header
      backdrop
      shadow
    >
      <b-container class="py-4" fluid>
        <draggable
          v-model="executables"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <b-card
            v-for="(executable, id) in executables"
            v-bind:key="id"
            no-body
            class="my-2"
          >
            <b-card-body>
              <b-card-title>{{ getBaseName(executable.command) }}</b-card-title>
              <b-form>
                <b-form-group :disabled="!areExecutablesEditable">
                  <b-form-group
                    :label="$t('views.server.sections.workflow.commandLabel')"
                    :label-for="`command-${id}`"
                  >
                    <b-input-group>
                      <b-form-input
                        v-model="executable.command"
                        :id="`command-${id}`"
                      />
                      <b-input-group-append>
                        <b-button @click="editExecutableFile(executable)">
                          <b-icon icon="folder-symlink" />
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>

                  <b-form-group
                    :label="$t('views.server.sections.workflow.argsLabel')"
                    :label-for="`args-${id}`"
                  >
                    <b-form-tags
                      v-model="executable.args"
                      :input-id="`args-${id}`"
                      :placeholder="
                        $t('views.server.sections.workflow.argsPlaceholder')
                      "
                    />
                  </b-form-group>

                  <b-form-group
                    :label="$t('views.server.sections.workflow.delayLabel')"
                    :label-for="`delay-${id}`"
                  >
                    <b-form-spinbutton
                      v-model="executable.delay"
                      min="0"
                      step="500"
                      max="10000"
                      :id="`delay-${id}`"
                    />
                  </b-form-group>
                </b-form-group>
              </b-form>
            </b-card-body>

            <b-card-footer>
              <b-button-group class="w-100" size="sm">
                <b-button
                  @click="remove(executable)"
                  :disabled="!areExecutablesEditable"
                  variant="outline-danger"
                >
                  <b-icon icon="trash" />
                  {{ $t('views.server.sections.workflow.removeButton') }}
                </b-button>
              </b-button-group>
            </b-card-footer>
          </b-card>
        </draggable>

        <b-button @click="add" :disabled="!areExecutablesEditable" block="">
          <b-icon icon="file-plus" />
          {{ $t('views.server.sections.workflow.addButton') }}
        </b-button>
        <b-button
          @click="save"
          :disabled="!areExecutablesEditable"
          variant="primary"
          block
        >
          <b-icon icon="archive" />
          {{ $t('views.server.sections.workflow.saveButton') }}
        </b-button>
      </b-container>
    </b-sidebar>

    <b-container fluid>
      <h1>{{ $t('views.server.title') }}</h1>

      <b-row>
        <b-col cols="12" class="my-2">
          <h3>{{ $t('views.server.sections.workflow.title') }}</h3>

          <hr />

          <b-card no-body>
            <b-card-body class="text-center overflow-auto">
              <vue-mermaid :nodes="workflowGraph" type="graph LR" />
            </b-card-body>
            <b-card-footer>
              <b-alert :show="!areExecutablesEditable" variant="warning">
                <b-icon icon="lock" />
                {{ $t('views.server.sections.workflow.executablesLocked') }}
              </b-alert>

              <b-button
                v-b-toggle.workflow
                :disabled="!areExecutablesEditable"
                block
              >
                <b-icon icon="arrow-left-right" />
                {{ $t('views.server.sections.workflow.editButton') }}
              </b-button>
            </b-card-footer>
          </b-card>
        </b-col>

        <b-col cols="12" class="my-2">
          <h3>{{ $t('views.server.sections.processes.title') }}</h3>

          <hr />

          <b-card no-body>
            <b-tabs fill pills card small>
              <b-tab v-for="(executable, id) in executables" v-bind:key="id">
                <template v-slot:title>
                  <b-spinner v-if="executable.process" type="grow" small />
                  {{ getBaseName(executable.command) }}
                </template>

                <b-button-group class="w-100 my-2">
                  <b-button
                    @click="sequentialStart(executable)"
                    :disabled="Boolean(executable.process)"
                    variant="primary"
                  >
                    <b-icon icon="play-fill" />
                    {{
                      $t(
                        'views.server.sections.processes.sequentialStartButton'
                      )
                    }}
                  </b-button>
                  <b-button
                    @click="sequentialStop(executable)"
                    :disabled="!Boolean(executable.process)"
                    variant="secondary"
                  >
                    <b-icon icon="stop-fill" />
                    {{
                      $t('views.server.sections.processes.sequentialStopButton')
                    }}
                  </b-button>
                </b-button-group>

                <b-button-group class="w-100 my-2">
                  <b-button
                    @click="start(executable)"
                    :disabled="Boolean(executable.process)"
                    variant="outline-primary"
                  >
                    <b-icon icon="play" />
                    {{ $t('views.server.sections.processes.startButton') }}
                  </b-button>
                  <b-button
                    @click="stop(executable)"
                    :disabled="!Boolean(executable.process)"
                    variant="outline-secondary"
                  >
                    <b-icon icon="stop" />
                    {{ $t('views.server.sections.processes.stopButton') }}
                  </b-button>
                </b-button-group>

                <b-form @submit="send(executable)">
                  <b-form-group
                    :label="$t('views.server.sections.processes.stdinLabel')"
                    label-for="stdin"
                  >
                    <b-input-group>
                      <b-form-input
                        v-model="stdin"
                        :disabled="Boolean(!executable.process)"
                        id="stdin"
                      />
                      <b-input-group-append>
                        <b-button
                          @click="send(executable)"
                          :disabled="Boolean(!executable.process)"
                          block
                        >
                          <b-icon icon="reply" />
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-form>

                <b-card title="CPU / RAM" class="my-2">
                  <b-card-sub-title v-if="executable.metrics.length > 0">
                    {{ getLastCpuUsage(executable) | percent(2) }}
                    /
                    {{ getLastRamUsage(executable) | bytes }}
                  </b-card-sub-title>

                  <process-metrics-chart
                    v-if="getChartData(executable)"
                    :chartData="getChartData(executable)"
                    class="metrics-chart"
                  />
                  <p v-else>
                    {{ $t('views.server.sections.processes.noMetric') }}
                  </p>
                </b-card>

                <b-list-group class="my-2">
                  <b-list-group-item
                    v-for="(log, id) in executable.logs"
                    v-bind:key="id"
                    class="d-flex justify-content-between align-items-center"
                  >
                    <code class="text-dark">{{ log.data }}</code>
                    <b-badge :variant="getLogVariant(log.type)" pill>
                      {{ log.type }}
                    </b-badge>
                  </b-list-group-item>
                </b-list-group>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { remote } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import kill from 'tree-kill';
import pidUsage from 'pidusage';
import SystemInformation from 'systeminformation';
import SettingsManager from '@/utils/SettingsManager';
import ProcessMetricsChart from '@/components/Server/ProcessMetricsChart';
import Executable from '@/models/Executable';

export default {
  name: 'Server',
  components: {
    ProcessMetricsChart
  },
  data() {
    return {
      executables: [],
      stdin: null,
      cpuCores: 1
    };
  },
  computed: {
    areExecutablesEditable() {
      return (
        this.executables.filter(executable => executable.process).length === 0
      );
    },
    dragOptions() {
      return {
        disabled: !this.areExecutablesEditable
      };
    },
    workflowGraph() {
      return this.executables.map((executable, id) => {
        return {
          id: id,
          text: path.basename(executable.command),
          link: executable.delay ? `-- ${executable.delay} ms -->` : '-->',
          next: [id + 1],
          group: path.dirname(executable.command)
        };
      });
    }
  },
  methods: {
    getBaseName: path.basename,
    add() {
      this.executables.push(new Executable());
    },
    remove(executable) {
      this.executables.splice(this.executables.indexOf(executable), 1);
    },
    save() {
      SettingsManager.setExecutables(
        this.executables.map(executable => executable.getSavableObject())
      );

      this.$bvModal.msgBoxOk(
        this.$t('views.server.notifications.executablesSaved.message'),
        {
          title: this.$t('views.server.notifications.executablesSaved.title')
        }
      );
    },
    async editExecutableFile(executable) {
      const result = await remote.dialog.showOpenDialog({
        defaultPath: path.dirname(executable.command),
        properties: ['openFile'],
        filters: [{ name: 'exe', extensions: ['exe'] }]
      });

      if (!result.canceled && result.filePaths.length > 0) {
        executable.reset();
        executable.command = result.filePaths[0];
      }
    },
    start(executable) {
      if (!executable.process) {
        executable.process = null;
        executable.metrics = [];
        executable.logs = [];

        executable.process = spawn(executable.command, executable.args, {
          cwd: path.dirname(executable.command)
        });

        executable.process.stdout.on('data', data => {
          executable.logs.push({
            type: 'stdout',
            data: Buffer.from(data).toString(this.encoding)
          });
        });

        executable.process.stderr.on('data', data => {
          executable.logs.push({
            type: 'stderr',
            data: Buffer.from(data).toString(this.encoding)
          });
        });

        executable.process.on('exit', data => {
          executable.logs.push({
            type: 'exit',
            data
          });
          executable.process = null;
        });
      }
    },
    async sequentialStart(executable) {
      for (const child of this.executables.slice(
        0,
        this.executables.indexOf(executable) + 1
      )) {
        await new Promise(resolve => setTimeout(resolve, child.delay));
        this.start(child);
      }
    },
    stop(executable) {
      if (executable.process) {
        kill(executable.process.pid);
        executable.process = null;
      }
    },
    async sequentialStop(executable) {
      for (const child of this.executables
        .slice(this.executables.indexOf(executable))
        .reverse()) {
        this.stop(child);
      }
    },
    send(executable) {
      executable.process.stdin.write(this.stdin);

      executable.logs.push({
        type: 'stdin',
        data: this.stdin
      });
    },
    getLogVariant(type) {
      switch (type) {
        case 'stdout':
          return 'success';
        case 'stderr':
          return 'danger';
        case 'exit':
          return 'warning';
        default:
          return 'secondary';
      }
    },
    async monitorExecutables() {
      for (const executable of this.executables) {
        if (executable.process) {
          executable.metrics.push(await pidUsage(executable.process.pid));
        }
      }

      setTimeout(this.monitorExecutables, 1000);
    },
    getLastCpuUsage(executable) {
      return executable.metrics.length > 0
        ? executable.metrics.slice(-1)[0].cpu / (100 * this.cpuCores)
        : null;
    },
    getLastRamUsage(executable) {
      return executable.metrics.length > 0
        ? executable.metrics.slice(-1)[0].memory
        : null;
    },
    getChartData(executable) {
      const metricsCount = executable.metrics.length;

      if (metricsCount > 0) {
        const labels = executable.metrics
          .map(metric => new Date(metric.timestamp).toLocaleTimeString())
          .slice(Math.max(metricsCount - 10, 0));

        const datasets = [
          {
            label: 'CPU',
            yAxisID: 'CPU',
            borderColor: '#3b4545',
            backgroundColor: 'transparent',
            data: executable.metrics
              .map(metric => metric.cpu / 100 / this.cpuCores)
              .slice(Math.max(metricsCount - 10, 0))
          },
          {
            label: 'RAM',
            yAxisID: 'RAM',
            borderColor: '#008080',
            backgroundColor: 'transparent',
            data: executable.metrics
              .map(metric => metric.memory)
              .slice(Math.max(metricsCount - 10, 0))
          }
        ];

        return {
          labels,
          datasets
        };
      }
      return null;
    }
  },
  async mounted() {
    this.executables = SettingsManager.getExecutables().map(
      executable =>
        new Executable(executable.args, executable.command, executable.delay)
    );

    this.cpuCores = (await SystemInformation.cpu()).cores;

    this.monitorExecutables();
  }
};
</script>

<style scoped>
.metrics-chart {
  height: 200px;
}
</style>
