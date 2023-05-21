import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Edit from "../../views/Edit";
import Upload from "../../views/Upload";
import Profile from "../../views/Profile";
import PublicProfile from "../../views/PublicProfile";

import Cartpage from "../../views/Cartpage";
import Register from "../../views/Register";
import Browser from "../../views/Browser";
import Checkout from "../../views/Checkout";
import Orderpage from "../../views/Orderpage";
import Salespage from "../../views/Salespage";
import BookDetail from "../../views/BookDetail";
import Contactform from "../../views/Contactform";
import MessageBox from "../../views/MessageBox";

const AppRouter = () => {
  return (
      <BrowserRouter>
        <Switch>
          {/*<Route path="/browser">*/}
          {/*  <MainGuard>*/}
          {/*    <MainRouter base="/browser"/>*/}
          {/*  </MainGuard>*/}
          {/*</Route>*/}
          <Route exact path="/login">
            <LoginGuard>
              <Login/>
            </LoginGuard>
          </Route>
          <Route exact path="/">
            <Redirect to="/browser"/>
          </Route>
          <Route exact path={`/register`}> <Register /> </Route>
          <Route exact path={`/edit/:id`}> <Edit /> </Route>
          <Route exact path={`/upload/:id`}> <Upload /> </Route>

          <Route exact path={`/profile/:id`}> <Profile /> </Route>
          <Route exact path={`/publicprofile/:id`}> <PublicProfile /> </Route>

          <Route exact path={`/book/:id`}> <BookDetail /> </Route>


          <Route exact path={`/cartpage/:id`}> <Cartpage /> </Route>

          <Route exact path={`/browser`}> <Browser /> </Route>

          <Route exact path={`/checkout/:id`}> <Checkout /> </Route>

          <Route exact path={`/orderpage/:id`}> <Orderpage /> </Route>

          <Route exact path={`/salespage/:id`}> <Salespage /> </Route>

          <Route exact path={`/contactform/:sender/:accepter/:orderId`}> <Contactform /> </Route>

          <Route exact path={`/messagebox/:id`}> <MessageBox /> </Route>
        </Switch>
      </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;

