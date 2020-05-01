<template>
  <div>
    <b-container>
      <h1>{{ $t('views.system.title') }}</h1>

      <b-row v-if="cpu" class="my-2">
        <b-col>
          <h3>{{ $t('views.system.sections.1.title') }}</h3>

          <b-card :title="cpu.manufacturer" :sub-title="cpu.brand">
            <json-viewer :value="cpu" />
          </b-card>
        </b-col>
      </b-row>

      <b-row v-if="ram" class="my-2">
        <b-col>
          <h3>{{ $t('views.system.sections.2.title') }}</h3>

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
      </b-row>

      <b-row v-if="storage" class="my-2">
        <b-col>
          <h3>{{ $t('views.system.sections.3.title') }}</h3>

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
      </b-row>

      <b-row v-if="processes" class="my-2">
        <b-col>
          <h3>{{ $t('views.system.sections.4.title') }}</h3>

          <tree-view :tree="processesTree" />
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
      graph: {
        width: 1500,
        height: 1000,
        background: '#eee',
        nodes: [
          {
            id: '167efa699c7863ac',
            content: {
              text: 'Search',
              color: '#fab1a0'
            },
            width: 150,
            height: 60,
            shape: 'ellipse',
            point: {
              x: 1163,
              y: 242.2209625601816
            }
          },
          {
            id: '167efa7fc5d2f8d6',
            content: {
              text: 'Vue.js',
              url: 'https://vuejs.org/',
              color: 'white'
            },
            width: 150,
            height: 60,
            point: {
              x: 142,
              y: 335.9315621358057
            },
            shape: ''
          },
          {
            id: '167efa988e882161',
            content: {
              text: 'GitHub',
              url: 'https://github.com',
              color: 'white'
            },
            width: 150,
            height: 60,
            point: {
              x: 103,
              y: 99.9606147800741
            },
            shape: ''
          },
          {
            id: '167efaa2c59c27a1',
            content: {
              text: 'Google',
              url: 'https://www.google.com',
              color: 'white'
            },
            width: 150,
            height: 60,
            point: {
              x: 916,
              y: 95.02826241986094
            },
            shape: ''
          },
          {
            id: '167efabc40ee0852',
            content: {
              text: 'Development',
              color: '#fab1a0'
            },
            width: 200,
            height: 100,
            shape: 'ellipse',
            point: {
              x: 354,
              y: 166.53316452172362
            }
          },
          {
            id: '167efae23b74ae81',
            content: {
              text: 'Entertainment',
              color: '#fab1a0'
            },
            width: 200,
            height: 60,
            shape: 'ellipse',
            point: {
              x: 787,
              y: 534.5452292961393
            }
          },
          {
            id: '167efae64ea50b14',
            content: {
              text: 'YouTube',
              color: 'white',
              url: 'https://www.youtube.com'
            },
            width: 150,
            height: 60,
            point: {
              x: 867,
              y: 335.7771330748642
            },
            shape: ''
          },
          {
            id: '167efaefb4058b44',
            content: {
              text: 'Shopping',
              color: '#fab1a0'
            },
            width: 150,
            height: 60,
            shape: 'ellipse',
            point: {
              x: 203,
              y: 520.2200795768947
            }
          },
          {
            id: '167efaf41e0cc6f2',
            content: {
              text: 'Amazon',
              url: 'https://www.amazon.com',
              color: 'white'
            },
            width: 150,
            height: 60,
            point: {
              x: 401,
              y: 415.25250558023174
            },
            shape: 'ellipse'
          },
          {
            id: '167efafa9d4b4dbc',
            content: {
              text: 'AWS',
              url: 'https://aws.amazon.com',
              color: 'white'
            },
            width: 150,
            height: 60,
            point: {
              x: 626,
              y: 282.68778041751256
            },
            shape: ''
          },
          {
            id: '1680e229c0732ae9',
            content: {
              text: 'Social',
              color: '#fab1a0'
            },
            shape: 'ellipse',
            width: 150,
            height: 60,
            point: {
              x: 452,
              y: 759.8688614196489
            }
          },
          {
            id: '1680e2326421055d',
            content: {
              text: 'Twitter',
              url: 'https://twitter.com/',
              color: 'white'
            },
            width: 150,
            height: 60,
            point: {
              x: 189,
              y: 659.0198654750499
            },
            shape: ''
          },
          {
            id: '1680e259f7a6775b',
            content: {
              text: 'Angular',
              url: 'https://angular.io/',
              color: 'white'
            },
            width: 150,
            height: 60,
            point: {
              x: 619,
              y: 77.46450051344266
            },
            shape: ''
          }
        ],
        links: [
          {
            id: '167efaaddec32dd0',
            source: '167efaa2c59c27a1',
            destination: '167efa699c7863ac',
            point: {
              x: 1175.5,
              y: 140.62461249002126
            },
            color: '#55efc4',
            arrow: 'dest',
            shape: 'bezier',
            pattern: 'solid'
          },
          {
            id: '167efabd659483de',
            source: '167efabc40ee0852',
            destination: '167efa988e882161',
            point: {
              x: 335,
              y: 83.74688965089885
            },
            color: '#74b9ff',
            pattern: 'solid'
          },
          {
            id: '167efabe6bfc5f86',
            source: '167efabc40ee0852',
            destination: '167efa7fc5d2f8d6',
            point: {
              x: 283,
              y: 254.73236332876465
            },
            color: '#74b9ff'
          },
          {
            id: '167efae7330e886a',
            source: '167efae64ea50b14',
            destination: '167efae23b74ae81',
            point: {
              x: 963.5,
              y: 464.16118118550173
            },
            color: '#55efc4'
          },
          {
            id: '167efae7f84c412e',
            source: '167efae64ea50b14',
            destination: '167efaa2c59c27a1',
            point: {
              x: 900.5,
              y: 219.90269774736257
            },
            color: '#55efc4',
            pattern: 'dash',
            shape: 'straight',
            arrow: 'none'
          },
          {
            id: '167efaf767b32352',
            source: '167efaf41e0cc6f2',
            destination: '167efaefb4058b44',
            point: {
              x: 338.5,
              y: 444.7362925785632
            },
            color: '#74b9ff'
          },
          {
            id: '167efafb77b76f76',
            source: '167efafa9d4b4dbc',
            destination: '167efabc40ee0852',
            point: {
              x: 649,
              y: 223.1104724696181
            },
            color: '#74b9ff',
            shape: 'straight',
            pattern: 'solid',
            arrow: 'none'
          },
          {
            id: '167efafd0d253d23',
            source: '167efaf41e0cc6f2',
            destination: '167efafa9d4b4dbc',
            point: {
              x: 677.5,
              y: 451.4701429988721
            },
            color: '#74b9ff',
            arrow: 'dest',
            pattern: 'dash',
            shape: 'bezier'
          },
          {
            id: '1680e2377d4df60c',
            source: '1680e229c0732ae9',
            destination: '1680e2326421055d',
            point: {
              x: 427.5,
              y: 687.4443634473494
            },
            color: '#a29bfe'
          },
          {
            id: '1680e25b9919ba70',
            source: '1680e259f7a6775b',
            destination: '167efabc40ee0852',
            point: {
              x: 517.5,
              y: 102.49883251758314
            },
            color: '#74b9ff',
            shape: 'bezier',
            arrow: 'both'
          }
        ]
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
    }
  },
  methods: {
    async refresh() {
      this.cpu = await SystemInformation.cpu();
      this.ram = await SystemInformation.mem();
      this.storage = await SystemInformation.fsSize();
      this.processes = await SystemInformation.processes();
    }
  },
  async mounted() {
    await this.refresh();
  }
};
</script>
