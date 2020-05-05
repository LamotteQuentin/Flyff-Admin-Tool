import Settings from 'electron-settings';
import path from 'path';

const KEYS = {
  EXECUTABLES: 'executables'
};

Settings.setPath(path.join(path.dirname(Settings.file()), 'config.json'));

export default {
  getSettingsPath() {
    return Settings.file();
  },
  getExecutables() {
    return Settings.get(KEYS.EXECUTABLES);
  },
  setExecutables(settings) {
    return Settings.set(KEYS.EXECUTABLES, settings);
  }
};
