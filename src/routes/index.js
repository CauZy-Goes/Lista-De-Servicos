import {Routes, Route} from 'react-router-dom';

import SignIn from '../pages/Signin';
import SignUp from '../pages/SignUp';
import DashBoard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import New from '../pages/New';
import Bank from '../pages/Bank';

import Private from './Private';

function RoutesApp(){
  return(
    <Routes>
      
      <Route path='/' element={ <SignIn/> }/>

      <Route path='/register' element={ <SignUp/> }/>

      <Route path='/dashboard' element={ <Private> <DashBoard/> </Private> }/>

      <Route path='/profile' element={<Private> <Profile/> </Private>}/>

      <Route path='/customers' element={<Private> <Customers/> </Private>}/>

      <Route path='/bank' element={<Private> <Bank/> </Private>}/>

      <Route path='/new' element={<Private> <New/> </Private>}/>
      <Route path='/new/:id' element={<Private> <New/> </Private>}/>

    </Routes>
  );

};

export default RoutesApp;