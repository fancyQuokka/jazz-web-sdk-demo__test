import { FC, useEffect, useMemo, useState } from 'react';

import { createJazzWebSdk, getLocalDevices, JazzSdk, SDK_VERSION } from '@salutejs/jazz-sdk-web';
import {
  audioOutputMixerPlugin,
  logsPlugin,
  videoElementPoolPlugin,
} from '@salutejs/jazz-sdk-web-plugins';

const App: FC = () => {
  const [ sdk, setSdk ] = useState<JazzSdk | undefined>(undefined);
  const [status, setStatus] = useState('process');

  useEffect(() => {
    console.log('Start creating sdk...');
    let jazzSdk: JazzSdk | undefined;
    // create sdk
    createJazzWebSdk({
      userAgent: 'Jazz Test App',
      plugins: [
        videoElementPoolPlugin(),
        audioOutputMixerPlugin(),
        logsPlugin({
          logLevel: 'debug',
          isEnableStdout: true,
        }),
      ]
    })
      .then((sdk) => {
        console.log('Sdk is created');
        jazzSdk = sdk;
        setSdk(sdk);
        setStatus('success');
      })
      .catch((error) => {
        console.error('Fail create sdk', error);
        setStatus('fail');
      });

    return () => {
      setSdk(undefined);
      setTimeout(() => {
        jazzSdk?.destroy();
      }, 0);
    };
  }, [setSdk]);

  const localDevices = useMemo(() => {
    if (!sdk) return undefined;

    return getLocalDevices(sdk);
  }, [sdk]);

  useEffect(() => {
    if (localDevices) {
      localDevices.requestUserMediaPermissions(
        'audio',
        'video',
      ).then(({audio, video}) => {
        console.log('!!! never got here !!!');
        console.log(audio, video)
      });

      const { audio, video } = localDevices.userMediaPermissions.get();
      console.log(audio, video);

      const audioInputDevices = localDevices.audioInputDevices.get();
      const audioOutputDevices = localDevices.audioOutputDevices.get();
      const videoInputDevices = localDevices.audioOutputDevices.get();
      console.log(audioInputDevices, audioOutputDevices, videoInputDevices);

      const audioInput = localDevices.audioInput.get();
      const audioOutput = localDevices.audioOutput.get();
      const videoInput = localDevices.videoInput.get();
      console.log(audioInput, audioOutput, videoInput);

    }
  }, [localDevices])

  return (
    <div>
      <div>
        <div>SDK version: {SDK_VERSION}</div>
      </div>
    </div>
  );
};

export const AppContainer: FC = () => {
  return (
    <App />
  );
};
