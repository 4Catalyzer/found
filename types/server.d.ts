// TypeScript Version: 4.0

import { FarceRouterOptions, RenderArgs, Resolver } from 'found';
import * as React from 'react';

export {};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export interface GetFarceResultOptions
  extends Omit<FarceRouterOptions, 'store' | 'historyProtocol'> {
  url: string;
  resolver?: Resolver;
  matchContext?: any;
}

export interface FarceElementResult {
  status: number;
  element: React.ReactElement;
}

export interface FarceRedirectResult {
  status: number;
  redirect: {
    url: string;
  };
}

export type FarceResult = FarceElementResult | FarceRedirectResult;

export function getFarceResult(
  options: GetFarceResultOptions,
): Promise<FarceResult>;

export interface RouterProviderProps {
  renderArgs: RenderArgs;
  children?: React.ReactNode;
}

export type RouterProvider = React.ComponentType<RouterProviderProps>;
