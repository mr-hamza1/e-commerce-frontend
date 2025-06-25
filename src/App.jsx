import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, BrowserRouter, Route, useLocation } from 'react-router-dom';
import Loader from './components/loader';
import Header from './components/header';
import {Toaster} from 'react-hot-toast'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { server } from './constants/config';
import { userExist, userNotExist } from './redux/reducer/userReducer';
import ProtectRoute from './auth/ProtectedRoute';
import { NewProduct } from './pages/Admin/Management/NewProduct';
import NotFoundPage from './pages/NotFoundPage';

/// Local users App main pages
const Home = lazy(() => import('./pages/home'));
const Search = lazy(() => import('./pages/search'));
const Cart = lazy(() => import('./pages/cart'));
const Login = lazy(() => import('./pages/Login'));
const Shipping = lazy(() => import('./pages/shipping'));
const Favourites = lazy(() => import('./pages/Favourites'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Orders = lazy(() => import('./pages/Orders'));
const Checkout = lazy(() => import('./pages/Checkout'));

/// Admin pages dashboard
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Products = lazy(() => import('./pages/Admin/Products'));
const Transaction = lazy(() => import('./pages/Admin/Transaction'));
const Customer = lazy(() => import('./pages/Admin/Customer'));
const ManageNewProduct = lazy(() => import('./pages/Admin/Management/ManageNewProduct'));
const ManageTransactions = lazy(() => import('./pages/Admin/Management/ManageTransactions'));

/// Admin pages Charts
const BarCharts = lazy(() => import('./pages/Admin/Charts/BarCharts'));
const PieCharts = lazy(() => import('./pages/Admin/Charts/PieCharts'));
const LineCharts = lazy(() => import('./pages/Admin/Charts/LineCharts'));

// Admin Apps
const StopWatch = lazy(() => import('./pages/Admin/Apps/StopWatch'));
const Cupone = lazy(() => import('./pages/Admin/Apps/Cupone'));
const Toss = lazy(() => import('./pages/Admin/Apps/Toss'));



const App = () => {

  const {user, loading} = useSelector((state) => state.userReducer)
   
  const dispatch = useDispatch();

  useEffect(() => {
    axios
.get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExist(data.user)))
      .catch((err) => dispatch(userNotExist()));

  }, [dispatch]);



  return (
       loading? <Loader />:
       (<BrowserRouter>
      <MainLayout user={user} />
    </BrowserRouter>)
  );
};

const MainLayout = ({user}) => {
  const location = useLocation();


  // Check if the current route starts with "/admin"
  const isAdminRoute = location.pathname.startsWith('/admin');
     


  return (
      <>
        {/* Show Header only if not an admin route */}
       <Header user={user} />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"  element={<Home user={user} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/pay" element={<Checkout />} />



           <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          <Route element={<ProtectRoute user={user} redirect='/login'/>}>  
           <Route path="/shipping" element={<Shipping />} />
           <Route path="/orders" element={<Orders />} />
           <Route path="/favourites" element={<Favourites />} />
           <Route path="/cart" element={<Cart />} />
          </Route>


          {/* Admin routes */}

          <Route element={
               <ProtectRoute  
                  user={user}
                  adminOnly={true}
                  admin={user? (user.role=== "admin"? true : false) : false}
               />
              
          }
          >
             <Route path="/admin/dashboard" element={<Dashboard />} />
             <Route path="/admin/product" element={<Products />} />
             <Route path="/admin/product/new" element={<NewProduct />} />
             <Route path="/admin/transaction" element={<Transaction />} />
             <Route path="/admin/customer" element={<Customer />} />


             <Route path="/admin/product/:id" element={<ManageNewProduct/>} />
             <Route path="/admin/transaction/:id" element={<ManageTransactions/>} />


             <Route path="/admin/chart/bar" element={<BarCharts/>} />
             <Route path="/admin/chart/pie" element={<PieCharts/>} />
             <Route path="/admin/chart/line" element={<LineCharts/>} />


             <Route path="/admin/app/stopwatch" element={<StopWatch/>} />
             <Route path="/admin/app/cupon" element={<Cupone/>} />
             <Route path="/admin/app/toss" element={<Toss/>} />


          </Route>

          <Route  path="*" element={<NotFoundPage/> }/>
         

        
        </Routes>


      </Suspense>
      <Toaster position='bottom-center'/>
      </>
  );
};

export default App;
