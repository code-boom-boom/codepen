import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-4">
        <Link to="/">
          <span className="text-lg font-bold uppercase text-orange-700">
            Home
          </span>
        </Link>
      </div>
      <Outlet />
    </>
  )
}

export default Layout
