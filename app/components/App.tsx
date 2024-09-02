// "use client";

// import { useEffect, useRef, useState } from "react";
// import {
//   LiveConnectionState,
//   LiveTranscriptionEvent,
//   LiveTranscriptionEvents,
//   useDeepgram,
// } from "../context/DeepgramContextProvider";
// import {
//   MicrophoneEvents,
//   MicrophoneState,
//   useMicrophone,
// } from "../context/MicrophoneContextProvider";

// import Visualizer from "./Visualizer";

// const App: () => JSX.Element = () => {
//   const [caption, setCaption] = useState<string | undefined>(
//     "Powered by Deepgram"
//     // section that gives the output as converted audio to text
//   );
//   const { connection, connectToDeepgram, connectionState } = useDeepgram();
//   const { setupMicrophone, microphone, startMicrophone, microphoneState } =
//     useMicrophone();
//   const captionTimeout = useRef<any>();
//   const keepAliveInterval = useRef<any>();

//   useEffect(() => {
//     setupMicrophone();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (microphoneState === MicrophoneState.Ready) {
//       connectToDeepgram({
//         model: "nova-2",
//         interim_results: true,
//         smart_format: true,
//         filler_words: true,
//         utterance_end_ms: 3000,
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [microphoneState]);

//   useEffect(() => {
//     if (!microphone) return;
//     if (!connection) return;

//     const onData = (e: BlobEvent) => {
//       // iOS SAFARI FIX:
//       // Prevent packetZero from being sent. If sent at size 0, the connection will close. 
//       if (e.data.size > 0) {
//         connection?.send(e.data);
//       }
//     };

//     const onTranscript = (data: LiveTranscriptionEvent) => {
//       const { is_final: isFinal, speech_final: speechFinal } = data;
//       let thisCaption = data.channel.alternatives[0].transcript;

//       console.log("thisCaption", thisCaption);
//       if (thisCaption !== "") {
//         console.log('thisCaption !== ""', thisCaption);
//         setCaption(thisCaption);
//       }

//       if (isFinal && speechFinal) {
//         clearTimeout(captionTimeout.current);
//         captionTimeout.current = setTimeout(() => {
//           setCaption(undefined);
//           clearTimeout(captionTimeout.current);
//         }, 3000);
//       }
//     };

//     if (connectionState === LiveConnectionState.OPEN) {
//       connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
//       microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

//       startMicrophone();
//     }

//     return () => {
//       // prettier-ignore
//       connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
//       microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
//       clearTimeout(captionTimeout.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [connectionState]);

//   useEffect(() => {
//     if (!connection) return;

//     if (
//       microphoneState !== MicrophoneState.Open &&
//       connectionState === LiveConnectionState.OPEN
//     ) {
//       connection.keepAlive();

//       keepAliveInterval.current = setInterval(() => {
//         connection.keepAlive();
//       }, 10000);
//     } else {
//       clearInterval(keepAliveInterval.current);
//     }

//     return () => {
//       clearInterval(keepAliveInterval.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [microphoneState, connectionState]);

//   return (
//     <>
//       <div className="flex h-full antialiased">
//         <div className="flex flex-row h-full w-full overflow-x-hidden">
//           <div className="flex flex-col flex-auto h-full">
//             {/* height 100% minus 8rem */}
//             <div className="relative w-full h-full">
//               {microphone && <Visualizer microphone={microphone} />}
//               <div className="absolute bottom-[8rem]  inset-x-0 max-w-4xl mx-auto text-center">
//                 {caption && <span className="bg-red-600 p-8">{caption}</span>}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default App;



//New updations made in teh UI

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useChat } from 'ai/react';
// import {
//   LiveConnectionState,
//   LiveTranscriptionEvent,
//   LiveTranscriptionEvents,
//   useDeepgram,
// } from "../context/DeepgramContextProvider";
// import {
//   MicrophoneEvents,
//   MicrophoneState,
//   useMicrophone,
// } from "../context/MicrophoneContextProvider";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Mic, MicOff, Home, ShoppingBag, BarChart2, Settings, Bell, Search } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";

// export default function Component() {
//   const [isListening, setIsListening] = useState(false);
//   const { messages, input, handleInputChange, handleSubmit } = useChat();
//   const [productInfo, setProductInfo] = useState(null);
//   const [caption, setCaption] = useState<string | undefined>("Powered by Deepgram");

//   const { connection, connectToDeepgram, connectionState } = useDeepgram();
//   const { setupMicrophone, microphone, startMicrophone, microphoneState } = useMicrophone();
//   const captionTimeout = useRef<any>();
//   const keepAliveInterval = useRef<any>();

//   useEffect(() => {
//     setupMicrophone();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (microphoneState === MicrophoneState.Ready) {
//       connectToDeepgram({
//         model: "nova-2",
//         interim_results: true,
//         smart_format: true,
//         filler_words: true,
//         utterance_end_ms: 3000,
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [microphoneState]);

//   useEffect(() => {
//     if (!microphone) return;
//     if (!connection) return;

//     const onData = (e: BlobEvent) => {
//       if (e.data.size > 0) {
//         connection?.send(e.data);
//       }
//     };

//     const onTranscript = (data: LiveTranscriptionEvent) => {
//       const { is_final: isFinal, speech_final: speechFinal } = data;
//       let thisCaption = data.channel.alternatives[0].transcript;

