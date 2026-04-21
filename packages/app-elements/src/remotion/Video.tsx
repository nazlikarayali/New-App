import { Composition } from 'remotion';
import { AppShowcase } from './AppShowcase';

export const Video: React.FC = () => (
  <>
    <Composition
      id="AppShowcase"
      component={AppShowcase}
      durationInFrames={600}
      fps={30}
      width={1280}
      height={1000}
    />
  </>
);
