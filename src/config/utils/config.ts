import { promises } from 'fs';
import { resolve } from 'path';
import { TypeScriptConfig } from './addons';
import { ExternalMap } from './externals';
import { fileExists } from './file/exists';
import { Server } from './server';

const {} = promises;

export interface Config {
	externals?: ExternalMap;
	logLevel?: string;
	servers: Server[];
	tsConfig?: TypeScriptConfig;
}

export interface LoadedConfig {
	config: Config;
	configPath: string;
}

/**
 * Loads the configuration file from the provided path
 */
function loadConfigFile(path: string): LoadedConfig {
	const configPath = resolve(path);
	const config = require(configPath);

	return { config, configPath };
}

/**
 * Loads the configuration file from the default location relative to the cwd
 */
async function loadDefaultConfig(): Promise<LoadedConfig | undefined> {
	const configPath = resolve('./webserv.json');
	if (await fileExists(configPath)) {
		const config = require(configPath);
		return { config, configPath };
	}
	return undefined;
}

/**
 * @returns a config at the provided path, the default config, or undefined if none exist
 */
export function loadConfig(path?: string) {
	return path ? loadConfigFile(path) : loadDefaultConfig();
}
