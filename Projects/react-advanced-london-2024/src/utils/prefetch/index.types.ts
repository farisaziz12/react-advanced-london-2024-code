type PrefetchSuccess<TData> = {
  type: 'data'
  data: TData
}

type PrefetchError = {
  type: 'error'
  error: Error
}

export type PrefetchResult<TData> = PrefetchSuccess<TData> | PrefetchError