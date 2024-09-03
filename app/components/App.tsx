

// New New updations made in teh UI

"use client";

import { useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "../context/MicrophoneContextProvider";

const App = () => {
  const [caption, setCaption] = useState<string | undefined>("Powered by Deepgram");
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } = useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();

  useEffect(() => {
    setupMicrophone();
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: LiveTranscriptionEvent) => {
      const thisCaption = data.channel.alternatives[0].transcript;
      if (thisCaption !== "") {
        setCaption(thisCaption);
      }

      if (data.is_final && data.speech_final) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption(undefined);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
    }

    return () => {
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
      clearTimeout(captionTimeout.current);
    };
  }, [connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (microphoneState !== MicrophoneState.Open && connectionState === LiveConnectionState.OPEN) {
      connection.keepAlive();
      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
  }, [microphoneState, connectionState]);

  return (
    <div className="min-h-screen flex rounded-md">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md m-4 ">
        <div className="p-6 text-blue-800 font-bold rounded-md">Flipkart AI</div>
        <ul>
          <li className="px-6 py-2 hover:bg-gray-200 text-black"><a href="#">Dashboard</a></li>
          <li className="px-6 py-2 hover:bg-gray-200 text-black"><a href="#">Products</a></li>
          <li className="px-6 py-2 hover:bg-gray-200 text-black"><a href="#">Analytics</a></li>
          <li className="px-6 py-2 hover:bg-gray-200 text-black"><a href="#">Settings</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">AI Assistant Dashboard</h1>
          <input type="text" placeholder="Search..." className="border rounded-md px-4 py-2" />
        </div>

        {/* Voice Assistant and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Voice Assistant Section */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-bold mb-4">Voice Assistant</h2>
            <div className="relative h-64 border rounded-lg flex items-center justify-center">
              {caption ? (
                <span className="bg-gray-200 p-4 rounded text-black">{caption}</span>
              ) : (
                <button className="p-4 bg-blue-500 text-white rounded-full">🎤</button>
              )}
            </div>
          </div>

          {/* Recent Activity and Quick Stats */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-4 text-blue-900">Recent Activity</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>User searched for "smartphones"</li>
                <li>Product "Smartphone X" viewed</li>
                <li>Voice assistant queried about features</li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-4 text-blue-900">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-black">1,234</p>
                  <p className="text-sm text-gray-500">Total Queries</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-black">95%</p>
                  <p className="text-sm text-gray-500">Satisfaction Rate</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-black">1.5s</p>
                  <p className="text-sm text-gray-500">Avg. Response Time</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-black">502</p>
                  <p className="text-sm text-gray-500">Active Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

