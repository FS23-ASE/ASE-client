import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Edit from "../../views/Edit";
import Upload from "../../views/Upload";
import Profile from "../../views/Profile";
import Cartpage from "../../views/Cartpage";
import Register from "../../views/Register";
import Browser from "../../views/Browser";
import Checkout from "../../views/Checkout";
import Orderpage from "../../views/Orderpage";

const AppRouter = () => {
  return (
      <BrowserRouter>
        <Switch>
          <Route path="/game">
            <GameGuard>
              <GameRouter base="/game"/>
            </GameGuard>
          </Route>
          <Route exact path="/login">
            <LoginGuard>
              <Login/>
            </LoginGuard>
          </Route>
          <Route exact path="/">
            <Redirect to="/game"/>
          </Route>
          <Route exact path={`/register`}> <Register /> </Route>
          <Route exact path={`/edit/:id`}> <Edit /> </Route>
          <Route exact path={`/upload/:id`}> <Upload /> </Route>

          <Route exact path={`/profile/:id`}> <Profile /> </Route>

          <Route exact path={`/cartpage/:id`}> <Cartpage /> </Route>

          <Route exact path={`/browser/:id`}> <Browser /> </Route>

          <Route exact path={`/checkout/:id`}> <Checkout /> </Route>

          <Route exact path={`/orderpage/:id`}> <Orderpage /> </Route>
        </Switch>
      </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
