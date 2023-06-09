import {Redirect, Route} from "react-router-dom";
import PropTypes from 'prop-types';
import Profile from "../../views/Profile";
import Edit from "../../views/Edit";
import Upload from "../../views/Upload";
import Cartpage from "../../views/Cartpage";
import BookDetail from "../../views/BookDetail";


const MainRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of MainRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>

      <Route exact path={`${props.base}`}>
        <Redirect to={`${props.base}/browser`}/>
      </Route>
        <Route exact path={`${props.base}/profile/:id`}> <Profile />}> </Route>
        <Route exact path={`${props.base}/edit/:id`}> <Edit />}> </Route>
        <Route exact path={`${props.base}/upload/:id`}> <Upload />}> </Route>
        <Route exact path={`${props.base}/cartpage/:id`}> <Cartpage />}> </Route>
        <Route exact path={`${props.base}/book/:id`}> <BookDetail />}> </Route>

    </div>
  );
};
/*
* Don't forget to export your component!
 */

MainRouter.propTypes = {
  base: PropTypes.string
}

export default MainRouter;
