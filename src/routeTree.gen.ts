/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as TestRouteImport } from './routes/test'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AnalysisIndexRouteImport } from './routes/analysis/index'
import { Route as AnalysisTaskIdRouteImport } from './routes/analysis/$taskId'

const TestRoute = TestRouteImport.update({
  id: '/test',
  path: '/test',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AnalysisIndexRoute = AnalysisIndexRouteImport.update({
  id: '/analysis/',
  path: '/analysis/',
  getParentRoute: () => rootRouteImport,
} as any)
const AnalysisTaskIdRoute = AnalysisTaskIdRouteImport.update({
  id: '/analysis/$taskId',
  path: '/analysis/$taskId',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/test': typeof TestRoute
  '/analysis/$taskId': typeof AnalysisTaskIdRoute
  '/analysis': typeof AnalysisIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/test': typeof TestRoute
  '/analysis/$taskId': typeof AnalysisTaskIdRoute
  '/analysis': typeof AnalysisIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/test': typeof TestRoute
  '/analysis/$taskId': typeof AnalysisTaskIdRoute
  '/analysis/': typeof AnalysisIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/test' | '/analysis/$taskId' | '/analysis'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/test' | '/analysis/$taskId' | '/analysis'
  id: '__root__' | '/' | '/test' | '/analysis/$taskId' | '/analysis/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  TestRoute: typeof TestRoute
  AnalysisTaskIdRoute: typeof AnalysisTaskIdRoute
  AnalysisIndexRoute: typeof AnalysisIndexRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/test': {
      id: '/test'
      path: '/test'
      fullPath: '/test'
      preLoaderRoute: typeof TestRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/analysis/': {
      id: '/analysis/'
      path: '/analysis'
      fullPath: '/analysis'
      preLoaderRoute: typeof AnalysisIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/analysis/$taskId': {
      id: '/analysis/$taskId'
      path: '/analysis/$taskId'
      fullPath: '/analysis/$taskId'
      preLoaderRoute: typeof AnalysisTaskIdRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  TestRoute: TestRoute,
  AnalysisTaskIdRoute: AnalysisTaskIdRoute,
  AnalysisIndexRoute: AnalysisIndexRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
