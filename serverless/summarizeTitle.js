// API GATEWAY: https://u47ywgl6gj.execute-api.us-east-1.amazonaws.com/default/MemAiSummarizerBody

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "API KEY HERE",
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  // Retrieve the input message from the API request

  const message = JSON.parse(event.body).message;

  try {
    // Use the OpenAI API to generate a response
    const response = await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a text summarizer.",
          },
          {
            role: "user",
            content:
              "Summarize this website title in as few words as possible:" +
              message,
          },
        ],
        max_tokens: 1000,
      })
      .then((response) => response.data.choices[0].message.content.trim());

    // Construct the API response object with the generated response
    const responseBody = {
      response: response,
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseBody),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: "An error occurred",
    };
  }
};
