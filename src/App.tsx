import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import EatList from './pages/EatList/EatList';
import AddEat from './pages/EatList/AddEat';
import EatDetailPage from './pages/EatList/EatDetailPage';
import EditEatPage from './pages/EatList/EditEatPage';

import FitTracker from './pages/FitTracker/FitTracker';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/eatlist">
          <EatList />
        </Route>
        <Route exact path="/eatlist/add">
          <AddEat />
        </Route>
        <Route path="/eatlist/card/:id">
          <EatDetailPage />
        </Route>
        <Route path="/eatlist/edit/:id">
          <EditEatPage />
        </Route>
        <Route path="/fittracker">
          <FitTracker />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
    <ToastContainer position="bottom-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover={false} theme="dark" />
  </IonApp>
);

export default App;
