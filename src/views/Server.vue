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

          <b-card title="Logs" class="my-2">
            <json-viewer :value="logs" :expand-depth="3" />
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { spawn } from 'child_process';
import path from 'path';

export default {
  name: 'Server',
  data() {
    return {
      file: undefined,
      child: undefined,
      stdin: undefined,
      logs: [],
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
      ]
    };
  },
  methods: {
    start() {
      this.child = spawn(this.file.path, {
        cwd: path.dirname(this.file.path)
      });

      this.child.stdout.on('data', data => {
        this.logs.push({
          type: 'stdout',
          data: Buffer.from(data).toString(this.encoding)
        });
      });

      this.child.stderr.on('data', data => {
        this.logs.push({
          type: 'stderr',
          data: Buffer.from(data).toString(this.encoding)
        });
      });

      this.child.on('exit', exitCode => {
        this.logs.push({
          type: 'exit',
          exitCode
        });
      });
    },
    send() {
      this.child.stdin.write(this.stdin);
      this.logs.push({
        type: 'stdin',
        data: this.stdin
      });
    }
  }
};
</script>
