import MagieConfig from "./types/MagieConfig";

export default function setConfig(config: MagieConfig) {
    if (!config.vite) config.vite = {};
    if (!config.frontend) config.frontend = true;
    if (!config.backend) config.backend = {};
    if (!config.backend.entry) config.backend.entry = 'src/index.ts';
    if (!config.vite.plugins) config.vite.plugins = [];
    if (!config.server) config.server = {};
    if (!config.server.port) config.server.port = 3001;
    if (!config.plugins) config.plugins = [];
    
    config.plugins = [config.plugins].flat();
    for (let plugin of config.plugins) {
        if (plugin.magieConfig) {
            config = { ...config, ...plugin.magieConfig(config) };
        }
    }
}