//       if (thisCaption !== "") {
//         setCaption(thisCaption);
//       }

//       if (isFinal && speechFinal) {
//         clearTimeout(captionTimeout.current);
//         captionTimeout.current = setTimeout(() => {
//           setCaption(undefined);
//           clearTimeout(captionTimeout.current);
//         }, 3000);
//       }
//     };

//     if (connectionState === LiveConnectionState.OPEN) {
//       connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
//       microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

//       startMicrophone();
//     }

//     return () => {
//       connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
//       microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
//       clearTimeout(captionTimeout.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [connectionState]);

//   useEffect(() => {
//     if (!connection) return;

//     if (
//       microphoneState !== MicrophoneState.Open &&
//       connectionState === LiveConnectionState.OPEN
//     ) {
//       connection.keepAlive();

//       keepAliveInterval.current = setInterval(() => {
//         connection.keepAlive();
//       }, 10000);
//     } else {
//       clearInterval(keepAliveInterval.current);
//     }

//     return () => {
//       clearInterval(keepAliveInterval.current);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [microphoneState, connectionState]);

//   const toggleListening = () => {
//     setIsListening(!isListening);
//     if (!isListening) {
//       setTimeout(() => {
//         handleInputChange({ target: { value: "Tell me about the latest smartphones" } } as any);
//         handleSubmit({ preventDefault: () => {} } as any);
//         setIsListening(false);
//       }, 2000);
//     }
//   };

//   const parseProductInfo = (message: string) => {
//     if (message.includes("smartphone")) {
//       return {
//         name: "Latest Smartphone X",
//         price: "$999",
//         features: ["5G", "6.7 inch display", "Triple camera"],
//         stock: 50,
//         rating: 4.5,
//       };
//     }
//     return null;
//   };

//   if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
//     const newProductInfo = parseProductInfo(messages[messages.length - 1].content);
//     if (newProductInfo && JSON.stringify(newProductInfo) !== JSON.stringify(productInfo)) {
//       setProductInfo(newProductInfo);
//     }
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md">
//         <div className="p-4">
//           <h1 className="text-2xl font-bold text-blue-600">FlipKart AI</h1>
//         </div>
//         <nav className="mt-8">
//           <a className="flex items-center px-4 py-2 text-gray-700 bg-gray-200" href="#">
//             <Home className="w-5 h-5 mr-2" />
//             Dashboard
//           </a>
//           <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200" href="#">
//             <ShoppingBag className="w-5 h-5 mr-2" />
//             Products
//           </a>
//           <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200" href="#">
//             <BarChart2 className="w-5 h-5 mr-2" />
//             Analytics
//           </a>
//           <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200" href="#">
//             <Settings className="w-5 h-5 mr-2" />
//             Settings
//           </a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
//           <div className="flex items-center">
//             <Input type="text" placeholder="Search..." className="w-64 mr-4" />
//             <Button variant="outline" size="icon">
//               <Search className="h-4 w-4" />
//             </Button>
//           </div>
//           <div className="flex items-center">
//             <Button variant="outline" size="icon" className="mr-4">
//               <Bell className="h-4 w-4" />
//             </Button>
//             <Avatar>
//               <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
//               <AvatarFallback>JD</AvatarFallback>
//             </Avatar>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Assistant Dashboard</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Voice Assistant Card */}
//             <Card className="col-span-1 md:col-span-2">
//               <CardHeader>
//                 <CardTitle>Voice Assistant</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-[300px] w-full pr-4 mb-4">
//                   {messages.map((message, index) => (
//                     <div key={index} className={`mb-4 ${message.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}`}>
//                       <strong>{message.role === 'assistant' ? 'AI: ' : 'You: '}</strong>
//                       {message.content}
//                     </div>
//                   ))}
//                 </ScrollArea>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="w-full"
//                   onClick={toggleListening}
//                   disabled={microphoneState !== MicrophoneState.Open || connectionState !== LiveConnectionState.OPEN}
//                 >
//                   {isListening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
//                   {isListening ? "Stop Listening" : "Start Listening"}
//                 </Button>
//                 <div className="mt-2 text-center text-gray-600">
//                   <strong>Live Caption: </strong> {caption}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Product Information Card */}
//             {productInfo && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Product Information</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p><strong>Name:</strong> {productInfo.name}</p>
//                   <p><strong>Price:</strong> {productInfo.price}</p>
//                   <p><strong>Features:</strong> {productInfo.features.join(', ')}</p>
//                   <p><strong>Stock:</strong> {productInfo.stock}</p>
//                   <p><strong>Rating:</strong> {productInfo.rating} / 5</p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


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
    <div className="min-h-screen  flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 text-blue-800 font-bold">Flipkart AI</div>
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
              <h3 className="font-bold mb-4">Recent Activity</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>User searched for "smartphones"</li>
                <li>Product "Smartphone X" viewed</li>
                <li>Voice assistant queried about features</li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">1,234</p>
                  <p className="text-sm text-gray-500">Total Queries</p>
                </div>
                <div>
                  <p className="text-xl font-bold">95%</p>
                  <p className="text-sm text-gray-500">Satisfaction Rate</p>
                </div>
                <div>
                  <p className="text-xl font-bold">1.5s</p>
                  <p className="text-sm text-gray-500">Avg. Response Time</p>
                </div>
                <div>
                  <p className="text-xl font-bold">502</p>
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

