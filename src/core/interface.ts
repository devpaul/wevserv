import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';

export const enum ServerType {
	HTTP = 'http',
	HTTPS = 'https'
}

export type HttpMethod = 'connect' | 'delete' | 'get' | 'head' | 'post' | 'put' | 'trace';

export type Process = (request: IncomingMessage, response: ServerResponse) => Promise<void> | void;

export type ProcessFactory<T extends object> = (options: T) => Process;

export type Guard = (request: IncomingMessage) => boolean;

export type AsyncGuard = (request: IncomingMessage) => boolean | Promise<boolean>;

export type GuardFactory<T extends object> = (options: T) => Guard;

export type MiddlewareResult = object | void;

/**
 * Middleware handles a single request made to the server.
 *
 * The preferred way to provide a response is by returning a MiddlewareResult from the middleware.
 * This may then be transformed by a Transform to supply a response in an acceptable format.
 */
export interface Middleware {
	(request: IncomingMessage, response: ServerResponse): Promise<MiddlewareResult> | MiddlewareResult;
}

export type MiddlewareFactory<T extends object = {}> = (options: T) => Middleware;

export type Transform = (result: MiddlewareResult, request: IncomingMessage, response: ServerResponse) => void;

export type TransformFactory<T extends object> = (options: T) => Transform;

export interface Route {
	/**
	 * Tests if the IncomingMessage should be handled by this route
	 */
	test(request: IncomingMessage, response: ServerResponse): Promise<boolean> | boolean;
	/**
	 * Seeks a response to provide to ServerResponse
	 */
	run: Middleware;
}

export type ErrorRequestHandler = (error: any, response: ServerResponse, result?: MiddlewareResult) => void;

export interface RouteDescriptor {
	before?: Process[];
	guards?: Guard[];
	middleware: Middleware | Array<Route | RouteDescriptor>;
	transforms?: Transform[];
	after?: Process[];
	errorHandler?: ErrorRequestHandler;
}

export interface RouteProperties {
	route?: string;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Type Transforms
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type RequireSome<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Socket upgrades
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type UpgradeListener = (request: IncomingMessage, socket: Socket, head: Buffer) => void | Promise<void>;

export type UpgradeListenerFactory<T extends object> = (options: T) => UpgradeListener;

export type UpgradeErrorHandler = (e: Error, socket?: Socket) => void;

export interface Upgrade {
	/**
	 * Tests if the IncomingMessage should be upgraded
	 */
	test(request: IncomingMessage): Promise<boolean> | boolean;
	/**
	 * Upgrades the IncomingMessage to bidirectionally pass messages asynchronously using a socket
	 */
	run: UpgradeListener;
}

export interface UpgradeDescriptor {
	guards?: AsyncGuard[];
	upgrade: UpgradeListener | Array<Upgrade | UpgradeDescriptor>;
	errorHandler?: UpgradeErrorHandler;
}
