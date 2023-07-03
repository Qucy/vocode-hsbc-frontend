# Project Name

This is a React.JS based frontend project that provides an all-in-one chat experience using the Vocode JS and React frameworks. The goal of the project is to enable users to interact with a large language model using speech-to-text and text-to-speech services. The application allows users to input spoken text, which is then processed by the language model to generate a response. The project is designed to be based on our PoC requirments.

## Getting Started

### Prerequisites

- Node JS v18.16.0 and React v18.2.0 to run the application.
- The main libraries used in the application are Vocode JS liberary for hanlding streaming response from backend.
- In addition to the libraries, you will need a valid large language model service such as OpenAI or Azure OpenAI to use the application.
- You will also need a valid speech service such as Azure Speech Service, Google Speech Service, or Deepgram Speech Service to enable speech-to-text conversion.

Please ensure that you have installed all necessary libraries and have valid credentials for the language and speech services before running the application. Additional setup steps may be required depending on your specific use case.

### Installing

To install the required libraries for the application, run the following command:

```bash
npm install
```

This will install all the necessary libraries listed in the package.json file.

### Running the Application

To start the application, run the following command:

```bash
npm run start:public
```

This will start the application on port 3000.

## Usage

To use this application, you will need to combine it with the backend project vocode-hsbc-backend. You will need to set the conversation endpoint in the Conversation.tsx, for example ws://localhost:8000. This will allow the frontend to call the API at the backend and enable users to communicate with the language model and speech services.

Once the backend and frontend are connected, the user can input spoken or written text, which will be processed by the language model to generate a response. The response can then be converted to speech using the text-to-speech service and played back to the user.

## Configuration

To configure the application, only change the conversation url in the Conversation.tsx file, for instance:

```typescript
  const { status, start, stop, analyserNode, transcripts } = useConversation({
    backendUrl: "ws://localhost:8000/conversation", // TODO change to your backend URL
    subscribeTranscript: false,
    audioDeviceConfig,
  });
```

Please replace the values after backendUrl with your own values for the respective conversation services.

## Deployment

Coming soon...

## Contributing

- Qucy/Steven for backend and LLM agents
- Qucy/Nicolas for frontend UI

### TODOs

- UI enhancemeant, display script at left side of screen and display button at right side of screen

## License

Not applicable.
