<template>
  <div>
    <b-container fluid>
      <h1>{{ $t('views.server.title') }}</h1>

      <b-row>
        <b-col>
          <h3>{{ $t('views.server.sections.executable.title') }}</h3>

          <hr />

          <b-form-group
            :label="$t('views.server.sections.executable.fileLabel')"
            label-for="file"
            description="*.exe"
          >
            <b-form-file
              v-model="file"
              accept=".exe"
              :state="Boolean(file)"
              id="file"
            />
          </b-form-group>
          <b-form-group
            :label="$t('views.server.sections.executable.encodingLabel')"
            label-for="encoding"
          >
            <b-form-select
              v-model="encoding"
              :options="encodings"
              id="encoding"
              required
            />
          </b-form-group>
          <b-button @click="start" :disabled="!file" block>
            {{ $t('views.server.sections.executable.startButton') }}
          </b-button>

          <b-form-group
            :label="$t('views.server.sections.executable.inputLabel')"
            label-for="stdin"
          >
            <b-form-input v-model="stdin" :disabled="!file" id="stdin" />
          </b-form-group>
          <b-button @click="send" :disabled="!file" block>
            {{ $t('views.server.sections.executable.sendButton') }}
          </b-button>
        </b-col>
        <b-col>
          <h3>{{ $t('views.server.sections.logs.title') }}</h3>

          <hr />

          <json-viewer :value="logs" :expand-depth="3" />
        </b-col>
        <b-col>
          <h3>{{ $t('views.server.sections.performance.title') }}</h3>

          <hr />

          <json-viewer v-if="performance" :value="performance" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { spawn } from 'child_process';
import path from 'path';
import SystemInformation from 'systeminformation';

export default {
  name: 'Server',
  data() {
    return {
      file: undefined,
      proc: undefined,
      stdin: undefined,
      encoding: 'utf8',
      encodings: [
        'utf8',
        'utf16le',
        'latin1',
        'base64',
        'hex',
        'ascii',
        'binary',
        'ucs2',
        'win-1252'
      ],
      logs: [],
      performance: undefined
    };
  },
  methods: {
    start() {
      this.proc = spawn(this.file.path, {
        cwd: path.dirname(this.file.path)
      });

      this.proc.stdout.on('data', data => {
        this.logs.push({
          type: 'stdout',
          data: Buffer.from(data).toString(this.encoding)
        });
      });

      this.proc.stderr.on('data', data => {
        this.logs.push({
          type: 'stderr',
          data: Buffer.from(data).toString(this.encoding)
        });
      });

      this.proc.on('exit', exitCode => {
        this.logs.push({
          type: 'exit',
          exitCode
        });
      });
    },
    send() {
      this.proc.stdin.write(this.stdin);
      this.logs.push({
        type: 'stdin',
        data: this.stdin
      });
    },
    async monitor() {
      if (this.proc) {
        const processes = await SystemInformation.processes();
        this.performance = processes.list.find(
          proc => proc.pid == this.proc.pid
        );
      } else {
        this.performance = undefined;
      }
      setTimeout(this.monitor, 2000);
    }
  },
  mounted() {
    this.monitor();
  }
};
</script>
