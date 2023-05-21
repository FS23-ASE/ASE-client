# Group-ASE-client

## Getting started

This is the client-side code for a Book E-Commerce web application developed by Group ASE as part of the FS23 Advanced Software Engineering course.

## Components and UI Elements
React Components: The frontend is structured using reusable React components, which encapsulate the UI elements and logic for different parts of the application, such as book listings, user profile, shopping cart, and checkout process.
UI Library: Utilizes a UI library, such as Material-UI or Ant Design, to enhance the visual appearance and consistency of the user interface, providing ready-to-use components, icons, and styles.

## Docker
The setup relies on the Docker.Please make sure you have downloaded it.Also,you can download docker compose using homebrew
by running: brew install docker-compose

## How to run it by docker
To quickly build and test the docker images, a docker-compose.yml file is in the root directory.
In the root directory, start the deployment with:
```bash
docker compose up
```
To stop them, run:
```bash
docker compose down
```

## Prerequisites and Installation to run locally
 All dependencies, including React, get installed with:

```npm install```


Run this command before you start your application for the first time. Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.
 
### Build
Finally, `npm run build` builds the app for production to the `build` folder.<br>

## Testing and continuous integration
We have implemented a continuous integration (CI) flow in our project and utilized Travis CI and SonarCloud as essential tools for automated build, testing, and code quality analysis.

Travis CI is a cloud-based CI tool that integrates with version control systems like GitHub, enabling automatic triggering of the build process. We stored the project's code in a GitHub repository and employed Travis CI to monitor changes in the repository. Whenever new code commits or pushes occur, Travis CI automatically triggers the build process.

During the build stage, Travis CI performs the build and compilation based on the project's configuration file (e.g., .travis.yml). We specified Gradle as the build tool in the configuration file, defining the necessary dependencies and build tasks. Travis CI automatically downloads the required dependencies and executes the build command. If the build is successful, it generates an executable application or software package.

Subsequently, Travis CI runs automated tests. We have developed unit tests within the project. Travis CI executes these tests according to the instructions in the configuration file and collects the test results. If the tests pass, it provides feedback and proceeds to the next stage.

In the continuous integration flow, code quality analysis is crucial. To achieve static code analysis, We employed SonarCloud. SonarCloud performs static analysis of the code, detecting potential issues and violations such as code quality, security vulnerabilities, and technical debt. It offers detailed code quality metrics and suggestions to help us improve the code's quality and maintainability.

The integration of Travis CI and SonarCloud allows us to continuously monitor and enhance code quality. After a successful build and passing tests, Travis CI sends the build report and test results to SonarCloud for code quality analysis. SonarCloud generates comprehensive reports and provides a visual dashboard to track code quality and potential issues.

By utilizing Travis CI and SonarCloud, we have effectively implemented automated build, testing, and code quality analysis within the continuous integration flow. This enables us to develop and deliver high-quality software more rapidly and efficiently. Additionally, the continuous integration flow establishes a solid foundation for team collaboration and project management.
