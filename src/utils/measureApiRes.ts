export const measureApi = async <T,>(name: string, request: () => Promise<T>): Promise<T> => {
    const start = performance.now()

    try {
        return await request()
    } finally {
        console.log(
            `⏱️ ${name}:`,
            `${Math.round(performance.now() - start)}ms`
        )
    }
}