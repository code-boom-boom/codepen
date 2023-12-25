import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routes from './routes'
import HomePage from './pages'
import Layout from './pages/Layout'

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            {routes.map((route) => (
              <Route
                key={`path-${route.path}`}
                path={route.path}
                element={<route.pageComponent />}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
