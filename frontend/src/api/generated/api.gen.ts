/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Error {
  /** Machine-readable code: an app code, or the default code of the status (bad_request, unauthorized, forbidden, not_found, conflict, gone, precondition_failed, too_large, unprocessable, too_many_requests, not_implemented, bad_gateway, unavailable, gateway_timeout, internal, method_not_allowed, not_acceptable, unsupported_media_type). */
  code: string;
  /** The message. On 5xx always the status text. */
  error: string;
  /** On 5xx only: the id the full error is logged under. */
  id?: string;
}

export interface GetNumberResp {
  number: number;
}

export interface SchemafAuth0LoginRequest {
  id_token: string;
}

export interface SchemafErrorDetails {
  code: string;
  /** The full error. */
  error: string;
  id: string;
  method: string;
  /** The misuse of the error API, if any. */
  misuse?: string;
  path: string;
  status: number;
  /** The caller, if authenticated. */
  subject?: string;
  /** @format date-time */
  time: string;
}

export interface SchemafLoginResponse {
  subject: string;
  token: string;
}

export interface SchemafRefreshResponse {
  token: string;
}

export interface SchemafUpdateRequest {
  version: string;
}

export interface SchemafUpdateState {
  available: {
    notes: string;
    version: string;
  }[];
  checked?: string;
  install?: {
    finished: string;
    from: string;
    message: string;
    started: string;
    state:
      | "installing"
      | "installed"
      | "rolled-back"
      | "failed"
      | "rollback-failed";
    version: string;
  };
  request?: {
    message: string;
    state: "accepted" | "rejected";
    time: string;
    version: string;
  };
  /** The running version; empty in development. */
  running: string;
  status: "updater not enabled" | "idle" | "installing";
}

export interface SchemafUser {
  id: string;
}

export interface SetNumberReq {
  number: number;
}

export interface SetNumberResp {
  number: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export type ContentType =
  | "application/json"
  | "application/vnd.api+json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/plain";

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    ["application/json"]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    ["application/vnd.api+json"]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    ["text/plain"]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    ["multipart/form-data"]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    ["application/x-www-form-urlencoded"]: (input: any) =>
      this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || "application/json"];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== "multipart/form-data"
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API
 * @version 1.0.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Verifies the ID token from the Auth0 SPA SDK and starts a schemaf session. 404 if Auth0 is not configured on this instance.
     *
     * @name PostApiAuthAuth0Login
     * @summary Sign in with an Auth0 ID token
     * @request POST:/api/auth/auth0/login
     */
    postApiAuthAuth0Login: (
      data: SchemafAuth0LoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<SchemafLoginResponse, Error>({
        path: `/api/auth/auth0/login`,
        method: "POST",
        body: data,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * @description Revokes the current session (if any) and clears the session cookie.
     *
     * @name PostApiAuthLogout
     * @summary End the current session
     * @request POST:/api/auth/logout
     */
    postApiAuthLogout: (params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/api/auth/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @name PostApiAuthRefresh
     * @summary Get a fresh token for the current session
     * @request POST:/api/auth/refresh
     * @secure
     */
    postApiAuthRefresh: (params: RequestParams = {}) =>
      this.request<SchemafRefreshResponse, Error>({
        path: `/api/auth/refresh`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Passes the request to the named identity provider and starts a schemaf session. The body is defined by the provider.
     *
     * @name PostApiAuthProviderLogin
     * @summary Sign in with an identity provider
     * @request POST:/api/auth/{provider}/login
     */
    postApiAuthProviderLogin: (
      provider: string,
      data: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.request<SchemafLoginResponse, Error>({
        path: `/api/auth/${provider}/login`,
        method: "POST",
        body: data,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * @description Every PUBLIC_* environment variable, keyed by its full name. Read it in the frontend through config() from config.gen.ts.
     *
     * @name GetApiConfig
     * @summary Public frontend config
     * @request GET:/api/config
     */
    getApiConfig: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Error>({
        path: `/api/config`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description The details stored for the 5xx answered with this id: open in development mode, in production only to callers the app allows (app.CanSeeErrorDetails). 404 when the id is unknown or expired (kept: newest 1000, at most 24 hours, per process).
     *
     * @name GetApiErrorsId
     * @summary Details of a server error
     * @request GET:/api/errors/{id}
     * @secure
     */
    getApiErrorsId: (id: string, params: RequestParams = {}) =>
      this.request<SchemafErrorDetails, Error>({
        path: `/api/errors/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description "status" is "ok" or "error", "db" and every registered health check are "ok" or "error: …". 503 (with the same body) when anything is unhealthy.
     *
     * @name GetApiHealth
     * @summary Health check
     * @request GET:/api/health
     */
    getApiHealth: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string> | Error>({
        path: `/api/health`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns 0 if no number has been set yet.
     *
     * @name GetApiNumber
     * @summary Returns the stored number.
     * @request GET:/api/number
     */
    getApiNumber: (params: RequestParams = {}) =>
      this.request<GetNumberResp, Error>({
        path: `/api/number`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Replaces any previously stored value.
     *
     * @name PutApiNumber
     * @summary Stores a number.
     * @request PUT:/api/number
     */
    putApiNumber: (data: SetNumberReq, params: RequestParams = {}) =>
      this.request<SetNumberResp, Error>({
        path: `/api/number`,
        method: "PUT",
        body: data,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * @description Mode (development or production), uptime, last backup, active identity providers, and every registered status provider.
     *
     * @name GetApiStatus
     * @summary Service status
     * @request GET:/api/status
     */
    getApiStatus: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Error>({
        path: `/api/status`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description The running version, the verified versions the app may request (with their release notes), and the last install and request. Status "updater not enabled" without an updater on the run host. 403 until the app authorizes callers (app.SetUpdatesAuth).
     *
     * @name GetApiUpdates
     * @summary The instance's updates
     * @request GET:/api/updates
     * @secure
     */
    getApiUpdates: (params: RequestParams = {}) =>
      this.request<SchemafUpdateState, Error>({
        path: `/api/updates`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Asks the run host's updater to install one of the available versions; the updater checks it again and decides. 403 until the app authorizes callers (app.SetUpdatesAuth); 409 updater_not_enabled or install_running; 422 version_not_available.
     *
     * @name PostApiUpdatesRequest
     * @summary Request the install of a version
     * @request POST:/api/updates/request
     * @secure
     */
    postApiUpdatesRequest: (
      data: SchemafUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<SchemafUpdateRequest, Error>({
        path: `/api/updates/request`,
        method: "POST",
        body: data,
        secure: true,
        type: "application/json",
        format: "json",
        ...params,
      }),

    /**
     * @description The subject of the caller.
     *
     * @name GetApiUserMe
     * @summary The authenticated caller
     * @request GET:/api/user/me
     * @secure
     */
    getApiUserMe: (params: RequestParams = {}) =>
      this.request<SchemafUser, Error>({
        path: `/api/user/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
