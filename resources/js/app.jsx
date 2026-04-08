import './bootstrap'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })

createInertiaApp({
    resolve: name => {
        const importPage = Object.keys(pages).find(key =>
            key === `./Pages/${name}.jsx` || key.endsWith(`/${name}.jsx`)
        )
        return importPage ? pages[importPage].default : undefined
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})
