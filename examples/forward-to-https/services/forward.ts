import { ServiceFactory } from '../../../src/config/interfaces';
import { Service } from '../../../src/core/app';
import { forwarder } from '../../../src/middleware/handlers/forwarder';

export interface Config {
	location: string;
}

/**
 * Forward http users to https
 */
const forward: ServiceFactory<Config> = ({ location }) => {
	const service: Service = {
		route: {
			middleware: forwarder({
				location
			})
		}
	};
	return service;
};

export default forward;
