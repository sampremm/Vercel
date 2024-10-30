 Vercel Clone

## Overview
The **Vercel Clone** project is a platform designed to replicate the functionalities of Vercel, enabling users to deploy front-end applications with seamless integrations and a smooth user experience. This application leverages modern technologies to provide an efficient deployment process and an intuitive user interface.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Containerization**: Docker
- **Cloud Services**: AWS (ECS, ECR, S3)
- **Deployment**: Reverse Proxy

## Features
- **Isolated Environments**: Utilized **Docker** to create isolated environments for serving React dist files (static assets), facilitating efficient and scalable deployment.
- **AWS Integration**: 
  - Uploaded Docker images to **AWS ECR** for secure storage.
  - Managed deployment clusters using **AWS ECS** for seamless scaling.
  - Hosted static files on **AWS S3** for reliable content delivery.
- **Reverse Proxy Setup**: Designed a reverse proxy to stream `index.html`, ensuring quick and smooth access to the application.
- **Responsive Design**: Developed a user-friendly and responsive front-end using **React.js** to enhance user interaction and accessibility.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sampremm/vercel-clone.git
   cd vercel-clone
Install the required dependencies:

bash
Copy code
npm install
Set up your AWS credentials and configure Docker.

Build and run the application:

bash
Copy code
docker-compose up --build
Usage
Once the application is running, users can deploy their front-end applications by uploading their code through the user interface. The backend processes the deployment, serving the static assets through the configured AWS infrastructure.

Contribution
Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for improvements.

Thanks to Puysh
This project was inspired by a tutorial from Puysh. You can check it out here: YouTube Tutorial https://www.youtube.com/watch?v=QPzrIp5kyho&t=193s
