import React from "react"

export const composeProviders =
  (...providers: React.ComponentType<{ children: React.ReactNode }>[]) =>
    ({ children }: { children: React.ReactNode }) =>
      providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>
      }, children)
