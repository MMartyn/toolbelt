import { AppClient, inflightURL, InstanceOptions, IOContext } from '@vtex/api'

export interface SpecTestReport {
  testId: string
  title: string[]
  state: string
  body: string
  stack?: string
  error?: string
}

export interface Screenshot {
  screenshotId: string
  name?: string
  testId: string
  takenAt: string
  path: string
  height: number
  width: number
}

export interface SpecReport {
  state: 'enqueued' | 'running' | 'passed' | 'failed' | 'skipped' | 'error'
  error?: string
  report?: {
    stats: {
      suites: number
      tests: number
      passes: number
      pending: number
      skipped: number
      failures: number
    }
    tests: SpecTestReport[]
    video?: string
    screenshots: Screenshot[]
  }
  logId?: string
  lastUpdate: number
}

export interface AppReport {
  [spec: string]: SpecReport
}

export interface TestReport {
  [appId: string]: AppReport
}

export interface TestOptions {
  monitoring: boolean
  integration: boolean
  authToken?: string
  appKey?: string
  appToken?: string
}

type Spec = string

export interface TestRequest {
  testId: string
  options: TestOptions
  testers: {
    [tester: string]: {
      [appId: string]: Spec[]
    }
  }
  requestedAt: number
}

export default class Tester extends AppClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('vtex.tester-hub', context, options)
  }

  public report = (testId: string) =>
    this.http.get<TestReport>(`/_v/report/${testId}?__v=0.x`, {
      headers: {
        ['Authorization']: this.context.authToken,
      },
      inflightKey: inflightURL,
      metric: 'tester-report',
      cacheable: 0,
    })

  public test = (options: TestOptions, appId: string = '') =>
    this.http.post<TestRequest>(`/_v/test/${appId}`, options, {
      headers: {
        ['Authorization']: this.context.authToken,
      },
      inflightKey: inflightURL,
      metric: 'tester-test',
    })
}
