import './styles/app.scss';
import { DesignLibrary } from './components/DesignLibrary';
import { Agentation } from 'agentation';

function App() {
  return (
    <>
      <DesignLibrary />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}

export default App;
