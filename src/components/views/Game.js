import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {Link, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import User from "../../models/User";

const Player = ({user}) => (
  <div className="player container">
    <div className="player username"><Link className="linkStyle" to={`profile/${user.id}`}>{user.username}</Link></div>

<div className="player id">id: {user.id} </div>
  </div>
);


Player.propTypes = {
  user: PropTypes.object
};

const Game = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [users, setUsers] = useState(null);

  const logout = async () => {
      try { await api.put('/users/'+localStorage.getItem("id")+"/logout");
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          history.push('/login');}


      catch (error) {
          alert(`Something went wrong during the logout: \n${handleError(error)}`);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      history.push('/login');

  }


  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get('/users');

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, []);

  let content = <Spinner/>;

    if (users) {
        content = (
            <div className="game">
                <Link className="linkStyle" to={`/profile/${localStorage.getItem('id')}`}>
                    <Button
                        width="100%"
                    >
                        View Profile
                    </Button>
                </Link>
                <Button
                  width="100%"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
            </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <p className="game paragraph">
        You can check your profile or logout
      </p>
      {content}
    </BaseContainer>
  );
}

export default Game;