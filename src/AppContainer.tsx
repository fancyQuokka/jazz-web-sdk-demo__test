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
  const [ info, setInfo ] = useState('');

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
        setInfo({
          promise: 'requestUserMediaPermissions is resolved',
          audio: JSON.stringify(audio),
          video: JSON.stringify(video)
        });
        console.log('!!! never got here !!!');
      });

      const { audio, video } = localDevices.userMediaPermissions.get();
      setInfo({
        promise: 'requestUserMediaPermissions promise is not resolved',
        audio: JSON.stringify(audio),
        video: JSON.stringify(video)
      });

      const audioInputDevices = localDevices.audioInputDevices.get();
      const audioOutputDevices = localDevices.audioOutputDevices.get();
      const videoInputDevices = localDevices.audioOutputDevices.get();

      setInfo({
        audioInputDevices: JSON.stringify(audioInputDevices),
        audioOutputDevices: JSON.stringify(audioOutputDevices),
        videoInputDevices: JSON.stringify(videoInputDevices)
      });

      const audioInput = localDevices.audioInput.get();
      const audioOutput = localDevices.audioOutput.get();
      const videoInput = localDevices.videoInput.get();

      setInfo({
        audioInput: JSON.stringify(audioInput),
        audioOutput: JSON.stringify(audioOutput),
        videoInput: JSON.stringify(videoInput)
      });
    }
  }, [localDevices])

  return (
    <div>
      <div>
        <div>SDK version: {SDK_VERSION}</div>
        <div>{Object.keys(info).map(key => (
          <div key={key}>
            <span>{key}:</span>
            <span>{info[key]}</span>
          </div>
        ))}</div>
      </div>
    </div>
  );
};

export const AppContainer: FC = () => {
  return (
    <App />
  );
};
