# MemAI Chrome Extension by Joe Zakielarz

🎉 This is a Chrome extension that allows you to use the MemAI API to generate mems from any website. It's my application for the MemAI Take Home Project!

## 💻 Installation

1. Install node.js, npm, and yarn. Yarn installation: npm install --global yarn
1. Install dependencies with `yarn install`
1. Run `yarn build` to build the extension
1. Go to chrome://extensions
1. Enable developer mode
1. Click "Load unpacked", and select the `build` folder

## 📝 Descriptions

My goal was to make the extension as similar in feel and design to the Mem website as possible, and I feel like I accomplished that. I put a lot of emphasis on a simple and intuitive UI. I used Figma to wireframe the design beforehand. [You can check out my Figma here.](https://www.figma.com/file/BcrF1zw1ASIIShQtK1FiOi/MemAI-Chrome-Extension?node-id=0%3A1&t=vwewzeNsZI0PYkkP-1) I copied the same colors and used the same font that Mem uses on their website (Work Sans).

The extension is built with React and TypeScript. The most challenging part of this project was connecting the extension to the main Chrome storage and scripting so that I could save the API key and use it in the background script. I wound up figuring out that the "background" script is the only script that can access the Chrome storage, so I set up listeners in the background script that set, get, and remove the API key in Chrome storage. Just to note, I used the chrome.runtime.session API, which encrypts the api key.

The other most challening part was getting the text on the page. It wound up being a simple call to the chrome.scripting.executeScript API, however I was playing a lot with content scripts and the background script.

I found the Mem API to be very intuitive to use. I will say, however, that I wish it had more specific fields to enter for the Mem title, body, tags, and other metadata. I don't love the idea of building just one big string and formatting everything with markdown. Maybe I can help you fix that this summer!

## 💯 Features

- Generate a mem from any website
- Save your API key
- Easy link to your Mem Dashboard
- Add an unlimited amount of tags
- Edit the title and description of the mem
- GPT 3.5 description summarization

## 🚀 Serverless functions on AWS Lambda

This extension uses two serverless functions, one to summarize the description, and the other for the title. Both functions plug into the GPT 3.5 API to summarize the text. The reason for these functions is that it'd be a bad idea to expose your OpenAI API key in the extension itself, as anyone could just read the network traffic and see your key and exploit you. Instead, I segmented the OpenAI request into these functions so that users cannot steal your OpenAI API key. The functions are written in NodeJS and deployed to AWS Lambda with an API Gateway trigger, however they could be deployed on any serverless platform. There's a README in the `serverless` folder that gives two lines of info for how to deploy the functions correctly.

## 🔑 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## ℹ️ About me

I'm a junior at Duke University studying Computer Science and Mechanical Engineering. I'm a full stack developer with experience in React, Node.js, Python, SQL, and Solidity (blockchain). Last summer, I singlehandedly designed, built, and deployed an [NFT Marketplace](https://degen-marketplace.vercel.app). I co-founded [University Shipping](https://www.universityshipping.com/), a shipping and storage company, that services over 200 Duke students every year. I'm also a huge fan of snowboarding, reading, and [DJing](https://soundcloud.com/intrynzic/one-more-time-demo?si=9cddcb1a1ec54d31accabf857a82cdd4&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing).

Lastly, I'm super excited about potentially interning for Mem this summer! Thanks for the opportunity to build this extension!

<img src="https://avatars.githubusercontent.com/u/23621657?v=4" alt="Me" height="100px" width="100px" draggable="false">

[Personal Website](https://www.z5technologies.com/)

[Resume](https://drive.google.com/file/d/1fy01XbANUqzvaCpqjI3EpD-lsXQiViK1/view?usp=sharing)

[GitHub](https://github.com/JJZFIVE)

\- Joe 🫡
