<template>
  <div>
    <b-container fluid>
      <h1>{{ $t('views.system.title') }}</h1>

      <b-row class="my-2">
        <b-col v-if="cpu">
          <h3>{{ $t('views.system.sections.cpu.title') }}</h3>

          <hr />

          <b-card :title="cpu.manufacturer" :sub-title="cpu.brand">
            <pre>{{ cpu }}</pre>
          </b-card>
        </b-col>

        <b-col v-if="ram">
          <h3>{{ $t('views.system.sections.ram.title') }}</h3>

          <hr />

          <b-card>
            <b-card-title>
              {{ ram.total | bytes }}
            </b-card-title>
            <b-card-sub-title>
              {{ ram.swaptotal | bytes }}
            </b-card-sub-title>

            <br />

            <b-progress :max="ram.total">
              <b-progress-bar
                :value="ram.used"
                :variant="
                  (ram.used * 100) / ram.total < 90 ? 'success' : 'danger'
                "
              >
                <strong>
                  {{ ram.used | bytes }} /
                  {{ ram.total | bytes }}
                </strong>
              </b-progress-bar>
            </b-progress>

            <br />

            <b-progress :max="ram.swaptotal">
              <b-progress-bar
                :value="ram.swapused"
                :variant="
                  (ram.swapused * 100) / ram.swaptotal < 90
                    ? 'success'
                    : 'danger'
                "
              >
                <strong>
                  {{ ram.swapused | bytes }} /
                  {{ ram.swaptotal | bytes }}
                </strong>
              </b-progress-bar>
            </b-progress>
          </b-card>
        </b-col>

        <b-col v-if="storage">
          <h3>{{ $t('views.system.sections.storage.title') }}</h3>

          <hr />

          <b-card
            v-for="(fileSystem, id) in storage"
            v-bind:key="id"
            :title="fileSystem.mount"
            :sub-title="fileSystem.type"
            class="my-2"
          >
            <b-progress>
              <b-progress-bar
                :value="fileSystem.use"
                :variant="fileSystem.use < 90 ? 'success' : 'danger'"
              >
                <strong>
                  {{ fileSystem.used | bytes }} /
                  {{ fileSystem.size | bytes }}
                </strong>
              </b-progress-bar>
            </b-progress>
          </b-card>
        </b-col>

        <b-col v-if="processes">
          <h3>{{ $t('views.system.sections.processes.title') }}</h3>

          <hr />

          <h5>{{ $t('views.system.sections.processes.tree.title') }}</h5>
          <b-card bg-variant="dark">
            <tree-view :tree="processesTree" />
          </b-card>

          <br />

          <h5>{{ $t('views.system.sections.processes.graph.title') }}</h5>
          <b-card v-dragscroll class="overflow-auto">
            <vue-mermaid
              @nodeClick="showProcessDetails"
              :nodes="processesGraph"
              :config="mermaidConfig"
              type="graph LR"
            />
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SystemInformation from 'systeminformation';

export default {
  data() {
    return {
      cpu: undefined,
      ram: undefined,
      storage: undefined,
      processes: undefined,
      mermaidConfig: {
        theme: 'neutral'
      }
    };
  },
  computed: {
    processesTree() {
      if (this.processes) {
        const flat = this.processes.list.map(proc => {
          return {
            id: proc.pid,
            parent: proc.parentPid,
            text: `[${proc.pid}] ${proc.name}`
          };
        });
        const root = [];
        const map = {};

        flat.forEach(node => {
          try {
            if (!flat.find(proc => proc.id == node.parent))
              return root.push(node);

            let parentIndex = map[node.parent];
            if (typeof parentIndex !== 'number') {
              parentIndex = flat.findIndex(el => el.id === node.parent);
              map[node.parent] = parentIndex;
            }

            if (!flat[parentIndex].nodes) {
              return (flat[parentIndex].nodes = [node]);
            }

            flat[parentIndex].nodes.push(node);
          } catch (error) {
            console.error(error);
          }
        });

        return root;
      } else {
        return [];
      }
    },
    processesGraph() {
      return this.processes.list
        .filter(proc => proc.pid !== proc.parentPid)
        .map(proc => {
          const parentProc = this.processes.list.find(
            parent => parent.pid == proc.parentPid
          );
          const parentProcName = parentProc ? parentProc.name : 'NA';

          return {
            id: proc.pid,
            text: `"[${proc.pid}] ${proc.name}"`,
            link: `-- ${this.$t(
              'views.system.sections.processes.graph.linkLabel',
              [parentProcName, new Date(proc.started).toLocaleString()]
            )} -->`,
            next: [proc.parentPid],
            group: `"[${proc.parentPid}]"`
          };
        });
    }
  },
  methods: {
    async refresh() {
      this.cpu = await SystemInformation.cpu();
      this.ram = await SystemInformation.mem();
      this.storage = await SystemInformation.fsSize();
      this.processes = await SystemInformation.processes();
    },
    showProcessDetails(proc) {
      console.log('click', proc);
    }
  },
  async mounted() {
    await this.refresh();
  }
};
</script>

<style scoped>
#ll931217-vue-treeview {
  background-color: transparent;
  box-shadow: none;
  padding: 0;
}
</style>
