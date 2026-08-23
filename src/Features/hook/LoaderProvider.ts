import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { setLoaderHandler } from "../Services/loader-service"

type LoaderContextType = {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType>({
  loading: false,
  showLoader: () => {},
  hideLoader: () => {}
})

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false)

  const showLoader = () => setLoading(true)
  const hideLoader = () => setLoading(false)

  useEffect(() => {
    setLoaderHandler((visible: boolean) => {
      setLoading(visible)
    })
  }, [])

  return React.createElement(
    LoaderContext.Provider,
    { value: { loading, showLoader, hideLoader } },
    children
  )
}

export const useLoader = () => useContext(LoaderContext)