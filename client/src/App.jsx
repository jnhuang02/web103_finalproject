// import React from 'react'
// import { useRoutes, Link } from 'react-router-dom'
// import Locations from './pages/Locations'
// import LocationEvents from './pages/LocationEvents'
// import Events from './pages/Events'
// import './App.css'

// const App = () => {
//   let element = useRoutes([
//     {
//       path: '/',
//       element: <Locations />
//     },
//     {
//       path: '/echolounge',
//       element: <LocationEvents index={1} />
//     },
//     {
//       path: '/houseofblues',
//       element: <LocationEvents index={2} />
//     },
//     {
//       path: '/pavilion',
//       element: <LocationEvents index={3} />
//     },
//     {
//       path: '/americanairlines',
//       element: <LocationEvents index={4} />
//     },
//     {
//       path: '/events',
//       element: <Events />
//     }
//   ])

//   return (
//     <div className='app'>

//       <header className='main-header'>
//         <h1>UnityGrid Plaza</h1>

//         <div className='header-buttons'>
//           <Link to='/' role='button'>Home</Link>
//           <Link to='/events' role='button'>Events</Link>
//         </div>
//       </header>

//       <main>
//         {element}
//       </main>
//     </div>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LocationDetail from './pages/LocationDetail'
import AllEvents from './pages/AllEvents'


export default function App(){
return (
<BrowserRouter>
<Navbar />
<main className="container">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/events" element={<AllEvents />} />
<Route path="/locations/:slug" element={<LocationDetail />} />
</Routes>
</main>
</BrowserRouter>
)
}